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
  Sparkles 
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
} from '@/components/automations/custom-nodes'

const nodeTypes = {
  triggerNode: TriggerNode,
  textNode: TextActionNode,
  audioNode: AudioActionNode,
  mediaNode: MediaActionNode,
  paymentNode: PaymentActionNode,
  delayNode: DelayNode,
  conditionNode: ConditionNode,
  crmNode: CrmActionNode,
}

const initialNodes: Node[] = [
  {
    id: 'node-1',
    type: 'triggerNode',
    position: { x: 50, y: 150 },
    data: {
      label: 'Novo Lead Meta Ads',
      description: 'Dispara quando o lead clica no anúncio e inicia a conversa no Telegram.',
      badge: 'utm_source = meta',
    },
  },
  {
    id: 'node-2',
    type: 'textNode',
    position: { x: 360, y: 150 },
    data: {
      title: 'Boas-Vindas Imediata',
      message: 'Olá {{lead.nome}}! Seja muito bem-vindo. Recebemos seu interesse na campanha de escala.',
      hasButtons: true,
    },
  },
  {
    id: 'node-3',
    type: 'delayNode',
    position: { x: 680, y: 150 },
    data: {
      delay: '2 minutos',
    },
  },
  {
    id: 'node-4',
    type: 'audioNode',
    position: { x: 970, y: 150 },
    data: {
      title: 'Áudio Consultor Sênior',
      duration: '0:42s',
      description: 'Áudio gravado pelo Guilherme explicando a estrutura de atendimento.',
    },
  },
  {
    id: 'node-5',
    type: 'conditionNode',
    position: { x: 1300, y: 120 },
    data: {
      title: 'Demonstrou Interesse?',
      conditionText: 'Contém: "Sim", "Quero", "Como funciona"',
    },
  },
  {
    id: 'node-6',
    type: 'paymentNode',
    position: { x: 1650, y: 80 },
    data: {
      title: 'Setup Inicial Pix',
      amount: '2.500,00',
      provider: 'Asaas Pix Instantâneo',
    },
  },
  {
    id: 'node-7',
    type: 'crmNode',
    position: { x: 1980, y: 80 },
    data: {
      action: 'Mover para Qualificado',
      details: 'Estágio → Qualificado',
      tag: 'Lead VIP',
    },
  },
]

const initialEdges: Edge[] = [
  { id: 'e1-2', source: 'node-1', target: 'node-2', animated: true, style: { stroke: '#22d3ee', strokeWidth: 2 } },
  { id: 'e2-3', source: 'node-2', target: 'node-3', style: { stroke: '#3b82f6', strokeWidth: 2 } },
  { id: 'e3-4', source: 'node-3', target: 'node-4', style: { stroke: '#f59e0b', strokeWidth: 2 } },
  { id: 'e4-5', source: 'node-4', target: 'node-5', style: { stroke: '#10b981', strokeWidth: 2 } },
  { id: 'e5-6', source: 'node-5', sourceHandle: 'true', target: 'node-6', animated: true, style: { stroke: '#10b981', strokeWidth: 2 } },
  { id: 'e6-7', source: 'node-6', target: 'node-7', style: { stroke: '#22d3ee', strokeWidth: 2 } },
]

