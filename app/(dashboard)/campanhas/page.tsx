'use client'

import * as React from 'react'
import { UtmLinkGenerator } from '@/components/campaigns/utm-link-generator'
import { CampaignsTable } from '@/components/campaigns/campaigns-table'
import { Badge } from '@/components/ui/badge'

export default function CampanhasPage() {
  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-zinc-100">Campanhas & Atribuição de Tráfego</h1>
            <Badge variant="outline" className="font-mono-code text-[10px] text-cyan-400 border-cyan-500/30">
              ROI & UTM Tracking
            </Badge>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Gerencie campanhas Meta Ads, Google Ads e TikTok Ads, gere links de captação para o Telegram e acompanhe CPL e ROI.
          </p>
        </div>
      </div>

      {/* UTM Generator Tool */}
      <UtmLinkGenerator />

      {/* Campaigns Metrics Table */}
      <CampaignsTable />
    </div>
  )
}
