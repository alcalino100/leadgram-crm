'use client'

import * as React from 'react'
import { WebhooksLogs } from '@/components/settings/webhooks-logs'
import { Badge } from '@/components/ui/badge'

export default function WebhooksPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-zinc-100">Webhooks & Logs</h1>
            <Badge variant="outline" className="font-mono-code text-[10px] text-cyan-400 border-cyan-500/30">
              Inbound & Outbound
            </Badge>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Logs de comunicação com o Telegram e ferramentas externas de automação (n8n / Make / Gateways)
          </p>
        </div>
      </div>

      <WebhooksLogs />
    </div>
  )
}
