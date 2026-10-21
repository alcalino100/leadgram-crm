'use client'

import * as React from 'react'
import Link from 'next/link'
import { 
  Users, 
  MessageSquare, 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  Bot, 
  ExternalLink, 
  Plus, 
  CheckCircle2, 
  Clock,
  Sparkles,
  Flame,
  Crown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { mockLeads, mockBots } from '@/lib/mock-data'
import { useAppStore } from '@/lib/store'

export default function DashboardOverviewPage() {
  const { currentOrganization, leads } = useAppStore()

  // Calculate live stats
  const totalLeads = leads.length
  const hotLeads = leads.filter(l => l.score_badge === 'quente' || l.score_badge === 'vip').length
  const totalPipelineValue = leads.reduce((acc, l) => acc + (l.estimated_value || 0), 0)

  return (
    <div className="space-y-6">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-zinc-100">Visão Geral</h1>
            <Badge variant="outline" className="font-mono-code text-[10px]">
              {currentOrganization?.slug || 'growthscale'}
            </Badge>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Métricas em tempo real de tráfego pago & atendimento via Telegram Bot
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/pipeline" className="flex items-center gap-1.5">
              <span>Ver Pipeline</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-zinc-400" />
            </Link>
          </Button>

          <Button asChild size="sm" className="bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-semibold">
            <Link href="/inbox" className="flex items-center gap-1.5">
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Abrir Inbox</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Leads */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 relative overflow-hidden group hover:border-zinc-700/80 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Total de Leads</span>
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-zinc-100 font-mono-code">{totalLeads}</span>
            <span className="text-[11px] font-medium text-emerald-400 flex items-center">
              +28% <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>
          <p className="text-[10px] text-zinc-500 mt-1">Origem Meta Ads + Google Ads</p>
        </div>

        {/* Hot / VIP Leads */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 relative overflow-hidden group hover:border-zinc-700/80 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Leads Quentes & VIP</span>
            <div className="p-1.5 rounded-lg bg-pink-500/10 text-pink-400">
              <Flame className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-zinc-100 font-mono-code">{hotLeads}</span>
            <span className="text-[11px] font-medium text-pink-400">Score &gt; 80</span>
          </div>
          <p className="text-[10px] text-zinc-500 mt-1">Alta intenção de contratação</p>
        </div>

        {/* Pipeline Value */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 relative overflow-hidden group hover:border-zinc-700/80 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Valor em Negociação</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-zinc-100 font-mono-code">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(totalPipelineValue)}
            </span>
          </div>
          <p className="text-[10px] text-zinc-500 mt-1">5 oportunidades ativas</p>
        </div>

        {/* Bot Status */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 relative overflow-hidden group hover:border-zinc-700/80 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Tempo de 1ª Resposta</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-emerald-400 font-mono-code">1.2s</span>
            <span className="text-[11px] font-medium text-zinc-400">via Bot IA</span>
          </div>
          <p className="text-[10px] text-zinc-500 mt-1">100% dos leads recebidos</p>
        </div>
      </div>

      {/* Main Grid: Recent Telegram Leads & Campaign Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Leads Table */}
        <div className="lg:col-span-2 rounded-xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-xs overflow-hidden">
          <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-zinc-200">Últimos Leads Captados</h2>
              <p className="text-[11px] text-zinc-400">Entradas automáticas via anúncios e bot Telegram</p>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/leads" className="text-xs text-cyan-400 hover:text-cyan-300">
                Ver todos os leads →
              </Link>
            </Button>
          </div>

          <div className="divide-y divide-zinc-800/60 overflow-x-auto">
            {leads.slice(0, 5).map((lead) => (
              <div
                key={lead.id}
                className="p-3.5 flex items-center justify-between hover:bg-zinc-800/30 transition-colors gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-8 w-8 rounded-full bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-xs font-medium text-zinc-300 shrink-0">
                    {lead.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-zinc-100 truncate">{lead.name}</span>
                      {lead.score_badge === 'vip' && (
                        <Badge variant="vip" className="gap-1">
                          <Crown className="h-2.5 w-2.5" /> VIP
                        </Badge>
                      )}
                      {lead.score_badge === 'quente' && (
                        <Badge variant="destructive" className="gap-0.5">
                          <Flame className="h-2.5 w-2.5" /> Quente
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-zinc-400 mt-0.5">
                      <span className="font-mono-code text-cyan-400/90">{lead.telegram_username || '@indefinido'}</span>
                      <span>•</span>
                      <span>chat_id: <span className="font-mono-code text-zinc-400">{lead.telegram_chat_id}</span></span>
                      <span>•</span>
                      <span className="text-zinc-400">{lead.source?.name || 'Tráfego'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <p className="text-xs font-semibold text-zinc-200 font-mono-code">
                      {lead.estimated_value
                        ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(lead.estimated_value)
                        : '—'}
                    </p>
                    <p className="text-[10px] text-zinc-400 capitalize">{lead.stage.replace('_', ' ')}</p>
                  </div>
                  <Button asChild variant="outline" size="iconSm">
                    <Link href="/inbox">
                      <MessageSquare className="h-3.5 w-3.5 text-zinc-400 hover:text-cyan-400" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Bot & Pipeline Summary */}
        <div className="space-y-4">
          {/* Active Bot card */}
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-200">Bot Telegram Conectado</span>
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono-code bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> ATIVO
              </span>
            </div>

            <div className="p-3 rounded-lg bg-zinc-950/80 border border-zinc-800 space-y-2">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-cyan-400" />
                <span className="text-xs font-medium text-zinc-200">Atendente IA Principal</span>
              </div>
              <p className="text-[10px] font-mono-code text-cyan-400 truncate">
                @growthscale_lead_bot
              </p>
              <p className="text-[10px] text-zinc-400 line-clamp-2">
                Triagem imediata com qualificação de ticket e sincronização de UTM.
              </p>
            </div>

            <Button asChild variant="outline" size="sm" className="w-full text-xs">
              <Link href="/inbox" className="flex items-center justify-center gap-1.5">
                <span>Ver Conversas do Bot</span>
                <ExternalLink className="h-3 w-3" />
              </Link>
            </Button>
          </div>

          {/* Prompt Architecture Guide reminder */}
          <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/20 p-4 space-y-2">
            <div className="flex items-center gap-1.5 text-cyan-400">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-semibold">Fluxo de Captação & CRM</span>
            </div>
            <p className="text-[11px] text-zinc-300 leading-relaxed">
              Clique no anúncio <span className="text-cyan-400 font-mono-code">→</span> Link com UTM <span className="text-cyan-400 font-mono-code">→</span> Telegram <span className="text-cyan-400 font-mono-code">→</span> Webhook cria lead <span className="text-cyan-400 font-mono-code">→</span> Atendente avança no pipeline.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
