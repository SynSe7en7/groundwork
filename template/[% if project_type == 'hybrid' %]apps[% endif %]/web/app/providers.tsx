'use client'

import type { ReactNode } from 'react'
import { UIProvider } from '@PROJECT_SLUG_PLACEHOLDER/ui'

export function Providers({ children }: { children: ReactNode }) {
  return <UIProvider defaultTheme="light">{children}</UIProvider>
}
