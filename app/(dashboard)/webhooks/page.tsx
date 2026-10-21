'use client'

import * as React from 'react'
import { WebhooksManager } from '@/components/settings/webhooks-manager'
import { WebhooksLogs } from '@/components/settings/webhooks-logs'

export default function WebhooksPage() {
  return (
    <div className="space-y-8">
      {/* Gerenciador de Links e Conexões Webhook (Req 4) */}
      <WebhooksManager />

      {/* Histórico e Logs de Disparos */}
      <div className="pt-4 border-t border-zinc-800">
        <h2 className="text-sm font-bold text-zinc-200 mb-3">Histórico de Disparos & Logs</h2>
        <WebhooksLogs />
      </div>
    </div>
  )
}
