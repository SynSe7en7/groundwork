import type { ReactNode } from 'react'
import { TamaguiProvider, Theme } from 'tamagui'
import config from './tamagui.config'

export { config }
export * from './env-badge'

// Re-export the Tamagui primitives the app layer uses so screens import from a
// single design-system entry point rather than reaching into tamagui directly.
export {
  YStack,
  XStack,
  H1,
  H2,
  Paragraph,
  Button,
  Text,
  Theme,
} from 'tamagui'

export function UIProvider({
  children,
  defaultTheme = 'light',
}: {
  children: ReactNode
  defaultTheme?: 'light' | 'dark'
}) {
  return (
    <TamaguiProvider config={config} defaultTheme={defaultTheme}>
      {children}
    </TamaguiProvider>
  )
}
