'use client'

import * as React from 'react'
import { Handle, Position } from '@xyflow/react'
import { 
  Zap, 
  MessageSquare, 
  Mic, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  FileText, 
  QrCode, 
  Clock, 
  GitBranch, 
  Tag as TagIcon, 
  ArrowRight,
  UserCheck,
  Flame,
  CheckCircle2,
  Sliders
} from 'lucide-react'

// 1. TRIGGER NODE (Gatilho Inicial)
export function TriggerNode({ data }: { data: any }) {
  return (
    <div className="min-w-[260px] rounded-xl border border-cyan-500/50 bg-zinc-950/95 p-3.5 shadow-2xl backdrop-blur-md text-zinc-100">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Zap className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono-code uppercase text-cyan-400 font-bold block">
              Gatilho Inicial
            </span>
            <span className="text-xs font-bold text-zinc-100">{data.label || data.title || 'Novo Lead Ads'}</span>
          </div>
        </div>
      </div>

      <div className="pt-2 text-[11px] text-zinc-400 space-y-1">
        <p className="line-clamp-2">{data.description || 'Dispara quando o lead clica no anúncio e abre o bot.'}</p>
        {(data.badge || data.event) && (
          <span className="inline-block text-[9px] font-mono-code px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-cyan-300">
            {data.badge || data.event}
          </span>
        )}
      </div>

      {/* Handles para conexões horizontais e verticais */}
      <Handle
        type="source"
        position={Position.Right}
        id="source-right"
        className="w-3 h-3 bg-cyan-400 border-2 border-zinc-950"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="source-bottom"
        className="w-3 h-3 bg-cyan-400 border-2 border-zinc-950"
      />
    </div>
  )
}

// 2. TELEGRAM TEXT ACTION NODE
export function TextActionNode({ data }: { data: any }) {
  const messageContent = data.template || data.message || 'Olá amor! Bem-vindo ao meu canal exclusivo...'

  return (
    <div className="min-w-[270px] max-w-[320px] rounded-xl border border-blue-500/40 bg-zinc-950/95 p-3.5 shadow-2xl backdrop-blur-md text-zinc-100">
      <Handle
        type="target"
        position={Position.Left}
        id="target-left"
        className="w-3 h-3 bg-blue-400 border-2 border-zinc-950"
      />
      <Handle
        type="target"
        position={Position.Top}
        id="target-top"
        className="w-3 h-3 bg-blue-400 border-2 border-zinc-950"
      />

      <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <MessageSquare className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono-code uppercase text-blue-400 font-bold block">
              Telegram: Mensagem
            </span>
            <span className="text-xs font-bold text-zinc-100">{data.title || 'Enviar Texto'}</span>
          </div>
        </div>
      </div>

      <div className="pt-2 text-[11px] text-zinc-300">
        <div className="p-2 rounded bg-zinc-900/80 border border-zinc-800 text-zinc-300 text-[11px] whitespace-pre-line line-clamp-4">
          {messageContent}
        </div>
      </div>

      {/* Botões Inline do Telegram (Ex: Quero 🫣😏 / Agora não) */}
      {data.buttons && Array.isArray(data.buttons) && data.buttons.length > 0 && (
        <div className="mt-3 pt-2.5 border-t border-zinc-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-400 font-medium flex items-center gap-1">
              👇 Selecione uma opção:
            </span>
            <span className="text-[9px] font-mono-code text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded border border-sky-500/20">
              Inline
            </span>
          </div>

          <div className="space-y-1.5">
            {data.buttons.map((btn: any, index: number) => {
              const btnId = btn.id || `btn-${index}`
              const isUrl = btn.action === 'url'
              return (
                <div
                  key={btnId}
                  className="relative group flex items-center justify-between px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-md shadow-sky-950/40 transition-all border border-sky-400/30"
                >
                  <span className="truncate pr-2">{btn.text || btn.label || `Opção ${index + 1}`}</span>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {isUrl ? (
                      <span className="text-[9px] font-mono-code bg-sky-700/90 px-1.5 py-0.5 rounded text-sky-200">
                        Link ↗
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono-code bg-sky-700/90 px-1.5 py-0.5 rounded text-sky-200">
                        Simulando
                      </span>
                    )}
                  </div>

                  {/* Saída conectável exclusiva para o botão */}
                  <Handle
                    type="source"
                    position={Position.Right}
                    id={`btn-${btnId}`}
                    className="!w-3 !h-3 !bg-sky-300 !border-2 !border-zinc-950 !-right-2 hover:!scale-125 transition-transform"
                    title={`Conectar saída do botão: "${btn.text || btn.label}"`}
                  />
                </div>
              )
            })}
          </div>
        </div>
      )}

      <Handle
        type="source"
        position={Position.Right}
        id="source-right"
        className="w-3 h-3 bg-blue-400 border-2 border-zinc-950"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="source-bottom"
        className="w-3 h-3 bg-blue-400 border-2 border-zinc-950"
      />
    </div>
  )
}

