'use client'

import * as React from 'react'
import { 
  X, 
  Trash2, 
  Copy, 
  Check, 
  QrCode, 
  MessageSquare, 
  Mic, 
  ImageIcon, 
  VideoIcon, 
  Clock, 
  GitBranch, 
  Tag as TagIcon, 
  Zap, 
  DollarSign, 
  Sliders,
  Sparkles,
  Layers,
  Plus,
  ExternalLink,
  MousePointerClick
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useAppStore } from '@/lib/store'
import { Node } from '@xyflow/react'

interface NodeConfigDrawerProps {
  node: Node | null
  onClose: () => void
  onUpdateData: (nodeId: string, data: Record<string, any>) => void
  onDeleteNode: (nodeId: string) => void
  onDuplicateNode?: (node: Node) => void
}

export function NodeConfigDrawer({
  node,
  onClose,
  onUpdateData,
  onDeleteNode,
  onDuplicateNode,
}: NodeConfigDrawerProps) {
  const { pipelineStages, availableTags } = useAppStore()

  if (!node) return null

  const data: Record<string, any> = (node.data || {}) as any
  const nodeType = node.type || 'textNode'

  // Helper para atualizar campos específicos
  const handleChange = (field: string, value: any) => {
    onUpdateData(node.id, { [field]: value })
  }

  // Identificação do Tipo de Bloco
  const isPix = ['paymentNode', 'firebotPixNode', 'pixNode', 'payment'].includes(nodeType)
  const isText = ['textNode', 'messageNode', 'text', 'message'].includes(nodeType)
  const isAudio = ['audioNode', 'audio', 'voiceNode'].includes(nodeType)
  const isMedia = ['mediaNode', 'media', 'photoNode', 'videoNode'].includes(nodeType)
  const isDelay = ['delayNode', 'delay'].includes(nodeType)
  const isCondition = ['conditionNode', 'condition'].includes(nodeType)
  const isCrm = ['crmNode', 'actionNode', 'crm', 'action'].includes(nodeType)
  const isTrigger = ['triggerNode', 'trigger', 'input'].includes(nodeType)

  return (
    <div className="absolute top-4 right-4 z-20 w-80 sm:w-96 max-h-[calc(100vh-9rem)] rounded-2xl border border-zinc-800 bg-zinc-950/95 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden text-zinc-100 animate-in slide-in-from-right duration-200">
      {/* Header do Painel */}
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/20">
            {isPix && <QrCode className="h-4 w-4 text-emerald-400" />}
            {isText && <MessageSquare className="h-4 w-4 text-blue-400" />}
            {isAudio && <Mic className="h-4 w-4 text-amber-400" />}
            {isMedia && <ImageIcon className="h-4 w-4 text-purple-400" />}
            {isDelay && <Clock className="h-4 w-4 text-amber-400" />}
            {isCondition && <GitBranch className="h-4 w-4 text-purple-400" />}
            {isCrm && <TagIcon className="h-4 w-4 text-pink-400" />}
            {isTrigger && <Zap className="h-4 w-4 text-cyan-400" />}
            {!isPix && !isText && !isAudio && !isMedia && !isDelay && !isCondition && !isCrm && !isTrigger && (
              <Sliders className="h-4 w-4 text-zinc-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-100">
                {isPix && 'Configurar Cobrança PIX'}
                {isText && 'Configurar Mensagem'}
                {isAudio && 'Configurar Áudio de Voz'}
                {isMedia && 'Configurar Foto / Teaser'}
                {isDelay && 'Configurar Tempo de Espera'}
                {isCondition && 'Configurar Condição Lógica'}
                {isCrm && 'Configurar Ação no CRM'}
                {isTrigger && 'Configurar Gatilho Inicial'}
                {!isPix && !isText && !isAudio && !isMedia && !isDelay && !isCondition && !isCrm && !isTrigger && 'Configurar Bloco'}
              </span>
            </div>
            <p className="text-[10px] font-mono-code text-zinc-500">ID: {node.id}</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          title="Fechar painel"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Formulário Dinâmico por Tipo de Bloco */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {/* ======================================================== */}
        {/* 1. CONFIGURAÇÃO DO BLOCO PIX FIREBOT                     */}
        {/* ======================================================== */}
        {isPix && (
          <div className="space-y-3.5">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300">
              ⚡ Gerador oficial de PIX Copia e Cola e QR Code integrado com a sua API da Firebot.
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-zinc-300">
                Valor do PIX (R$) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs font-bold text-zinc-500 select-none">
                  R$
                </span>
                <Input
                  type="number"
                  step="0.01"
                  min="1"
                  value={data.amount || 49.9}
                  onChange={(e) => handleChange('amount', parseFloat(e.target.value) || 0)}
                  placeholder="49.90"
                  className="bg-zinc-900 border-zinc-700 pl-9 font-mono-code font-bold text-sm text-emerald-400"
                />
              </div>
              <p className="text-[10px] text-zinc-500">
                Ex: 19.90 (Prévia), 49.90 (VIP Mensal), 97.00 (Trimestral), 150.00 (Vídeo Privado).
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-zinc-300">
                Descrição do Acesso / Produto
              </label>
              <Input
                value={data.description || data.title || ''}
                onChange={(e) => {
                  handleChange('description', e.target.value)
                  handleChange('title', e.target.value)
                }}
                placeholder="Ex: Acesso Canal VIP + Pack Bônus"
                className="bg-zinc-900 border-zinc-700 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-zinc-300">
                Instruções de Pagamento (Texto enviado no Telegram)
              </label>
              <textarea
                value={
                  data.instructions ||
                  '💎 Copie o código PIX abaixo e pague em qualquer banco. Seu acesso VIP será liberado automaticamente em menos de 10 segundos!'
                }
                onChange={(e) => handleChange('instructions', e.target.value)}
                rows={3}
                className="w-full rounded-md bg-zinc-900 border border-zinc-700 p-2 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="pt-2 border-t border-zinc-800/80 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                <input
                  type="checkbox"
                  checked={data.autoSendTelegram !== false}
                  onChange={(e) => handleChange('autoSendTelegram', e.target.checked)}
                  className="rounded border-zinc-700 text-emerald-500 focus:ring-emerald-500"
                />
                <span>Enviar QR Code e Copia e Cola automaticamente no chat</span>
              </label>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 2. CONFIGURAÇÃO DE MENSAGEM DE TEXTO                    */}
        {/* ======================================================== */}
        {isText && (
          <div className="space-y-3.5">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-zinc-300">Título Interno do Bloco</label>
              <Input
                value={data.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Ex: Boas-Vindas Imediata"
                className="bg-zinc-900 border-zinc-700 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-zinc-300">Texto da Mensagem</label>
                <span className="text-[10px] text-zinc-500">Suporta Markdown</span>
              </div>
              <textarea
                value={data.template || data.message || ''}
                onChange={(e) => {
                  handleChange('template', e.target.value)
                  handleChange('message', e.target.value)
                }}
                rows={6}
                placeholder="Digite a mensagem que o bot enviará..."
                className="w-full rounded-md bg-zinc-900 border border-zinc-700 p-2.5 text-xs text-zinc-200 font-sans focus:outline-none focus:ring-1 focus:ring-blue-500 leading-relaxed"
              />
              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-[10px] text-zinc-500">Variáveis:</span>
                <button
                  type="button"
                  onClick={() =>
                    handleChange('template', (data.template || '') + ' {{lead.nome}}')
                  }
                  className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-mono-code text-blue-400 hover:border-blue-500"
                >
                  {"{{lead.nome}}"}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleChange('template', (data.template || '') + ' {{lead.username}}')
                  }
                  className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-mono-code text-cyan-400 hover:border-cyan-500"
                >
                  {"{{lead.username}}"}
                </button>
              </div>
            </div>

            {/* Seção de Botões Inline Telegram (Ex: Quero 🫣😏 / Agora não) */}
            <div className="pt-3 border-t border-zinc-800/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <MousePointerClick className="h-4 w-4 text-sky-400" />
                  <span className="text-[11px] font-semibold text-zinc-200">
                    Botões de Escolha (Telegram Inline)
                  </span>
                </div>
                <Badge variant="outline" className="text-[9px] font-mono-code text-sky-400 border-sky-500/30">
                  {(data.buttons || []).length} Botão(ões)
                </Badge>
              </div>

              <p className="text-[10px] text-zinc-400 leading-normal">
                Adicione botões para o lead clicar no Telegram (ex: <span className="text-zinc-200 font-semibold">"Quero 🫣😏"</span>, <span className="text-zinc-200 font-semibold">"Sim"</span>, <span className="text-zinc-200 font-semibold">"Não"</span>). Cada botão cria uma saída exclusiva no canvas!
              </p>

              {/* Modelos / Presets Rápidos com 1 Clique */}
              <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800 space-y-1.5">
                <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold block">
                  Modelos Rápidos (1 Clique):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      handleChange('template', '🤭 Sabia que você ia ficar curiosinho...\n\nPreparei alguns conteúdos especiais pra quem quer conhecer meu lado mais ousado.😏\n\nVocê quer ver???🤭👀')
                      handleChange('buttons', [
                        { id: 'btn_1', text: 'Quero 🫣😏', action: 'next' },
                        { id: 'btn_2', text: 'Agora não 🤫', action: 'next' },
                      ])
                    }}
                    className="px-2 py-1 rounded bg-sky-950/60 hover:bg-sky-900/80 text-sky-300 border border-sky-500/30 text-[10px] font-medium transition-colors text-left"
                  >
                    🔥 "Você quer ver?" (Quero / Não)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleChange('buttons', [
                        { id: 'btn_sim', text: 'Sim, com certeza! 🔥', action: 'next' },
                        { id: 'btn_nao', text: 'Não agora', action: 'next' },
                      ])
                    }}
                    className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-medium transition-colors"
                  >
                    ⚡ Sim / Não
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleChange('buttons', [
                        { id: 'btn_vip', text: 'Liberar Acesso VIP 💎', action: 'next' },
                        { id: 'btn_duvida', text: 'Tirar Dúvidas', action: 'next' },
                      ])
                    }}
                    className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-medium transition-colors"
                  >
                    💎 VIP / Suporte
                  </button>
                </div>
              </div>

              {/* Lista de Botões Cadastrados */}
              <div className="space-y-2">
                {(data.buttons || []).map((btn: any, index: number) => (
                  <div
                    key={btn.id || index}
                    className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 space-y-2 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold font-mono-code text-sky-400">
                        Botão #{index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const nextBtns = (data.buttons || []).filter((_: any, i: number) => i !== index)
                          handleChange('buttons', nextBtns)
                        }}
                        className="text-zinc-500 hover:text-red-400 transition-colors p-0.5"
                        title="Remover botão"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-400">Texto exibido no botão</label>
                      <Input
                        value={btn.text || ''}
                        onChange={(e) => {
                          const nextBtns = [...(data.buttons || [])]
                          nextBtns[index] = { ...nextBtns[index], text: e.target.value }
                          handleChange('buttons', nextBtns)
                        }}
                        placeholder="Ex: Quero 🫣😏"
                        className="h-8 bg-zinc-950 border-zinc-700 text-xs font-semibold text-zinc-100"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div>
                        <label className="text-[10px] text-zinc-400">Tipo de Ação</label>
                        <select
                          value={btn.action || 'next'}
                          onChange={(e) => {
                            const nextBtns = [...(data.buttons || [])]
                            nextBtns[index] = { ...nextBtns[index], action: e.target.value }
                            handleChange('buttons', nextBtns)
                          }}
                          className="w-full h-7 rounded bg-zinc-950 border border-zinc-700 text-[11px] text-zinc-300 px-2 focus:outline-none"
                        >
                          <option value="next">Avançar Fluxo (Canvas)</option>
                          <option value="url">Abrir Link (URL)</option>
                        </select>
                      </div>

                      {btn.action === 'url' ? (
                        <div>
                          <label className="text-[10px] text-zinc-400">Link URL</label>
                          <Input
                            value={btn.url || ''}
                            onChange={(e) => {
                              const nextBtns = [...(data.buttons || [])]
                              nextBtns[index] = { ...nextBtns[index], url: e.target.value }
                              handleChange('buttons', nextBtns)
                            }}
                            placeholder="https://t.me/..."
                            className="h-7 bg-zinc-950 border-zinc-700 text-[11px] font-mono-code"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center text-[10px] text-zinc-500 pt-3">
                          <span>Conecte a saída no canvas</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Botão Adicionar Mais Um Botão */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const current = data.buttons || []
                    const newBtn = {
                      id: `btn_${Date.now()}`,
                      text: `Opção ${current.length + 1}`,
                      action: 'next',
                    }
                    handleChange('buttons', [...current, newBtn])
                  }}
                  className="w-full h-8 text-xs border-dashed border-zinc-700 hover:border-sky-500/50 hover:bg-sky-500/10 text-sky-300 gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Adicionar Opção de Botão</span>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 3. CONFIGURAÇÃO DE ÁUDIO DE VOZ                         */}
        {/* ======================================================== */}
        {isAudio && (
          <div className="space-y-3.5">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-zinc-300">Identificação do Áudio</label>
              <Input
                value={data.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Ex: Áudio 1 - Boas-Vindas Sussurrado"
                className="bg-zinc-900 border-zinc-700 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-zinc-300">URL do Áudio (MP3 / OGG)</label>
              <Input
                value={data.audioUrl || ''}
                onChange={(e) => handleChange('audioUrl', e.target.value)}
                placeholder="https://seusite.com/audio/voz_1.mp3"
                className="bg-zinc-900 border-zinc-700 text-xs font-mono-code"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-zinc-300">Duração Exibida</label>
              <Input
                value={data.duration || '0:18'}
                onChange={(e) => handleChange('duration', e.target.value)}
                placeholder="Ex: 0:24"
                className="bg-zinc-900 border-zinc-700 text-xs font-mono-code"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-zinc-300">Legenda / Transcrição</label>
              <textarea
                value={data.caption || data.message || ''}
                onChange={(e) => {
                  handleChange('caption', e.target.value)
                  handleChange('message', e.target.value)
                }}
                rows={3}
                placeholder="Ex: Oi amor, que bom que você veio... preparei algo bem especial ❤️"
                className="w-full rounded-md bg-zinc-900 border border-zinc-700 p-2 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 4. CONFIGURAÇÃO DE MÍDIA (FOTO / TEASER / VÍDEO)         */}
        {/* ======================================================== */}
        {isMedia && (
          <div className="space-y-3.5">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-zinc-300">Tipo de Conteúdo</label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={data.mediaType !== 'video' ? 'default' : 'outline'}
                  onClick={() => handleChange('mediaType', 'photo')}
                  className={`text-xs h-8 ${data.mediaType !== 'video' ? 'bg-pink-600 hover:bg-pink-500' : 'border-zinc-700'}`}
                >
                  <ImageIcon className="h-3.5 w-3.5 mr-1" /> Foto / Teaser
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={data.mediaType === 'video' ? 'default' : 'outline'}
                  onClick={() => handleChange('mediaType', 'video')}
                  className={`text-xs h-8 ${data.mediaType === 'video' ? 'bg-purple-600 hover:bg-purple-500' : 'border-zinc-700'}`}
                >
                  <VideoIcon className="h-3.5 w-3.5 mr-1" /> Vídeo / Teaser
                </Button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-zinc-300">URL da Imagem ou Vídeo</label>
              <Input
                value={data.url || ''}
                onChange={(e) => handleChange('url', e.target.value)}
                placeholder="https://seusite.com/previa_blur.jpg"
                className="bg-zinc-900 border-zinc-700 text-xs font-mono-code"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-zinc-300">Legenda da Prévia</label>
              <textarea
                value={data.caption || data.message || ''}
                onChange={(e) => {
                  handleChange('caption', e.target.value)
                  handleChange('message', e.target.value)
                }}
                rows={3}
                placeholder="Ex: Prévia de hoje... clica abaixo pra ver sem censura 🔥"
                className="w-full rounded-md bg-zinc-900 border border-zinc-700 p-2 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-pink-500"
              />
            </div>

            {/* Seção de Botões Inline Telegram para Foto / Vídeo Teaser */}
            <div className="pt-3 border-t border-zinc-800/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <MousePointerClick className="h-4 w-4 text-pink-400" />
                  <span className="text-[11px] font-semibold text-zinc-200">
                    Botões Abaixo da Mídia
                  </span>
                </div>
                <Badge variant="outline" className="text-[9px] font-mono-code text-pink-400 border-pink-500/30">
                  {(data.buttons || []).length} Botão(ões)
                </Badge>
              </div>

              {/* Lista de Botões Cadastrados */}
              <div className="space-y-2">
                {(data.buttons || []).map((btn: any, index: number) => (
                  <div
                    key={btn.id || index}
                    className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold font-mono-code text-pink-400">
                        Botão #{index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const nextBtns = (data.buttons || []).filter((_: any, i: number) => i !== index)
                          handleChange('buttons', nextBtns)
                        }}
                        className="text-zinc-500 hover:text-red-400 transition-colors p-0.5"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <Input
                      value={btn.text || ''}
                      onChange={(e) => {
                        const nextBtns = [...(data.buttons || [])]
                        nextBtns[index] = { ...nextBtns[index], text: e.target.value }
                        handleChange('buttons', nextBtns)
                      }}
                      placeholder="Ex: Desbloquear VIP Completo 🔥"
                      className="h-8 bg-zinc-950 border-zinc-700 text-xs font-semibold text-zinc-100"
                    />
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const current = data.buttons || []
                    const newBtn = {
                      id: `btn_${Date.now()}`,
                      text: `Desbloquear VIP Completo 🔥`,
                      action: 'next',
                    }
                    handleChange('buttons', [...current, newBtn])
                  }}
                  className="w-full h-8 text-xs border-dashed border-zinc-700 hover:border-pink-500/50 hover:bg-pink-500/10 text-pink-300 gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Adicionar Botão na Mídia</span>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 5. CONFIGURAÇÃO DE DELAY (TEMPO DE ESPERA)               */}
        {/* ======================================================== */}
        {isDelay && (
          <div className="space-y-3.5">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-zinc-300">Tempo de Espera</label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="1"
                  value={data.duration || 15}
                  onChange={(e) => {
                    const dur = parseInt(e.target.value) || 1
                    handleChange('duration', dur)
                    handleChange('delay', `${dur} ${data.unit || 'minutos'}`)
                  }}
                  className="bg-zinc-900 border-zinc-700 text-sm font-bold text-amber-400 w-24"
                />
                <select
                  value={data.unit || 'minutes'}
                  onChange={(e) => {
                    const unit = e.target.value
                    handleChange('unit', unit)
                    handleChange('delay', `${data.duration || 15} ${unit === 'seconds' ? 'segundos' : unit === 'hours' ? 'horas' : 'minutos'}`)
                  }}
                  className="flex-1 h-9 rounded-md bg-zinc-900 border border-zinc-700 text-xs text-zinc-200 px-2.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="seconds">Segundos</option>
                  <option value="minutes">Minutos</option>
                  <option value="hours">Horas</option>
                  <option value="days">Dias</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 6. CONFIGURAÇÃO DE AÇÃO CRM                             */}
        {/* ======================================================== */}
        {isCrm && (
          <div className="space-y-3.5">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-zinc-300">Título da Ação</label>
              <Input
                value={data.label || data.action || ''}
                onChange={(e) => {
                  handleChange('label', e.target.value)
                  handleChange('action', e.target.value)
                }}
                placeholder="Ex: Mover para VIP Ativo"
                className="bg-zinc-900 border-zinc-700 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-zinc-300">
                Mover para Estágio do Funil
              </label>
              <select
                value={data.value || data.stage || ''}
                onChange={(e) => {
                  const val = e.target.value
                  const stageObj = pipelineStages.find((s) => s.id === val)
                  handleChange('value', val)
                  handleChange('stage', val)
                  handleChange('details', `Estágio → ${stageObj?.name || val}`)
                }}
                className="w-full h-9 rounded-md bg-zinc-900 border border-zinc-700 text-xs text-zinc-200 px-2.5 focus:outline-none focus:ring-1 focus:ring-pink-500 capitalize"
              >
                <option value="">Nenhuma alteração de estágio</option>
                {pipelineStages.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-zinc-300">
                Aplicar Tag de Segmentação
              </label>
              <select
                value={data.tag || ''}
                onChange={(e) => handleChange('tag', e.target.value)}
                className="w-full h-9 rounded-md bg-zinc-900 border border-zinc-700 text-xs text-zinc-200 px-2.5 focus:outline-none focus:ring-1 focus:ring-pink-500"
              >
                <option value="">Nenhuma tag</option>
                {availableTags.map((t) => (
                  <option key={t.id} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 7. CONFIGURAÇÃO DE GATILHO (TRIGGER)                    */}
        {/* ======================================================== */}
        {isTrigger && (
          <div className="space-y-3.5">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-zinc-300">Nome do Gatilho</label>
              <Input
                value={data.label || ''}
                onChange={(e) => handleChange('label', e.target.value)}
                placeholder="Ex: Solicitou PIX"
                className="bg-zinc-900 border-zinc-700 text-xs font-bold text-cyan-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-zinc-300">Descrição do Evento</label>
              <Input
                value={data.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Ex: Cliente selecionou plano VIP"
                className="bg-zinc-900 border-zinc-700 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-zinc-300">Evento de Ativação</label>
              <select
                value={data.event || 'telegram.start'}
                onChange={(e) => handleChange('event', e.target.value)}
                className="w-full h-9 rounded-md bg-zinc-900 border border-zinc-700 text-xs text-zinc-200 px-2.5 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                <option value="telegram.start">Novo Lead (/start no Telegram)</option>
                <option value="lead.wants_pix">Solicitou PIX / Escolheu Plano</option>
                <option value="pix.pending_15m">PIX Pendente após 15 minutos</option>
                <option value="firebot.venda.paga">PIX Confirmado pela Firebot</option>
                <option value="keyword">Palavra-chave recebida</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Rodapé de Ações */}
      <div className="p-3 border-t border-zinc-800 bg-zinc-900/60 flex items-center justify-between">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onDeleteNode(node.id)}
          className="h-8 text-xs text-zinc-400 hover:text-red-400 hover:bg-red-500/10"
        >
          <Trash2 className="h-3.5 w-3.5 mr-1" />
          <span>Excluir Bloco</span>
        </Button>

        <Button
          size="sm"
          onClick={onClose}
          className="bg-pink-600 hover:bg-pink-500 text-white font-semibold text-xs h-8 px-4"
        >
          <Check className="h-3.5 w-3.5 mr-1" />
          <span>Concluir</span>
        </Button>
      </div>
    </div>
  )
}
