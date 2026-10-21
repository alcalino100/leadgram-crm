'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { 
  Search, 
  Filter, 
  MessageSquare, 
  MoreHorizontal, 
  Crown, 
  Flame, 
  Plus, 
  X, 
  ArrowUpDown, 
  ExternalLink,
  Tag as TagIcon,
  User,
  SlidersHorizontal
} from 'lucide-react'
import { toast } from 'sonner'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { NewLeadDialog } from '@/components/leads/new-lead-dialog'
import { mockLeadSources, mockPipelineStages, mockUsers, mockCampaigns } from '@/lib/mock-data'
import { LeadStageId } from '@/types'

export function LeadsTable() {
  const router = useRouter()
  const { leads, pipelineStages, users, openLeadDrawer, updateLeadStage, assignLead, deleteLead } = useAppStore()

  const [search, setSearch] = React.useState('')
  const [selectedSource, setSelectedSource] = React.useState<string>('all')
  const [selectedStage, setSelectedStage] = React.useState<string>('all')
  const [selectedUser, setSelectedUser] = React.useState<string>('all')
  const [selectedCampaign, setSelectedCampaign] = React.useState<string>('all')
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300)
    return () => clearTimeout(timer)
  }, [])

  // Filter logic
  const filteredLeads = leads.filter((lead) => {
    const searchLower = search.toLowerCase()
    const matchesSearch =
      !search ||
      lead.name.toLowerCase().includes(searchLower) ||
      (lead.phone && lead.phone.toLowerCase().includes(searchLower)) ||
      (lead.telegram_username && lead.telegram_username.toLowerCase().includes(searchLower)) ||
      (lead.telegram_chat_id && String(lead.telegram_chat_id).includes(searchLower))

    const matchesSource = selectedSource === 'all' || lead.source_id === selectedSource
    const matchesStage = selectedStage === 'all' || lead.stage === selectedStage
    const matchesUser = selectedUser === 'all' || lead.assigned_to === selectedUser
    const matchesCampaign = selectedCampaign === 'all' || lead.campaign_id === selectedCampaign

    return matchesSearch && matchesSource && matchesStage && matchesUser && matchesCampaign
  })

  const hasActiveFilters =
    search || selectedSource !== 'all' || selectedStage !== 'all' || selectedUser !== 'all' || selectedCampaign !== 'all'

  const clearFilters = () => {
    setSearch('')
    setSelectedSource('all')
    setSelectedStage('all')
    setSelectedUser('all')
    setSelectedCampaign('all')
  }

  return (
    <div className="space-y-4">
      {/* Table Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="h-3.5 w-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome, telefone, @username ou chat_id..."
              className="pl-8 text-xs bg-zinc-900/60"
            />
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-xs text-zinc-400 hover:text-zinc-100 flex items-center gap-1 shrink-0"
            >
              <X className="h-3.5 w-3.5" />
              Limpar
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <NewLeadDialog />
        </div>
      </div>

      {/* Filter Badges Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-[10px] font-semibold uppercase text-zinc-400 flex items-center gap-1 shrink-0">
          <Filter className="h-3 w-3" /> Filtros:
        </span>

        {/* Origem Filter */}
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

        {/* Estágio Filter */}
        <select
          value={selectedStage}
          onChange={(e) => setSelectedStage(e.target.value)}
          className="h-7 rounded-md bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300 px-2 focus:outline-none focus:ring-1 focus:ring-pink-500"
        >
          <option value="all">Todos os Estágios</option>
          {pipelineStages.map((st) => (
            <option key={st.id} value={st.id}>
              {st.name}
            </option>
          ))}
        </select>

        {/* Responsável Filter */}
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

        {/* Campanha Filter */}
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

      {/* Main Table Container */}
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-xs overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : filteredLeads.length === 0 ? (
          /* Empty State */
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="h-12 w-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 mb-3">
              <Search className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-200">Nenhum lead encontrado</h3>
            <p className="text-xs text-zinc-400 mt-1 max-w-sm">
              Nenhum lead coincide com os filtros aplicados ou sua conta ainda não possui leads cadastrados.
            </p>
            <div className="mt-4 flex gap-2">
              {hasActiveFilters && (
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Limpar Filtros
                </Button>
              )}
              <NewLeadDialog />
            </div>
          </div>
        ) : (
          /* Data Table */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900/80 border-b border-zinc-800 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Lead / Contato</th>
                  <th className="py-3 px-3">Origem & Campanha</th>
                  <th className="py-3 px-3">Estágio</th>
                  <th className="py-3 px-3">Qualificação (Score)</th>
                  <th className="py-3 px-3">Responsável</th>
                  <th className="py-3 px-3">Tags</th>
                  <th className="py-3 px-3 text-right">Valor Estimado</th>
                  <th className="py-3 px-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => openLeadDrawer(lead.id)}
                    className="hover:bg-zinc-800/30 transition-colors cursor-pointer group"
                  >
                    {/* Lead info */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-xs font-semibold text-zinc-300 shrink-0">
                          {lead.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-zinc-100 group-hover:text-cyan-400 transition-colors">
                            {lead.name}
                          </p>
                          <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-mono-code mt-0.5">
                            <span className="text-cyan-400">{lead.telegram_username || '@s/user'}</span>
                            <span>•</span>
                            <span>{lead.phone || 's/ tel'}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Source & Campaign */}
                    <td className="py-3 px-3">
                      <div>
                        <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-zinc-800 text-zinc-300 border border-zinc-700">
                          {lead.source?.name || 'Tráfego'}
                        </span>
                        <p className="text-[10px] text-zinc-400 truncate max-w-[160px] mt-0.5">
                          {lead.campaign?.name || 'Sem campanha'}
                        </p>
                      </div>
                    </td>

                    {/* Stage Dropdown */}
                    <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={lead.stage}
                        onChange={(e) => {
                          updateLeadStage(lead.id, e.target.value as LeadStageId)
                          toast.success('Estágio atualizado')
                        }}
                        className="h-7 rounded-md bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300 px-2 focus:outline-none focus:ring-1 focus:ring-cyan-500 capitalize"
                      >
                        {pipelineStages.map((st) => (
                          <option key={st.id} value={st.id}>
                            {st.name}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Score Badge */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        {lead.score_badge === 'vip' && (
                          <Badge variant="vip" className="gap-1">
                            <Crown className="h-2.5 w-2.5" /> VIP
                          </Badge>
                        )}
                        {lead.score_badge === 'quente' && (
                          <Badge variant="destructive" className="gap-0.5">
                            <Flame className="h-2.5 w-2.5" /> Quente
                          </Badge>
                        )}
                        {lead.score_badge === 'morno' && (
                          <Badge variant="warning">Morno</Badge>
                        )}
                        {lead.score_badge === 'frio' && (
                          <Badge variant="secondary">Frio</Badge>
                        )}
                        <span className="text-[11px] font-mono-code text-zinc-400">
                          {lead.score}
                        </span>
                      </div>
                    </td>

                    {/* Assigned User */}
                    <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={lead.assigned_to || ''}
                        onChange={(e) => {
                          assignLead(lead.id, e.target.value)
                          toast.success('Responsável atualizado')
                        }}
                        className="h-7 rounded-md bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300 px-2 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      >
                        <option value="">Não atribuído</option>
                        {users.map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.name}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Tags */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1 flex-wrap max-w-[140px]">
                        {lead.tags && lead.tags.length > 0 ? (
                          lead.tags.map((t) => (
                            <span
                              key={t.id}
                              className={`px-1.5 py-0.2 rounded text-[10px] font-medium border ${t.color}`}
                            >
                              {t.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-zinc-400">—</span>
                        )}
                      </div>
                    </td>

                    {/* Estimated Value */}
                    <td className="py-3 px-3 text-right font-mono-code font-semibold text-zinc-200">
                      {lead.estimated_value
                        ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(lead.estimated_value)
                        : 'R$ 0'}
                    </td>

                    {/* Action buttons */}
                    <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1.5">
                        <Button
                          variant="ghost"
                          size="iconSm"
                          onClick={() => {
                            router.push('/inbox')
                          }}
                          title="Abrir no Inbox Telegram"
                        >
                          <MessageSquare className="h-3.5 w-3.5 text-zinc-400 hover:text-cyan-400" />
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="iconSm">
                              <MoreHorizontal className="h-3.5 w-3.5 text-zinc-400" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openLeadDrawer(lead.id)}>
                              Abrir Detalhes do Lead
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push('/inbox')}>
                              Ver Conversa no Inbox
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-rose-400"
                              onClick={() => {
                                updateLeadStage(lead.id, 'perdido')
                                toast.error('Lead marcado como Perdido')
                              }}
                            >
                              Marcar como Perdido
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