// 3. AUDIO / VOICE NOTE ACTION NODE
export function AudioActionNode({ data }: { data: any }) {
  return (
    <div className="min-w-[260px] rounded-xl border border-amber-500/50 bg-zinc-950/95 p-3.5 shadow-2xl backdrop-blur-md text-zinc-100">
      <Handle
        type="target"
        position={Position.Left}
        id="target-left"
        className="w-3 h-3 bg-amber-400 border-2 border-zinc-950"
      />
      <Handle
        type="target"
        position={Position.Top}
        id="target-top"
        className="w-3 h-3 bg-amber-400 border-2 border-zinc-950"
      />

      <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Mic className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono-code uppercase text-amber-400 font-bold block">
              Telegram: Áudio de Voz
            </span>
            <span className="text-xs font-bold text-zinc-100">{data.title || 'Áudio Sussurrado'}</span>
          </div>
        </div>
        <span className="text-[10px] font-mono-code text-zinc-400 px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800">
          {data.duration || '0:18'}
        </span>
      </div>

      <div className="pt-2 text-[11px] text-zinc-400">
        <p className="line-clamp-2 italic">"{data.caption || data.message || 'Áudio gravado como nota de voz humana'}"</p>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="source-right"
        className="w-3 h-3 bg-amber-400 border-2 border-zinc-950"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="source-bottom"
        className="w-3 h-3 bg-amber-400 border-2 border-zinc-950"
      />
    </div>
  )
}

// 4. MEDIA (PHOTO / VIDEO / TEASER) ACTION NODE
export function MediaActionNode({ data }: { data: any }) {
  const isVideo = data.mediaType === 'video'

  return (
    <div className="min-w-[260px] rounded-xl border border-pink-500/50 bg-zinc-950/95 p-3.5 shadow-2xl backdrop-blur-md text-zinc-100">
      <Handle
        type="target"
        position={Position.Left}
        id="target-left"
        className="w-3 h-3 bg-pink-400 border-2 border-zinc-950"
      />
      <Handle
        type="target"
        position={Position.Top}
        id="target-top"
        className="w-3 h-3 bg-pink-400 border-2 border-zinc-950"
      />

      <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-pink-500/20 text-pink-400 border border-pink-500/30">
            {isVideo ? <VideoIcon className="h-4 w-4" /> : <ImageIcon className="h-4 w-4" />}
          </div>
          <div>
            <span className="text-[10px] font-mono-code uppercase text-pink-400 font-bold block">
              Telegram: {isVideo ? 'Vídeo / Prévia' : 'Foto / Teaser VIP'}
            </span>
            <span className="text-xs font-bold text-zinc-100">{data.title || 'Teaser Exclusivo'}</span>
          </div>
        </div>
      </div>

      <div className="pt-2 text-[11px] text-zinc-400 space-y-1">
        <p className="line-clamp-2">Legenda: "{data.caption || data.message || 'Prévia do conteúdo liberado de hoje 🔥'}"</p>
      </div>

      {/* Botões Inline do Telegram para Mídia Teaser */}
      {data.buttons && Array.isArray(data.buttons) && data.buttons.length > 0 && (
        <div className="mt-3 pt-2.5 border-t border-zinc-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-400 font-medium flex items-center gap-1">
              👇 Selecione uma opção:
            </span>
            <span className="text-[9px] font-mono-code text-pink-400 bg-pink-500/10 px-1.5 py-0.5 rounded border border-pink-500/20">
              Inline
            </span>
          </div>

          <div className="space-y-1.5">
            {data.buttons.map((btn: any, index: number) => {
              const btnId = btn.id || `btn-${index}`
              const isUrl = btn.action === 'url'
              return (
                <div
                  key={btnId}
                  className="relative group flex items-center justify-between px-3 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white text-xs font-semibold shadow-md shadow-pink-950/40 transition-all border border-pink-400/30"
                >
                  <span className="truncate pr-2">{btn.text || btn.label || `Opção ${index + 1}`}</span>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {isUrl ? (
                      <span className="text-[9px] font-mono-code bg-pink-700/90 px-1.5 py-0.5 rounded text-pink-200">
                        Link ↗
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono-code bg-pink-700/90 px-1.5 py-0.5 rounded text-pink-200">
                        Simulando
                      </span>
                    )}
                  </div>

                  {/* Saída conectável exclusiva para o botão */}
                  <Handle
                    type="source"
                    position={Position.Right}
                    id={`btn-${btnId}`}
                    className="!w-3 !h-3 !bg-pink-300 !border-2 !border-zinc-950 !-right-2 hover:!scale-125 transition-transform"
                    title={`Conectar saída do botão: "${btn.text || btn.label}"`}
                  />
                </div>
              )
            })}
          </div>
        </div>
      )}

      <Handle
        type="source"
        position={Position.Right}
        id="source-right"
        className="w-3 h-3 bg-pink-400 border-2 border-zinc-950"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="source-bottom"
        className="w-3 h-3 bg-pink-400 border-2 border-zinc-950"
      />
    </div>
  )
}

