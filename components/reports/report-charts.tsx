'use client'

import * as React from 'react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { useAppStore } from '@/lib/store'
import { mockPipelineStages } from '@/lib/mock-data'

// Mock timeline data for leads per day
const dailyLeadsData = [
  { date: '15/10', meta: 4, google: 2, total: 6 },
  { date: '16/10', meta: 7, google: 3, total: 10 },
  { date: '17/10', meta: 5, google: 4, total: 9 },
  { date: '18/10', meta: 12, google: 6, total: 18 },
  { date: '19/10', meta: 9, google: 5, total: 14 },
  { date: '20/10', meta: 15, google: 8, total: 23 },
  { date: '21/10', meta: 11, google: 6, total: 17 },
]

const pieColors = ['#22d3ee', '#3b82f6', '#f59e0b', '#10b981', '#ec4899']

export function ReportCharts() {
  const { leads, campaigns } = useAppStore()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="h-72 rounded-xl border border-zinc-800 bg-zinc-900/40 animate-pulse" />
        <div className="h-72 rounded-xl border border-zinc-800 bg-zinc-900/40 animate-pulse" />
      </div>
    )
  }

  // 1. Leads por origem
  const sourceDistribution = [
    { name: 'Meta Ads', value: 28, color: '#22d3ee' },
    { name: 'Google Ads', value: 16, color: '#3b82f6' },
    { name: 'TikTok Ads', value: 7, color: '#f59e0b' },
    { name: 'Indicação', value: 5, color: '#ec4899' },
    { name: 'Orgânico', value: 4, color: '#10b981' },
  ]

  // 2. Funil por estágio
  const funnelData = mockPipelineStages.map((st) => {
    const count = leads.filter((l) => l.stage === st.id).length
    return {
      stage: st.name,
      leads: count,
      valor: leads.filter((l) => l.stage === st.id).reduce((acc, l) => acc + (l.estimated_value || 0), 0),
    }
  })

  // 3. Tabela Comparativa por Criativo e Responsável
  const creativeComparison = [
    {
      creative: 'Video_Explicativo_Vsl_v3',
      campaign: '[Meta] Scale Conversão Topo',
      responsible: 'Guilherme Silva',
      leads: 38,
      qualified: 19,
      sales: 4,
      cost: 3820,
      cpl: 100.5,
      revenue: 68000,
    },
    {
      creative: 'Anuncio_Responsivo_Search_01',
      campaign: '[Google] Search Fundo de Funil',
      responsible: 'Beatriz Ramos',
      leads: 22,
      qualified: 14,
      sales: 3,
      cost: 2150,
      cpl: 97.7,
      revenue: 45000,
    },
    {
      creative: 'Carrossel_Depoimentos_Case',
      campaign: '[Meta] Remarketing Vídeo',
      responsible: 'Carlos Mendes',
      leads: 18,
      qualified: 8,
      sales: 2,
      cost: 1450,
      cpl: 80.5,
      revenue: 28000,
    },
  ]

  return (
    <div className="space-y-6">
      {/* 2-Column Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Leads por Dia (Volume Temporal) */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <div>
              <h4 className="text-xs font-bold text-zinc-100">Evolução Diária de Novos Leads</h4>
              <p className="text-[10px] text-zinc-400">Distribuição entre Meta Ads e Google Ads no Telegram</p>
            </div>
            <span className="text-[10px] font-mono-code text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              Últimos 7 dias
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyLeadsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMeta" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorGoogle" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="date" stroke="#71717a" fontSize={10} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#09090b',
                    borderColor: '#27272a',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                />
                <Area type="monotone" dataKey="meta" name="Meta Ads" stroke="#22d3ee" fillOpacity={1} fill="url(#colorMeta)" />
                <Area type="monotone" dataKey="google" name="Google Ads" stroke="#3b82f6" fillOpacity={1} fill="url(#colorGoogle)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribuição por Origem de Tráfego */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <div>
              <h4 className="text-xs font-bold text-zinc-100">Leads por Canal de Captação</h4>
              <p className="text-[10px] text-zinc-400">Participação de cada canal na geração de contatos</p>
            </div>
            <span className="text-[10px] font-mono-code text-zinc-400">Total: 60 leads</span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {sourceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#09090b',
                    borderColor: '#27272a',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  formatter={(value) => <span className="text-[11px] text-zinc-300">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Funil de Vendas por Estágio */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
          <div>
            <h4 className="text-xs font-bold text-zinc-100">Funil de Conversão do Pipeline</h4>
            <p className="text-[10px] text-zinc-400">Quantidade de leads ativos por estágio no CRM</p>
          </div>
        </div>

        <div className="h-60 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={funnelData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="stage" stroke="#71717a" fontSize={10} tickLine={false} />
              <YAxis stroke="#71717a" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#09090b',
                  borderColor: '#27272a',
                  borderRadius: '8px',
                  fontSize: '11px',
                }}
              />
              <Bar dataKey="leads" name="Quantidade de Leads" fill="#22d3ee" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabela Comparativa por Criativo e Responsável */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
          <div>
            <h4 className="text-xs font-bold text-zinc-100">Comparativo: Criativo vs Atendente vs Vendas</h4>
            <p className="text-[10px] text-zinc-400">Cruze o criativo de anúncio com o atendente que fecha mais contratos</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-900/80 border-b border-zinc-800 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Criativo do Anúncio</th>
                <th className="py-2.5 px-3">Campanha</th>
                <th className="py-2.5 px-3">Consultor Responsável</th>
                <th className="py-2.5 px-3 text-right">Leads</th>
                <th className="py-2.5 px-3 text-right">CPL</th>
                <th className="py-2.5 px-3 text-right">Qualificados</th>
                <th className="py-2.5 px-3 text-right">Vendas</th>
                <th className="py-2.5 px-3 text-right">Receita (R$)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-mono-code text-[11px]">
              {creativeComparison.map((row, idx) => (
                <tr key={idx} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="py-2.5 px-3 font-sans font-semibold text-zinc-100">
                    {row.creative}
                  </td>
                  <td className="py-2.5 px-3 font-sans text-zinc-400">
                    {row.campaign}
                  </td>
                  <td className="py-2.5 px-3 font-sans text-cyan-400">
                    {row.responsible}
                  </td>
                  <td className="py-2.5 px-3 text-right text-zinc-200">
                    {row.leads}
                  </td>
                  <td className="py-2.5 px-3 text-right text-cyan-400">
                    R$ {row.cpl.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-amber-400">
                    {row.qualified}
                  </td>
                  <td className="py-2.5 px-3 text-right text-emerald-400 font-bold">
                    {row.sales}
                  </td>
                  <td className="py-2.5 px-3 text-right text-zinc-100 font-bold">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(row.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
