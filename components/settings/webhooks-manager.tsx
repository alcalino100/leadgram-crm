'use client'

import * as React from 'react'
import { 
  Radio, 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  Send, 
  ExternalLink, 
  Copy, 
  CheckCheck, 
  Clock, 
  ShieldCheck, 
  RefreshCw 
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { WebhookEndpoint } from '@/lib/webhookDispatcher'

export function WebhooksManager() {
  const [webhooks, setWebhooks] = React.useState<WebhookEndpoint[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isTestingId, setIsTestingId] = React.useState<string | null>(null)

  // Modal State
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [name, setName] = React.useState('')
  const [url, setUrl] = React.useState('')
  const [selectedEvents, setSelectedEvents] = React.useState<string[]>(['all'])
  const [isSaving, setIsSaving] = React.useState(false)

  const loadWebhooks = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/crm/webhooks')
      const data = await res.json()
      if (data.webhooks) {
        setWebhooks(data.webhooks)
      }
    } catch {
      toast.error('Erro ao carregar webhooks')
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    loadWebhooks()
  }, [loadWebhooks])

  const handleOpenCreate = () => {
    setEditingId(null)
    setName('')
    setUrl('')
    setSelectedEvents(['all'])
    setIsDialogOpen(true)
  }

  const handleOpenEdit = (wh: WebhookEndpoint) => {
    setEditingId(wh.id)
    setName(wh.name)
    setUrl(wh.url)
    setSelectedEvents(wh.events || ['all'])
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    if (!name.trim() || !url.trim()) {
      toast.error('Nome e URL do webhook são obrigatórios')
      return
    }

    setIsSaving(true)
    try {
      const method = editingId ? 'PUT' : 'POST'
      const res = await fetch('/api/crm/webhooks', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingId,
          name: name.trim(),
          url: url.trim(),
          events: selectedEvents,
          active: true,
        }),
      })

      const data = await res.json()
      if (data.success) {
        toast.success(editingId ? 'Webhook atualizado com sucesso!' : 'Novo webhook cadastrado!')
        setIsDialogOpen(false)
        loadWebhooks()
      } else {
        toast.error(data.error || 'Erro ao salvar webhook')
      }
    } catch {
      toast.error('Erro de conexão ao salvar webhook')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string, whName: string) => {
    if (!confirm(`Tem certeza que deseja remover o webhook "${whName}"?`)) return

    try {
      const res = await fetch(`/api/crm/webhooks?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Webhook excluído!')
        loadWebhooks()
      }
    } catch {
      toast.error('Erro ao excluir webhook')
    }
  }

  const handleTest = async (wh: WebhookEndpoint) => {
    setIsTestingId(wh.id)
    try {
      const res = await fetch('/api/crm/webhooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test', url: wh.url }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success(`Disparo de teste enviado com sucesso para "${wh.name}"!`, {
          description: `Resposta HTTP: ${data.status}. Verifique o recebimento no destino.`,
        })
      } else {
        toast.error(`Falha no envio de teste: ${data.error}`)
      }
    } catch (err: any) {
      toast.error(`Erro ao disparar teste: ${err.message}`)
    } finally {
      setIsTestingId(null)
    }
  }

  const handleToggleActive = async (wh: WebhookEndpoint) => {
    try {
      const res = await fetch('/api/crm/webhooks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: wh.id,
          active: !wh.active,
        }),
      })
      if (res.ok) {
        toast.success(`Webhook ${!wh.active ? 'ativado' : 'pausado'}!`)
        loadWebhooks()
      }
    } catch {
      toast.error('Erro ao atualizar status do webhook')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-zinc-100">Webhooks & Integrações Externas</h1>
            <Badge variant="outline" className="font-mono-code text-[10px] text-amber-400 border-amber-500/30">
              {webhooks.length} Conexão(ões)
            </Badge>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Configure e gerencie múltiplos links de conexões externas (Webhook.site, n8n, Make, endpoints personalizados).
          </p>
        </div>

        <Button
          onClick={handleOpenCreate}
          className="bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold text-xs h-9"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          <span>Adicionar Nova Conexão Webhook</span>
        </Button>
      </div>

      {/* Lista de Webhooks */}
      <div className="space-y-3">
        {webhooks.map((wh) => (
          <div
            key={wh.id}
            className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-bold text-zinc-100">{wh.name}</span>
                <Badge
                  variant="outline"
                  className={`text-[9px] font-mono-code ${
                    wh.active
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-zinc-800 text-zinc-500'
                  }`}
                >
                  {wh.active ? 'Ativo' : 'Pausado'}
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono-code text-zinc-400 bg-zinc-950/80 px-2.5 py-1 rounded border border-zinc-800 max-w-xl truncate">
                <span className="text-amber-400 font-semibold select-none">POST</span>
                <span className="truncate">{wh.url}</span>
              </div>

              <div className="flex items-center gap-1.5 pt-0.5 flex-wrap">
                <span className="text-[10px] text-zinc-500">Eventos inscritos:</span>
                {wh.events.map((ev) => (
                  <Badge key={ev} variant="outline" className="text-[9px] font-mono-code px-1.5 py-0 h-4 text-zinc-400">
                    {ev}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Ações */}
            <div className="flex items-center gap-2 shrink-0">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleTest(wh)}
                disabled={isTestingId === wh.id}
                className="h-8 text-xs border-zinc-700 bg-zinc-900 text-amber-400 hover:text-amber-300"
              >
                <Send className="h-3.5 w-3.5 mr-1" />
                <span>{isTestingId === wh.id ? 'Testando...' : 'Testar Conexão'}</span>
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => handleToggleActive(wh)}
                className="h-8 text-xs border-zinc-700 bg-zinc-900 text-zinc-300"
              >
                {wh.active ? 'Pausar' : 'Ativar'}
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleOpenEdit(wh)}
                className="h-8 w-8 p-0 text-zinc-400 hover:text-zinc-200"
                title="Editar webhook"
              >
                <Edit2 className="h-3.5 w-3.5" />
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDelete(wh.id, wh.name)}
                className="h-8 w-8 p-0 text-zinc-500 hover:text-red-400"
                title="Excluir webhook"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Criar/Editar Webhook */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800 text-zinc-100">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              {editingId ? 'Editar Conexão Webhook' : 'Adicionar Nova Conexão Webhook'}
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-400">
              Insira a URL que receberá os payloads de leads, mensagens e pagamentos via POST em tempo real.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">Nome Identificador</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: n8n Produção, Make Funil VIP, Webhook.site"
                className="bg-zinc-950 border-zinc-700 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">URL do Endpoint de Destino</label>
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://sua-api.com/webhook ou webhook.site/..."
                className="bg-zinc-950 border-zinc-700 text-sm font-mono-code"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-300">Eventos a Encaminhar</label>
              <div className="space-y-1.5">
                {[
                  { id: 'all', label: 'Todos os Eventos (Recomendado)' },
                  { id: 'telegram.lead_message', label: 'Novos Contatos / Mensagens no Telegram' },
                  { id: 'firebot.payment_confirmed', label: 'Pagamentos PIX Confirmados (venda.paga)' },
                  { id: 'crm.lead_stage_changed', label: 'Mudança de Estágio no Pipeline' },
                ].map((ev) => {
                  const isChecked = selectedEvents.includes(ev.id)
                  return (
                    <label
                      key={ev.id}
                      className="flex items-center gap-2 p-2 rounded bg-zinc-950/60 border border-zinc-800/80 cursor-pointer text-xs text-zinc-300 hover:border-zinc-700"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          if (ev.id === 'all') {
                            setSelectedEvents(['all'])
                          } else {
                            const withoutAll = selectedEvents.filter((s) => s !== 'all')
                            if (e.target.checked) {
                              setSelectedEvents([...withoutAll, ev.id])
                            } else {
                              setSelectedEvents(withoutAll.filter((s) => s !== ev.id))
                            }
                          }
                        }}
                        className="rounded border-zinc-700 text-pink-600 focus:ring-pink-500"
                      />
                      <span>{ev.label}</span>
                    </label>
                  )
                })}
              </div>
            </div>
          </div>

          <DialogFooter className="border-t border-zinc-800 pt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDialogOpen(false)}
              className="text-xs text-zinc-400"
            >
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs"
            >
              <Check className="h-3.5 w-3.5 mr-1" />
              <span>{isSaving ? 'Salvando...' : 'Salvar Conexão'}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
