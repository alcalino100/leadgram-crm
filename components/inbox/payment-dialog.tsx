'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { QrCode, DollarSign, ShieldCheck, Copy, Check, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { useAppStore } from '@/lib/store'
import { PaymentGatewayProvider } from '@/types'

const paymentSchema = z.object({
  amount: z.coerce.number().min(1, 'O valor mínimo é R$ 1,00'),
  description: z.string().min(3, 'Insira uma descrição para o pagamento'),
  provider: z.enum(['asaas', 'mercadopago', 'stripe', 'custom_pix']),
})

type PaymentFormValues = z.infer<typeof paymentSchema>

interface PaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  conversationId: string
  leadId: string
  leadName: string
}

export function PaymentDialog({
  open,
  onOpenChange,
  conversationId,
  leadId,
  leadName,
}: PaymentDialogProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const { generatePaymentLink } = useAppStore()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema) as any,
    defaultValues: {
      amount: 1500,
      description: `Contrato de Tráfego & Bot Telegram - ${leadName}`,
      provider: 'asaas',
    },
  })

  const onSubmit = async (data: PaymentFormValues) => {
    setIsSubmitting(true)
    try {
      const payment = generatePaymentLink(
        conversationId,
        leadId,
        data.amount,
        data.description,
        data.provider as PaymentGatewayProvider
      )

      toast.success('Cobrança Pix enviada no chat!', {
        description: `Valor de ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(payment.amount)} gerado via ${payment.provider.toUpperCase()}.`,
      })

      reset()
      onOpenChange(false)
    } catch {
      toast.error('Erro ao gerar cobrança')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="p-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <QrCode className="h-4 w-4" />
            </span>
            Gerar Cobrança Pix / Checkout
          </DialogTitle>
          <DialogDescription>
            Gere uma chave Pix e link de pagamento direto no chat do Telegram para {leadName}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-zinc-300 flex items-center gap-1">
              <DollarSign className="h-3 w-3 text-emerald-400" /> Valor da Cobrança (R$) *
            </label>
            <Input
              {...register('amount')}
              type="number"
              step="0.01"
              placeholder="1500.00"
              className="font-mono-code text-base"
              aria-invalid={errors.amount ? 'true' : 'false'}
            />
            {errors.amount && (
              <p className="text-[10px] text-rose-400">{errors.amount.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-medium text-zinc-300">
              Descrição / Item da Venda *
            </label>
            <Input
              {...register('description')}
              placeholder="Ex: Taxa de Setup Tráfego + Bot"
              aria-invalid={errors.description ? 'true' : 'false'}
            />
            {errors.description && (
              <p className="text-[10px] text-rose-400">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-medium text-zinc-300 flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-cyan-400" /> Gateway de Pagamento
            </label>
            <select
              {...register('provider')}
              className="flex h-8 w-full rounded-md border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-xs text-zinc-100 transition-colors focus-visible:outline-none focus-visible:border-cyan-500 focus-visible:ring-1 focus-visible:ring-cyan-500"
            >
              <option value="asaas" className="bg-zinc-900">Asaas (Pix Instantâneo + Split)</option>
              <option value="mercadopago" className="bg-zinc-900">Mercado Pago (Pix + Cartão 12x)</option>
              <option value="stripe" className="bg-zinc-900">Stripe (Cartão Internacional)</option>
              <option value="custom_pix" className="bg-zinc-900">Chave Pix Direta da Agência</option>
            </select>
          </div>

          <DialogFooter className="pt-2 border-t border-zinc-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              size="sm"
              className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Gerando Pix...
                </>
              ) : (
                <>
                  <QrCode className="h-3.5 w-3.5" />
                  Gerar e Enviar Pix
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
