'use client'

import * as React from 'react'
import { BotsManager } from '@/components/settings/bots-manager'
import { Badge } from '@/components/ui/badge'

export default function BotsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-zinc-100">Bots Telegram</h1>
            <Badge variant="outline" className="font-mono-code text-[10px] text-cyan-400 border-cyan-500/30">
              Telegram Bot API
            </Badge>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Gerencie múltiplos bots Telegram, URLs de webhooks e tokens de acesso
          </p>
        </div>
      </div>

      <BotsManager />
    </div>
  )
}
