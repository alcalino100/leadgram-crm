'use client'

import * as React from 'react'
import { Users, Edit3, Shield, Mail, Check, Crown, UserCheck } from 'lucide-react'
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
import { User, Role } from '@/types'

export function TeamManager() {
  const { users, leads, updateUser } = useAppStore()

  const [editingUser, setEditingUser] = React.useState<User | null>(null)
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [role, setRole] = React.useState<Role>('agent')
  const [avatarUrl, setAvatarUrl] = React.useState('')
  const [isSaving, setIsSaving] = React.useState(false)

  const handleOpenEdit = (user: User) => {
    setEditingUser(user)
    setName(user.name)
    setEmail(user.email)
    setRole(user.role || 'agent')
    setAvatarUrl(user.avatar_url || '')
  }

  const handleSave = async () => {
    if (!editingUser) return
    if (!name.trim() || !email.trim()) {
      toast.error('Nome e e-mail são obrigatórios')
      return
    }

    setIsSaving(true)
    const updated = await updateUser({
      id: editingUser.id,
      name: name.trim(),
      email: email.trim(),
      role,
      avatar_url: avatarUrl.trim() || undefined,
    })
    setIsSaving(false)

    if (updated) {
      toast.success(`Informações de "${updated.name}" salvas no Supabase com sucesso!`)
      setEditingUser(null)
    } else {
      toast.error('Erro ao salvar usuário no banco de dados')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
            <Users className="h-4 w-4 text-pink-400" />
            <span>Membros da Equipe ({users.length} Usuários)</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Gerencie os acessos, nomes e permissões dos operadores do CRM comercial.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {users.map((user) => {
          const isOwner = user.role === 'owner' || user.role === 'admin'
          const assignedCount = leads.filter((l) => l.assigned_to === user.id).length

          return (
            <div
              key={user.id}
              className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-pink-500/10 border border-pink-500/30 flex items-center justify-center font-bold text-sm text-pink-400">
                    {user.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-zinc-100">{user.name}</span>
                      {isOwner && (
                        <Badge className="bg-pink-500/10 text-pink-400 border-pink-500/30 text-[9px] px-1 py-0 h-4">
                          <Crown className="h-2.5 w-2.5 mr-0.5" /> Administrador
                        </Badge>
                      )}
                      {!isOwner && (
                        <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 text-zinc-400">
                          Atendente VIP
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5">
                      <Mail className="h-3 w-3 text-zinc-500" />
                      {user.email}
                    </span>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleOpenEdit(user)}
                  className="h-7 text-xs border-zinc-700 bg-zinc-900 text-zinc-200 hover:text-white"
                >
                  <Edit3 className="h-3 w-3 mr-1 text-pink-400" />
                  <span>Editar</span>
                </Button>
              </div>

              <div className="pt-3 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-500">
                <span>Leads sob responsabilidade:</span>
                <span className="font-mono-code font-bold text-zinc-300">{assignedCount} lead(s)</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal de Edição de Usuário */}
      <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
        <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800 text-zinc-100">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Editar Dados do Usuário</DialogTitle>
            <DialogDescription className="text-xs text-zinc-400">
              Altere o nome exibido, e-mail de contato e cargo de permissão.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">Nome Completo</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Guilherme Garcia"
                className="bg-zinc-950 border-zinc-700 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">E-mail</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ex: gui@leadgram.com"
                className="bg-zinc-950 border-zinc-700 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">Cargo / Função</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="w-full h-9 rounded-md bg-zinc-950 border border-zinc-700 text-xs text-zinc-200 px-3 focus:outline-none focus:ring-1 focus:ring-pink-500"
              >
                <option value="owner">Proprietário / Administrador Geral</option>
                <option value="agent">Operador Comercial / Atendente VIP</option>
              </select>
            </div>
          </div>

          <DialogFooter className="border-t border-zinc-800 pt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditingUser(null)}
              className="text-xs text-zinc-400"
            >
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="bg-pink-600 hover:bg-pink-500 text-white font-semibold text-xs"
            >
              <Check className="h-3.5 w-3.5 mr-1" />
              <span>{isSaving ? 'Salvando...' : 'Salvar Alterações'}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
