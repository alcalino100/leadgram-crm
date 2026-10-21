'use client'

import * as React from 'react'
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
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
  Plus, 
  Play, 
  Save, 
  Check, 
  Sparkles,
  MousePointerClick
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  TriggerNode,
  TextActionNode,
  AudioActionNode,
  MediaActionNode,
  PaymentActionNode,
  DelayNode,
  ConditionNode,
  CrmActionNode,
  DefaultFallbackNode,
} from '@/components/automations/custom-nodes'
import { NodeConfigDrawer } from '@/components/automations/node-config-drawer'

const nodeTypes = {
  // Triggers
  triggerNode: TriggerNode,
  trigger: TriggerNode,

  // Text / Message
  textNode: TextActionNode,
  messageNode: TextActionNode,
  text: TextActionNode,
  message: TextActionNode,

  // Audio / Voice
  audioNode: AudioActionNode,
  audio: AudioActionNode,
  voiceNode: AudioActionNode,

  // Media (Photo / Video / Teaser)
  mediaNode: MediaActionNode,
  media: MediaActionNode,
  photoNode: MediaActionNode,
  videoNode: MediaActionNode,

  // Payment / Pix Firebot
  paymentNode: PaymentActionNode,
  firebotPixNode: PaymentActionNode,
  pixNode: PaymentActionNode,
  payment: PaymentActionNode,

  // Delay
  delayNode: DelayNode,
  delay: DelayNode,

  // Condition
  conditionNode: ConditionNode,
  condition: ConditionNode,

  // CRM Action
  crmNode: CrmActionNode,
  actionNode: CrmActionNode,
  crm: CrmActionNode,
  action: CrmActionNode,

  // Fallbacks
  default: DefaultFallbackNode,
  input: TriggerNode,
  output: CrmActionNode,
}

const initialNodes: Node[] = [
  {
    id: 'node-1',
    type: 'triggerNode',
    position: { x: 50, y: 150 },
    data: {
      label: 'Novo Lead Ads Meta/Google',
      description: 'Dispara quando o lead clica no anúncio e inicia o bot Telegram.',
      badge: 'utm_source = meta_ads',
    },
  },
  {
    id: 'node-2',
    type: 'textNode',
    position: { x: 380, y: 150 },
    data: {
      title: 'Pergunta com Opções (Botões)',
      message: '🤭 Sabia que você ia ficar curiosinho...\n\nPreparei alguns conteúdos especiais pra quem quer conhecer meu lado mais ousado.😏\n\nVocê quer ver???🤭👀',
      buttons: [
        { id: 'btn_1', text: 'Quero 🫣😏', action: 'next' },
        { id: 'btn_2', text: 'Agora não 🤫', action: 'next' },
      ],
    },
  },
  {
    id: 'node-3',
    type: 'delayNode',
    position: { x: 700, y: 150 },
    data: {
      delay: '2 minutos',
      duration: 2,
      unit: 'minutes',
    },
  },
  {
    id: 'node-4',
    type: 'audioNode',
    position: { x: 980, y: 150 },
    data: {
      title: 'Áudio Sussurrado VIP',
      duration: '0:22',
      caption: 'Oi meu bem... preparei algo bem especial só pra você hoje ❤️',
    },
  },
  {
    id: 'node-5',
    type: 'paymentNode',
    position: { x: 1300, y: 150 },
    data: {
      title: 'Acesso VIP Firebot',
      description: 'Plano VIP Vitalício + Pack Bônus',
      amount: 49.9,
      instructions: 'Pague o PIX Copia e Cola para liberação automática do canal VIP.',
    },
  },
  {
    id: 'node-6',
    type: 'crmNode',
    position: { x: 1650, y: 150 },
    data: {
      action: 'Mover para VIP Ativo',
      label: 'Mover para VIP Ativo',
      details: 'Estágio → Ganho/VIP Ativo',
      tag: 'Assinante VIP',
    },
  },
]

const initialEdges: Edge[] = [
  { id: 'e1-2', source: 'node-1', target: 'node-2', animated: true, style: { stroke: '#ec4899', strokeWidth: 2 } },
  { id: 'e2-3', source: 'node-2', sourceHandle: 'btn-btn_1', target: 'node-3', animated: true, style: { stroke: '#0ea5e9', strokeWidth: 2 } },
  { id: 'e3-4', source: 'node-3', target: 'node-4', style: { stroke: '#f59e0b', strokeWidth: 2 } },
  { id: 'e4-5', source: 'node-4', target: 'node-5', animated: true, style: { stroke: '#10b981', strokeWidth: 2 } },
  { id: 'e5-6', source: 'node-5', target: 'node-6', style: { stroke: '#ec4899', strokeWidth: 2 } },
]

