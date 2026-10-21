'use client'

import * as React from 'react'
import { Plus, Trash2, Edit2, Check, X, ArrowUp, ArrowDown, Palette, Sliders } from 'lucide-react'
import { toast } from 'sonner'
import { useAppStore } from '@/lib/store'
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
import { PipelineStage } from '@/types'

const PRESET_COLORS = [
  '#22d3ee', // Cyan
  '#38bdf8', // Sky
  '#ec4899', // Pink / Magenta
  '#f59e0b', // Amber
  '#a855f7', // Purple
  '#10b981', // Emerald
  '#ef4444', // Red
  '#6366f1', // Indigo
]

export function StagesManagerDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { pipelineStages, addStage, updateStage, deleteStage } = useAppStore()

  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [editName, setEditName] = React.useState('')
  const [editColor, setEditColor] = React.useState('#22d3ee')

  // Novo estágio
  const [isAdding, setIsAdding] = React.useState(false)
  const [newName, setNewName] = React.useState('')
  const [newColor, setNewColor] = React.useState('#ec4899')
  const [isSaving, setIsSaving] = React.useState(false)

  const handleStartEdit = (stage: PipelineStage) => {
    setEditingId(stage.id)
    setEditName(stage.name)
    setEditColor(stage.color)
  }

  const handleSaveEdit = async (id: string) => {
    if (!editName.trim()) {
      toast.error('O nome do estágio não pode ser vazio')
      return
    }

    setIsSaving(true)
    const updated = await updateStage({ id, name: editName.trim(), color: editColor })
    setIsSaving(false)

    if (updated) {
      toast.success('Estágio atualizado com sucesso!')
      setEditingId(null)
    } else {
      toast.error('Erro ao salvar alterações no estágio')
    }
  }

  const handleCreateStage = async () => {
    if (!newName.trim()) {
      toast.error('Informe o nome do novo estágio')
      return
    }

    setIsSaving(true)
    const stageId = newName.trim().toLowerCase().replace(/[^a-z0-9]/g, '_')
    const created = await addStage({
      id: stageId,
      name: newName.trim(),
      color: newColor,
    })
    setIsSaving(false)

    if (created) {
      toast.success(`Estágio "${created.name}" criado com sucesso!`)
      setNewName('')
      setIsAdding(false)
    } else {
      toast.error('Erro ao criar estágio no banco de dados')
    }
  }

  const handleDeleteStage = async (id: string, name: string) => {
    if (pipelineStages.length <= 2) {
      toast.error('O pipeline precisa ter no mínimo 2 estágios')
      return
    }

    if (!confirm(`Tem certeza que deseja excluir o estágio "${name}"?`)) {
      return
    }

    const res = await deleteStage(id)
    if (res.success) {
      toast.success(`Estágio "${name}" removido com sucesso!`)
    } else {
      toast.error(res.error || 'Erro ao excluir estágio')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl bg-zinc-900 border-zinc-800 text-zinc-100 max-h-[85vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Sliders className="h-5 w-5 text-pink-400" />
            <DialogTitle className="text-lg font-bold">Personalizar Estágios do Pipeline</DialogTitle>
          </div>
          <DialogDescription className="text-xs text-zinc-400">
            Adicione, renomeie, mude as cores ou remova estágios do seu funil comercial. Todas as alterações são salvas diretamente no Supabase.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1">
          {pipelineStages.map((stage, idx) => {
            const isEditing = editingId === stage.id

            if (isEditing) {
              return (
                <div key={stage.id} className="p-3 rounded-lg border border-pink-500/50 bg-zinc-950 space-y-3">
                  <div className="flex items-center gap-2">
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Nome do estágio"
                      className="bg-zinc-900 border-zinc-700 text-sm h-8"
                      autoFocus
                    />
                    <Button
                      size="sm"
                      onClick={() => handleSaveEdit(stage.id)}
                      disabled={isSaving}
                      className="bg-pink-600 hover:bg-pink-500 h-8 px-3"
                    >
                      <Check className="h-3.5 w-3.5 mr-1" /> Salvar
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingId(null)}
                      className="h-8 px-2 text-zinc-400"
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  {/* Color Selector */}
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[11px] text-zinc-400">Cor do Estágio:</span>
                    <div className="flex items-center gap-1.5">
                      {PRESET_COLORS.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setEditColor(c)}
                          className={`h-5 w-5 rounded-full transition-transform ${
                            editColor === c ? 'scale-125 ring-2 ring-white' : 'opacity-70 hover:opacity-100'
                          }`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )
            }

            return (
              <div
                key={stage.id}
                className="flex items-center justify-between p-3 rounded-lg border border-zinc-800 bg-zinc-950/60 hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center font-mono-code text-xs text-zinc-500 w-4">
                    {idx + 1}
                  </div>
                  <div
                    className="h-3 w-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: stage.color }}
                  />
                  <div>
                    <span className="text-sm font-medium text-zinc-200">{stage.name}</span>
                    <span className="ml-2 text-[10px] font-mono-code text-zinc-500">({stage.id})</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleStartEdit(stage)}
                    className="h-7 w-7 p-0 text-zinc-400 hover:text-zinc-200"
                    title="Editar nome ou cor"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteStage(stage.id, stage.name)}
                    className="h-7 w-7 p-0 text-zinc-500 hover:text-red-400"
                    title="Excluir estágio"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )
          })}

          {/* Form de Criação de Novo Estágio */}
          {isAdding ? (
            <div className="p-3 rounded-lg border border-cyan-500/50 bg-zinc-950 space-y-3">
              <span className="text-xs font-semibold text-cyan-400">Criar Novo Estágio</span>
              <div className="flex items-center gap-2">
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ex: Comprou Pack Extra, Upsell Vídeo..."
                  className="bg-zinc-900 border-zinc-700 text-sm h-8"
                  autoFocus
                />
                <Button
                  size="sm"
                  onClick={handleCreateStage}
                  disabled={isSaving}
                  className="bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold h-8 px-3"
                >
                  <Check className="h-3.5 w-3.5 mr-1" /> Criar
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsAdding(false)}
                  className="h-8 px-2 text-zinc-400"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>

              {/* Color Selector */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] text-zinc-400">Cor:</span>
                <div className="flex items-center gap-1.5">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setNewColor(c)}
                      className={`h-5 w-5 rounded-full transition-transform ${
                        newColor === c ? 'scale-125 ring-2 ring-white' : 'opacity-70 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAdding(true)}
              className="w-full border-dashed border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-500 h-9"
            >
              <Plus className="h-4 w-4 mr-1.5 text-pink-400" />
              <span>Adicionar Novo Estágio ao Pipeline</span>
            </Button>
          )}
        </div>

        <DialogFooter className="border-t border-zinc-800 pt-3">
          <Button
            size="sm"
            onClick={() => onOpenChange(false)}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs"
          >
            Concluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
