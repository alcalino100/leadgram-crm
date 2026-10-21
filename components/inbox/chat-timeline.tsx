'use client'

import * as React from 'react'
import { 
  Send, 
  Paperclip, 
  Mic, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  FileText, 
  Bot, 
  UserCheck, 
  Play, 
  Pause, 
  Copy, 
  Check, 
  ExternalLink, 
  QrCode, 
  Sparkles, 
  ChevronDown,
  Phone,
  MoreVertical,
  CheckCheck
} from 'lucide-react'
import { toast } from 'sonner'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { PaymentDialog } from '@/components/inbox/payment-dialog'
import { Message, MessageType } from '@/types'
import { cn } from '@/lib/utils'

interface ChatTimelineProps {
  onToggleContext?: () => void
}

export function ChatTimeline({ onToggleContext }: ChatTimelineProps) {
  const { 
    conversations, 
    activeConversationId, 
    messages, 
    sendTextMessage, 
    sendMediaMessage, 
    updateConversationStatus 
  } = useAppStore()

  const [inputMessage, setInputMessage] = React.useState('')
  const [isPlayingAudio, setIsPlayingAudio] = React.useState<string | null>(null)
  const [copiedPixId, setCopiedPixId] = React.useState<string | null>(null)
  const [paymentDialogOpen, setPaymentDialogOpen] = React.useState(false)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  const activeConv = conversations.find((c) => c.id === activeConversationId)
  const convMessages = activeConversationId ? messages[activeConversationId] || [] : []

  // Auto scroll to bottom
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [convMessages])

  // ========================================================
  // SUPABASE REALTIME LISTENER HOOK (Mock listener preparado)
  // Conectar aqui:
  // supabase.channel(`conversation:${activeConversationId}`)
  //   .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => ...)
  //   .subscribe()
  // ========================================================
  React.useEffect(() => {
    if (!activeConversationId) return
    // Mock listener conectado para receber updates do bot
  }, [activeConversationId])

  if (!activeConv) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-zinc-950 text-zinc-400">
        <Bot className="h-10 w-10 text-zinc-400 mb-2" />
        <h3 className="text-sm font-semibold text-zinc-300">Selecione uma conversa</h3>
        <p className="text-xs text-zinc-400 mt-1">
          Escolha um lead na coluna ao lado para visualizar o histórico de mensagens do Telegram.
        </p>
      </div>
    )
  }

  const lead = activeConv.lead

  const handleSend = () => {
    if (!inputMessage.trim() || !activeConversationId) return
    sendTextMessage(activeConversationId, inputMessage.trim())
    setInputMessage('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSendMockMedia = (type: MessageType) => {
    if (!activeConversationId) return
    if (type === 'audio') {
      sendMediaMessage(
        activeConversationId,
        'audio',
        'https://example.com/audio/mock-voice.mp3',
        'Mensagem de voz gravada',
        42,
        'Explicação gravada pelo atendente sobre o onboarding'
      )
      toast.success('Áudio gravado enviado no Telegram')
    } else if (type === 'photo') {
      sendMediaMessage(
        activeConversationId,
        'photo',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
        'grafico_de_performance.png',
        undefined,
        'Veja os resultados da nossa última campanha!'
      )
      toast.success('Foto enviada no Telegram')
    } else if (type === 'document') {
      sendMediaMessage(
        activeConversationId,
        'document',
        'https://example.com/docs/proposta.pdf',
        'Proposta_Comercial_Agencia.pdf',
        undefined,
        'Segue em anexo a proposta comercial detalhada.'
      )
      toast.success('Documento PDF enviado no Telegram')
    }
  }

  const handleCopyPix = (pixCode: string, id: string) => {
    navigator.clipboard.writeText(pixCode)
    setCopiedPixId(id)
    toast.success('Código Pix Copia e Cola copiado!')
    setTimeout(() => setCopiedPixId(null), 2500)
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-zinc-950 overflow-hidden relative">
      {/* Chat Top Header */}
      <div className="h-16 px-4 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-100">
            {lead?.name.substring(0, 2).toUpperCase() || 'TG'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-xs text-zinc-100">{lead?.name}</span>
              {lead?.score_badge === 'vip' && (
                <Badge variant="vip" className="text-[9px] px-1.5 py-0 h-4">VIP</Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-mono-code">
              <span className="text-cyan-400">{lead?.telegram_username || '@indefinido'}</span>
              <span>•</span>
              <span>chat_id: {lead?.telegram_chat_id}</span>
            </div>
          </div>
        </div>

        {/* Status Mode Switcher: Bot Ativo vs Em Atendimento Humano */}
        <div className="flex items-center gap-2">
          {activeConv.status === 'in_human_service' ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                updateConversationStatus(activeConv.id, 'bot_active')
                toast.info('Conversa devolvida para o Bot Automático')
              }}
              className="text-xs border-cyan-500/30 text-cyan-400 hover:bg-cyan-950/40 gap-1.5 h-7"
            >
              <Bot className="h-3.5 w-3.5" />
              <span>Devolver para Bot</span>
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => {
                updateConversationStatus(activeConv.id, 'in_human_service')
                toast.success('Você assumiu o atendimento humano!')
              }}
              className="text-xs bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold gap-1.5 h-7"
            >
              <UserCheck className="h-3.5 w-3.5" />
              <span>Assumir Atendimento</span>
            </Button>
          )}

          {/* Quick Payment Action */}
          <Button
            size="sm"
            onClick={() => setPaymentDialogOpen(true)}
            className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 font-semibold gap-1.5 h-7"
          >
            <QrCode className="h-3.5 w-3.5" />
            <span>Gerar Pix</span>
          </Button>

          {onToggleContext && (
            <Button
              size="sm"
              variant="outline"
              onClick={onToggleContext}
              className="text-xs lg:hidden h-7"
            >
              Lead
            </Button>
          )}
        </div>
      </div>

      {/* Messages Timeline */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[radial-gradient(#18181b_1px,transparent_1px)] [background-size:16px_16px]">
        {convMessages.map((msg) => {
          const isLead = msg.sender_type === 'lead'
          const isBot = msg.sender_type === 'bot'
          const isAgent = msg.sender_type === 'agent'

          return (
            <div
              key={msg.id}
              className={cn(
                "flex flex-col max-w-[80%] sm:max-w-[70%]",
                isLead ? "mr-auto items-start" : "ml-auto items-end"
              )}
            >
              {/* Sender label */}
              <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 mb-1 px-1">
                {isBot && (
                  <span className="flex items-center gap-1 text-cyan-400 font-semibold">
                    <Bot className="h-2.5 w-2.5" /> Bot IA
                  </span>
                )}
                {isAgent && (
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <UserCheck className="h-2.5 w-2.5" /> Atendente
                  </span>
                )}
                {isLead && (
                  <span className="text-zinc-300 font-medium">{lead?.name}</span>
                )}
                <span>•</span>
                <span className="font-mono-code text-[9px]">
                  {new Date(msg.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {/* Message Bubble */}
              <div
                className={cn(
                  "p-3 rounded-2xl text-xs shadow-xs leading-relaxed transition-all",
                  isLead
                    ? "bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-xs"
                    : isBot
                    ? "bg-cyan-950/40 border border-cyan-500/30 text-zinc-100 rounded-tr-xs"
                    : "bg-emerald-950/40 border border-emerald-500/30 text-zinc-100 rounded-tr-xs"
                )}
              >
                {/* Text Message */}
                {msg.message_type === 'text' && (
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                )}

                {/* Audio Voice Note */}
                {msg.message_type === 'audio' && (
                  <div className="space-y-1.5 min-w-[220px]">
                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() =>
                          setIsPlayingAudio(isPlayingAudio === msg.id ? null : msg.id)
                        }
                        className="h-8 w-8 rounded-full bg-cyan-500 text-zinc-950 flex items-center justify-center hover:bg-cyan-400 transition-colors"
                      >
                        {isPlayingAudio === msg.id ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4 ml-0.5" />
                        )}
                      </button>
                      <div className="flex-1 space-y-1">
                        <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full bg-cyan-400 transition-all duration-300",
                              isPlayingAudio === msg.id ? "w-2/3 animate-pulse" : "w-1/4"
                            )}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] font-mono-code text-zinc-400">
                          <span>Áudio Gravado</span>
                          <span>0:{msg.media_duration || 35}</span>
                        </div>
                      </div>
                    </div>
                    {msg.caption && (
                      <p className="text-[11px] text-zinc-300 pt-1 border-t border-zinc-800/60">
                        {msg.caption}
                      </p>
                    )}
                  </div>
                )}

                {/* Photo Message */}
                {msg.message_type === 'photo' && (
                  <div className="space-y-2">
                    <div className="rounded-lg overflow-hidden border border-zinc-800 max-h-56">
                      <img
                        src={msg.media_url || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800'}
                        alt="Imagem enviada"
                        className="w-full h-auto object-cover"
                      />
                    </div>
                    {msg.caption && <p className="text-[11px] text-zinc-300">{msg.caption}</p>}
                  </div>
                )}

                {/* Document PDF Message */}
                {msg.message_type === 'document' && (
                  <div className="space-y-2 min-w-[200px]">
                    <div className="flex items-center gap-2.5 p-2 rounded-lg bg-zinc-950/60 border border-zinc-800">
                      <div className="p-2 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-xs text-zinc-200 truncate">
                          {msg.media_name || 'Proposta.pdf'}
                        </p>
                        <p className="text-[10px] font-mono-code text-zinc-400">PDF • 1.4 MB</p>
                      </div>
                    </div>
                    {msg.caption && <p className="text-[11px] text-zinc-300">{msg.caption}</p>}
                  </div>
                )}

                {/* Payment Request (Pix Copia e Cola & QR Code) */}
                {msg.message_type === 'payment_request' && msg.payment && (
                  <div className="space-y-2.5 min-w-[260px] bg-zinc-950/80 p-3 rounded-xl border border-emerald-500/30">
                    <div className="flex items-center justify-between pb-1.5 border-b border-zinc-800">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                        <QrCode className="h-4 w-4" />
                        <span>Cobrança Pix Oficial</span>
                      </div>
                      <span className="text-[10px] font-mono-code uppercase px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                        {msg.payment.provider}
                      </span>
                    </div>

                    <div>
                      <p className="text-lg font-bold font-mono-code text-zinc-100">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(msg.payment.amount)}
                      </p>
                      <p className="text-[11px] text-zinc-400 mt-0.5">{msg.payment.description}</p>
                    </div>

                    {msg.payment.pix_qr_code_url && (
                      <div className="flex justify-center p-2 bg-white rounded-lg border border-zinc-200">
                        <img
                          src={msg.payment.pix_qr_code_url}
                          alt="QR Code Pix"
                          className="w-36 h-36 object-contain"
                        />
                      </div>
                    )}

                    {msg.payment.pix_copy_paste && (
                      <div className="space-y-1.5">
                        <Button
                          size="sm"
                          onClick={() => handleCopyPix(msg.payment!.pix_copy_paste!, msg.id)}
                          className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-semibold gap-1.5 h-8"
                        >
                          {copiedPixId === msg.id ? (
                            <>
                              <Check className="h-3.5 w-3.5" />
                              <span>Código Copiado!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" />
                              <span>Copiar Código Pix</span>
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Delivery receipt */}
              {!isLead && (
                <div className="flex items-center gap-1 text-[9px] text-zinc-400 mt-0.5 pr-1">
                  <CheckCheck className="h-3 w-3 text-cyan-400" />
                  <span>Entregue via Telegram Bot</span>
                </div>
              )}
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Templates Bar */}
      <div className="px-3 py-1.5 border-t border-zinc-800/80 bg-zinc-950/60 flex items-center gap-2 overflow-x-auto text-[11px]">
        <span className="text-[10px] text-zinc-400 uppercase font-semibold flex items-center gap-1 shrink-0">
          <Sparkles className="h-3 w-3 text-cyan-400" /> Respostas Rápidas:
        </span>
        <button
          onClick={() => setInputMessage('Olá! Como posso ajudar você hoje no seu projeto de tráfego?')}
          className="px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-cyan-500/40 hover:text-cyan-300 whitespace-nowrap transition-colors"
        >
          👋 Boas-vindas
        </button>
        <button
          onClick={() => setInputMessage('Perfeito! Qual é o faturamento médio atual da sua operação?')}
          className="px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-cyan-500/40 hover:text-cyan-300 whitespace-nowrap transition-colors"
        >
          📊 Pergunta de Qualificação
        </button>
        <button
          onClick={() => setInputMessage('Consegue fazer uma rápida chamada no Google Meet hoje às 16h?')}
          className="px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-cyan-500/40 hover:text-cyan-300 whitespace-nowrap transition-colors"
        >
          📅 Agendamento
        </button>
      </div>

      {/* Input Box Footer */}
      <div className="p-3 border-t border-zinc-800/80 bg-zinc-950">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-2 focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500 transition-all">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Responder a ${lead?.name || 'este lead'} no Telegram (Enter para enviar)...`}
            rows={2}
            className="w-full bg-transparent text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none resize-none"
          />

          <div className="flex items-center justify-between pt-1.5 border-t border-zinc-800/60">
            {/* Attachment dropdowns: Audio, Foto, Vídeo, Documento, Pix */}
            <div className="flex items-center gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="p-1.5 rounded-md text-zinc-400 hover:text-cyan-400 hover:bg-zinc-800 transition-colors"
                    title="Anexar mídia ou cobrança"
                  >
                    <Paperclip className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-52">
                  <DropdownMenuItem
                    onClick={() => handleSendMockMedia('audio')}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Mic className="h-4 w-4 text-cyan-400" />
                    <span>Enviar Áudio de Voz</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleSendMockMedia('photo')}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <ImageIcon className="h-4 w-4 text-emerald-400" />
                    <span>Enviar Foto / Imagem</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleSendMockMedia('document')}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <FileText className="h-4 w-4 text-amber-400" />
                    <span>Enviar Proposta PDF</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setPaymentDialogOpen(true)}
                    className="flex items-center gap-2 cursor-pointer text-emerald-400 font-semibold"
                  >
                    <QrCode className="h-4 w-4" />
                    <span>Gerar Cobrança Pix</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <button
                type="button"
                onClick={() => handleSendMockMedia('audio')}
                className="p-1.5 rounded-md text-zinc-400 hover:text-cyan-400 hover:bg-zinc-800 transition-colors"
                title="Gravar áudio"
              >
                <Mic className="h-4 w-4" />
              </button>
            </div>

            <Button
              onClick={handleSend}
              disabled={!inputMessage.trim()}
              size="sm"
              className="bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-semibold h-7 px-3 text-xs gap-1"
            >
              <span>Enviar</span>
              <Send className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Payment Dialog Modal */}
      {lead && (
        <PaymentDialog
          open={paymentDialogOpen}
          onOpenChange={setPaymentDialogOpen}
          conversationId={activeConv.id}
          leadId={lead.id}
          leadName={lead.name}
        />
      )}
    </div>
  )
}
