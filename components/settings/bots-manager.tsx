'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  Bot, 
  Plus, 
  Radio, 
  ExternalLink, 
  Key, 
  Trash2, 
  Pause, 
  Play, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  Copy,
  Check
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
  DialogTrigger,
} from '@/components/ui/dialog'
import { useAppStore } from '@/lib/store'
import { Bot as BotType } from '@/types'

const newBotSchema = z.object({
  name: z.string().min(2, 'Nome do bot é obrigatório'),
  username: z.string().min(3, 'Username deve ter no mínimo 3 caracteres'),
  token: z.string().min(10, 'Token Telegram é obrigatório'),
  persona: z.string().optional(),
})

type NewBotFormValues = z.infer<typeof newBotSchema>

export function BotsManager() {
  const { bots, fetchInitialData } = useAppStore()
  const [localBots, setLocalBots] = React.useState<BotType[]>(bots)
  const [open, setOpen] = React.useState(false)
  const [isTestingId, setIsTestingId] = React.useState<string | null>(null)
  const [copiedUrl, setCopiedUrl] = React.useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Sincronizar com store
  React.useEffect(() => {
    setLocalBots(bots)
  }, [bots])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewBotFormValues>({
    resolver: zodResolver(newBotSchema),
    defaultValues: {
      name: '',
      username: '',
      token: '',
      persona: 'Atendente VIP especialista em envio de prévias e conversão via PIX.',
    },
  })

  const onSubmit = async (data: NewBotFormValues) => {
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/crm/bots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await res.json()

      if (result.success && result.bot) {
        toast.success(`Bot "${data.name}" conectado com sucesso!`, {
          description: 'Webhook registrado na Telegram Bot API e salvo no Supabase.',
        })
        reset()
        setOpen(false)
        fetchInitialData()
      } else {
        toast.error(result.error || 'Erro ao conectar bot')
      }
    } catch {
      toast.error('Erro de conexão ao salvar bot')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteBot = async (botId: string, botName: string) => {
    if (!confirm(`Tem certeza que deseja desconectar o bot "${botName}"?`)) return

    try {
      const res = await fetch(`/api/crm/bots?id=${botId}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success(`Bot "${botName}" removido com sucesso!`)
        fetchInitialData()
      } else {
        toast.error('Erro ao excluir bot')
      }
    } catch {
      toast.error('Erro de conexão')
    }
  }

  const toggleBotStatus = async (bot: BotType) => {
    const nextStatus = bot.status === 'active' ? 'paused' : 'active'
    try {
      const res = await fetch('/api/crm/bots', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: bot.id, status: nextStatus }),
      })
      if (res.ok) {
        toast.info(`Status do bot alterado para ${nextStatus === 'active' ? 'Ativo' : 'Pausado'}`)
        fetchInitialData()
      }
    } catch {
      toast.error('Erro ao atualizar status')
    }
  }

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url)
    setCopiedUrl(id)
    toast.success('URL do Webhook copiada!')
    setTimeout(() => setCopiedUrl(null), 2500)
  }

  return (
    <div className="space-y-4">
      {/* Top Banner & Quick Connect */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-zinc-800 bg-zinc-900/40">
        <div>
          <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
            <Radio className="h-4 w-4 text-pink-500 animate-pulse" />
            <span>Bots Conectados ({localBots.length})</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Cada bot possui um webhook exclusivo gerado pela nossa API na Vercel para recepção instantânea de mensagens.
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-pink-600 hover:bg-pink-500 text-white font-semibold text-xs">
              <Plus className="h-4 w-4 mr-1.5" />
              <span>Conectar Novo Bot</span>
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800 text-zinc-100">
            <form onSubmit={handleSubmit(onSubmit)}>
              <DialogHeader>
                <DialogTitle className="text-base font-bold">Conectar Bot Telegram</DialogTitle>
                <DialogDescription className="text-xs text-zinc-400">
                  Crie o bot no <strong className="text-zinc-200">@BotFather</strong> no Telegram e cole o token abaixo.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3.5 py-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300">Nome Interno</label>
                  <Input
                    {...register('name')}
                    placeholder="Ex: Atendente VIP Oficial"
                    className="bg-zinc-950 border-zinc-700 text-xs"
                  />
                  {errors.name && <p className="text-[11px] text-red-400">{errors.name.message}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300">Username (@)</label>
                  <Input
                    {...register('username')}
                    placeholder="Ex: canal_vip_atendimento_bot"
                    className="bg-zinc-950 border-zinc-700 text-xs font-mono-code"
                  />
                  {errors.username && <p className="text-[11px] text-red-400">{errors.username.message}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300">Token da Telegram Bot API</label>
                  <Input
                    {...register('token')}
                    type="password"
                    placeholder="7182948291:AAH..."
                    className="bg-zinc-950 border-zinc-700 text-xs font-mono-code"
                  />
                  {errors.token && <p className="text-[11px] text-red-400">{errors.token.message}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300">Persona / Instruções da IA</label>
                  <Input
                    {...register('persona')}
                    placeholder="Ex: Atendente consultivo de alta conversão"
                    className="bg-zinc-950 border-zinc-700 text-xs"
                  />
                </div>
              </div>

              <DialogFooter className="border-t border-zinc-800 pt-3">
                <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)} className="text-xs text-zinc-400">
                  Cancelar
                </Button>
                <Button type="submit" size="sm" disabled={isSubmitting} className="bg-pink-600 hover:bg-pink-500 text-white font-semibold text-xs">
                  {isSubmitting ? 'Conectando...' : 'Salvar e Registrar Webhook'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de Bots (Vazio = 0) */}
      {localBots.length === 0 ? (
        <div className="p-12 text-center flex flex-col items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/20">
          <div className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500 mb-3">
            <Bot className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-300">Nenhum bot conectado no momento (0)</h3>
          <p className="text-xs text-zinc-500 max-w-sm mt-1">
            Conecte seu primeiro bot usando o token do @BotFather para começar a receber mensagens e leads no CRM.
          </p>
          <Button
            size="sm"
            onClick={() => setOpen(true)}
            className="mt-4 bg-pink-600 hover:bg-pink-500 text-white font-semibold text-xs"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            <span>Conectar Primeiro Bot</span>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {localBots.map((bot) => {
            const isActive = bot.status === 'active'
            const webhookUrl = bot.webhook_url || `https://leadgram-crm.vercel.app/api/telegram/${bot.id}/webhook`

            return (
              <div
                key={bot.id}
                className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-zinc-100">{bot.name}</span>
                    <Badge variant="outline" className="text-[10px] font-mono-code text-zinc-400">
                      @{bot.username}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`text-[9px] font-mono-code ${
                        isActive
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-zinc-800 text-zinc-500'
                      }`}
                    >
                      {isActive ? 'Ativo' : 'Pausado'}
                    </Badge>
                  </div>

                  <p className="text-xs text-zinc-400">{bot.persona}</p>

                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[10px] text-zinc-500">Webhook:</span>
                    <code className="text-[10px] font-mono-code text-pink-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                      {webhookUrl}
                    </code>
                    <button
                      onClick={() => handleCopyUrl(webhookUrl, bot.id)}
                      className="text-zinc-500 hover:text-zinc-300 transition-colors"
                      title="Copiar URL"
                    >
                      {copiedUrl === bot.id ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleBotStatus(bot)}
                    className="h-8 text-xs border-zinc-700 bg-zinc-900 text-zinc-300"
                  >
                    {isActive ? <Pause className="h-3.5 w-3.5 mr-1" /> : <Play className="h-3.5 w-3.5 mr-1 text-emerald-400" />}
                    <span>{isActive ? 'Pausar' : 'Ativar'}</span>
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteBot(bot.id, bot.name)}
                    className="h-8 w-8 p-0 text-zinc-500 hover:text-red-400"
                    title="Excluir bot"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
