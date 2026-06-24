import type { ReactNode } from 'react'
import { Providers } from './providers'

export const metadata = {
  title: 'Web',
  description: 'Shared web and native app.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
