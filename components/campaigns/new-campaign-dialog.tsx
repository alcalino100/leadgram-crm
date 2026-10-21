'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Megaphone, DollarSign, Target, Globe, Loader2 } from 'lucide-react'
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
  DialogTrigger,
} from '@/components/ui/dialog'
import { useAppStore } from '@/lib/store'

const newCampaignSchema = z.object({
  name: z.string().min(3, 'Nome da campanha é obrigatório'),
  platform: z.enum(['meta', 'google', 'tiktok', 'organic', 'referral', 'other']),
  objective: z.string().min(2, 'Objetivo é obrigatório'),
  budget: z.coerce.number().min(0, 'Orçamento deve ser positivo'),
  ad_set: z.string().optional(),
  creative: z.string().optional(),
  utm_campaign: z.string().min(2, 'Identificador UTM da campanha é obrigatório'),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
})

type NewCampaignFormValues = z.infer<typeof newCampaignSchema>

export function NewCampaignDialog() {
  const [open, setOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const { addCampaign, currentOrganization } = useAppStore()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewCampaignFormValues>({
    resolver: zodResolver(newCampaignSchema) as any,
    defaultValues: {
      name: '',
      platform: 'meta',
      objective: 'Captação de Leads Telegram',
      budget: 3500,
      ad_set: 'Público Aberto + Interesses B2B',
      creative: 'Video_VSL_01',
      utm_campaign: '',
      utm_source: 'meta',
      utm_medium: 'cpc',
    },
  })

  const onSubmit = async (data: NewCampaignFormValues) => {
    setIsSubmitting(true)
    try {
      addCampaign({
        organization_id: currentOrganization?.id || 'org-agency-alpha',
        name: data.name,
        platform: data.platform,
        objective: data.objective,
        budget: data.budget,
        cost: 0,
        ad_set: data.ad_set,
        creative: data.creative,
        status: 'active',
        utms: {
          utm_source: data.utm_source || data.platform,
          utm_medium: data.utm_medium || 'cpc',
          utm_campaign: data.utm_campaign,
          utm_content: data.creative,
          telegram_start: `${data.utm_source || data.platform}__${data.utm_campaign}`,
        },
      })

      toast.success(`Campanha "${data.name}" criada com sucesso!`, {
        description: 'Parâmetros UTM registrados e prontos para captação.',
      })

      reset()
      setOpen(false)
    } catch {
      toast.error('Erro ao cadastrar campanha')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-semibold gap-1.5">
          <Plus className="h-4 w-4" />
          <span>Nova Campanha</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="p-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Megaphone className="h-4 w-4" />
            </span>
            Cadastrar Nova Campanha de Tráfego
          </DialogTitle>
          <DialogDescription>
            Configure a campanha para rastrear leads, calcular CPL e gerar links automáticos de captação.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-zinc-300">Nome da Campanha *</label>
            <Input
              {...register('name')}
              placeholder="Ex: [Meta] Escala Topo - VSL Criativo 04"
              aria-invalid={errors.name ? 'true' : 'false'}
            />
            {errors.name && (
              <p className="text-[10px] text-rose-400">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-zinc-300">Plataforma *</label>
              <select
                {...register('platform')}
                className="w-full h-8 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 px-2 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                <option value="meta">Meta Ads (FB/IG)</option>
                <option value="google">Google Ads</option>
                <option value="tiktok">TikTok Ads</option>
                <option value="organic">Orgânico</option>
                <option value="referral">Indicação</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-zinc-300">Orçamento Previsto (R$)</label>
              <Input
                {...register('budget')}
                type="number"
                placeholder="3500"
                className="font-mono-code"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-medium text-zinc-300">Objetivo da Campanha</label>
            <Input
              {...register('objective')}
              placeholder="Ex: Cadastros Telegram / Conversão"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-zinc-300">Conjunto / Público</label>
              <Input
                {...register('ad_set')}
                placeholder="Ex: Lookalike 1% Compradores"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-zinc-300">Criativo Principal</label>
              <Input
                {...register('creative')}
                placeholder="Ex: Video_Depoimento_02"
              />
            </div>
          </div>

          <div className="space-y-1 pt-2 border-t border-zinc-800">
            <label className="text-[11px] font-medium text-cyan-400 font-mono-code">
              utm_campaign (Identificador de Rastreio) *
            </label>
            <Input
              {...register('utm_campaign')}
              placeholder="escala_black_crm_01"
              className="font-mono-code"
              aria-invalid={errors.utm_campaign ? 'true' : 'false'}
            />
            {errors.utm_campaign && (
              <p className="text-[10px] text-rose-400">{errors.utm_campaign.message}</p>
            )}
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
                'Salvar Campanha'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