interface AutomationFlowBuilderProps {
  initialNodes?: Node[]
  initialEdges?: Edge[]
  onNodesEdgesChange?: (nodes: Node[], edges: Edge[]) => void
}

export function AutomationFlowBuilder({
  initialNodes: propNodes,
  initialEdges: propEdges,
  onNodesEdgesChange,
}: AutomationFlowBuilderProps = {}) {
  const [nodes, setNodes] = React.useState<Node[]>(propNodes || initialNodes)
  const [edges, setEdges] = React.useState<Edge[]>(propEdges || initialEdges)
  const [selectedNodeId, setSelectedNodeId] = React.useState<string | null>(null)
  const [isSaved, setIsSaved] = React.useState(false)

  // Bloco selecionado reativo
  const selectedNode = React.useMemo(() => {
    return nodes.find((n) => n.id === selectedNodeId) || null
  }, [nodes, selectedNodeId])

  // Atualizar quando props mudarem
  React.useEffect(() => {
    if (propNodes) setNodes(propNodes)
  }, [propNodes])

  React.useEffect(() => {
    if (propEdges) setEdges(propEdges)
  }, [propEdges])

  const onNodesChange = React.useCallback(
    (changes: any) => {
      setNodes((nds) => {
        const next = applyNodeChanges(changes, nds)
        onNodesEdgesChange?.(next, edges)
        return next
      })
    },
    [edges, onNodesEdgesChange]
  )

  const onEdgesChange = React.useCallback(
    (changes: any) => {
      setEdges((eds) => {
        const next = applyEdgeChanges(changes, eds)
        onNodesEdgesChange?.(nodes, next)
        return next
      })
    },
    [nodes, onNodesEdgesChange]
  )

  const onConnect = React.useCallback(
    (params: Connection) => {
      setEdges((eds) => {
        const next = addEdge(
          { ...params, animated: true, style: { stroke: '#ec4899', strokeWidth: 2 } },
          eds
        )
        onNodesEdgesChange?.(nodes, next)
        return next
      })
    },
    [nodes, onNodesEdgesChange]
  )

  // Atualizar dados do nó selecionado no Sharkbot Drawer
  const updateNodeData = React.useCallback(
    (nodeId: string, patch: Record<string, any>) => {
      setNodes((nds) => {
        const next = nds.map((n) => {
          if (n.id === nodeId) {
            return {
              ...n,
              data: {
                ...n.data,
                ...patch,
              },
            }
          }
          return n
        })
        onNodesEdgesChange?.(next, edges)
        return next
      })
    },
    [edges, onNodesEdgesChange]
  )

  // Excluir nó
  const deleteNode = React.useCallback(
    (nodeId: string) => {
      setNodes((nds) => {
        const nextNodes = nds.filter((n) => n.id !== nodeId)
        setEdges((eds) => {
          const nextEdges = eds.filter((e) => e.source !== nodeId && e.target !== nodeId)
          onNodesEdgesChange?.(nextNodes, nextEdges)
          return nextEdges
        })
        return nextNodes
      })
      setSelectedNodeId(null)
      toast.success('Bloco removido com sucesso!')
    },
    [onNodesEdgesChange]
  )

  // Duplicar nó
  const duplicateNode = React.useCallback(
    (nodeToDuplicate: Node) => {
      const newId = `node-${Date.now()}`
      const newNode: Node = {
        ...nodeToDuplicate,
        id: newId,
        position: {
          x: (nodeToDuplicate.position?.x || 100) + 40,
          y: (nodeToDuplicate.position?.y || 100) + 40,
        },
        data: { ...nodeToDuplicate.data },
      }
      setNodes((nds) => {
        const next = [...nds, newNode]
        onNodesEdgesChange?.(next, edges)
        return next
      })
      setSelectedNodeId(newId)
      toast.success('Bloco duplicado com sucesso!')
    },
    [edges, onNodesEdgesChange]
  )

  const addCustomNode = (type: string, defaultData: any) => {
    const id = `node-${Date.now()}`
    const newNode: Node = {
      id,
      type,
      position: { x: 340 + Math.random() * 120, y: 180 + Math.random() * 100 },
      data: defaultData,
    }
    setNodes((nds) => {
      const next = [...nds, newNode]
      onNodesEdgesChange?.(next, edges)
      return next
    })
    setSelectedNodeId(id)
    toast.success('Novo bloco adicionado! Configure os detalhes no painel lateral.')
  }

  const handleSave = () => {
    setIsSaved(true)
    onNodesEdgesChange?.(nodes, edges)
    toast.success('Fluxo de automação salvo com sucesso!', {
      description: 'As alterações foram sincronizadas com o banco de dados.',
    })
    setTimeout(() => setIsSaved(false), 2000)
  }

  const handleTestFlow = () => {
    toast.info('Simulação disparada!', {
      description: 'O fluxo foi executado para simulação no bot Telegram.',
    })
  }

  return (
    <div className="flex flex-col h-[calc(100vh-9rem)] rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-2xl relative">
      {/* Top Controls Bar */}
      <div className="h-14 px-4 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs text-zinc-100">Funil Telegram de Alta Conversão</span>
            <span className="flex items-center gap-1 text-[10px] font-mono-code bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> ATIVO
            </span>
          </div>
          <span className="hidden sm:inline-block text-xs text-zinc-500">|</span>
          <span className="hidden sm:inline-block text-xs text-zinc-400">
            Estilo N8N / Sharkbot Flow Builder
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleTestFlow}
            className="text-xs h-8 gap-1.5 border-zinc-800 hover:border-pink-500/40 text-zinc-300"
          >
            <Play className="h-3.5 w-3.5 text-pink-400" />
            <span>Testar no Bot</span>
          </Button>

          <Button
            size="sm"
            onClick={handleSave}
            className="bg-pink-600 hover:bg-pink-500 text-white font-semibold text-xs h-8 gap-1.5 shadow-md shadow-pink-600/20"
          >
            {isSaved ? <Check className="h-3.5 w-3.5" /> : <Save className="h-3.5 w-3.5" />}
            <span>{isSaved ? 'Salvo!' : 'Salvar Automação'}</span>
          </Button>
        </div>
      </div>

      {/* Main Builder Canvas + Nodes Palette + Config Drawer */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* ReactFlow Canvas */}
        <div className="flex-1 h-full w-full bg-zinc-950">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={(_event, node) => setSelectedNodeId(node.id)}
            onPaneClick={() => setSelectedNodeId(null)}
            nodeTypes={nodeTypes}
            fitView
            className="bg-zinc-950"
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={16}
              size={1}
              color="#27272a"
            />
            <Controls className="!bg-zinc-900 !border-zinc-800 !text-zinc-200 fill-zinc-200" />
          </ReactFlow>
        </div>

        {/* Floating Node Palette Drawer on the Left */}
        <div className="absolute top-4 left-4 z-10 w-64 rounded-xl border border-zinc-800/90 bg-zinc-950/90 backdrop-blur-md p-3 shadow-2xl space-y-3">
          <div className="flex items-center justify-between pb-1.5 border-b border-zinc-800">
            <span className="text-[11px] font-bold uppercase text-zinc-300 flex items-center gap-1.5">
              <Plus className="h-3.5 w-3.5 text-pink-400" /> Adicionar Bloco
            </span>
            <span className="text-[9px] font-mono-code text-zinc-400">Sharkbot style</span>
          </div>

          <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1">
            <button
              onClick={() =>
                addCustomNode('textNode', {
                  title: 'Pergunta com Botões',
                  message: '🤭 Sabia que você ia ficar curiosinho...\n\nPreparei alguns conteúdos especiais pra quem quer conhecer meu lado mais ousado.😏\n\nVocê quer ver???🤭👀',
                  buttons: [
                    { id: 'btn_1', text: 'Quero 🫣😏', action: 'next' },
                    { id: 'btn_2', text: 'Agora não 🤫', action: 'next' },
                  ],
                })
              }
              className="w-full p-2 rounded-lg bg-sky-950/40 hover:bg-sky-900/50 border border-sky-500/40 text-left text-xs transition-colors flex items-center gap-2"
            >
              <MousePointerClick className="h-4 w-4 text-sky-400 shrink-0" />
              <div>
                <p className="font-semibold text-zinc-100 flex items-center gap-1.5">
                  Pergunta com Botões
                  <span className="text-[8px] font-mono-code bg-sky-500/20 text-sky-300 px-1 rounded">Print</span>
                </p>
                <p className="text-[10px] text-zinc-400">Opções "Quero 🫣😏", "Sim", "Não"</p>
              </div>
            </button>

            <button
              onClick={() =>
                addCustomNode('textNode', {
                  title: 'Mensagem de Texto',
                  message: 'Oi amor! Seja bem-vindo ao meu canal VIP 🔥 Quer ver meus conteúdos exclusivos?',
                })
              }
              className="w-full p-2 rounded-lg bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-blue-500/40 text-left text-xs transition-colors flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4 text-blue-400 shrink-0" />
              <div>
                <p className="font-semibold text-zinc-200">Texto Telegram</p>
                <p className="text-[10px] text-zinc-400">Texto com formatação e botões</p>
              </div>
            </button>

            <button
              onClick={() =>
                addCustomNode('audioNode', {
                  title: 'Áudio Sussurrado',
                  duration: '0:22',
                  caption: 'Oi meu bem... preparei algo bem especial só pra você hoje ❤️',
                })
              }
              className="w-full p-2 rounded-lg bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-amber-500/40 text-left text-xs transition-colors flex items-center gap-2"
            >
              <Mic className="h-4 w-4 text-amber-400 shrink-0" />
              <div>
                <p className="font-semibold text-zinc-200">Áudio de Voz</p>
                <p className="text-[10px] text-zinc-400">Simula áudio gravado no app</p>
              </div>
            </button>

            <button
              onClick={() =>
                addCustomNode('mediaNode', {
                  title: 'Foto Teaser VIP',
                  mediaType: 'photo',
                  caption: 'Olha o que acabou de sair no VIP... clica abaixo para desbloquear 🔥',
                })
              }
              className="w-full p-2 rounded-lg bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-pink-500/40 text-left text-xs transition-colors flex items-center gap-2"
            >
              <ImageIcon className="h-4 w-4 text-pink-400 shrink-0" />
              <div>
                <p className="font-semibold text-zinc-200">Foto / Teaser</p>
                <p className="text-[10px] text-zinc-400">Prévia com blur ou censura</p>
              </div>
            </button>

            <button
              onClick={() =>
                addCustomNode('paymentNode', {
                  title: 'Acesso VIP Firebot',
                  amount: 49.9,
                  description: 'Acesso Canal VIP Mensal',
                  instructions: 'Copie o código PIX e pague no app do banco para liberar imediatamente!',
                })
              }
              className="w-full p-2 rounded-lg bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-emerald-500/40 text-left text-xs transition-colors flex items-center gap-2"
            >
              <QrCode className="h-4 w-4 text-emerald-400 shrink-0" />
              <div>
                <p className="font-semibold text-zinc-200">Gerar PIX Firebot</p>
                <p className="text-[10px] text-zinc-400">QR Code + Copia e Cola automático</p>
              </div>
            </button>

            <button
              onClick={() =>
                addCustomNode('delayNode', {
                  delay: '5 minutos',
                  duration: 5,
                  unit: 'minutes',
                })
              }
              className="w-full p-2 rounded-lg bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-amber-500/40 text-left text-xs transition-colors flex items-center gap-2"
            >
              <Clock className="h-4 w-4 text-amber-400 shrink-0" />
              <div>
                <p className="font-semibold text-zinc-200">Delay / Espera</p>
                <p className="text-[10px] text-zinc-400">Aguarda minutos antes do próximo envio</p>
              </div>
            </button>

            <button
              onClick={() =>
                addCustomNode('conditionNode', {
                  title: 'Se respondeu "Quero"',
                  conditionText: 'Contém: Quero, Sim, VIP, Manda',
                })
              }
              className="w-full p-2 rounded-lg bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-purple-500/40 text-left text-xs transition-colors flex items-center gap-2"
            >
              <GitBranch className="h-4 w-4 text-purple-400 shrink-0" />
              <div>
                <p className="font-semibold text-zinc-200">Condição (If / Else)</p>
                <p className="text-[10px] text-zinc-400">Ramifica o atendimento</p>
              </div>
            </button>

            <button
              onClick={() =>
                addCustomNode('crmNode', {
                  action: 'Mover Estágio',
                  label: 'Mover para VIP Ativo',
                  details: 'Estágio → Ganho/VIP Ativo',
                  tag: 'Assinante VIP',
                })
              }
              className="w-full p-2 rounded-lg bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-pink-500/40 text-left text-xs transition-colors flex items-center gap-2"
            >
              <TagIcon className="h-4 w-4 text-pink-400 shrink-0" />
              <div>
                <p className="font-semibold text-zinc-200">Ação CRM</p>
                <p className="text-[10px] text-zinc-400">Altera funil ou aplica tag</p>
              </div>
            </button>
          </div>
        </div>

        {/* Sharkbot Style Node Configuration Drawer on the Right */}
        <NodeConfigDrawer
          node={selectedNode}
          onClose={() => setSelectedNodeId(null)}
          onUpdateData={updateNodeData}
          onDeleteNode={deleteNode}
          onDuplicateNode={duplicateNode}
        />
      </div>
    </div>
  )
}
