'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  KanbanSquare, 
  MessageSquare, 
  Megaphone, 
  Zap, 
  BarChart3, 
  Settings,
  Bot,
  X,
  Radio
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/lib/store'
import { Badge } from '@/components/ui/badge'

const navItems = [
  { name: 'Visão Geral', href: '/', icon: LayoutDashboard },
  { name: 'Leads', href: '/leads', icon: Users, badge: '5' },
  { name: 'Pipeline', href: '/pipeline', icon: KanbanSquare },
  { name: 'Inbox Telegram', href: '/inbox', icon: MessageSquare, badge: '2', isLive: true },
  { name: 'Campanhas', href: '/campanhas', icon: Megaphone },
  { name: 'Automações', href: '/automacoes', icon: Zap },
  { name: 'Relatórios', href: '/relatorios', icon: BarChart3 },
  { name: 'Configurações', href: '/configuracoes', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { isSidebarOpen, setSidebarOpen } = useAppStore()

  const sidebarContent = (
    <div className="flex flex-col h-full bg-zinc-950 border-r border-zinc-800/80">
      {/* Brand logo & status */}
      <div className="flex h-16 items-center justify-between px-5 border-b border-zinc-800/80">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-7 w-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight text-zinc-100">LeadGram</span>
              <span className="text-[10px] font-mono-code px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">CRM</span>
            </div>
            <p className="text-[10px] text-zinc-400">Telegram & Ads Engine</p>
          </div>
        </Link>

        {/* Mobile close button */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="md:hidden p-1.5 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60"
          aria-label="Fechar menu lateral"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" aria-label="Navegação Principal">
        <div className="px-3 pb-2 text-[10px] uppercase font-semibold text-zinc-400 tracking-wider">
          Comercial & Operação
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "group flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500",
                isActive
                  ? "bg-zinc-900 text-cyan-400 border border-cyan-500/20 shadow-xs shadow-cyan-950/40"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60"
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "h-4 w-4 transition-colors",
                    isActive ? "text-cyan-400" : "text-zinc-400 group-hover:text-zinc-300"
                  )}
                />
                <span>{item.name}</span>
              </div>

              <div className="flex items-center gap-1.5">
                {item.isLive && (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                  </span>
                )}
                {item.badge && (
                  <span className={cn(
                    "px-1.5 py-0.5 rounded text-[10px] font-mono-code leading-none",
                    isActive ? "bg-cyan-500/20 text-cyan-300" : "bg-zinc-800 text-zinc-400"
                  )}>
                    {item.badge}
                  </span>
                )}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Telegram Bot System status footer */}
      <div className="p-3 border-t border-zinc-800/80 bg-zinc-950/60">
        <div className="rounded-lg p-2.5 border border-zinc-800/80 bg-zinc-900/40 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Radio className="h-3 w-3 text-emerald-400 animate-pulse" />
              <span className="text-[11px] font-medium text-zinc-300">Bot Webhook</span>
            </div>
            <span className="text-[10px] font-mono-code text-emerald-400 bg-emerald-950/50 px-1 rounded border border-emerald-800/40">ONLINE</span>
          </div>
          <p className="text-[10px] text-zinc-400 font-mono-code truncate">
            @growthscale_lead_bot
          </p>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop fixed sidebar 260px */}
      <aside className="hidden md:flex w-[260px] flex-col fixed inset-y-0 left-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-xs md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer Sheet */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[260px] transition-transform duration-200 ease-in-out md:hidden",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label="Menu de Navegação Mobile"
      >
        {sidebarContent}
      </aside>
    </>
  )
}
