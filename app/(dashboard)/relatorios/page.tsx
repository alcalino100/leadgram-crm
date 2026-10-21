'use client'

import * as React from 'react'
import { KpiCards } from '@/components/reports/kpi-cards'
import { ReportCharts } from '@/components/reports/report-charts'
import { Badge } from '@/components/ui/badge'
import { Calendar, Filter, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function RelatoriosPage() {
  const [period, setPeriod] = React.useState<'today' | '7d' | '30d' | 'custom'>('7d')

  return (
    <div className="space-y-6">
      {/* Top Header & Period Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-zinc-100">Relatórios & Business Intelligence</h1>
            <Badge variant="outline" className="font-mono-code text-[10px] text-cyan-400 border-cyan-500/30">
              Métricas de Tráfego Pago & CRM
            </Badge>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Analise CPL real, taxa de qualificação, conversão de reuniões e ROI das campanhas no Telegram
          </p>
        </div>

        {/* Global Period Filter */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs self-start sm:self-auto">
          <button
            onClick={() => setPeriod('today')}
            className={cn(
              "px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors",
              period === 'today' ? "bg-zinc-800 text-cyan-400 font-semibold" : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            Hoje
          </button>
          <button
            onClick={() => setPeriod('7d')}
            className={cn(
              "px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors",
              period === '7d' ? "bg-zinc-800 text-cyan-400 font-semibold" : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            7 dias
          </button>
          <button
            onClick={() => setPeriod('30d')}
            className={cn(
              "px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors",
              period === '30d' ? "bg-zinc-800 text-cyan-400 font-semibold" : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            30 dias
          </button>
          <button
            onClick={() => setPeriod('custom')}
            className={cn(
              "px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors flex items-center gap-1",
              period === 'custom' ? "bg-zinc-800 text-cyan-400 font-semibold" : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            <Calendar className="h-3 w-3" />
            <span>Personalizado</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <KpiCards period={period} />

      {/* Recharts Data Visualization */}
      <ReportCharts />
    </div>
  )
}