export function AutomationFlowBuilder() {
  const [nodes, setNodes] = React.useState<Node[]>(initialNodes)
  const [edges, setEdges] = React.useState<Edge[]>(initialEdges)
  const [isSaved, setIsSaved] = React.useState(false)

  const onNodesChange = React.useCallback(
    (changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  )

  const onEdgesChange = React.useCallback(
    (changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  )

  const onConnect = React.useCallback(
    (params: Connection) =>
      setEdges((eds) =>
        addEdge(
          { ...params, animated: true, style: { stroke: '#22d3ee', strokeWidth: 2 } },
          eds
        )
      ),
    []
  )

  const addCustomNode = (type: string, defaultData: any) => {
    const id = `node-${Date.now()}`
    const newNode: Node = {
      id,
      type,
      position: { x: 300 + Math.random() * 200, y: 300 + Math.random() * 100 },
      data: defaultData,
    }
    setNodes((nds) => [...nds, newNode])
    toast.success('Novo bloco adicionado ao fluxo!')
  }

  const handleSave = () => {
    setIsSaved(true)
    toast.success('Fluxo de automação salvo com sucesso!', {
      description: 'As alterações foram sincronizadas e publicadas no bot Telegram.',
    })
    setTimeout(() => setIsSaved(false), 2000)
  }

  const handleTestFlow = () => {
    toast.info('Simulação disparada!', {
      description: 'Uma mensagem de teste foi enviada para o bot Telegram conectado.',
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
            Estilo N8N / Node Workflow Engine
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleTestFlow}
            className="text-xs h-8 gap-1.5 border-zinc-800 hover:border-cyan-500/40"
          >
            <Play className="h-3.5 w-3.5 text-cyan-400" />
            <span>Testar no Bot</span>
          </Button>

          <Button
            size="sm"
            onClick={handleSave}
            className="bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-semibold text-xs h-8 gap-1.5"
          >
            {isSaved ? <Check className="h-3.5 w-3.5" /> : <Save className="h-3.5 w-3.5" />}
            <span>{isSaved ? 'Salvo!' : 'Salvar Automação'}</span>
          </Button>
        </div>
      </div>

      {/* Main Builder Canvas + Nodes Palette */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* ReactFlow Canvas */}
        <div className="flex-1 h-full w-full bg-zinc-950">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
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
              <Plus className="h-3.5 w-3.5 text-cyan-400" /> Adicionar Bloco
            </span>
            <span className="text-[9px] font-mono-code text-zinc-400">n8n style</span>
          </div>

          <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1">
            <button
              onClick={() =>
                addCustomNode('textNode', {
                  title: 'Mensagem de Texto',
                  message: 'Olá {{lead.nome}}, como podemos ajudar?',
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
                  title: 'Áudio Gravado',
                  duration: '0:35s',
                  description: 'Mensagem de áudio com gravação realista',
                })
              }
              className="w-full p-2 rounded-lg bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-emerald-500/40 text-left text-xs transition-colors flex items-center gap-2"
            >
              <Mic className="h-4 w-4 text-emerald-400 shrink-0" />
              <div>
                <p className="font-semibold text-zinc-200">Áudio de Voz</p>
                <p className="text-[10px] text-zinc-400">Simula áudio gravado no app</p>
              </div>
            </button>

            <button
              onClick={() =>
                addCustomNode('mediaNode', {
                  title: 'Foto Criativo',
                  mediaType: 'photo',
                  caption: 'Confira nossos cases de sucesso!',
                })
              }
              className="w-full p-2 rounded-lg bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-purple-500/40 text-left text-xs transition-colors flex items-center gap-2"
            >
              <ImageIcon className="h-4 w-4 text-purple-400 shrink-0" />
              <div>
                <p className="font-semibold text-zinc-200">Foto / Carrossel</p>
                <p className="text-[10px] text-zinc-400">Imagens com legenda e link</p>
              </div>
            </button>

            <button
              onClick={() =>
                addCustomNode('paymentNode', {
                  title: 'Cobrança Pix Instantânea',
                  amount: '1.200,00',
                  provider: 'Asaas / Mercado Pago',
                })
              }
              className="w-full p-2 rounded-lg bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-emerald-500/40 text-left text-xs transition-colors flex items-center gap-2"
            >
              <QrCode className="h-4 w-4 text-emerald-400 shrink-0" />
              <div>
                <p className="font-semibold text-zinc-200">Gerar Cobrança Pix</p>
                <p className="text-[10px] text-zinc-400">Chave Copia e Cola + QR Code</p>
              </div>
            </button>

            <button
              onClick={() =>
                addCustomNode('delayNode', {
                  delay: '5 minutos',
                })
              }
              className="w-full p-2 rounded-lg bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-amber-500/40 text-left text-xs transition-colors flex items-center gap-2"
            >
              <Clock className="h-4 w-4 text-amber-400 shrink-0" />
              <div>
                <p className="font-semibold text-zinc-200">Delay / Espera</p>
                <p className="text-[10px] text-zinc-400">Aguarda minutos ou horas</p>
              </div>
            </button>

            <button
              onClick={() =>
                addCustomNode('conditionNode', {
                  title: 'Se respondeu "Sim"',
                  conditionText: 'Verifica intenção de compra',
                })
              }
              className="w-full p-2 rounded-lg bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-rose-500/40 text-left text-xs transition-colors flex items-center gap-2"
            >
              <GitBranch className="h-4 w-4 text-rose-400 shrink-0" />
              <div>
                <p className="font-semibold text-zinc-200">Condição (If / Else)</p>
                <p className="text-[10px] text-zinc-400">Ramifica o atendimento</p>
              </div>
            </button>

            <button
              onClick={() =>
                addCustomNode('crmNode', {
                  action: 'Mover Estágio',
                  details: 'Estágio → Proposta Enviada',
                  tag: 'Interesse Alto',
                })
              }
              className="w-full p-2 rounded-lg bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-cyan-500/40 text-left text-xs transition-colors flex items-center gap-2"
            >
              <TagIcon className="h-4 w-4 text-cyan-400 shrink-0" />
              <div>
                <p className="font-semibold text-zinc-200">Ação CRM</p>
                <p className="text-[10px] text-zinc-400">Altera funil ou aplica tag</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
