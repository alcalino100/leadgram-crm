'use client'

import { Toaster as Sonner } from 'sonner'

type ToasterProps = React.ComponentProps<typeof Sonner>

export function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-zinc-900 group-[.toaster]:text-zinc-100 group-[.toaster]:border-zinc-800 group-[.toaster]:shadow-xl group-[.toaster]:rounded-lg text-sm',
          description: 'group-[.toast]:text-zinc-400',
          actionButton:
            'group-[.toast]:bg-cyan-500 group-[.toast]:text-zinc-950 font-medium',
          cancelButton:
            'group-[.toast]:bg-zinc-800 group-[.toast]:text-zinc-400',
          error:
            'group-[.toast]:border-rose-900/50 group-[.toast]:bg-rose-950/40 group-[.toast]:text-rose-200',
          success:
            'group-[.toast]:border-emerald-900/50 group-[.toast]:bg-emerald-950/40 group-[.toast]:text-emerald-200',
        },
      }}
      {...props}
    />
  )
}
