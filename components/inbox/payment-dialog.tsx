'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { QrCode, DollarSign, ShieldCheck, Copy, Check, Loader2, Sparkles, Flame } from 'lucide-react'
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
  provider: z.enum(['firebot', 'asaas', 'mercadopago', 'stripe', 'custom_pix']),
  customerCpf: z.string().optional(),
  customerPhone: z.string().optional(),
})

type PaymentFormValues = z.infer<typeof paymentSchema>

interface PaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  conversationId: string
  leadId: string
  leadName: string
  telegramChatId?: string
}

export function PaymentDialog({
  open,
  onOpenChange,
  conversationId,
  leadId,
  leadName,
  telegramChatId,
}: PaymentDialogProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [generatedPix, setGeneratedPix] = React.useState<{
    pixCopiaECola: string
    qrCodeUrl?: string
    transactionId: string
    amount: number
  } | null>(null)
  const [copied, setCopied] = React.useState(false)

  const { generatePaymentLink, leads } = useAppStore()
  const currentLead = leads.find((l) => l.id === leadId)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema) as any,
    defaultValues: {
      amount: 1500,
      description: `Contrato de Tráfego & Bot Telegram - ${leadName}`,
      provider: 'firebot',
      customerCpf: '47259845821',
      customerPhone: currentLead?.phone || '11988442211',
    },
  })

  const selectedProvider = watch('provider')

  const onSubmit = async (data: PaymentFormValues) => {
    setIsSubmitting(true)
    try {
      if (data.provider === 'firebot') {
        // Chamar API real da Firebot
        const res = await fetch('/api/firebot/pix', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: data.amount,
            description: data.description,
            customer: {
              name: leadName,
              email: currentLead?.email || 'lead@email.com',
              cpf: data.customerCpf || '47259845821',
              phone: data.customerPhone || '11988442211',
            },
            leadId,
            leadName,
            telegramChatId: telegramChatId || currentLead?.telegram_chat_id,
          }),
        })

        const firebotData = await res.json()

        if (!firebotData.success) {
          throw new Error(firebotData.error || 'Erro ao gerar Pix na Firebot')
        }

        setGeneratedPix({
          pixCopiaECola: firebotData.pixCopiaECola,
          qrCodeUrl: firebotData.qrCodeUrl,
          transactionId: firebotData.transactionId,
          amount: data.amount,
        })

        // Adicionar mensagem com os dados reais da Firebot na conversa
        generatePaymentLink(
          conversationId,
          leadId,
          data.amount,
          data.description,
          'firebot'
        )

        toast.success('Cobrança Firebot PIX gerada com sucesso!', {
          description: `Chave Pix Copia e Cola e QR Code criados e enviados no Telegram.`,
        })
      } else {
        // Fallback para outros provedores
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
      }
    } catch (err: any) {
      toast.error('Erro ao gerar cobrança', {
        description: err.message || 'Verifique as credenciais da Firebot.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success('Código Pix Copia e Cola copiado!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleClose = () => {
    setGeneratedPix(null)
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="p-1 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <Flame className="h-4 w-4" />
            </span>
            Gerar Cobrança PIX Instantânea (Firebot)
          </DialogTitle>
          <DialogDescription>
            Gere uma chave Pix oficial com QR Code para enviar no chat do Telegram para <strong>{leadName}</strong>.
          </DialogDescription>
        </DialogHeader>

        {generatedPix ? (
          /* Success Screen with Real QR Code and Copia e Cola */
          <div className="space-y-4 py-2 text-center">
            <div className="p-4 rounded-xl border border-emerald-500/40 bg-zinc-950 flex flex-col items-center justify-center space-y-3">
              <span className="text-[10px] font-mono-code uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                Firebot API • Status: Pendente de Pagamento
              </span>

              {/* Real QR Code image from Firebot Base64 */}
              {generatedPix.qrCodeUrl && (
                <div className="p-2 bg-white rounded-xl shadow-lg border border-zinc-200">
                  <img
                    src={generatedPix.qrCodeUrl}
                    alt="QR Code Pix Firebot"
                    className="w-44 h-44 object-contain"
                  />
                </div>
              )}

              <p className="text-xl font-bold font-mono-code text-zinc-100">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(generatedPix.amount)}
              </p>
              <p className="text-[10px] font-mono-code text-zinc-400">
                ID: {generatedPix.transactionId}
              </p>
            </div>

            <div className="space-y-1.5 text-left">
              <label className="text-[11px] font-medium text-zinc-300">Código Pix Copia e Cola:</label>
              <div className="flex items-center gap-2">
                <input
                  readOnly
                  value={generatedPix.pixCopiaECola}
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded-md px-3 py-1.5 text-xs font-mono-code text-zinc-300 truncate"
                />
                <Button
                  size="sm"
                  onClick={() => handleCopy(generatedPix.pixCopiaECola)}
                  className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold gap-1.5 shrink-0"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? 'Copiado!' : 'Copiar'}</span>
                </Button>
              </div>
            </div>

            <DialogFooter className="pt-2 border-t border-zinc-800">
              <Button onClick={handleClose} size="sm" className="w-full bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-semibold">
                Concluir e Voltar ao Chat
              </Button>
            </DialogFooter>
          </div>
        ) : (
          /* Form Screen */
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-zinc-300 flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-orange-400" /> Gateway de Pagamento *
              </label>
              <select
                {...register('provider')}
                className="flex h-8 w-full rounded-md border border-orange-500/40 bg-zinc-900/80 px-3 py-1 text-xs text-orange-200 font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-500"
              >
                <option value="firebot" className="bg-zinc-900 text-orange-300">
                  🔥 Firebot (Pix Instantâneo Oficial - Conectado)
                </option>
                <option value="asaas" className="bg-zinc-900 text-zinc-300">
                  Asaas (Split de Comissões)
                </option>
                <option value="mercadopago" className="bg-zinc-900 text-zinc-300">
                  Mercado Pago (Pix + Cartão)
                </option>
                <option value="stripe" className="bg-zinc-900 text-zinc-300">
                  Stripe (Cartão Internacional)
                </option>
              </select>
            </div>

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
                Descrição do Produto ou Serviço *
              </label>
              <Input
                {...register('description')}
                placeholder="Ex: Consultoria de Tráfego + Bot Telegram"
                aria-invalid={errors.description ? 'true' : 'false'}
              />
              {errors.description && (
                <p className="text-[10px] text-rose-400">{errors.description.message}</p>
              )}
            </div>

            {selectedProvider === 'firebot' && (
              <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-zinc-950 border border-zinc-800">
                <div className="space-y-1">
                  <label className="text-[10px] font-medium text-zinc-400">CPF do Pagador</label>
                  <Input
                    {...register('customerCpf')}
                    placeholder="12345678900"
                    className="font-mono-code text-xs h-7"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-medium text-zinc-400">Telefone / WhatsApp</label>
                  <Input
                    {...register('customerPhone')}
                    placeholder="11999998888"
                    className="font-mono-code text-xs h-7"
                  />
                </div>
              </div>
            )}

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
                className="bg-orange-500 hover:bg-orange-400 text-zinc-950 font-bold gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Gerando na Firebot...
                  </>
                ) : (
                  <>
                    <QrCode className="h-3.5 w-3.5" />
                    Gerar Pix Firebot
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
