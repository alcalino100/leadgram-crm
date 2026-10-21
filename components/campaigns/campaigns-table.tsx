'use client'

import * as React from 'react'
import { Megaphone, ExternalLink, TrendingUp, DollarSign, Users, Award, ArrowUpRight } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { NewCampaignDialog } from '@/components/campaigns/new-campaign-dialog'

export function CampaignsTable() {
  const { campaigns, leads } = useAppStore()

  // Calculate metrics per campaign
  const campaignMetrics = campaigns.map((camp) => {
    const campLeads = leads.filter((l) => l.campaign_id === camp.id || l.utms?.utm_campaign === camp.utms?.utm_campaign)
    const totalLeads = campLeads.length
    const qualifiedLeads = campLeads.filter((l) => l.stage === 'qualificado' || l.stage === 'proposta_enviada' || l.stage === 'ganho').length
    const closedSales = campLeads.filter((l) => l.stage === 'ganho').length
    const revenue = campLeads.filter((l) => l.stage === 'ganho').reduce((acc, l) => acc + (l.estimated_value || 0), 0)

    const cost = camp.cost || 0
    const cpl = cost > 0 && totalLeads > 0 ? cost / totalLeads : null
    const roi = cost > 0 ? ((revenue - cost) / cost) * 100 : null

    return {
      ...camp,
      totalLeads,
      qualifiedLeads,
      closedSales,
      revenue,
      cpl,
      roi,
    }
  })

  const getPlatformBadge = (platform: string) => {
    switch (platform) {
      case 'meta':
        return <Badge variant="blue" className="text-[10px]">Meta Ads</Badge>
      case 'google':
        return <Badge variant="warning" className="text-[10px]">Google Ads</Badge>
      case 'tiktok':
        return <Badge variant="destructive" className="text-[10px]">TikTok Ads</Badge>
      case 'organic':
        return <Badge variant="secondary" className="text-[10px]">Orgânico</Badge>
      case 'referral':
        return <Badge variant="vip" className="text-[10px]">Indicação</Badge>
      default:
        return <Badge variant="outline" className="text-[10px]">Tráfego</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-zinc-100">Desempenho de Campanhas & Atribuição</h3>
          <p className="text-xs text-zinc-400">
            Acompanhe o CPL real e ROI de ponta a ponta: do clique no anúncio até a venda no CRM.
          </p>
        </div>

        <NewCampaignDialog />
      </div>

      <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-900/80 border-b border-zinc-800 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Campanha</th>
                <th className="py-3 px-3">Plataforma</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Leads</th>
                <th className="py-3 px-3 text-right">Investimento</th>
                <th className="py-3 px-3 text-right">CPL</th>
                <th className="py-3 px-3 text-right">Qualificados</th>
                <th className="py-3 px-3 text-right">Vendas</th>
                <th className="py-3 px-3 text-right">Receita (R$)</th>
                <th className="py-3 px-4 text-right">ROI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-mono-code text-[11px]">
              {campaignMetrics.map((camp) => (
                <tr key={camp.id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="py-3 px-4 font-sans font-medium text-zinc-100 max-w-[220px]">
                    <div className="truncate font-semibold text-xs">{camp.name}</div>
                    <div className="text-[10px] text-zinc-400 font-mono-code truncate mt-0.5">
                      utm: {camp.utms?.utm_campaign || '—'}
                    </div>
                  </td>

                  <td className="py-3 px-3 font-sans">
                    {getPlatformBadge(camp.platform)}
                  </td>

                  <td className="py-3 px-3 font-sans">
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono-code text-emerald-400 bg-emerald-950/50 px-1.5 py-0.2 rounded border border-emerald-800/40">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      ATIVO
                    </span>
                  </td>

                  <td className="py-3 px-3 text-right text-zinc-200 font-bold">
                    {camp.totalLeads}
                  </td>

                  <td className="py-3 px-3 text-right text-zinc-300">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(camp.cost || 0)}
                  </td>

                  <td className="py-3 px-3 text-right text-cyan-400 font-semibold">
                    {camp.cpl !== null
                      ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(camp.cpl)
                      : '—'}
                  </td>

                  <td className="py-3 px-3 text-right text-amber-400 font-semibold">
                    {camp.qualifiedLeads}
                  </td>

                  <td className="py-3 px-3 text-right text-emerald-400 font-bold">
                    {camp.closedSales}
                  </td>

                  <td className="py-3 px-3 text-right text-zinc-100 font-bold">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(camp.revenue)}
                  </td>

                  <td className="py-3 px-4 text-right">
                    {camp.roi !== null ? (
                      <span className={camp.roi >= 0 ? "text-emerald-400 font-bold" : "text-rose-400"}>
                        {camp.roi >= 0 ? '+' : ''}{camp.roi.toFixed(0)}%
                      </span>
                    ) : (
                      <span className="text-zinc-500">—</span>
                    )}
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
