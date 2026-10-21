import * as React from 'react'
import { Sidebar } from '@/components/shell/sidebar'
import { Header } from '@/components/shell/header'
import { DataSyncInitializer } from '@/components/shell/data-sync-initializer'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <DataSyncInitializer />
      <Sidebar />
      <Header />
      <main className="flex-1 md:pl-[260px] pt-16 flex flex-col">
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
