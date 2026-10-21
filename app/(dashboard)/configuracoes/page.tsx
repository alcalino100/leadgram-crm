'use client'

import * as React from 'react'
import { BotsManager } from '@/components/settings/bots-manager'
import { WebhooksManager } from '@/components/settings/webhooks-manager'
import { TeamManager } from '@/components/settings/team-manager'
import { StagesManagerDialog } from '@/components/pipeline/stages-manager-dialog'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { 
  Bot, 
  Webhook, 
  Users, 
  Sliders, 
  Plus
} from 'lucide-react'
import { useAppStore } from '@/lib/store'

export default function ConfiguracoesPage() {
  const { pipelineStages } = useAppStore()
  const [isStagesOpen, setIsStagesOpen] = React.useState(false)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-zinc-100">Configurações & Painel Administrativo</h1>
            <Badge variant="outline" className="font-mono-code text-[10px] text-pink-400 border-pink-500/30">
              Admin & Operações
            </Badge>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Gerencie os 2 operadores da equipe, bots Telegram, conexões de webhook e estágios customizados do pipeline
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="team" className="w-full space-y-4">
        <TabsList className="bg-zinc-900 border border-zinc-800 p-1 flex-wrap">
          <TabsTrigger value="team" className="gap-1.5 text-xs">
            <Users className="h-3.5 w-3.5 text-pink-400" />
            <span>Membros da Equipe (2 Usuários)</span>
          </TabsTrigger>
          <TabsTrigger value="bots" className="gap-1.5 text-xs">
            <Bot className="h-3.5 w-3.5" />
            <span>Bots Telegram</span>
          </TabsTrigger>
          <TabsTrigger value="webhooks" className="gap-1.5 text-xs">
            <Webhook className="h-3.5 w-3.5 text-amber-400" />
            <span>Conexões Webhook</span>
          </TabsTrigger>
          <TabsTrigger value="pipeline" className="gap-1.5 text-xs">
            <Sliders className="h-3.5 w-3.5 text-cyan-400" />
            <span>Estágios do Pipeline</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Equipe (2 Usuários Editáveis - Req 3) */}
        <TabsContent value="team" className="space-y-4">
          <TeamManager />
        </TabsContent>

        {/* Tab 2: Bots Telegram (Req 1) */}
        <TabsContent value="bots" className="space-y-4">
          <BotsManager />
        </TabsContent>

        {/* Tab 3: Webhooks (Req 4) */}
        <TabsContent value="webhooks" className="space-y-4">
          <WebhooksManager />
        </TabsContent>

        {/* Tab 4: Estágios do Pipeline (Req 5) */}
        <TabsContent value="pipeline" className="space-y-4">
          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-zinc-100">Estágios do Pipeline ({pipelineStages.length})</h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Estes estágios estruturam o Kanban de vendas e acompanhamento dos leads.
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => setIsStagesOpen(true)}
                className="bg-pink-600 hover:bg-pink-500 text-white font-semibold text-xs"
              >
                <Sliders className="h-3.5 w-3.5 mr-1" />
                <span>Gerenciar Estágios</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {pipelineStages.map((stage, idx) => (
                <div
                  key={stage.id}
                  className="p-3 rounded-lg border border-zinc-800 bg-zinc-950 flex items-center gap-3"
                >
                  <div
                    className="h-3.5 w-3.5 rounded-full shrink-0"
                    style={{ backgroundColor: stage.color }}
                  />
                  <div className="truncate">
                    <span className="text-xs font-semibold text-zinc-200 block truncate">{stage.name}</span>
                    <span className="text-[10px] font-mono-code text-zinc-500">Ordem #{idx + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal de Gerenciamento de Estágios */}
      <StagesManagerDialog open={isStagesOpen} onOpenChange={setIsStagesOpen} />
    </div>
  )
}
