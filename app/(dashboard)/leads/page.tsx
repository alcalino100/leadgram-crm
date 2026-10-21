'use client'

import * as React from 'react'
import { LeadsTable } from '@/components/leads/leads-table'
import { LeadDrawer } from '@/components/leads/lead-drawer'
import { Badge } from '@/components/ui/badge'

export default function LeadsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-zinc-100">Leads Comerciais</h1>
            <Badge variant="outline" className="font-mono-code text-[10px]">
              CRM Core
            </Badge>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Gerencie contatos recebidos via tráfego pago (Meta Ads, Google Ads) e atendimento direto via Telegram Bot
          </p>
        </div>
      </div>

      {/* Main Table */}
      <LeadsTable />

      {/* Slide-over Detail Drawer */}
      <LeadDrawer />
    </div>
  )
}
