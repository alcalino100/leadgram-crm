'use client'

import * as React from 'react'
import { 
  Users, 
  DollarSign, 
  Flame, 
  Crown, 
  Clock, 
  Filter, 
  Plus, 
  MoveRight, 
  CheckCircle2, 
  MessageSquare,
  AlertCircle
} from 'lucide-react'
import { toast } from 'sonner'
import { useAppStore } from '@/lib/store'
import { mockPipelineStages, mockLeadSources, mockCampaigns, mockUsers } from '@/lib/mock-data'
import { Lead, LeadStageId } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { NewLeadDialog } from '@/components/leads/new-lead-dialog'
import { LeadDrawer } from '@/components/leads/lead-drawer'
import { cn } from '@/lib/utils'

export function PipelineKanban() {
  const { leads, updateLeadStage, openLeadDrawer } = useAppStore()

  // Filters
  const [selectedUser, setSelectedUser] = React.useState<string>('all')
  const [selectedSource, setSelectedSource] = React.useState<string>('all')
  const [selectedCampaign, setSelectedCampaign] = React.useState<string>('all')
  const [mobileActiveStage, setMobileActiveStage] = React.useState<LeadStageId>('novo')

  // Drag-and-drop state
  const [draggingLeadId, setDraggingLeadId] = React.useState<string | null>(null)
  const [dragOverColumn, setDragOverColumn] = React.useState<LeadStageId | null>(null)

  // Filter leads
  const filteredLeads = leads.filter((lead) => {
    const matchesUser = selectedUser === 'all' || lead.assigned_to === selectedUser
    const matchesSource = selectedSource === 'all' || lead.source_id === selectedSource
    const matchesCampaign = selectedCampaign === 'all' || lead.campaign_id === selectedCampaign
    return matchesUser && matchesSource && matchesCampaign
  })

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    setDraggingLeadId(leadId)
    e.dataTransfer.setData('text/plain', leadId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, stageId: LeadStageId) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (dragOverColumn !== stageId) {
      setDragOverColumn(stageId)
    }
  }

  const handleDragLeave = () => {
    setDragOverColumn(null)
  }

  const handleDrop = (e: React.DragEvent, targetStage: LeadStageId) => {
    e.preventDefault()
    const leadId = e.dataTransfer.getData('text/plain') || draggingLeadId
    setDraggingLeadId(null)
    setDragOverColumn(null)

    if (!leadId) return

    const targetLead = leads.find((l) => l.id === leadId)
    if (!targetLead) return

    if (targetLead.stage === targetStage) return

    try {
      updateLeadStage(leadId, targetStage)
      const stageName = mockPipelineStages.find((s) => s.id === targetStage)?.name
      toast.success(`Lead movido para "${stageName}"`, {
        description: `Score atualizado e evento registrado no histórico.`,
      })
    } catch {
      toast.error('Erro ao mover lead', {
        description: 'Não foi possível atualizar o estágio do lead.',
      })
    }
  }

  return (
    <div className="space-y-4">
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-semibold uppercase text-zinc-400 flex items-center gap-1 shrink-0">
            <Filter className="h-3 w-3" /> Filtrar Funil:
          </span>

          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="h-7 rounded-md bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300 px-2 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          >
            <option value="all">Todos os Atendentes</option>
            {mockUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>

          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="h-7 rounded-md bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300 px-2 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          >
            <option value="all">Todas as Origens</option>
            {mockLeadSources.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <select
            value={selectedCampaign}
            onChange={(e) => setSelectedCampaign(e.target.value)}
            className="h-7 rounded-md bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300 px-2 focus:outline-none focus:ring-1 focus:ring-cyan-500 truncate max-w-[180px]"
          >
            <option value="all">Todas as Campanhas</option>
            {mockCampaigns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <NewLeadDialog />
        </div>
      </div>

      {/* Mobile Stage Selector Tabs (below 768px) */}
      <div className="flex md:hidden overflow-x-auto gap-1 pb-2 border-b border-zinc-800">
        {mockPipelineStages.map((stage) => {
          const count = filteredLeads.filter((l) => l.stage === stage.id).length
          const isActive = mobileActiveStage === stage.id
          return (
            <button
              key={stage.id}
              onClick={() => setMobileActiveStage(stage.id)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5",
                isActive
                  ? "bg-zinc-800 text-cyan-400 border border-cyan-500/30"
                  : "text-zinc-400 hover:text-zinc-200 bg-zinc-900/50"
              )}
            >
              <span>{stage.name}</span>
              <span className="text-[10px] font-mono-code px-1 rounded bg-zinc-800 text-zinc-300">
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3 min-h-[600px] overflow-x-auto pb-6">
        {mockPipelineStages.map((stage) => {
          const stageLeads = filteredLeads.filter((l) => l.stage === stage.id)
          const totalValue = stageLeads.reduce((acc, l) => acc + (l.estimated_value || 0), 0)
          const isOver = dragOverColumn === stage.id
          const isHiddenOnMobile = mobileActiveStage !== stage.id

          return (
            <div
              key={stage.id}
              onDragOver={(e) => handleDragOver(e, stage.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, stage.id)}
              className={cn(
                "flex flex-col rounded-xl border bg-zinc-900/30 backdrop-blur-xs transition-colors min-w-[260px] md:min-w-0",
                isOver ? "border-cyan-500 bg-cyan-950/20" : "border-zinc-800/80",
                isHiddenOnMobile ? "hidden md:flex" : "flex"
              )}
            >
              {/* Column Header */}
              <div className="p-3 border-b border-zinc-800/80 bg-zinc-900/60 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className={cn("text-xs font-semibold", stage.color)}>
                      {stage.name}
                    </span>
                    <span className="text-[10px] font-mono-code px-1.5 py-0.2 rounded-full bg-zinc-800 text-zinc-300">
                      {stageLeads.length}
                    </span>
                  </div>

                  <NewLeadDialog
                    trigger={
                      <button
                        className="p-1 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                        title="Adicionar lead neste estágio"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    }
                  />
                </div>

                <div className="mt-1.5 flex items-center justify-between text-[11px] font-mono-code text-zinc-400">
                  <span>Total estimado:</span>
                  <span className="text-zinc-200 font-semibold">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                      maximumFractionDigits: 0,
                    }).format(totalValue)}
                  </span>
                </div>
              </div>

              {/* Cards Container */}
              <div className="flex-1 p-2 space-y-2.5 overflow-y-auto max-h-[700px]">
                {stageLeads.length === 0 ? (
                  <div className="h-28 border border-dashed border-zinc-800/80 rounded-lg flex flex-col items-center justify-center p-3 text-center text-zinc-400">
                    <p className="text-[11px]">Nenhum lead</p>
                    <p className="text-[9px] mt-0.5 text-zinc-400">Arraste cards para cá</p>
                  </div>
                ) : (
                  stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, lead.id)}
                      onClick={() => openLeadDrawer(lead.id)}
                      className={cn(
                        "group rounded-lg border border-zinc-800/80 bg-zinc-950/80 p-3 shadow-xs hover:border-zinc-700 hover:shadow-md transition-all cursor-grab active:cursor-grabbing relative",
                        draggingLeadId === lead.id && "opacity-50 ring-2 ring-cyan-500"
                      )}
                    >
                      {/* Name & Badges */}
                      <div className="flex items-start justify-between gap-1">
                        <span className="font-semibold text-xs text-zinc-100 group-hover:text-cyan-400 transition-colors line-clamp-1">
                          {lead.name}
                        </span>
                        {lead.score_badge === 'vip' && (
                          <Badge variant="vip" className="text-[9px] px-1.5 py-0 h-4">
                            VIP
                          </Badge>
                        )}
                        {lead.score_badge === 'quente' && (
                          <Badge variant="destructive" className="text-[9px] px-1.5 py-0 h-4">
                            Quente
                          </Badge>
                        )}
                      </div>

                      {/* Telegram & Origin */}
                      <div className="mt-1 flex items-center gap-1.5 text-[10px] text-zinc-400 font-mono-code">
                        <span className="text-cyan-400 truncate max-w-[100px]">
                          {lead.telegram_username || '@indefinido'}
                        </span>
                        <span>•</span>
                        <span className="text-zinc-400 truncate">
                          {lead.source?.name || 'Tráfego'}
                        </span>
                      </div>

                      {/* Estimated Value */}
                      <div className="mt-2 flex items-center justify-between text-xs pt-1.5 border-t border-zinc-900">
                        <span className="font-mono-code font-bold text-emerald-400">
                          {lead.estimated_value
                            ? new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                                maximumFractionDigits: 0,
                              }).format(lead.estimated_value)
                            : 'R$ 0'}
                        </span>

                        <span className="text-[10px] text-zinc-400 font-mono-code">
                          Score: <span className="text-zinc-300 font-semibold">{lead.score}</span>
                        </span>
                      </div>

                      {/* Card Footer: Assignee & Interaction */}
                      <div className="mt-2 flex items-center justify-between text-[10px] text-zinc-400">
                        <span className="truncate max-w-[110px]">
                          {lead.assigned_user?.name?.split(' ')[0] || 'Sem resp.'}
                        </span>

                        <span className="flex items-center gap-1 text-[9px] text-zinc-400">
                          <Clock className="h-2.5 w-2.5" />
                          {lead.last_interaction_at
                            ? new Date(lead.last_interaction_at).toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : 'hoje'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>

      <LeadDrawer />
    </div>
  )
}
