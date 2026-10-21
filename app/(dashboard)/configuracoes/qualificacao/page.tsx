'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowLeft, Sparkles, Sliders, CheckCircle2, Flame, Crown, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { calculateLeadScore } from '@/lib/qualification'

export default function QualificacaoConfigPage() {
  // Simulator state
  const [hasPaidSource, setHasPaidSource] = React.useState(true)
  const [hasUtmCampaign, setHasUtmCampaign] = React.useState(true)
  const [hasTelegramChat, setHasTelegramChat] = React.useState(true)
  const [hasTelegramUsername, setHasTelegramUsername] = React.useState(true)
  const [selectedTagVIP, setSelectedTagVIP] = React.useState(true)
  const [selectedTagBudget, setSelectedTagBudget] = React.useState(false)
  const [selectedStage, setSelectedStage] = React.useState<'novo' | 'contato_feito' | 'qualificado' | 'proposta_enviada' | 'ganho'>('qualificado')

  // Calculate simulated score
  const mockTagsSimulated: any[] = []
  if (selectedTagVIP) mockTagsSimulated.push({ id: 'tag-vip', name: 'Lead VIP' })
  if (selectedTagBudget) mockTagsSimulated.push({ id: 'tag-orcamento-alto', name: 'Budget > 20k' })

  const result = calculateLeadScore({
    source: hasPaidSource ? { id: 'meta', name: 'Meta Ads', platform: 'meta' } : { id: 'organic', name: 'Orgânico', platform: 'organic' },
    utms: hasUtmCampaign ? { utm_campaign: 'black_scale_crm' } : undefined,
    telegram_chat_id: hasTelegramChat ? '12345678' : undefined,
    telegram_username: hasTelegramUsername ? '@lead_simulado' : undefined,
    tags: mockTagsSimulated,
    stage: selectedStage,
  })

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="iconSm">
              <Link href="/leads">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-xl font-bold tracking-tight text-zinc-100">
              Motor de Qualificação & Lead Score
            </h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1 pl-8">
            Critérios transparentes de pontuação de 0 a 100 baseados em tráfego pago, presença no Telegram e avanço no funil.
          </p>
        </div>
      </div>

      {/* Rules Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Rule 1: Origem */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-200">1. Origem de Tráfego & UTMs</h3>
            <span className="text-xs font-mono-code text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              Até 40 pts
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Leads originados de campanhas pagas comprovam investimento em anúncios e têm alta propensão de compra.
          </p>
          <ul className="text-xs text-zinc-300 space-y-1.5 pt-1">
            <li className="flex items-center justify-between">
              <span>Meta Ads ou Google Ads</span>
              <span className="font-mono-code text-emerald-400">+20 pts</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Indicação qualificada</span>
              <span className="font-mono-code text-emerald-400">+25 pts</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Parâmetro utm_campaign atribuído</span>
              <span className="font-mono-code text-emerald-400">+10 pts</span>
            </li>
            <li className="flex items-center justify-between">
              <span>utm_content ou utm_term presente</span>
              <span className="font-mono-code text-emerald-400">+5 pts</span>
            </li>
          </ul>
        </div>

        {/* Rule 2: Telegram */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-200">2. Interações no Telegram Bot</h3>
            <span className="text-xs font-mono-code text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              Até 20 pts
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            A presença de chat_id e @username válido no Telegram garante entregabilidade sem fricção de WhatsApp.
          </p>
          <ul className="text-xs text-zinc-300 space-y-1.5 pt-1">
            <li className="flex items-center justify-between">
              <span>Chat ID autenticado via webhook</span>
              <span className="font-mono-code text-emerald-400">+10 pts</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Username público (@username) informado</span>
              <span className="font-mono-code text-emerald-400">+10 pts</span>
            </li>
          </ul>
        </div>

        {/* Rule 3: Tags */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-200">3. Tags & Respostas do Bot</h3>
            <span className="text-xs font-mono-code text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              Até 25 pts
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Tags atribuídas manualmente pela equipe ou por automações de perguntas e respostas.
          </p>
          <ul className="text-xs text-zinc-300 space-y-1.5 pt-1">
            <li className="flex items-center justify-between">
              <span>Tag "Lead VIP" (Ticket alto / Urgente)</span>
              <span className="font-mono-code text-emerald-400">+15 pts</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Tag "Budget &gt; 20k"</span>
              <span className="font-mono-code text-emerald-400">+15 pts</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Tag "Urgente"</span>
              <span className="font-mono-code text-emerald-400">+10 pts</span>
            </li>
          </ul>
        </div>

        {/* Rule 4: Pipeline */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-200">4. Estágio Comercial</h3>
            <span className="text-xs font-mono-code text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              Até 20 pts
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            À medida que o atendente ou bot avança o lead no funil, o score reflete a maturação.
          </p>
          <ul className="text-xs text-zinc-300 space-y-1.5 pt-1">
            <li className="flex items-center justify-between">
              <span>Estágio "Ganho"</span>
              <span className="font-mono-code text-emerald-400">+20 pts</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Estágio "Proposta Enviada"</span>
              <span className="font-mono-code text-emerald-400">+18 pts</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Estágio "Qualificado"</span>
              <span className="font-mono-code text-emerald-400">+15 pts</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Estágio "Contato Feito"</span>
              <span className="font-mono-code text-emerald-400">+8 pts</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Interactive Simulator Section */}
      <div className="rounded-xl border border-cyan-500/30 bg-zinc-900/50 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-zinc-100">Simulador Interativo de Lead Score</h3>
          </div>
          <Badge
            variant={
              result.badge === 'vip'
                ? 'vip'
                : result.badge === 'quente'
                ? 'destructive'
                : result.badge === 'morno'
                ? 'warning'
                : 'secondary'
            }
            className="text-xs px-2.5 py-0.5"
          >
            {result.badge.toUpperCase()} ({result.total} / 100)
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <label className="p-3 rounded-lg border border-zinc-800 bg-zinc-950/60 flex items-center justify-between cursor-pointer">
            <span className="text-xs text-zinc-300">Origem Paga (Ads)</span>
            <input
              type="checkbox"
              checked={hasPaidSource}
              onChange={(e) => setHasPaidSource(e.target.checked)}
              className="accent-cyan-500"
            />
          </label>

          <label className="p-3 rounded-lg border border-zinc-800 bg-zinc-950/60 flex items-center justify-between cursor-pointer">
            <span className="text-xs text-zinc-300">UTMs Rastreadas</span>
            <input
              type="checkbox"
              checked={hasUtmCampaign}
              onChange={(e) => setHasUtmCampaign(e.target.checked)}
              className="accent-cyan-500"
            />
          </label>

          <label className="p-3 rounded-lg border border-zinc-800 bg-zinc-950/60 flex items-center justify-between cursor-pointer">
            <span className="text-xs text-zinc-300">Username Telegram</span>
            <input
              type="checkbox"
              checked={hasTelegramUsername}
              onChange={(e) => setHasTelegramUsername(e.target.checked)}
              className="accent-cyan-500"
            />
          </label>

          <label className="p-3 rounded-lg border border-zinc-800 bg-zinc-950/60 flex items-center justify-between cursor-pointer">
            <span className="text-xs text-zinc-300">Tag Lead VIP</span>
            <input
              type="checkbox"
              checked={selectedTagVIP}
              onChange={(e) => setSelectedTagVIP(e.target.checked)}
              className="accent-pink-500"
            />
          </label>
        </div>
      </div>
    </div>
  )
}
