'use client'

import * as React from 'react'
import { InboxShell } from '@/components/inbox/inbox-shell'
import { Badge } from '@/components/ui/badge'

export default function InboxPage() {
  return (
    <div className="space-y-4">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-1 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-zinc-100">Inbox Telegram</h1>
            <Badge variant="outline" className="font-mono-code text-[10px] text-cyan-400 border-cyan-500/30">
              Live Webhook
            </Badge>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Central de atendimento unificada: alterne entre o Bot IA e seus consultores comerciais em tempo real
          </p>
        </div>
      </div>

      {/* 3-Column Inbox Interface */}
      <InboxShell />
    </div>
  )
}
