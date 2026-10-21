'use client'

import * as React from 'react'
import { PipelineKanban } from '@/components/leads/pipeline-kanban'
import { Badge } from '@/components/ui/badge'

export default function PipelinePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-zinc-100">Pipeline Comercial</h1>
            <Badge variant="outline" className="font-mono-code text-[10px]">
              Kanban 7 Estágios
            </Badge>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Acompanhe oportunidades, arraste leads entre estágios e monitore o volume negociado em tempo real
          </p>
        </div>
      </div>

      {/* Kanban Board */}
      <PipelineKanban />
    </div>
  )
}
