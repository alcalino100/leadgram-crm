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
  UserCheck
} from 'lucide-react'
import { cn } from '@/lib/utils'

// 1. TRIGGER NODE (Gatilho)
export function TriggerNode({ data }: { data: any }) {
  return (
    <div className="min-w-[240px] rounded-xl border border-cyan-500/40 bg-zinc-950/95 p-3 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Zap className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono-code uppercase text-cyan-400 font-bold block">
              Gatilho Inicial
            </span>
            <span className="text-xs font-semibold text-zinc-100">{data.label || 'Novo Lead Ads'}</span>
          </div>
        </div>
      </div>

      <div className="pt-2 text-[11px] text-zinc-400 space-y-1">
        <p className="line-clamp-2">{data.description || 'Dispara quando o lead clica no anúncio e abre o bot.'}</p>
        {data.badge && (
          <span className="inline-block text-[9px] font-mono-code px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
            {data.badge}
          </span>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-cyan-400 border-2 border-zinc-950"
      />
    </div>
  )
}

// 2. TELEGRAM TEXT ACTION NODE
export function TextActionNode({ data }: { data: any }) {
  return (
    <div className="min-w-[260px] rounded-xl border border-blue-500/40 bg-zinc-950/95 p-3 shadow-xl backdrop-blur-md">
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-blue-400 border-2 border-zinc-950"
      />

      <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <MessageSquare className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono-code uppercase text-blue-400 font-bold block">
              Telegram: Mensagem de Texto
            </span>
            <span className="text-xs font-semibold text-zinc-100">{data.title || 'Enviar Texto'}</span>
          </div>
        </div>
      </div>

      <div className="pt-2 text-[11px] text-zinc-300">
        <div className="p-2 rounded bg-zinc-900/80 border border-zinc-800 font-sans italic text-zinc-400 text-[11px]">
          "{data.message || 'Olá {{lead.nome}}, obrigado pelo interesse!'}"
        </div>
        {data.hasButtons && (
          <div className="mt-1.5 flex gap-1">
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
              Botão 1: Ver Demonstração
            </span>
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-blue-400 border-2 border-zinc-950"
      />
    </div>
  )
}

// 3. TELEGRAM AUDIO / VOICE NOTE NODE
export function AudioActionNode({ data }: { data: any }) {
  return (
    <div className="min-w-[260px] rounded-xl border border-emerald-500/40 bg-zinc-950/95 p-3 shadow-xl backdrop-blur-md">
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-emerald-400 border-2 border-zinc-950"
      />

      <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Mic className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono-code uppercase text-emerald-400 font-bold block">
              Telegram: Áudio Humano
            </span>
            <span className="text-xs font-semibold text-zinc-100">{data.title || 'Enviar Mensagem de Voz'}</span>
          </div>
        </div>
      </div>

      <div className="pt-2 space-y-1.5 text-[11px] text-zinc-300">
        <div className="flex items-center justify-between p-1.5 rounded bg-zinc-900/80 border border-zinc-800 text-[10px] font-mono-code">
          <span className="text-emerald-400 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Gravando áudio... ({data.duration || '0:38s'})
          </span>
          <span className="text-zinc-500">voice.ogg</span>
        </div>
        <p className="text-[10px] text-zinc-400 line-clamp-1">{data.description || 'Áudio explicativo com tom natural'}</p>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-emerald-400 border-2 border-zinc-950"
      />
    </div>
  )
}

// 4. TELEGRAM PHOTO / VIDEO NODE
export function MediaActionNode({ data }: { data: any }) {
  const isVideo = data.mediaType === 'video'

  return (
    <div className="min-w-[260px] rounded-xl border border-purple-500/40 bg-zinc-950/95 p-3 shadow-xl backdrop-blur-md">
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-purple-400 border-2 border-zinc-950"
      />

      <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30">
            {isVideo ? <VideoIcon className="h-4 w-4" /> : <ImageIcon className="h-4 w-4" />}
          </div>
          <div>
            <span className="text-[10px] font-mono-code uppercase text-purple-400 font-bold block">
              Telegram: {isVideo ? 'Vídeo / VSL' : 'Foto / Criativo'}
            </span>
            <span className="text-xs font-semibold text-zinc-100">{data.title || 'Enviar Mídia'}</span>
          </div>
        </div>
      </div>

      <div className="pt-2 text-[11px] text-zinc-400 space-y-1">
        <p className="line-clamp-2">Legenda: "{data.caption || 'Confira os resultados reais dos nossos clientes'}"</p>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-purple-400 border-2 border-zinc-950"
      />
    </div>
  )
}

// 5. PAYMENT PIX GATEWAY ACTION NODE
export function PaymentActionNode({ data }: { data: any }) {
  return (
    <div className="min-w-[260px] rounded-xl border border-emerald-500/50 bg-zinc-950/95 p-3 shadow-xl backdrop-blur-md">
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-emerald-400 border-2 border-zinc-950"
      />

      <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <QrCode className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono-code uppercase text-emerald-400 font-bold block">
              Gateway: Gerar Cobrança Pix
            </span>
            <span className="text-xs font-semibold text-zinc-100">{data.title || 'Cobrança Automática'}</span>
          </div>
        </div>
      </div>

      <div className="pt-2 space-y-1.5 text-[11px]">
        <div className="flex items-center justify-between font-mono-code">
          <span className="text-zinc-400">Valor:</span>
          <span className="text-emerald-400 font-bold">R$ {data.amount || '497,00'}</span>
        </div>
        <div className="flex items-center justify-between font-mono-code text-[10px]">
          <span className="text-zinc-400">Provedor:</span>
          <span className="text-zinc-300 uppercase">{data.provider || 'Asaas / Mercado Pago'}</span>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-emerald-400 border-2 border-zinc-950"
      />
    </div>
  )
}

// 6. DELAY NODE (Tempo de Espera)
export function DelayNode({ data }: { data: any }) {
  return (
    <div className="min-w-[220px] rounded-xl border border-amber-500/40 bg-zinc-950/95 p-3 shadow-xl backdrop-blur-md">
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-amber-400 border-2 border-zinc-950"
      />

      <div className="flex items-center justify-between pb-1.5 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono-code uppercase text-amber-400 font-bold block">
              Temporizador / Delay
            </span>
            <span className="text-xs font-semibold text-zinc-100">Aguardar {data.delay || '3 minutos'}</span>
          </div>
        </div>
      </div>

      <p className="pt-1.5 text-[10px] text-zinc-400">
        Simula digitação ou tempo de resposta natural antes do próximo passo.
      </p>

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-amber-400 border-2 border-zinc-950"
      />
    </div>
  )
}

// 7. CONDITION NODE (If / Else)
export function ConditionNode({ data }: { data: any }) {
  return (
    <div className="min-w-[240px] rounded-xl border border-rose-500/40 bg-zinc-950/95 p-3 shadow-xl backdrop-blur-md">
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-rose-400 border-2 border-zinc-950"
      />

      <div className="flex items-center justify-between pb-1.5 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <GitBranch className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono-code uppercase text-rose-400 font-bold block">
              Condição (If / Else)
            </span>
            <span className="text-xs font-semibold text-zinc-100">{data.title || 'Respondeu Positivo?'}</span>
          </div>
        </div>
      </div>

      <p className="pt-1.5 text-[10px] text-zinc-400">
        {data.conditionText || 'Se contém: "Sim", "Tenho interesse" ou "Quero"'}
      </p>

      {/* Output handles for True and False */}
      <div className="mt-3 pt-2 border-t border-zinc-800 flex justify-between text-[10px] font-mono-code font-bold">
        <span className="text-emerald-400">VERDADEIRO</span>
        <span className="text-rose-400">FALSO</span>
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

// 8. CRM STAGE & TAG NODE
export function CrmActionNode({ data }: { data: any }) {
  return (
    <div className="min-w-[240px] rounded-xl border border-cyan-500/40 bg-zinc-950/95 p-3 shadow-xl backdrop-blur-md">
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-cyan-400 border-2 border-zinc-950"
      />

      <div className="flex items-center justify-between pb-1.5 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <TagIcon className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono-code uppercase text-cyan-400 font-bold block">
              Ação CRM LeadGram
            </span>
            <span className="text-xs font-semibold text-zinc-100">{data.action || 'Atualizar Funil'}</span>
          </div>
        </div>
      </div>

      <div className="pt-2 text-[11px] text-zinc-300 font-mono-code space-y-1">
        <p className="text-cyan-400">{data.details || 'Estágio → Qualificado'}</p>
        {data.tag && <p className="text-pink-400">+ Tag: {data.tag}</p>}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-cyan-400 border-2 border-zinc-950"
      />
    </div>
  )
}
