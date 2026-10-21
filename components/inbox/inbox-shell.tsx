'use client'

import * as React from 'react'
import { ConversationList } from '@/components/inbox/conversation-list'
import { ChatTimeline } from '@/components/inbox/chat-timeline'
import { LeadContextPanel } from '@/components/inbox/lead-context-panel'
import { LeadDrawer } from '@/components/leads/lead-drawer'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export function InboxShell() {
  const [mobileTab, setMobileTab] = React.useState<'conversations' | 'chat' | 'context'>('chat')
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 250)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-8rem)] rounded-xl border border-zinc-800 bg-zinc-950 flex overflow-hidden">
        <div className="w-80 border-r border-zinc-800 p-4 space-y-3">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
        <div className="flex-1 p-4 space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-48 w-2/3 ml-auto" />
          <Skeleton className="h-24 w-1/2 mr-auto" />
          <Skeleton className="h-32 w-2/3 ml-auto" />
        </div>
        <div className="hidden lg:block w-80 border-l border-zinc-800 p-4 space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] rounded-xl border border-zinc-800/80 bg-zinc-950 overflow-hidden shadow-2xl">
      {/* Mobile Sub-Navigation Bar (below lg breakpoint) */}
      <div className="flex lg:hidden border-b border-zinc-800 bg-zinc-900/60 p-1 text-xs">
        <button
          onClick={() => setMobileTab('conversations')}
          className={cn(
            "flex-1 py-1.5 rounded-md font-medium transition-colors text-center",
            mobileTab === 'conversations'
              ? "bg-zinc-800 text-cyan-400 font-semibold"
              : "text-zinc-400 hover:text-zinc-200"
          )}
        >
          Conversas
        </button>
        <button
          onClick={() => setMobileTab('chat')}
          className={cn(
            "flex-1 py-1.5 rounded-md font-medium transition-colors text-center",
            mobileTab === 'chat'
              ? "bg-zinc-800 text-cyan-400 font-semibold"
              : "text-zinc-400 hover:text-zinc-200"
          )}
        >
          Chat Telegram
        </button>
        <button
          onClick={() => setMobileTab('context')}
          className={cn(
            "flex-1 py-1.5 rounded-md font-medium transition-colors text-center",
            mobileTab === 'context'
              ? "bg-zinc-800 text-cyan-400 font-semibold"
              : "text-zinc-400 hover:text-zinc-200"
          )}
        >
          Contexto do Lead
        </button>
      </div>

      {/* 3-Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Coluna 1: Lista de Conversas (320px no desktop) */}
        <div
          className={cn(
            "w-full lg:w-80 h-full shrink-0",
            mobileTab === 'conversations' ? "flex" : "hidden lg:flex"
          )}
        >
          <ConversationList
            onSelectConversation={() => {
              setMobileTab('chat')
            }}
          />
        </div>

        {/* Coluna 2: Chat Timeline Principal */}
        <div
          className={cn(
            "flex-1 h-full min-w-0",
            mobileTab === 'chat' ? "flex flex-col" : "hidden lg:flex lg:flex-col"
          )}
        >
          <ChatTimeline onToggleContext={() => setMobileTab('context')} />
        </div>

        {/* Coluna 3: Painel de Contexto do Lead (320px no desktop) */}
        <div
          className={cn(
            "w-full lg:w-80 h-full shrink-0",
            mobileTab === 'context' ? "flex" : "hidden xl:flex"
          )}
        >
          <LeadContextPanel />
        </div>
      </div>

      <LeadDrawer />
    </div>
  )
}
