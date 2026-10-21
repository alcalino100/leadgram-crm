'use client'

import * as React from 'react'
import { Check, ChevronsUpDown, Building2, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/lib/store'
import { Skeleton } from '@/components/ui/skeleton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function OrgSwitcher() {
  const { currentOrganization, organizations, setCurrentOrganization, isLoadingOrg } = useAppStore()

  if (isLoadingOrg) {
    return (
      <div className="flex items-center gap-2 px-2 py-1.5 w-[200px]" aria-label="Carregando organização">
        <Skeleton className="h-6 w-6 rounded" />
        <div className="space-y-1">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-2 w-16" />
        </div>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg border border-zinc-800/80 bg-zinc-900/60 hover:bg-zinc-800/80 text-left transition-colors w-48 sm:w-56 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500"
        aria-label={`Organização atual: ${currentOrganization?.name || 'Selecione'}`}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 text-cyan-400 font-bold text-xs">
            {currentOrganization?.name.substring(0, 1) || 'G'}
          </div>
          <div className="truncate">
            <p className="text-xs font-medium text-zinc-100 truncate">{currentOrganization?.name}</p>
            <p className="text-[10px] text-zinc-400 font-mono-code uppercase tracking-wider">Agency Pro</p>
          </div>
        </div>
        <ChevronsUpDown className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-56">
        <div className="px-2 py-1.5 text-[10px] uppercase font-semibold text-zinc-400 tracking-wider">
          Organizações
        </div>
        {organizations.map((org) => {
          const isSelected = currentOrganization?.id === org.id
          return (
            <DropdownMenuItem
              key={org.id}
              onClick={() => setCurrentOrganization(org)}
              className="flex items-center justify-between py-2 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Building2 className="h-3.5 w-3.5 text-zinc-400" />
                <span className={cn("text-xs", isSelected ? "font-semibold text-cyan-400" : "text-zinc-200")}>
                  {org.name}
                </span>
              </div>
              {isSelected && <Check className="h-3.5 w-3.5 text-cyan-400" />}
            </DropdownMenuItem>
          )
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-xs text-zinc-400 hover:text-zinc-100 cursor-pointer flex items-center gap-2">
          <Plus className="h-3.5 w-3.5" />
          <span>Criar nova agência</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