// 5. PAYMENT PIX GATEWAY ACTION NODE (Firebot PIX)
export function PaymentActionNode({ data }: { data: any }) {
  const amountFormatted = data.amount
    ? typeof data.amount === 'number'
      ? data.amount.toFixed(2).replace('.', ',')
      : String(data.amount)
    : '49,90'

  return (
    <div className="min-w-[270px] rounded-xl border border-emerald-500/60 bg-zinc-950/95 p-3.5 shadow-2xl backdrop-blur-md text-zinc-100">
      <Handle
        type="target"
        position={Position.Left}
        id="target-left"
        className="w-3 h-3 bg-emerald-400 border-2 border-zinc-950"
      />
      <Handle
        type="target"
        position={Position.Top}
        id="target-top"
        className="w-3 h-3 bg-emerald-400 border-2 border-zinc-950"
      />

      <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <QrCode className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono-code uppercase text-emerald-400 font-bold block">
              Firebot PIX Automático
            </span>
            <span className="text-xs font-bold text-zinc-100">{data.description || data.title || 'Acesso VIP Mensal'}</span>
          </div>
        </div>
      </div>

      <div className="pt-2 space-y-1.5 text-[11px]">
        <div className="flex items-center justify-between font-mono-code">
          <span className="text-zinc-400">Valor da Cobrança:</span>
          <span className="text-emerald-400 font-bold text-sm">R$ {amountFormatted}</span>
        </div>
        <div className="flex items-center justify-between font-mono-code text-[10px]">
          <span className="text-zinc-500">Gateway:</span>
          <span className="text-zinc-300 font-semibold uppercase">Firebot API (Instantâneo)</span>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="source-right"
        className="w-3 h-3 bg-emerald-400 border-2 border-zinc-950"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="source-bottom"
        className="w-3 h-3 bg-emerald-400 border-2 border-zinc-950"
      />
    </div>
  )
}

// 6. DELAY NODE (Tempo de Espera)
export function DelayNode({ data }: { data: any }) {
  const delayText = data.delay || (data.duration ? `${data.duration} ${data.unit || 'minutos'}` : '15 minutos')

  return (
    <div className="min-w-[230px] rounded-xl border border-amber-500/40 bg-zinc-950/95 p-3.5 shadow-2xl backdrop-blur-md text-zinc-100">
      <Handle
        type="target"
        position={Position.Left}
        id="target-left"
        className="w-3 h-3 bg-amber-400 border-2 border-zinc-950"
      />
      <Handle
        type="target"
        position={Position.Top}
        id="target-top"
        className="w-3 h-3 bg-amber-400 border-2 border-zinc-950"
      />

      <div className="flex items-center justify-between pb-1.5 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono-code uppercase text-amber-400 font-bold block">
              Tempo de Espera (Delay)
            </span>
            <span className="text-xs font-bold text-zinc-100">Aguardar {delayText}</span>
          </div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="source-right"
        className="w-3 h-3 bg-amber-400 border-2 border-zinc-950"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="source-bottom"
        className="w-3 h-3 bg-amber-400 border-2 border-zinc-950"
      />
    </div>
  )
}

