'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { 
  X, 
  MessageSquare, 
  Phone, 
  Mail, 
  Send, 
  Tag as TagIcon, 
  Clock, 
  User, 
  Calendar, 
  Flame, 
  Crown, 
  Link2, 
  ExternalLink, 
  Activity, 
  CheckCircle2, 
  Plus, 
  Trash2,
  Share2
} from 'lucide-react'
import { toast } from 'sonner'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { mockPipelineStages, mockUsers } from '@/lib/mock-data'
import { LeadStageId } from '@/types'

export function LeadDrawer() {
  const router = useRouter()
  const { 
    selectedLeadId, 
    isLeadDrawerOpen, 
    closeLeadDrawer, 
    leads, 
    leadEvents,
    availableTags,
    updateLeadStage, 
    assignLead, 
    toggleLeadTag, 
    updateLeadNotes 
  } = useAppStore()

  const lead = leads.find((l) => l.id === selectedLeadId)
  const [notesText, setNotesText] = React.useState('')
  const [isEditingNotes, setIsEditingNotes] = React.useState(false)

  React.useEffect(() => {
    if (lead) {
      setNotesText(lead.notes || '')
      setIsEditingNotes(false)
    }
  }, [lead])

  if (!isLeadDrawerOpen || !lead) return null

  const events = leadEvents.filter((e) => e.lead_id === lead.id)

  const handleSaveNotes = () => {
    updateLeadNotes(lead.id, notesText)
    setIsEditingNotes(false)
    toast.success('Nota interna atualizada')
  }

  const handleStageChange = (newStage: LeadStageId) => {
    updateLeadStage(lead.id, newStage)
    toast.success(`Estágio alterado para "${newStage.replace('_', ' ').toUpperCase()}"`)
  }

  const handleAssignChange = (userId: string) => {
    assignLead(lead.id, userId)
    toast.success('Responsável atualizado')
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={closeLeadDrawer}
        aria-hidden="true"
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-xl bg-zinc-950 border-l border-zinc-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-start justify-between bg-zinc-900/40">
          <div className="space-y-1 pr-6">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-zinc-100">{lead.name}</h2>
              {lead.score_badge === 'vip' && (
                <Badge variant="vip" className="gap-1">
                  <Crown className="h-2.5 w-2.5" /> VIP ({lead.score} pts)
                </Badge>
              )}
              {lead.score_badge === 'quente' && (
                <Badge variant="destructive" className="gap-1">
                  <Flame className="h-2.5 w-2.5" /> Quente ({lead.score} pts)
                </Badge>
              )}
              {lead.score_badge === 'morno' && (
                <Badge variant="warning">
                  Morno ({lead.score} pts)
                </Badge>
              )}
              {lead.score_badge === 'frio' && (
                <Badge variant="secondary">
                  Frio ({lead.score} pts)
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-zinc-400">
              <span className="font-mono-code text-cyan-400">
                {lead.telegram_username || '@indefinido'}
              </span>
              <span>•</span>
              <span className="font-mono-code text-zinc-400">
                ID: {lead.telegram_chat_id || 'sem_chat_id'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="default"
              onClick={() => {
                closeLeadDrawer()
                router.push('/inbox')
              }}
              className="bg-cyan-500 hover:bg-cyan-400 text-zinc-950 text-xs font-semibold gap-1.5"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Abrir Inbox</span>
            </Button>
            <button
              onClick={closeLeadDrawer}
              className="p-1 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
              aria-label="Fechar painel do lead"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Action Controls: Stage & Assignee */}
        <div className="p-3 bg-zinc-900/60 border-b border-zinc-800 grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-semibold uppercase text-zinc-400 block mb-1">
              Estágio do Funil
            </label>
            <select
              value={lead.stage}
              onChange={(e) => handleStageChange(e.target.value as LeadStageId)}
              className="w-full h-8 rounded-md bg-zinc-900 border border-zinc-700/80 text-xs text-zinc-100 px-2 focus:outline-none focus:ring-1 focus:ring-cyan-500 capitalize"
            >
              {mockPipelineStages.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-semibold uppercase text-zinc-400 block mb-1">
              Responsável Comercial
            </label>
            <select
              value={lead.assigned_to || ''}
              onChange={(e) => handleAssignChange(e.target.value)}
              className="w-full h-8 rounded-md bg-zinc-900 border border-zinc-700/80 text-xs text-zinc-100 px-2 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              <option value="">Não atribuído</option>
              {mockUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Scrollable Content Body with Tabs */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Contact & Value Summary Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-2.5 rounded-lg border border-zinc-800 bg-zinc-900/30">
              <span className="text-[10px] text-zinc-400 block">Telefone</span>
              <span className="text-xs font-medium text-zinc-200 flex items-center gap-1.5 mt-0.5 font-mono-code">
                <Phone className="h-3 w-3 text-cyan-400" />
                {lead.phone || 'Não informado'}
              </span>
            </div>

            <div className="p-2.5 rounded-lg border border-zinc-800 bg-zinc-900/30">
              <span className="text-[10px] text-zinc-400 block">E-mail</span>
              <span className="text-xs font-medium text-zinc-200 flex items-center gap-1.5 mt-0.5 truncate">
                <Mail className="h-3 w-3 text-zinc-400" />
                {lead.email || 'Não informado'}
              </span>
            </div>

            <div className="p-2.5 rounded-lg border border-zinc-800 bg-zinc-900/30">
              <span className="text-[10px] text-zinc-400 block">Valor Estimado</span>
              <span className="text-xs font-bold text-emerald-400 mt-0.5 font-mono-code block">
                {lead.estimated_value
                  ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(lead.estimated_value)
                  : 'R$ 0,00'}
              </span>
            </div>

            <div className="p-2.5 rounded-lg border border-zinc-800 bg-zinc-900/30">
              <span className="text-[10px] text-zinc-400 block">Canal / Origem</span>
              <span className="text-xs font-medium text-cyan-300 mt-0.5 block truncate">
                {lead.source?.name || 'Tráfego Pago'}
              </span>
            </div>
          </div>

          {/* Tags Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <TagIcon className="h-3.5 w-3.5 text-zinc-400" /> Tags de Segmentação
              </span>
              <span className="text-[10px] text-zinc-400">Clique para alternar</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {availableTags.map((tag) => {
                const isSelected = lead.tags?.some((t) => t.id === tag.id)
                return (
                  <button
                    key={tag.id}
                    onClick={() => toggleLeadTag(lead.id, tag)}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all border ${
                      isSelected
                        ? tag.color
                        : 'border-zinc-800 text-zinc-400 bg-zinc-900/40 hover:bg-zinc-800'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {tag.name}
                  </button>
                )
              })}
            </div>
          </div>

          {/* UTM Attribution Accordion / Card */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3 space-y-2">
            <div className="flex items-center justify-between pb-1 border-b border-zinc-800/80">
              <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1.5">
                <Link2 className="h-3.5 w-3.5" /> Atribuição de Tráfego Pago & UTMs
              </span>
              <span className="text-[10px] font-mono-code text-zinc-400">
                {lead.campaign?.platform?.toUpperCase() || 'META'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono-code">
              <div>
                <span className="text-zinc-400 text-[10px] block">utm_source:</span>
                <span className="text-zinc-200">{lead.utms?.utm_source || 'meta'}</span>
              </div>
              <div>
                <span className="text-zinc-400 text-[10px] block">utm_medium:</span>
                <span className="text-zinc-200">{lead.utms?.utm_medium || 'cpc'}</span>
              </div>
              <div className="col-span-2">
                <span className="text-zinc-400 text-[10px] block">utm_campaign:</span>
                <span className="text-cyan-400 break-all">{lead.utms?.utm_campaign || 'scale_campanha_topo'}</span>
              </div>
              {lead.utms?.utm_content && (
                <div className="col-span-2">
                  <span className="text-zinc-400 text-[10px] block">utm_content (Criativo):</span>
                  <span className="text-zinc-300 break-all">{lead.utms.utm_content}</span>
                </div>
              )}
              {lead.utms?.utm_term && (
                <div className="col-span-2">
                  <span className="text-zinc-400 text-[10px] block">utm_term (Público):</span>
                  <span className="text-zinc-300">{lead.utms.utm_term}</span>
                </div>
              )}
            </div>
          </div>

          {/* Tabs for Timeline / Notes / Tasks */}
          <Tabs defaultValue="events" className="w-full">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="events">Histórico ({events.length})</TabsTrigger>
              <TabsTrigger value="notes">Notas Internas</TabsTrigger>
              <TabsTrigger value="tasks">Tarefas</TabsTrigger>
            </TabsList>

            {/* Events Tab */}
            <TabsContent value="events" className="space-y-3 pt-2">
              {events.length === 0 ? (
                <p className="text-xs text-zinc-400 text-center py-4">Nenhum evento registrado ainda.</p>
              ) : (
                <div className="relative pl-4 space-y-4 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-[1px] before:bg-zinc-800">
                  {events.map((evt) => (
                    <div key={evt.id} className="relative text-xs group">
                      <div className="absolute -left-4 top-1 h-2 w-2 rounded-full bg-cyan-400 ring-4 ring-zinc-950" />
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-zinc-200">{evt.title}</span>
                          <span className="text-[10px] font-mono-code text-zinc-400">
                            {new Date(evt.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        {evt.description && (
                          <p className="text-zinc-400 text-[11px] mt-0.5 leading-relaxed">{evt.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Notes Tab */}
            <TabsContent value="notes" className="space-y-3 pt-2">
              <div className="space-y-2">
                <Textarea
                  value={notesText}
                  onChange={(e) => {
                    setNotesText(e.target.value)
                    setIsEditingNotes(true)
                  }}
                  placeholder="Insira detalhes de follow-up, faturamento do cliente, objeções..."
                  rows={4}
                  className="text-xs"
                />
                {isEditingNotes && (
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setNotesText(lead.notes || '')
                        setIsEditingNotes(false)
                      }}
                    >
                      Descartar
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSaveNotes}
                      className="bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-semibold"
                    >
                      Salvar Nota
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Tasks Tab */}
            <TabsContent value="tasks" className="space-y-3 pt-2">
              <div className="rounded-lg border border-zinc-800 p-3 bg-zinc-900/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                    <span className="text-xs font-medium text-zinc-200">Follow-up Proposta Comercial</span>
                  </div>
                  <span className="text-[10px] font-mono-code text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                    Amanhã 15h
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Ligar para o Rodrigo ou chamar no Telegram para tirar dúvidas sobre o fechamento.
                </p>
              </div>

              <Button variant="outline" size="sm" className="w-full text-xs text-zinc-400 hover:text-zinc-100">
                + Adicionar Lembrete / Tarefa
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}
