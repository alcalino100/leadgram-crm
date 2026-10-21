'use client'

import * as React from 'react'
import { Sparkles, ArrowLeft, Clock } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

interface PagePlaceholderProps {
  title: string
  description: string
  promptStep: string
  features: string[]
}

export function PagePlaceholder({
  title,
  description,
  promptStep,
  features,
}: PagePlaceholderProps) {
  const [isSimulatingLoad, setIsSimulatingLoad] = React.useState(true)

  React.useEffect(() => {
    const timer = setTimeout(() => setIsSimulatingLoad(false), 400)
    return () => clearTimeout(timer)
  }, [])

  if (isSimulatingLoad) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
        </div>
        <Skeleton className="h-72 rounded-xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono-code uppercase px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            {promptStep}
          </span>
          <span className="text-xs text-zinc-400 flex items-center gap-1">
            <Clock className="h-3 w-3" /> Em desenvolvimento sequencial
          </span>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-zinc-100 mt-2">{title}</h1>
        <p className="text-xs text-zinc-400 mt-1 max-w-2xl">{description}</p>
      </div>

      {/* Feature Preview Card */}
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-xs">
        <div className="flex items-center gap-2 text-cyan-400 mb-4">
          <Sparkles className="h-4 w-4" />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Funcionalidades planejadas nesta fase:
          </span>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {features.map((feature, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2 text-xs text-zinc-300 p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/60"
            >
              <span className="text-cyan-400 font-mono-code font-bold">0{idx + 1}.</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3 pt-4 border-t border-zinc-800">
          <Button asChild variant="outline" size="sm">
            <Link href="/" className="flex items-center gap-1.5">
              <ArrowLeft className="h-3.5 w-3.5" />
              Voltar à Visão Geral
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
