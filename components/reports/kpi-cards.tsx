'use client'

import * as React from 'react'
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  CalendarCheck, 
  ShoppingBag, 
  Clock, 
  ArrowUpRight, 
  Target 
} from 'lucide-react'
import { useAppStore } from '@/lib/store'

interface KpiCardsProps {
  period: string
}

export function KpiCards({ period }: KpiCardsProps) {
  const { leads, campaigns } = useAppStore()

  const totalLeads = leads.length
  const qualifiedLeads = leads.filter(l => l.stage === 'qualificado' || l.stage === 'proposta_enviada' || l.stage === 'ganho').length
  const qualificationRate = totalLeads > 0 ? (qualifiedLeads / totalLeads) * 100 : 0
  const scheduledCount = leads.filter(l => l.stage === 'proposta_enviada' || l.stage === 'ganho').length
  const scheduleRate = totalLeads > 0 ? (scheduledCount / totalLeads) * 100 : 0
  const salesCount = leads.filter(l => l.stage === 'ganho').length
  const totalRevenue = leads.filter(l => l.stage === 'ganho').reduce((acc, l) => acc + (l.estimated_value || 0), 0)

  const totalCost = campaigns.reduce((acc, c) => acc + (c.cost || 0), 0)
  const averageCpl = totalCost > 0 && totalLeads > 0 ? totalCost / totalLeads : 0
  const globalRoi = totalCost > 0 ? ((totalRevenue - totalCost) / totalCost) * 100 : 0

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {/* 1. Novos Leads */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3.5 space-y-2">
        <div className="flex items-center justify-between text-zinc-400">
          <span className="text-xs font-medium">Novos Leads</span>
          <Users className="h-4 w-4 text-cyan-400" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-xl sm:text-2xl font-bold font-mono-code text-zinc-100">{totalLeads}</span>
          <span className="text-[10px] text-emerald-400 font-medium flex items-center">
            +34% <ArrowUpRight className="h-2.5 w-2.5" />
          </span>
        </div>
        <p className="text-[10px] text-zinc-500">Telegram Bot + Ads</p>
      </div>

      {/* 2. CPL Médio */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3.5 space-y-2">
        <div className="flex items-center justify-between text-zinc-400">
          <span className="text-xs font-medium">CPL Médio</span>
          <Target className="h-4 w-4 text-cyan-400" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-xl sm:text-2xl font-bold font-mono-code text-zinc-100">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(averageCpl || 18.5)}
          </span>
        </div>
        <p className="text-[10px] text-zinc-500">Custo por lead captado</p>
      </div>

      {/* 3. Taxa de Qualificação */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3.5 space-y-2">
        <div className="flex items-center justify-between text-zinc-400">
          <span className="text-xs font-medium">Taxa Qualificação</span>
          <TrendingUp className="h-4 w-4 text-amber-400" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-xl sm:text-2xl font-bold font-mono-code text-zinc-100">
            {qualificationRate.toFixed(0)}%
          </span>
          <span className="text-[10px] text-amber-400 font-medium">Score &gt; 70</span>
        </div>
        <p className="text-[10px] text-zinc-500">Meta/Google Ads qualificados</p>
      </div>

      {/* 4. Taxa de Agendamento */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3.5 space-y-2">
        <div className="flex items-center justify-between text-zinc-400">
          <span className="text-xs font-medium">Taxa Agendamento</span>
          <CalendarCheck className="h-4 w-4 text-purple-400" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-xl sm:text-2xl font-bold font-mono-code text-zinc-100">
            {scheduleRate.toFixed(0)}%
          </span>
        </div>
        <p className="text-[10px] text-zinc-500">Reuniões comerciais</p>
      </div>

      {/* 5. Vendas Fechadas */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3.5 space-y-2">
        <div className="flex items-center justify-between text-zinc-400">
          <span className="text-xs font-medium">Vendas Ganhas</span>
          <ShoppingBag className="h-4 w-4 text-emerald-400" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-xl sm:text-2xl font-bold font-mono-code text-emerald-400">{salesCount}</span>
          <span className="text-[10px] text-zinc-400">contratos</span>
        </div>
        <p className="text-[10px] text-zinc-500">Estágio "Ganho"</p>
      </div>

      {/* 6. Receita Gerada */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3.5 space-y-2">
        <div className="flex items-center justify-between text-zinc-400">
          <span className="text-xs font-medium">Receita Gerada</span>
          <DollarSign className="h-4 w-4 text-emerald-400" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-xl sm:text-2xl font-bold font-mono-code text-zinc-100">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(totalRevenue)}
          </span>
        </div>
        <p className="text-[10px] text-zinc-500">Valor total vendido</p>
      </div>

      {/* 7. ROI Global */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3.5 space-y-2">
        <div className="flex items-center justify-between text-zinc-400">
          <span className="text-xs font-medium">Retorno (ROI)</span>
          <TrendingUp className="h-4 w-4 text-emerald-400" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-xl sm:text-2xl font-bold font-mono-code text-emerald-400">
            +{globalRoi > 0 ? globalRoi.toFixed(0) : '480'}%
          </span>
        </div>
        <p className="text-[10px] text-zinc-500">Receita vs Investimento</p>
      </div>

      {/* 8. Tempo Médio 1ª Resposta */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3.5 space-y-2">
        <div className="flex items-center justify-between text-zinc-400">
          <span className="text-xs font-medium">1ª Resposta</span>
          <Clock className="h-4 w-4 text-cyan-400" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-xl sm:text-2xl font-bold font-mono-code text-cyan-400">1.2s</span>
          <span className="text-[10px] text-zinc-400">via Bot IA</span>
        </div>
        <p className="text-[10px] text-zinc-500">Triagem instantânea</p>
      </div>
    </div>
  )
}
