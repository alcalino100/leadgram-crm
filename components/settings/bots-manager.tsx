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
import { mockBots } from '@/lib/mock-data'
import { Bot as BotType } from '@/types'

const newBotSchema = z.object({
  name: z.string().min(2, 'Nome do bot é obrigatório'),
  username: z.string().min(3, 'Username deve ter no mínimo 3 caracteres'),
  token: z.string().min(10, 'Token Telegram é obrigatório'),
  persona: z.string().optional(),
})

type NewBotFormValues = z.infer<typeof newBotSchema>

export function BotsManager() {
  const [bots, setBots] = React.useState<BotType[]>(mockBots)
  const [open, setOpen] = React.useState(false)
  const [isTestingId, setIsTestingId] = React.useState<string | null>(null)
  const [copiedUrl, setCopiedUrl] = React.useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewBotFormValues>({
    resolver: zodResolver(newBotSchema),
    defaultValues: {
      name: '',
      username: '@novo_atendente_bot',
      token: '',
      persona: 'Atendente comercial de triagem rápida',
    },
  })

  const onSubmit = (data: NewBotFormValues) => {
    let cleanUsername = data.username.trim()
    if (!cleanUsername.startsWith('@')) cleanUsername = `@${cleanUsername}`

    const newBot: BotType = {
      id: `bot-${Date.now()}`,
      organization_id: 'org-agency-alpha',
      name: data.name,
      username: cleanUsername,
      token_masked: `${data.token.substring(0, 6)}••••••••••••••••••••••••••••••••`,
      persona: data.persona,
      status: 'active',
      webhook_url: `https://crm.growthscale.com.br/api/telegram/bot-${Date.now()}/webhook`,
      last_activity_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    setBots([newBot, ...bots])
    toast.success(`Bot "${data.name}" conectado com sucesso!`, {
      description: 'Webhook registrado e pronto para receber mensagens.',
    })
    reset()
    setOpen(false)
  }

  const handleTestWebhook = (botId: string) => {
    setIsTestingId(botId)
    setTimeout(() => {
      setIsTestingId(null)
      toast.success('Webhook testado com sucesso!', {
        description: 'Telegram respondeu status 200 OK (ping < 45ms).',
      })
    }, 800)
  }

  const toggleBotStatus = (botId: string) => {
    setBots(
      bots.map((b) =>
        b.id === botId
          ? { ...b, status: b.status === 'active' ? 'paused' : 'active' }
          : b
      )
    )
    toast.info('Status do bot alterado')
  }

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url)
    setCopiedUrl(id)
    toast.success('URL do Webhook copiada!')
    setTimeout(() => setCopiedUrl(null), 2500)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
            <Bot className="h-4 w-4 text-cyan-400" /> Bots Telegram Conectados
          </h3>
          <p className="text-xs text-zinc-400">
            Conecte múltiplos bots para diferentes campanhas ou marcas da agência.
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-semibold gap-1.5">
              <Plus className="h-4 w-4" />
              <span>Conectar Novo Bot</span>
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <span className="p-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Bot className="h-4 w-4" />
                </span>
                Conectar Bot Telegram
              </DialogTitle>
              <DialogDescription>
                Obtenha o Token com o <code className="text-cyan-400 font-mono-code">@BotFather</code> no Telegram e cole abaixo.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-zinc-300">Nome Interno do Bot *</label>
                <Input
                  {...register('name')}
                  placeholder="Ex: Atendente Comercial Black Friday"
                  aria-invalid={errors.name ? 'true' : 'false'}
                />
                {errors.name && (
                  <p className="text-[10px] text-rose-400">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-zinc-300">Username Telegram (@) *</label>
                <Input
                  {...register('username')}
                  placeholder="@sua_agencia_bot"
                  className="font-mono-code"
                  aria-invalid={errors.username ? 'true' : 'false'}
                />
                {errors.username && (
                  <p className="text-[10px] text-rose-400">{errors.username.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-zinc-300 flex items-center gap-1">
                  <Key className="h-3 w-3 text-cyan-400" /> Bot Token (@BotFather) *
                </label>
                <Input
                  {...register('token')}
                  type="password"
                  placeholder="7392819283:AAHxxxxxxxxx..."
                  className="font-mono-code"
                  aria-invalid={errors.token ? 'true' : 'false'}
                />
                <p className="text-[10px] text-zinc-500">
                  O token é armazenado de forma criptografada apenas no servidor.
                </p>
                {errors.token && (
                  <p className="text-[10px] text-rose-400">{errors.token.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-zinc-300">Persona / Instruções Iniciais</label>
                <Input
                  {...register('persona')}
                  placeholder="Ex: Consultor focado em agendamento de reuniões para gestores de tráfego"
                />
              </div>

              <DialogFooter className="pt-2 border-t border-zinc-800">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-semibold"
                >
                  Conectar e Salvar
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Bots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bots.map((bot) => (
          <div
            key={bot.id}
            className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-3 relative group hover:border-zinc-700 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-zinc-100">{bot.name}</h4>
                  <p className="text-[11px] font-mono-code text-cyan-400">{bot.username}</p>
                </div>
              </div>

              {bot.status === 'active' ? (
                <span className="flex items-center gap-1 text-[10px] font-mono-code bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> ONLINE
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[10px] font-mono-code bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded border border-zinc-700">
                  PAUSADO
                </span>
              )}
            </div>

            <p className="text-[11px] text-zinc-400 line-clamp-2">
              {bot.persona || 'Bot padrão de triagem e envio de mensagens de boas-vindas.'}
            </p>

            <div className="space-y-1.5 p-2 rounded-lg bg-zinc-950 border border-zinc-800/80 text-[10px] font-mono-code">
              <div className="flex items-center justify-between text-zinc-400">
                <span>Webhook URL:</span>
                <button
                  onClick={() => handleCopyUrl(bot.webhook_url || '', bot.id)}
                  className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  {copiedUrl === bot.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedUrl === bot.id ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>
              <p className="text-zinc-300 truncate">{bot.webhook_url}</p>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleTestWebhook(bot.id)}
                  disabled={isTestingId === bot.id}
                  className="text-xs h-7 gap-1"
                >
                  <RefreshCw className={isTestingId === bot.id ? "h-3 w-3 animate-spin text-cyan-400" : "h-3 w-3"} />
                  <span>{isTestingId === bot.id ? 'Testando...' : 'Testar Webhook'}</span>
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => toggleBotStatus(bot.id)}
                  className="text-xs h-7 text-zinc-400 hover:text-zinc-200"
                >
                  {bot.status === 'active' ? <Pause className="h-3 w-3 mr-1" /> : <Play className="h-3 w-3 mr-1" />}
                  <span>{bot.status === 'active' ? 'Pausar' : 'Ativar'}</span>
                </Button>
              </div>

              <span className="text-[10px] font-mono-code text-zinc-400">
                Token: {bot.token_masked || '••••••••'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
