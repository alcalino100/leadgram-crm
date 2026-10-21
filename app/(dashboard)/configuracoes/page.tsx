'use client'

import * as React from 'react'
import Link from 'next/link'
import { BotsManager } from '@/components/settings/bots-manager'
import { WebhooksLogs } from '@/components/settings/webhooks-logs'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { 
  Bot, 
  Webhook, 
  Users, 
  Sliders, 
  ShieldCheck, 
  Sparkles, 
  ArrowUpRight 
} from 'lucide-react'
import { mockUsers } from '@/lib/mock-data'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

export default function ConfiguracoesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-zinc-100">Configurações & Integrações</h1>
            <Badge variant="outline" className="font-mono-code text-[10px] text-cyan-400 border-cyan-500/30">
              Admin Console
            </Badge>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Gerencie bots Telegram, webhooks, membros da agência e parâmetros comerciais de qualificação
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="bots" className="w-full space-y-4">
        <TabsList className="bg-zinc-900 border border-zinc-800 p-1">
          <TabsTrigger value="bots" className="gap-1.5 text-xs">
            <Bot className="h-3.5 w-3.5" />
            <span>Bots Telegram</span>
          </TabsTrigger>
          <TabsTrigger value="webhooks" className="gap-1.5 text-xs">
            <Webhook className="h-3.5 w-3.5" />
            <span>Webhooks & Logs</span>
          </TabsTrigger>
          <TabsTrigger value="team" className="gap-1.5 text-xs">
            <Users className="h-3.5 w-3.5" />
            <span>Equipe & Permissões</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Bots Telegram */}
        <TabsContent value="bots" className="space-y-4">
          <BotsManager />
        </TabsContent>

        {/* Tab 2: Webhooks & Logs */}
        <TabsContent value="webhooks" className="space-y-4">
          <WebhooksLogs />
        </TabsContent>

        {/* Tab 3: Equipe & Membros */}
        <TabsContent value="team" className="space-y-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <div>
                <h3 className="text-sm font-bold text-zinc-100">Membros da Equipe Comercial</h3>
                <p className="text-xs text-zinc-400">Atribuição de leads e permissões de acesso ao CRM</p>
              </div>
              <Button size="sm" className="bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-semibold text-xs">
                + Convidar Membro
              </Button>
            </div>

            <div className="divide-y divide-zinc-800/60">
              {mockUsers.map((user) => (
                <div key={user.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.avatar_url} />
                      <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-xs text-zinc-100">{user.name}</p>
                      <p className="text-[11px] text-zinc-400 font-mono-code">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] uppercase font-mono-code px-2 py-0.5 rounded bg-zinc-800 text-cyan-400 border border-zinc-700">
                      {user.role}
                    </span>
                    <Button variant="outline" size="sm" className="text-xs h-7">
                      Editar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick link to Qualification Score Simulator */}
          <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/20 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-cyan-400" />
              <div>
                <h4 className="text-xs font-bold text-zinc-100">Motor de Qualificação (Lead Score 0-100)</h4>
                <p className="text-[11px] text-zinc-400">Ajuste os pesos e critérios automáticos de pontuação de leads</p>
              </div>
            </div>

            <Button asChild size="sm" variant="outline" className="text-xs gap-1 border-cyan-500/30 text-cyan-400">
              <Link href="/configuracoes/qualificacao">
                <span>Abrir Simulador</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
