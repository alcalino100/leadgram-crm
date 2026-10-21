'use client'

import * as React from 'react'
import { 
  Menu, 
  Search, 
  Bell, 
  Command, 
  UserCheck, 
  LogOut, 
  ShieldCheck, 
  ExternalLink 
} from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { OrgSwitcher } from '@/components/shell/org-switcher'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'

export function Header() {
  const { toggleSidebar, currentUser } = useAppStore()
  const router = useRouter()
  const [searchOpen, setSearchOpen] = React.useState(false)
  const [notificationsOpen, setNotificationsOpen] = React.useState(false)

  // Keyboard shortcut Cmd+K / Ctrl+K
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <header className="fixed top-0 right-0 left-0 md:left-[260px] h-16 z-20 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80 px-4 flex items-center justify-between">
      {/* Left side: Mobile menu button + Organization Switcher */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="md:hidden p-2 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500"
          aria-label="Abrir menu de navegação"
        >
          <Menu className="h-4 w-4" />
        </button>

        <OrgSwitcher />
      </div>

      {/* Middle/Right: Quick Search button */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => setSearchOpen(true)}
          className="hidden sm:flex items-center gap-2 h-8 px-3 rounded-lg border border-zinc-800/80 bg-zinc-900/60 hover:bg-zinc-800/60 text-zinc-400 hover:text-zinc-200 text-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500 w-44 md:w-64"
          aria-label="Buscar leads, conversas ou UTMs"
        >
          <Search className="h-3.5 w-3.5 text-zinc-400" />
          <span className="flex-1 text-left truncate">Buscar leads, UTMs...</span>
          <kbd className="hidden lg:inline-flex h-4 select-none items-center gap-1 rounded bg-zinc-800 px-1.5 font-mono text-[9px] font-medium text-zinc-400 border border-zinc-700">
            <Command className="h-2.5 w-2.5" /> K
          </kbd>
        </button>

        {/* Notifications Dropdown with amber-500 alert badge */}
        <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
          <DropdownMenuTrigger
            className="relative p-2 rounded-lg border border-zinc-800/80 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500"
            aria-label="Ver notificações do sistema"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-zinc-950" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-2">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <span className="text-xs font-semibold text-zinc-200">Alertas de Operação</span>
              <span className="text-[10px] font-mono-code text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                1 pendente
              </span>
            </div>
            <div className="py-2 space-y-2">
              <div className="p-2 rounded-md bg-amber-500/5 border border-amber-500/20 text-xs">
                <p className="font-medium text-amber-400">Lead aguardando resposta</p>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Rodrigo Albuquerque (@rodrigo_alpha) enviou mensagem há mais de 10 min.
                </p>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex items-center gap-2 p-1 pl-1.5 rounded-lg border border-zinc-800/80 bg-zinc-900/60 hover:bg-zinc-800 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500"
            aria-label="Menu do usuário"
          >
            <Avatar className="h-6 w-6">
              <AvatarImage src={currentUser?.avatar_url} alt={currentUser?.name || 'Usuário'} />
              <AvatarFallback>{currentUser?.name?.substring(0, 2).toUpperCase() || 'GS'}</AvatarFallback>
            </Avatar>
            <span className="hidden sm:inline-block text-xs font-medium text-zinc-200 pr-1">
              {currentUser?.name?.split(' ')[0]}
            </span>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-52">
            <div className="px-2 py-1.5">
              <p className="text-xs font-medium text-zinc-100">{currentUser?.name}</p>
              <p className="text-[10px] text-zinc-400 truncate">{currentUser?.email}</p>
              <div className="mt-1 flex items-center gap-1 text-[10px] text-cyan-400">
                <ShieldCheck className="h-3 w-3" />
                <span className="capitalize">{currentUser?.role || 'Administrador'}</span>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => router.push('/configuracoes')}
              className="text-xs text-zinc-300 hover:text-zinc-100 cursor-pointer flex items-center gap-2"
            >
              <UserCheck className="h-3.5 w-3.5" />
              <span>Configurações do Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push('/login')}
              className="text-xs text-rose-400 hover:text-rose-300 cursor-pointer flex items-center gap-2"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sair da conta</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Global Search Dialog Modal */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-zinc-950 border-zinc-800">
          <div className="flex items-center border-b border-zinc-800 px-3 py-2.5">
            <Search className="h-4 w-4 text-zinc-400 mr-2 shrink-0" />
            <input
              placeholder="Digite o nome do lead, @username Telegram, UTM ou telefone..."
              className="w-full bg-transparent text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
              autoFocus
            />
          </div>
          <div className="p-3 text-xs text-zinc-400 space-y-2">
            <p className="text-[10px] font-semibold uppercase text-zinc-400 px-1">Atalhos rápidos</p>
            <div 
              onClick={() => { setSearchOpen(false); router.push('/leads'); }}
              className="p-2 rounded-md hover:bg-zinc-900 cursor-pointer flex items-center justify-between text-zinc-300 hover:text-cyan-400"
            >
              <span>Ir para Leads</span>
              <kbd className="text-[10px] font-mono-code text-zinc-400">/leads</kbd>
            </div>
            <div 
              onClick={() => { setSearchOpen(false); router.push('/inbox'); }}
              className="p-2 rounded-md hover:bg-zinc-900 cursor-pointer flex items-center justify-between text-zinc-300 hover:text-cyan-400"
            >
              <span>Ir para Inbox Telegram</span>
              <kbd className="text-[10px] font-mono-code text-zinc-400">/inbox</kbd>
            </div>
            <div 
              onClick={() => { setSearchOpen(false); router.push('/campanhas'); }}
              className="p-2 rounded-md hover:bg-zinc-900 cursor-pointer flex items-center justify-between text-zinc-300 hover:text-cyan-400"
            >
              <span>Ir para Campanhas</span>
              <kbd className="text-[10px] font-mono-code text-zinc-400">/campanhas</kbd>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  )
}
