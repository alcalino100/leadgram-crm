'use client'

import * as React from 'react'
import { Webhook, RefreshCw, CheckCircle2, AlertTriangle, ArrowDownLeft, ArrowUpRight, Copy, Check } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface MockWebhookLog {
  id: string
  direction: 'inbound' | 'outbound'
  event: string
  source: string
  statusCode: number
  timestamp: string
  payload: Record<string, any>
}

const initialLogs: MockWebhookLog[] = [
  {
    id: 'log-1',
    direction: 'inbound',
    event: 'telegram.message_received',
    source: 'Telegram Bot API',
    statusCode: 200,
    timestamp: new Date(Date.now() - 3 * 60000).toISOString(),
    payload: {
      update_id: 928192831,
      message: {
        message_id: 481,
        chat: { id: 94827163, username: 'rodrigo_alpha' },
        text: 'Sensacional Guilherme. Consegue me mostrar uma demo prática amanhã?',
      },
    },
  },
  {
    id: 'log-2',
    direction: 'inbound',
    event: 'telegram.start_with_utms',
    source: 'Meta Ads (Instagram)',
    statusCode: 200,
    timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
    payload: {
      update_id: 928192830,
      start_param: 'meta__black_scale_crm__video_v3_case',
      utm_source: 'meta',
      utm_campaign: 'black_scale_crm',
    },
  },
  {
    id: 'log-3',
    direction: 'outbound',
    event: 'crm.lead_qualified_webhook',
    source: 'n8n Workflow Hub',
    statusCode: 200,
    timestamp: new Date(Date.now() - 25 * 60000).toISOString(),
    payload: {
      lead_id: 'lead-1',
      score: 95,
      badge: 'vip',
      action: 'distribute_agent_guilherme',
    },
  },
  {
    id: 'log-4',
    direction: 'outbound',
    event: 'payment.pix_generated',
    source: 'Asaas Gateway API',
    statusCode: 200,
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    payload: {
      payment_id: 'pay-001',
      amount: 15000.0,
      lead_id: 'lead-2',
      status: 'pending',
    },
  },
]

