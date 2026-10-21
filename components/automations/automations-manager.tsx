'use client'

import * as React from 'react'
import { 
  Zap, 
  Plus, 
  Play, 
  Trash2, 
  Copy, 
  Sliders, 
  ArrowLeft, 
  Save, 
  Check, 
  Mic, 
  Image as ImageIcon, 
  QrCode, 
  Clock, 
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Flame
} from 'lucide-react'
import { toast } from 'sonner'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { AutomationFlowBuilder } from '@/components/automations/flow-builder'

export function AutomationsManager() {
  const { automations, saveAutomation, deleteAutomation } = useAppStore()

  const [selectedAutomation, setSelectedAutomation] = React.useState<any | null>(null)
  const [isNewDialogOpen, setIsNewDialogOpen] = React.useState(false)
  const [newTitle, setNewTitle] = React.useState('')
  const [newTrigger, setNewTrigger] = React.useState('telegram.start')
  const [isSaving, setIsSaving] = React.useState(false)

  // Restaurar automação ativa salva após Hard Refresh
  React.useEffect(() => {
    if (typeof window !== 'undefined' && automations.length > 0 && !selectedAutomation) {
      const savedId = localStorage.getItem('leadgram_selected_automation_id')
      if (savedId) {
        const found = automations.find((a) => a.id === savedId)
        if (found) {
          setSelectedAutomation(found)
        }
      }
    }
  }, [automations, selectedAutomation])

  const handleSelectAutomation = (auto: any) => {
    setSelectedAutomation(auto)
    if (typeof window !== 'undefined') {
      localStorage.setItem('leadgram_selected_automation_id', auto.id)
    }
  }

  const handleBackToList = () => {
    setSelectedAutomation(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('leadgram_selected_automation_id')
    }
  }

  // Criar nova automação
  const handleCreateNew = async () => {
    if (!newTitle.trim()) {
      toast.error('Informe o nome da automação')
      return
    }

    setIsSaving(true)
    const newAuto = {
      name: newTitle.trim(),
      trigger: newTrigger,
      action: 'custom_flow',
      active: true,
      action_config: {
        nodes: [
          {
            id: '1',
            type: 'triggerNode',
            position: { x: 250, y: 50 },
            data: { label: 'Gatilho Inicial', event: newTrigger, description: 'Disparado pelo evento selecionado' },
          },
          {
            id: '2',
            type: 'textNode',
            position: { x: 250, y: 200 },
            data: { 
              title: 'Pergunta com Opções',
              message: '🤭 Sabia que você ia ficar curiosinho...\n\nPreparei alguns conteúdos especiais pra quem quer conhecer meu lado mais ousado.😏\n\nVocê quer ver???🤭👀',
              buttons: [
                { id: 'btn_1', text: 'Quero 🫣😏', action: 'next' },
                { id: 'btn_2', text: 'Agora não 🤫', action: 'next' },
              ],
            },
          },
        ],
        edges: [
          { id: 'e1-2', source: '1', target: '2', animated: true },
        ],
      },
    }

    const saved = await saveAutomation(newAuto)
    setIsSaving(false)

    if (saved) {
      toast.success('Automação criada com sucesso!')
      setIsNewDialogOpen(false)
      setNewTitle('')
      handleSelectAutomation(saved)
    } else {
      toast.error('Erro ao criar automação no banco de dados')
    }
  }

  // Alternar ativo/inativo
  const handleToggleActive = async (auto: any, e: React.MouseEvent) => {
    e.stopPropagation()
    const updated = await saveAutomation({
      ...auto,
      active: !auto.active,
    })
    if (updated) {
      toast.success(`Automação "${auto.name}" ${!auto.active ? 'ativada' : 'pausada'}!`)
    }
  }

  // Excluir automação
  const handleDelete = async (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm(`Tem certeza que deseja excluir a automação "${name}"?`)) return

    const ok = await deleteAutomation(id)
    if (ok) {
      toast.success('Automação excluída com sucesso!')
      if (selectedAutomation?.id === id) {
        setSelectedAutomation(null)
      }
    } else {
      toast.error('Erro ao excluir automação')
    }
  }

  // Se uma automação estiver selecionada, exibe o Flow Builder n8n para ela
  if (selectedAutomation) {
    return (
      <div className="space-y-4">
        {/* Top Header do Construtor */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 rounded-xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-xs">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBackToList}
              className="h-8 text-xs border-zinc-700 bg-zinc-900 text-zinc-300 hover:text-zinc-100"
            >
              <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Voltar para Lista
            </Button>

            <div>
              <div className="flex items-center gap-2">
                <Input
                  value={selectedAutomation.name}
                  onChange={(e) =>
                    setSelectedAutomation({ ...selectedAutomation, name: e.target.value })
                  }
                  className="bg-transparent border-none text-sm font-bold text-zinc-100 h-7 p-0 focus-visible:ring-1 focus-visible:ring-pink-500 w-auto min-w-[200px]"
                />
                <Badge
                  variant="outline"
                  className={`text-[10px] font-mono-code ${
                    selectedAutomation.active
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {selectedAutomation.active ? 'Ativo' : 'Pausado'}
                </Badge>
              </div>
              <p className="text-[11px] text-zinc-500">
                Gatilho: <span className="font-mono-code text-pink-400">{selectedAutomation.trigger}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const nextActive = !selectedAutomation.active
                setSelectedAutomation({ ...selectedAutomation, active: nextActive })
                saveAutomation({ ...selectedAutomation, active: nextActive })
                toast.success(`Status alterado para ${nextActive ? 'Ativo' : 'Pausado'}`)
              }}
              className="h-8 text-xs border-zinc-700 text-zinc-300"
            >
              {selectedAutomation.active ? 'Pausar Fluxo' : 'Ativar Fluxo'}
            </Button>

            {/* Botão de Salvar Definitivo (Req 2) */}
            <Button
              size="sm"
              onClick={async () => {
                setIsSaving(true)
                const saved = await saveAutomation(selectedAutomation)
                setIsSaving(false)
                if (saved) {
                  toast.success('Fluxo de automação salvo com sucesso no banco de dados!')
                } else {
                  toast.error('Erro ao salvar fluxo')
                }
              }}
              disabled={isSaving}
              className="bg-pink-600 hover:bg-pink-500 text-white font-semibold h-8 text-xs shadow-md shadow-pink-600/20"
            >
              <Save className="h-3.5 w-3.5 mr-1.5" />
              <span>{isSaving ? 'Salvando...' : 'Salvar Fluxo'}</span>
            </Button>
          </div>
        </div>

        {/* Visual Flow Builder */}
        <AutomationFlowBuilder
          initialNodes={selectedAutomation.action_config?.nodes}
          initialEdges={selectedAutomation.action_config?.edges}
          onNodesEdgesChange={(nodes, edges) => {
            setSelectedAutomation((prev: any) => ({
              ...prev,
              action_config: { ...prev.action_config, nodes, edges },
            }))
          }}
          onSave={async (nodes, edges) => {
            setIsSaving(true)
            const payload = {
              ...selectedAutomation,
              action_config: {
                ...(selectedAutomation.action_config || {}),
                nodes,
                edges,
              },
            }
            const saved = await saveAutomation(payload)
            setIsSaving(false)
            if (saved) {
              setSelectedAutomation(saved)
              if (typeof window !== 'undefined') {
                localStorage.setItem('leadgram_selected_automation_id', saved.id)
              }
              return saved
            }
            throw new Error('Erro ao salvar no banco de dados')
          }}
        />
      </div>
    )
  }

  // Lista de Automações
  return (
    <div className="space-y-6">
      {/* Header com Botão de Criação */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-zinc-100">Automações Comerciais & Prévias</h1>
            <Badge variant="outline" className="font-mono-code text-[10px] text-pink-400 border-pink-500/30">
              {automations.length} Fluxo(s) Cadastrados
            </Badge>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Crie e salve múltiplos funis para o Telegram: sequências de áudios sussurrados, fotos teaser, cobranças PIX Firebot e liberação de canais VIP.
          </p>
        </div>

        <Button
          onClick={() => setIsNewDialogOpen(true)}
          className="bg-pink-600 hover:bg-pink-500 text-white font-semibold text-xs h-9"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          <span>Criar Nova Automação</span>
        </Button>
      </div>

      {/* Grid de Automações Cadastradas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {automations.map((auto) => {
          const nodeCount = auto.action_config?.nodes?.length || 0

          return (
            <div
              key={auto.id}
              onClick={() => handleSelectAutomation(auto)}
              className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 hover:border-pink-500/60 transition-all cursor-pointer group flex flex-col justify-between space-y-4 hover:bg-zinc-900/60"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-bold text-zinc-100 group-hover:text-pink-400 transition-colors">
                    {auto.name}
                  </h3>
                  <Badge
                    variant="outline"
                    className={`text-[9px] font-mono-code px-1.5 py-0 ${
                      auto.active
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-zinc-800 text-zinc-500'
                    }`}
                  >
                    {auto.active ? 'Ativo' : 'Pausado'}
                  </Badge>
                </div>

                <div className="mt-2.5 flex items-center gap-1.5 text-xs text-zinc-400">
                  <Zap className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                  <span className="text-[11px] font-mono-code truncate">Gatilho: {auto.trigger}</span>
                </div>

                <div className="mt-2 flex items-center gap-2 text-[11px] text-zinc-500">
                  <span>{nodeCount} etapas no fluxo</span>
                  <span>•</span>
                  <span>Salvo no Supabase</span>
                </div>
              </div>

              {/* Ações do Card */}
              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedAutomation(auto)
                  }}
                  className="h-7 text-xs border-zinc-700 bg-zinc-900 text-zinc-200 hover:text-white"
                >
                  <Sliders className="h-3 w-3 mr-1 text-pink-400" />
                  <span>Editar Fluxo</span>
                </Button>

                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => handleToggleActive(auto, e)}
                    className="h-7 px-2 text-xs text-zinc-400 hover:text-zinc-200"
                    title={auto.active ? 'Pausar' : 'Ativar'}
                  >
                    {auto.active ? (
                      <span className="text-emerald-400 text-[11px]">Pausar</span>
                    ) : (
                      <span className="text-zinc-500 text-[11px]">Ativar</span>
                    )}
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => handleDelete(auto.id, auto.name, e)}
                    className="h-7 w-7 p-0 text-zinc-500 hover:text-red-400"
                    title="Excluir automação"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal de Nova Automação */}
      <Dialog open={isNewDialogOpen} onOpenChange={setIsNewDialogOpen}>
        <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800 text-zinc-100">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Criar Nova Automação</DialogTitle>
            <DialogDescription className="text-xs text-zinc-400">
              Defina o nome e o gatilho inicial para o novo fluxo.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">Nome da Automação</label>
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Ex: Upsell Pack Especial de Sexta"
                className="bg-zinc-950 border-zinc-700 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">Gatilho do Fluxo</label>
              <select
                value={newTrigger}
                onChange={(e) => setNewTrigger(e.target.value)}
                className="w-full h-9 rounded-md bg-zinc-950 border border-zinc-700 text-xs text-zinc-200 px-3 focus:outline-none focus:ring-1 focus:ring-pink-500"
              >
                <option value="telegram.start">Novo Lead (/start com UTM no Telegram)</option>
                <option value="lead.wants_pix">Cliente pediu PIX / Escolheu Plano</option>
                <option value="pix.pending_15m">PIX Pendente após 15 minutos</option>
                <option value="firebot.venda.paga">Pagamento PIX Aprovado (Firebot)</option>
                <option value="keyword.quero_ver">Palavra-chave recebida ("quero ver", "vip", etc.)</option>
              </select>
            </div>
          </div>

          <DialogFooter className="border-t border-zinc-800 pt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsNewDialogOpen(false)}
              className="text-xs text-zinc-400"
            >
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={handleCreateNew}
              disabled={isSaving}
              className="bg-pink-600 hover:bg-pink-500 text-white font-semibold text-xs"
            >
              Criar e Abrir Construtor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
