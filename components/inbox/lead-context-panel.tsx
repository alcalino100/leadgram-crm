'use client'

import * as React from 'react'
import { 
  User, 
  Phone, 
  Mail, 
  MessageCircle, 
  Megaphone, 
  Link2, 
  Tag as TagIcon, 
  CheckCircle2, 
  Flame, 
  Crown, 
  FileText, 
  ExternalLink,
  QrCode,
  DollarSign
} from 'lucide-react'
import { toast } from 'sonner'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { mockPipelineStages } from '@/lib/mock-data'
import { LeadStageId } from '@/types'
import { PaymentDialog } from '@/components/inbox/payment-dialog'

export function LeadContextPanel() {
  const { 
    conversations, 
    activeConversationId, 
    updateLeadStage, 
    openLeadDrawer,
    availableTags,
    toggleLeadTag,
    updateLeadNotes
  } = useAppStore()

  const [paymentOpen, setPaymentOpen] = React.useState(false)
  const activeConv = conversations.find((c) => c.id === activeConversationId)
  const lead = activeConv?.lead

  const [notes, setNotes] = React.useState('')

  React.useEffect(() => {
    if (lead) {
      setNotes(lead.notes || '')
    }
  }, [lead])

  if (!lead || !activeConv) {
    return (
      <div className="w-80 h-full bg-zinc-950 border-l border-zinc-800/80 p-4 text-center text-zinc-400 flex flex-col items-center justify-center">
        <p className="text-xs">Nenhum lead selecionado</p>
      </div>
    )
  }

  const handleStageChange = (newStage: LeadStageId) => {
    updateLeadStage(lead.id, newStage)
    toast.success('Estágio atualizado')
  }

  const handleSaveNotes = () => {
    updateLeadNotes(lead.id, notes)
    toast.success('Nota salva')
  }

  return (
    <div className="w-80 h-full bg-zinc-950 border-l border-zinc-800/80 flex flex-col overflow-y-auto">
      {/* Top Header */}
      <div className="p-4 border-b border-zinc-800/80 space-y-2">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-sm text-zinc-100">{lead.name}</h3>
            <p className="text-[11px] font-mono-code text-cyan-400">
              {lead.telegram_username || '@indefinido'}
            </p>
          </div>
          {lead.score_badge === 'vip' && <Badge variant="vip">VIP</Badge>}
          {lead.score_badge === 'quente' && <Badge variant="destructive">Quente</Badge>}
        </div>

        {/* Quick button to open full lead drawer */}
        <Button
          size="sm"
          variant="outline"
          onClick={() => openLeadDrawer(lead.id)}
          className="w-full text-xs h-7 gap-1.5"
        >
          <span>Abrir Lead Completo</span>
          <ExternalLink className="h-3 w-3" />
        </Button>
      </div>

      <div className="p-4 space-y-4 flex-1">
        {/* Stage Changer */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold uppercase text-zinc-400">Estágio no Funil</label>
          <select
            value={lead.stage}
            onChange={(e) => handleStageChange(e.target.value as LeadStageId)}
            className="w-full h-8 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 px-2 focus:outline-none focus:ring-1 focus:ring-cyan-500 capitalize"
          >
            {mockPipelineStages.map((st) => (
              <option key={st.id} value={st.id}>{st.name}</option>
            ))}
          </select>
        </div>

        {/* Score & Estimated Value */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 rounded-lg border border-zinc-800 bg-zinc-900/40">
            <span className="text-[10px] text-zinc-400 block">Lead Score</span>
            <span className="text-sm font-bold text-zinc-100 font-mono-code">{lead.score} / 100</span>
          </div>

          <div className="p-2.5 rounded-lg border border-zinc-800 bg-zinc-900/40">
            <span className="text-[10px] text-zinc-400 block">Valor Estimado</span>
            <span className="text-sm font-bold text-emerald-400 font-mono-code">
              {lead.estimated_value
                ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(lead.estimated_value)
                : 'R$ 0'}
            </span>
          </div>
        </div>

        {/* Contact info list */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2 text-zinc-300">
            <Phone className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
            <span className="font-mono-code">{lead.phone || 'Sem telefone'}</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-300">
            <Mail className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
            <span className="truncate">{lead.email || 'Sem e-mail'}</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-300">
            <MessageCircle className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
            <span className="font-mono-code text-[11px]">chat_id: {lead.telegram_chat_id}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-1.5 pt-2 border-t border-zinc-800/80">
          <span className="text-[10px] font-semibold uppercase text-zinc-400 block">Tags</span>
          <div className="flex flex-wrap gap-1">
            {availableTags.map((tag) => {
              const isSelected = lead.tags?.some((t) => t.id === tag.id)
              return (
                <button
                  key={tag.id}
                  onClick={() => toggleLeadTag(lead.id, tag)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-medium border transition-colors ${
                    isSelected ? tag.color : 'border-zinc-800 text-zinc-400 bg-zinc-900/40'
                  }`}
                >
                  {isSelected ? '✓ ' : '+ '}
                  {tag.name}
                </button>
              )
            })}
          </div>
        </div>

        {/* Campaign & UTMs */}
        <div className="space-y-1.5 pt-2 border-t border-zinc-800/80 text-[11px] font-mono-code">
          <div className="flex items-center justify-between text-zinc-400 text-[10px] font-semibold uppercase">
            <span>Atribuição de Anúncio</span>
            <span className="text-cyan-400">{lead.source?.name || 'Meta'}</span>
          </div>
          <div className="bg-zinc-900/60 p-2 rounded-lg border border-zinc-800/80 space-y-1">
            <p className="text-zinc-400 text-[10px]">utm_campaign:</p>
            <p className="text-zinc-200 truncate">{lead.utms?.utm_campaign || 'scale_campanha'}</p>
            {lead.utms?.utm_content && (
              <>
                <p className="text-zinc-400 text-[10px] pt-1">utm_content (Criativo):</p>
                <p className="text-zinc-300 truncate">{lead.utms.utm_content}</p>
              </>
            )}
          </div>
        </div>

        {/* Quick Payment Action */}
        <div className="pt-2 border-t border-zinc-800/80">
          <Button
            onClick={() => setPaymentOpen(true)}
            size="sm"
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold gap-1.5 text-xs h-8"
          >
            <QrCode className="h-3.5 w-3.5" />
            <span>Gerar Cobrança Pix</span>
          </Button>
        </div>

        {/* Internal Notes */}
        <div className="space-y-1.5 pt-2 border-t border-zinc-800/80">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase text-zinc-400">Notas Internas</span>
            <button
              onClick={handleSaveNotes}
              className="text-[10px] text-cyan-400 hover:underline"
            >
              Salvar
            </button>
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Anotações comerciais sobre este lead..."
            className="w-full rounded-md border border-zinc-800 bg-zinc-900/60 p-2 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 resize-none"
          />
        </div>
      </div>

      <PaymentDialog
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
        conversationId={activeConv.id}
        leadId={lead.id}
        leadName={lead.name}
      />
    </div>
  )
}
