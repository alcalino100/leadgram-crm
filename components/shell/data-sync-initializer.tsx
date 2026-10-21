'use client'

import * as React from 'react'
import { useAppStore } from '@/lib/store'

export function DataSyncInitializer() {
  const fetchInitialData = useAppStore((state) => state.fetchInitialData)

  React.useEffect(() => {
    fetchInitialData()
  }, [fetchInitialData])

  return null
}
