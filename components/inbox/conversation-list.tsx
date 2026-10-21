'use client'

import * as React from 'react'
import { 
  Search, 
  Filter, 
  MessageSquare, 
  Flame, 
  Crown, 
  Bot as BotIcon, 
  UserCheck, 
  Clock,
  Radio
} from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { ConversationStatus } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface ConversationListProps {
  onSelectConversation?: (id: string) => void
}

export function ConversationList({ onSelectConversation }: ConversationListProps) {
  const { conversations, activeConversationId, setActiveConversationId } = useAppStore()

  const [search, setSearch] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<string>('all')
  const [onlyHotLeads, setOnlyHotLeads] = React.useState(false)

  const filteredConversations = conversations.filter((conv) => {
    const searchLower = search.toLowerCase()
    const matchesSearch =
      !search ||
      (conv.lead?.name && conv.lead.name.toLowerCase().includes(searchLower)) ||
      (conv.lead?.telegram_username && conv.lead.telegram_username.toLowerCase().includes(searchLower)) ||
      (conv.last_message && conv.last_message.toLowerCase().includes(searchLower))

    const matchesStatus = statusFilter === 'all' || conv.status === statusFilter
    const matchesHot = !onlyHotLeads || conv.lead?.score_badge === 'quente' || conv.lead?.score_badge === 'vip'

    return matchesSearch && matchesStatus && matchesHot
  })

  const getStatusBadge = (status: ConversationStatus) => {
    switch (status) {
      case 'bot_active':
        return (
          <span className="inline-flex items-center gap-1 text-[9px] font-mono-code px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <BotIcon className="h-2.5 w-2.5" /> Bot Ativo
          </span>
        )
      case 'waiting_human':
        return (
          <span className="inline-flex items-center gap-1 text-[9px] font-mono-code px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold animate-pulse">
            <Radio className="h-2.5 w-2.5" /> Aguardando Humano
          </span>
        )
      case 'in_human_service':
        return (
          <span className="inline-flex items-center gap-1 text-[9px] font-mono-code px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <UserCheck className="h-2.5 w-2.5" /> Em Atendimento
          </span>
        )
      case 'closed':
        return (
          <span className="inline-flex items-center text-[9px] font-mono-code px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400">
            Encerrado
          </span>
        )
    }
  }

  return (
    <div className="flex flex-col h-full bg-zinc-950 border-r border-zinc-800/80">
      {/* Top Search & Filter Bar */}
      <div className="p-3 border-b border-zinc-800/80 space-y-2">
        <div className="relative">
          <Search className="h-3.5 w-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar mensagens, leads..."
            className="pl-8 text-xs bg-zinc-900/60 h-8"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-0.5">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-6 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-300 px-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          >
            <option value="all">Todos os Status</option>
            <option value="waiting_human">Aguardando Humano</option>
            <option value="in_human_service">Em Atendimento</option>
            <option value="bot_active">Bot Ativo</option>
            <option value="closed">Encerrados</option>
          </select>

          <button
            onClick={() => setOnlyHotLeads(!onlyHotLeads)}
            className={cn(
              "px-2 py-0.5 rounded text-[10px] font-medium border transition-colors flex items-center gap-1 shrink-0",
              onlyHotLeads
                ? "bg-pink-500/15 text-pink-300 border-pink-500/40"
                : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200"
            )}
          >
            <Flame className="h-2.5 w-2.5 text-pink-400" />
            <span>Leads Quentes</span>
          </button>
        </div>
      </div>

      {/* Conversations Scrollable List */}
      <div className="flex-1 overflow-y-auto divide-y divide-zinc-900">
        {filteredConversations.length === 0 ? (
          <div className="p-8 text-center text-zinc-400 flex flex-col items-center justify-center">
            <MessageSquare className="h-6 w-6 text-zinc-400 mb-2" />
            <p className="text-xs font-semibold text-zinc-300">Nenhuma conversa encontrada</p>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Não há chats ativos para os filtros selecionados.
            </p>
          </div>
        ) : (
          filteredConversations.map((conv) => {
            const isSelected = activeConversationId === conv.id
            const lead = conv.lead

            return (
              <div
                key={conv.id}
                onClick={() => {
                  setActiveConversationId(conv.id)
                  if (onSelectConversation) onSelectConversation(conv.id)
                }}
                className={cn(
                  "p-3 cursor-pointer transition-colors relative group",
                  isSelected
                    ? "bg-zinc-900 border-l-2 border-l-cyan-400 text-zinc-100"
                    : "hover:bg-zinc-900/50 text-zinc-300"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="h-8 w-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-semibold text-zinc-200 shrink-0">
                      {lead?.name.substring(0, 2).toUpperCase() || 'TG'}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-xs text-zinc-100 truncate">
                          {lead?.name || 'Lead Anônimo'}
                        </span>
                        {lead?.score_badge === 'vip' && (
                          <span className="h-1.5 w-1.5 rounded-full bg-pink-500" title="Lead VIP" />
                        )}
                        {lead?.score_badge === 'quente' && (
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" title="Lead Quente" />
                        )}
                      </div>

                      <p className="text-[10px] font-mono-code text-cyan-400 truncate">
                        {lead?.telegram_username || `@chat_${lead?.telegram_chat_id}`}
                      </p>
                    </div>
                  </div>

                  <span className="text-[9px] font-mono-code text-zinc-400 shrink-0">
                    {conv.last_message_at
                      ? new Date(conv.last_message_at).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : ''}
                  </span>
                </div>

                {/* Last message preview */}
                <p className="text-[11px] text-zinc-400 line-clamp-1 mt-1 pl-10">
                  {conv.last_message || 'Iniciando atendimento...'}
                </p>

                {/* Footer status & unread */}
                <div className="mt-2 pl-10 flex items-center justify-between">
                  <div>{getStatusBadge(conv.status)}</div>

                  {conv.unread_count && conv.unread_count > 0 ? (
                    <span className="px-1.5 py-0.2 rounded-full bg-cyan-500 text-zinc-950 font-bold text-[9px] font-mono-code">
                      {conv.unread_count}
                    </span>
                  ) : null}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
