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
  Radio, 
  Sparkles,
  X,
  Webhook
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/lib/store'
import { Badge } from '@/components/ui/badge'

export function Sidebar() {
  const pathname = usePathname()
  const { isSidebarOpen, setSidebarOpen, leads, bots } = useAppStore()

  const navItems = [
    { name: 'Visão Geral', href: '/', icon: LayoutDashboard },
    { 
      name: 'Contatos & Leads', 
      href: '/leads', 
      icon: Users, 
      badge: leads.length > 0 ? String(leads.length) : undefined 
    },
    { name: 'Pipeline VIP', href: '/pipeline', icon: KanbanSquare },
    { name: 'Inbox Telegram', href: '/inbox', icon: MessageSquare, isLive: true },
    { name: 'Automações & Fluxos', href: '/automacoes', icon: Zap },
    { name: 'Campanhas & UTMs', href: '/campanhas', icon: Megaphone },
    { 
      name: 'Bots Telegram', 
      href: '/bots', 
      icon: Bot, 
      badge: bots.length > 0 ? String(bots.length) : '0' 
    },
    { name: 'Webhooks & Logs', href: '/webhooks', icon: Webhook },
    { name: 'Relatórios BI', href: '/relatorios', icon: BarChart3 },
    { name: 'Configurações', href: '/configuracoes', icon: Settings },
  ]

  const sidebarContent = (
    <div className="flex flex-col h-full bg-zinc-950 border-r border-zinc-800/80">
      {/* Brand logo & status */}
      <div className="flex h-16 items-center justify-between px-5 border-b border-zinc-800/80">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-7 w-7 rounded-lg bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 group-hover:bg-pink-500/20 transition-colors">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight text-zinc-100">LeadGram</span>
              <span className="text-[10px] font-mono-code px-1.5 py-0.2 rounded bg-pink-500/10 text-pink-400 border border-pink-500/20">VIP</span>
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
                "group flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-pink-500",
                isActive
                  ? "bg-zinc-900 text-pink-400 border border-pink-500/20 shadow-xs shadow-pink-950/40"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60"
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "h-4 w-4 transition-colors",
                    isActive ? "text-pink-400" : "text-zinc-400 group-hover:text-zinc-300"
                  )}
                />
                <span>{item.name}</span>
              </div>

              <div className="flex items-center gap-1.5">
                {item.isLive && (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
                  </span>
                )}
                {item.badge && (
                  <span className={cn(
                    "px-1.5 py-0.5 rounded text-[10px] font-mono-code leading-none",
                    isActive ? "bg-pink-500/20 text-pink-300" : "bg-zinc-800 text-zinc-400"
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
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-zinc-300">Status dos Bots</span>
            {bots.length > 0 ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono-code text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {bots.length} Conectado(s)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono-code text-zinc-500">
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-600" />
                0 Conectados
              </span>
            )}
          </div>
          <div className="text-[10px] text-zinc-400">
            {bots.length > 0 ? (
              <span>Webhooks ativos na Vercel</span>
            ) : (
              <Link href="/bots" className="text-pink-400 hover:text-pink-300 underline">
                Conectar token no BotFather →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside className="hidden md:flex md:w-[260px] md:flex-col md:fixed md:inset-y-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-zinc-950/80 backdrop-blur-xs md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sliding Drawer */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[260px] transform transition-transform duration-300 ease-in-out md:hidden",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </div>
    </>
  )
}