// 7. CONDITION NODE (Se / Então)
export function ConditionNode({ data }: { data: any }) {
  return (
    <div className="min-w-[250px] rounded-xl border border-purple-500/50 bg-zinc-950/95 p-3.5 shadow-2xl backdrop-blur-md text-zinc-100">
      <Handle
        type="target"
        position={Position.Left}
        id="target-left"
        className="w-3 h-3 bg-purple-400 border-2 border-zinc-950"
      />
      <Handle
        type="target"
        position={Position.Top}
        id="target-top"
        className="w-3 h-3 bg-purple-400 border-2 border-zinc-950"
      />

      <div className="flex items-center justify-between pb-1.5 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <GitBranch className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono-code uppercase text-purple-400 font-bold block">
              Condição Lógica
            </span>
            <span className="text-xs font-bold text-zinc-100">{data.rule || 'Checagem de Status'}</span>
          </div>
        </div>
      </div>

      <div className="pt-2 text-[11px] font-mono-code space-y-1">
        <div className="flex items-center justify-between text-emerald-400">
          <span>Se Sim (Pago):</span>
          <span>Liberar VIP →</span>
        </div>
        <div className="flex items-center justify-between text-rose-400">
          <span>Se Não (Pendente):</span>
          <span>Follow-up →</span>
        </div>
      </div>

      <Handle
        type="source"
        id="true"
        position={Position.Right}
        style={{ top: '65%' }}
        className="w-3 h-3 bg-emerald-400 border-2 border-zinc-950"
      />
      <Handle
        type="source"
        id="false"
        position={Position.Right}
        style={{ top: '85%' }}
        className="w-3 h-3 bg-rose-400 border-2 border-zinc-950"
      />
    </div>
  )
}

// 8. CRM STAGE & TAG NODE (Ação CRM)
export function CrmActionNode({ data }: { data: any }) {
  const actionTitle = data.label || data.action || data.title || 'Mover para VIP'
  const actionDetails = data.details || (data.value ? `Estágio → ${data.value}` : 'Atualizar Funil')

  return (
    <div className="min-w-[260px] rounded-xl border border-pink-500/50 bg-zinc-950/95 p-3.5 shadow-2xl backdrop-blur-md text-zinc-100">
      <Handle
        type="target"
        position={Position.Left}
        id="target-left"
        className="w-3 h-3 bg-pink-400 border-2 border-zinc-950"
      />
      <Handle
        type="target"
        position={Position.Top}
        id="target-top"
        className="w-3 h-3 bg-pink-400 border-2 border-zinc-950"
      />

      <div className="flex items-center justify-between pb-1.5 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-pink-500/20 text-pink-400 border border-pink-500/30">
            <TagIcon className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono-code uppercase text-pink-400 font-bold block">
              Ação CRM LeadGram
            </span>
            <span className="text-xs font-bold text-zinc-100">{actionTitle}</span>
          </div>
        </div>
      </div>

      <div className="pt-2 text-[11px] text-zinc-300 font-mono-code space-y-1">
        <p className="text-pink-400">{actionDetails}</p>
        {data.tag && <p className="text-amber-400">+ Tag: {data.tag}</p>}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="source-right"
        className="w-3 h-3 bg-pink-400 border-2 border-zinc-950"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="source-bottom"
        className="w-3 h-3 bg-pink-400 border-2 border-zinc-950"
      />
    </div>
  )
}

// 9. DEFAULT FALLBACK NODE (Garante que NENHUM nó fique branco com texto invisível)
export function DefaultFallbackNode({ data }: { data: any }) {
  return (
    <div className="min-w-[240px] rounded-xl border border-zinc-700 bg-zinc-950/95 p-3.5 shadow-2xl backdrop-blur-md text-zinc-100">
      <Handle
        type="target"
        position={Position.Left}
        id="target-left"
        className="w-3 h-3 bg-zinc-400 border-2 border-zinc-950"
      />
      <Handle
        type="target"
        position={Position.Top}
        id="target-top"
        className="w-3 h-3 bg-zinc-400 border-2 border-zinc-950"
      />

      <div className="flex items-center gap-2 pb-1.5 border-b border-zinc-800">
        <div className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300">
          <Sliders className="h-4 w-4" />
        </div>
        <div>
          <span className="text-[10px] font-mono-code uppercase text-zinc-400 font-bold block">
            Etapa do Fluxo
          </span>
          <span className="text-xs font-bold text-zinc-100">
            {data.label || data.title || data.action || data.name || 'Ação'}
          </span>
        </div>
      </div>

      {data.description && (
        <div className="pt-2 text-[11px] text-zinc-400">
          <p>{data.description}</p>
        </div>
      )}

      <Handle
        type="source"
        position={Position.Right}
        id="source-right"
        className="w-3 h-3 bg-zinc-400 border-2 border-zinc-950"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="source-bottom"
        className="w-3 h-3 bg-zinc-400 border-2 border-zinc-950"
      />
    </div>
  )
}