export function WebhooksLogs() {
  const [logs, setLogs] = React.useState<MockWebhookLog[]>(initialLogs)
  const [resendingId, setResendingId] = React.useState<string | null>(null)
  const [selectedPayload, setSelectedPayload] = React.useState<MockWebhookLog | null>(initialLogs[0])

  const handleResend = (logId: string) => {
    setResendingId(logId)
    setTimeout(() => {
      setResendingId(null)
      toast.success('Evento de webhook reenviado com sucesso!', {
        description: 'Endpoint respondeu HTTP 200 OK.',
      })
    }, 700)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
            <Webhook className="h-4 w-4 text-cyan-400" /> Logs de Webhooks de Entrada & Saída
          </h3>
          <p className="text-xs text-zinc-400">
            Monitore cada payload recebido do Telegram ou enviado para plataformas externas (n8n, Make, Asaas).
          </p>
        </div>

        <span className="text-[10px] font-mono-code text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded border border-cyan-500/20">
          HMAC Secret Ativo
        </span>
      </div>

      {/* Webhook.site Destination Banner */}
      <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-cyan-400">🌐 Webhook de Integração Externa (Webhook.site)</span>
            <span className="text-[10px] font-mono-code bg-emerald-500/10 text-emerald-400 px-1.5 py-0.2 rounded border border-emerald-500/20">Conectado</span>
          </div>
          <p className="text-[11px] text-zinc-300">
            Todos os eventos do CRM, leads do Telegram e pagamentos da Firebot são encaminhados para esta URL.
          </p>
          <code className="text-[10px] font-mono-code text-cyan-300 block pt-0.5">
            https://webhook.site/2137c6fe-7a92-43c9-bdbd-8bcb8d8d33db
          </code>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            onClick={async () => {
              try {
                await fetch('/api/webhooks/test', { method: 'POST' })
                toast.success('Ping enviado para o webhook.site!', {
                  description: 'Abra a aba do webhook.site para ver o JSON recebido ao vivo.',
                })
              } catch {
                toast.error('Erro ao enviar ping')
              }
            }}
            className="text-xs h-7 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-semibold"
          >
            Disparar Teste
          </Button>

          <Button
            size="sm"
            variant="outline"
            asChild
            className="text-xs h-7 border-zinc-700 hover:border-zinc-500"
          >
            <a
              href="https://webhook.site/#!/view/2137c6fe-7a92-43c9-bdbd-8bcb8d8d33db"
              target="_blank"
              rel="noopener noreferrer"
            >
              Abrir Painel
            </a>
          </Button>
        </div>
      </div>

      {/* Firebot Webhook Integration Banner */}
      <div className="rounded-xl border border-orange-500/30 bg-orange-950/20 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-orange-400">🔥 Webhook Firebot PIX (Venda Paga)</span>
            <span className="text-[10px] font-mono-code bg-emerald-500/10 text-emerald-400 px-1.5 py-0.2 rounded border border-emerald-500/20">Ativo</span>
          </div>
          <p className="text-[11px] text-zinc-300">
            Cadastre a URL do webhook no painel da Firebot para aprovação em tempo real de transações PIX.
          </p>
          <code className="text-[10px] font-mono-code text-zinc-400 block pt-0.5">
            URL: https://seu-dominio.vercel.app/api/firebot/webhook
          </code>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            navigator.clipboard.writeText('https://seu-dominio.vercel.app/api/firebot/webhook')
            toast.success('URL do webhook Firebot copiada!')
          }}
          className="text-xs h-7 shrink-0 border-orange-500/30 text-orange-300 hover:bg-orange-500/10"
        >
          Copiar URL do Webhook
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Table List (3 cols) */}
        <div className="lg:col-span-3 rounded-xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900/80 border-b border-zinc-800 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Direção</th>
                  <th className="py-2.5 px-3">Evento</th>
                  <th className="py-2.5 px-3">Origem</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-right">Horário</th>
                  <th className="py-2.5 px-3 text-center">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-mono-code text-[11px]">
                {logs.map((log) => (
                  <tr
                    key={log.id}
                    onClick={() => setSelectedPayload(log)}
                    className={`hover:bg-zinc-800/40 cursor-pointer transition-colors ${
                      selectedPayload?.id === log.id ? 'bg-zinc-800/30' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3 font-sans">
                      {log.direction === 'inbound' ? (
                        <span className="flex items-center gap-1 text-[10px] text-cyan-400">
                          <ArrowDownLeft className="h-3 w-3" /> Entrada
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] text-purple-400">
                          <ArrowUpRight className="h-3 w-3" /> Saída
                        </span>
                      )}
                    </td>

                    <td className="py-2.5 px-3 font-sans font-medium text-zinc-200">
                      {log.event}
                    </td>

                    <td className="py-2.5 px-3 text-zinc-400 font-sans">
                      {log.source}
                    </td>

                    <td className="py-2.5 px-3 text-center">
                      <span className="inline-block text-[10px] px-1.5 py-0.2 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                        {log.statusCode} OK
                      </span>
                    </td>

                    <td className="py-2.5 px-3 text-right text-zinc-400 text-[10px]">
                      {new Date(log.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </td>

                    <td className="py-2.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <Button
                        size="iconSm"
                        variant="ghost"
                        onClick={() => handleResend(log.id)}
                        disabled={resendingId === log.id}
                        title="Reenviar Webhook"
                      >
                        <RefreshCw className={resendingId === log.id ? "h-3 w-3 animate-spin text-cyan-400" : "h-3 w-3 text-zinc-400 hover:text-zinc-100"} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payload Viewer (2 cols) */}
        <div className="lg:col-span-2 rounded-xl border border-zinc-800 bg-zinc-950 p-4 space-y-2 flex flex-col">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <span className="text-xs font-semibold text-zinc-200">Inspetor de Payload JSON</span>
            <span className="text-[10px] font-mono-code text-cyan-400">
              {selectedPayload?.id || 'Selecionado'}
            </span>
          </div>

          <div className="flex-1 overflow-auto rounded-lg bg-zinc-900/60 p-3 border border-zinc-800 font-mono-code text-[11px] text-zinc-300">
            <pre className="whitespace-pre-wrap break-all">
              {JSON.stringify(selectedPayload?.payload, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
