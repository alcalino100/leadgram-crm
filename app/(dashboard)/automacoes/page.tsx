'use client'

import * as React from 'react'
import { AutomationFlowBuilder } from '@/components/automations/flow-builder'
import { Badge } from '@/components/ui/badge'
import { Zap, Play, Layers } from 'lucide-react'

export default function AutomacoesPage() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-1 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-zinc-100">Automações & Fluxos Visuais</h1>
            <Badge variant="outline" className="font-mono-code text-[10px] text-cyan-400 border-cyan-500/30">
              N8N Workflow Engine
            </Badge>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Crie fluxos interativos de envio de áudio, vídeo, foto, texto, cobranças Pix e distribuição automática de leads
          </p>
        </div>
      </div>

      {/* Visual Flow Builder */}
      <AutomationFlowBuilder />
    </div>
  )
}
