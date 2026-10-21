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
  AlertCircle,
  Sliders
} from 'lucide-react'
import { toast } from 'sonner'
import { useAppStore } from '@/lib/store'
import { mockLeadSources, mockCampaigns } from '@/lib/mock-data'
import { Lead } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { NewLeadDialog } from '@/components/leads/new-lead-dialog'
import { LeadDrawer } from '@/components/leads/lead-drawer'
import { StagesManagerDialog } from '@/components/pipeline/stages-manager-dialog'
import { cn } from '@/lib/utils'

export function PipelineKanban() {
  const { leads, pipelineStages, users, updateLeadStage, openLeadDrawer } = useAppStore()

  // Filters
  const [selectedUser, setSelectedUser] = React.useState<string>('all')
  const [selectedSource, setSelectedSource] = React.useState<string>('all')
  const [selectedCampaign, setSelectedCampaign] = React.useState<string>('all')
  const [mobileActiveStage, setMobileActiveStage] = React.useState<string>(pipelineStages[0]?.id || 'novo')
  const [isStagesDialogOpen, setIsStagesDialogOpen] = React.useState(false)

  // Drag-and-drop state
  const [draggingLeadId, setDraggingLeadId] = React.useState<string | null>(null)
  const [dragOverColumn, setDragOverColumn] = React.useState<string | null>(null)

  // Sincronizar mobile active stage se os estágios mudarem
  React.useEffect(() => {
    if (pipelineStages.length > 0 && !pipelineStages.some((s) => s.id === mobileActiveStage)) {
      setMobileActiveStage(pipelineStages[0].id)
    }
  }, [pipelineStages, mobileActiveStage])

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

  const handleDragOver = (e: React.DragEvent, stageId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (dragOverColumn !== stageId) {
      setDragOverColumn(stageId)
    }
  }

  const handleDragLeave = () => {
    setDragOverColumn(null)
  }

  const handleDrop = (e: React.DragEvent, targetStage: string) => {
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
      const stageName = pipelineStages.find((s) => s.id === targetStage)?.name || targetStage
      toast.success(`Lead movido para "${stageName}"`, {
        description: `Score atualizado e evento registrado no Supabase.`,
      })
    } catch {
      toast.error('Erro ao mover lead', {
        description: 'Não foi possível atualizar o estágio do lead.',
      })
    }
  }

  return (
    <div className="space-y-4">
      {/* Top Filter Bar & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-semibold uppercase text-zinc-400 flex items-center gap-1 shrink-0">
            <Filter className="h-3 w-3" /> Filtrar Funil:
          </span>

          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="h-7 rounded-md bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300 px-2 focus:outline-none focus:ring-1 focus:ring-pink-500"
          >
            <option value="all">Todos os Atendentes</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>

          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="h-7 rounded-md bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300 px-2 focus:outline-none focus:ring-1 focus:ring-pink-500"
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
            className="h-7 rounded-md bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300 px-2 focus:outline-none focus:ring-1 focus:ring-pink-500 truncate max-w-[180px]"
          >
            <option value="all">Todas as Campanhas</option>
            {mockCampaigns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          {/* Botão Gerenciar Estágios (Req 5) */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsStagesDialogOpen(true)}
            className="h-8 text-xs border-zinc-700 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-200"
          >
            <Sliders className="h-3.5 w-3.5 mr-1.5 text-pink-400" />
            <span>Gerenciar Estágios</span>
          </Button>

          <NewLeadDialog />
        </div>
      </div>

      {/* Mobile Stage Selector Tabs */}
      <div className="flex md:hidden overflow-x-auto gap-1 pb-2 border-b border-zinc-800">
        {pipelineStages.map((stage) => {
          const count = filteredLeads.filter((l) => l.stage === stage.id).length
          const isActive = mobileActiveStage === stage.id
          return (
            <button
              key={stage.id}
              onClick={() => setMobileActiveStage(stage.id)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5",
                isActive
                  ? "bg-zinc-800 text-pink-400 border border-pink-500/30"
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

      {/* Kanban Board Horizontal Dinâmico */}
      <div className="flex gap-3 min-h-[600px] overflow-x-auto pb-6">
        {pipelineStages.map((stage) => {
          const stageLeads = filteredLeads.filter((l) => l.stage === stage.id)
          const totalValue = stageLeads.reduce((acc, l) => acc + (Number(l.estimated_value) || 0), 0)
          const isOver = dragOverColumn === stage.id
          const isHiddenOnMobile = mobileActiveStage !== stage.id

          return (
            <div
              key={stage.id}
              onDragOver={(e) => handleDragOver(e, stage.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, stage.id)}
              className={cn(
                "flex-1 min-w-[250px] max-w-[320px] rounded-xl border bg-zinc-900/30 flex flex-col transition-all duration-150",
                isOver ? "border-pink-500/80 bg-pink-500/5 ring-1 ring-pink-500/40" : "border-zinc-800/80",
                isHiddenOnMobile && "hidden md:flex"
              )}
            >
              {/* Column Header */}
              <div className="p-3 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-900/60 rounded-t-xl">
                <div className="flex items-center gap-2">
                  <div
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: stage.color }}
                  />
                  <span className="text-xs font-semibold text-zinc-200 truncate">{stage.name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Badge variant="outline" className="font-mono-code text-[10px] px-1.5 py-0 h-4">
                    {stageLeads.length}
                  </Badge>
                </div>
              </div>

              {/* Subheader: Volume Financeiro */}
              <div className="px-3 py-1.5 bg-zinc-950/40 border-b border-zinc-800/40 flex items-center justify-between text-[10px] text-zinc-400">
                <span>Volume Estimado:</span>
                <span className="font-mono-code font-bold text-zinc-300">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(totalValue)}
                </span>
              </div>

              {/* Leads Cards Container */}
              <div className="p-2 flex-1 space-y-2 overflow-y-auto max-h-[70vh]">
                {stageLeads.length === 0 ? (
                  <div className="h-32 flex flex-col items-center justify-center text-center p-3 border border-dashed border-zinc-800/60 rounded-lg">
                    <p className="text-[11px] text-zinc-500">Nenhum contato</p>
                    <p className="text-[9px] text-zinc-600 mt-0.5">Arraste contatos para cá</p>
                  </div>
                ) : (
                  stageLeads.map((lead) => {
                    const isDragging = draggingLeadId === lead.id
                    const isVip = lead.score_badge === 'vip'
                    const isHot = lead.score_badge === 'quente'

                    return (
                      <div
                        key={lead.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, lead.id)}
                        onClick={() => openLeadDrawer(lead.id)}
                        className={cn(
                          "p-3 rounded-lg border bg-zinc-950/90 hover:border-zinc-700/80 transition-all cursor-grab active:cursor-grabbing group relative select-none shadow-xs",
                          isDragging && "opacity-40 scale-95 border-pink-500",
                          isVip && "border-pink-500/40 hover:border-pink-500/80 shadow-pink-500/5",
                          !isVip && isHot && "border-amber-500/40 hover:border-amber-500/80",
                          !isVip && !isHot && "border-zinc-800/80"
                        )}
                      >
                        {/* Name & Badge */}
                        <div className="flex items-start justify-between gap-1">
                          <span className="text-xs font-semibold text-zinc-200 group-hover:text-pink-400 transition-colors truncate">
                            {lead.name}
                          </span>
                          {isVip && (
                            <Badge className="bg-pink-500/10 text-pink-400 border-pink-500/30 text-[9px] px-1 py-0 h-4 flex items-center gap-0.5">
                              <Crown className="h-2.5 w-2.5" /> VIP
                            </Badge>
                          )}
                          {!isVip && isHot && (
                            <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30 text-[9px] px-1 py-0 h-4 flex items-center gap-0.5">
                              <Flame className="h-2.5 w-2.5" /> Quente
                            </Badge>
                          )}
                        </div>

                        {/* Telegram Username */}
                        {lead.telegram_username && (
                          <div className="mt-0.5 flex items-center gap-1 text-[10px] text-zinc-400 font-mono-code">
                            <span>{lead.telegram_username}</span>
                          </div>
                        )}

                        {/* UTM / Source Info */}
                        <div className="mt-2 flex items-center justify-between text-[10px] text-zinc-400">
                          <span className="truncate max-w-[120px] font-mono-code">
                            {lead.utm_source ? `${lead.utm_source}` : 'Direto Telegram'}
                          </span>
                          <span className="font-mono-code font-bold text-zinc-200">
                            {lead.estimated_value ? `R$ ${lead.estimated_value}` : 'R$ 0'}
                          </span>
                        </div>

                        {/* Score Bar & Assigned User */}
                        <div className="mt-2.5 pt-2 border-t border-zinc-900 flex items-center justify-between text-[10px]">
                          <div className="flex items-center gap-1.5">
                            <div className="w-10 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                              <div
                                className={cn(
                                  "h-full rounded-full",
                                  isVip && "bg-pink-500",
                                  !isVip && isHot && "bg-amber-500",
                                  !isVip && !isHot && "bg-cyan-500"
                                )}
                                style={{ width: `${lead.score || 0}%` }}
                              />
                            </div>
                            <span className="font-mono-code text-[9px] text-zinc-400">{lead.score || 0} pts</span>
                          </div>

                          <span className="text-zinc-500 text-[10px]">
                            {lead.assigned_user?.name?.split(' ')[0] || 'Sem atendente'}
                          </span>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Slide-over Detail Drawer */}
      <LeadDrawer />

      {/* Modal de Gerenciamento de Estágios do Pipeline (Req 5) */}
      <StagesManagerDialog
        open={isStagesDialogOpen}
        onOpenChange={setIsStagesDialogOpen}
      />
    </div>
  )
}
