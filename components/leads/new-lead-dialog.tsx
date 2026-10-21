'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, User, Phone, Mail, MessageCircle, Megaphone, Users, FileText, Loader2, DollarSign } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useAppStore } from '@/lib/store'
import { mockLeadSources, mockCampaigns, mockUsers } from '@/lib/mock-data'

const newLeadSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  phone: z.string().optional(),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  telegram_username: z.string().optional(),
  source_id: z.string().min(1, 'Selecione uma origem'),
  campaign_id: z.string().optional(),
  assigned_to: z.string().optional(),
  estimated_value: z.coerce.number().min(0).optional(),
  notes: z.string().optional(),
})

type NewLeadFormValues = z.infer<typeof newLeadSchema>

interface NewLeadDialogProps {
  trigger?: React.ReactNode
}

export function NewLeadDialog({ trigger }: NewLeadDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const { addLead, currentOrganization } = useAppStore()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewLeadFormValues>({
    resolver: zodResolver(newLeadSchema) as any,
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      telegram_username: '',
      source_id: 'src-meta',
      campaign_id: 'camp-1',
      assigned_to: 'user-1',
      estimated_value: 10000,
      notes: '',
    },
  })

  const onSubmit = async (data: NewLeadFormValues) => {
    setIsSubmitting(true)
    try {
      const selectedSource = mockLeadSources.find((s) => s.id === data.source_id)
      const selectedCampaign = mockCampaigns.find((c) => c.id === data.campaign_id)
      const selectedUser = mockUsers.find((u) => u.id === data.assigned_to)

      // Format telegram username
      let cleanUsername = data.telegram_username?.trim()
      if (cleanUsername && !cleanUsername.startsWith('@')) {
        cleanUsername = `@${cleanUsername}`
      }

      const created = addLead({
        organization_id: currentOrganization?.id || 'org-agency-alpha',
        name: data.name,
        phone: data.phone || undefined,
        email: data.email || undefined,
        telegram_username: cleanUsername || undefined,
        telegram_chat_id: Math.floor(10000000 + Math.random() * 90000000).toString(),
        source_id: data.source_id,
        source: selectedSource,
        campaign_id: data.campaign_id || undefined,
        campaign: selectedCampaign,
        stage: 'novo',
        assigned_to: data.assigned_to || undefined,
        assigned_user: selectedUser,
        estimated_value: data.estimated_value || 0,
        utms: selectedCampaign?.utms,
        notes: data.notes || undefined,
        tags: [],
        last_interaction_at: new Date().toISOString(),
      })

      toast.success(`Lead "${created.name}" cadastrado com sucesso!`, {
        description: `Score inicial calculado: ${created.score} pts (${created.score_badge.toUpperCase()}).`,
      })

      reset()
      setOpen(false)
    } catch {
      toast.error('Erro ao cadastrar lead', {
        description: 'Verifique os campos obrigatórios e tente novamente.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" className="bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-semibold flex items-center gap-1.5">
            <Plus className="h-4 w-4" />
            <span>Novo Lead</span>
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="p-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Plus className="h-4 w-4" />
            </span>
            Cadastrar Novo Lead
          </DialogTitle>
          <DialogDescription>
            Insira os dados do lead captado via tráfego ou atendimento direto no Telegram.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* Nome & Telefone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-zinc-300 flex items-center gap-1">
                <User className="h-3 w-3 text-cyan-400" /> Nome Completo *
              </label>
              <Input
                {...register('name')}
                placeholder="Ex: Carlos Eduardo"
                aria-invalid={errors.name ? 'true' : 'false'}
              />
              {errors.name && (
                <p className="text-[10px] text-rose-400">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-zinc-300 flex items-center gap-1">
                <Phone className="h-3 w-3 text-zinc-400" /> Telefone / WhatsApp
              </label>
              <Input {...register('phone')} placeholder="+55 11 99999-9999" />
            </div>
          </div>

          {/* Email & Telegram Username */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-zinc-300 flex items-center gap-1">
                <Mail className="h-3 w-3 text-zinc-400" /> E-mail corporativo
              </label>
              <Input
                {...register('email')}
                type="email"
                placeholder="carlos@empresa.com.br"
                aria-invalid={errors.email ? 'true' : 'false'}
              />
              {errors.email && (
                <p className="text-[10px] text-rose-400">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-zinc-300 flex items-center gap-1">
                <MessageCircle className="h-3 w-3 text-cyan-400" /> Username Telegram
              </label>
              <Input
                {...register('telegram_username')}
                placeholder="@usuario_telegram"
                className="font-mono-code"
              />
            </div>
          </div>

          {/* Origem & Campanha */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-zinc-300 flex items-center gap-1">
                <Megaphone className="h-3 w-3 text-cyan-400" /> Canal de Origem *
              </label>
              <select
                {...register('source_id')}
                className="flex h-8 w-full rounded-md border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-xs text-zinc-100 transition-colors focus-visible:outline-none focus-visible:border-cyan-500 focus-visible:ring-1 focus-visible:ring-cyan-500"
              >
                {mockLeadSources.map((source) => (
                  <option key={source.id} value={source.id} className="bg-zinc-900">
                    {source.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-zinc-300 flex items-center gap-1">
                <Megaphone className="h-3 w-3 text-zinc-400" /> Campanha Atribuída
              </label>
              <select
                {...register('campaign_id')}
                className="flex h-8 w-full rounded-md border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-xs text-zinc-100 transition-colors focus-visible:outline-none focus-visible:border-cyan-500 focus-visible:ring-1 focus-visible:ring-cyan-500 truncate"
              >
                <option value="" className="bg-zinc-900">Nenhuma campanha</option>
                {mockCampaigns.map((camp) => (
                  <option key={camp.id} value={camp.id} className="bg-zinc-900">
                    {camp.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Responsável & Valor Estimado */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-zinc-300 flex items-center gap-1">
                <Users className="h-3 w-3 text-zinc-400" /> Atendente Responsável
              </label>
              <select
                {...register('assigned_to')}
                className="flex h-8 w-full rounded-md border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-xs text-zinc-100 transition-colors focus-visible:outline-none focus-visible:border-cyan-500 focus-visible:ring-1 focus-visible:ring-cyan-500"
              >
                {mockUsers.map((user) => (
                  <option key={user.id} value={user.id} className="bg-zinc-900">
                    {user.name} ({user.role})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-zinc-300 flex items-center gap-1">
                <DollarSign className="h-3 w-3 text-emerald-400" /> Valor Estimado (R$)
              </label>
              <Input
                {...register('estimated_value')}
                type="number"
                placeholder="10000"
                className="font-mono-code"
              />
            </div>
          </div>

          {/* Observações / Notas */}
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-zinc-300 flex items-center gap-1">
              <FileText className="h-3 w-3 text-zinc-400" /> Observações e Notas Iniciais
            </label>
            <Textarea
              {...register('notes')}
              placeholder="Ex: Lead informou interesse em plano anual para 3 atendentes..."
              rows={3}
            />
          </div>

          <DialogFooter className="pt-2 border-t border-zinc-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              size="sm"
              className="bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-semibold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Cadastrar Lead'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
