import { Stack } from 'expo-router'
import { UIProvider } from '@PROJECT_SLUG_PLACEHOLDER/ui'

export default function RootLayout() {
  return (
    <UIProvider defaultTheme="light">
      <Stack screenOptions={{ headerShown: false }} />
    </UIProvider>
  )
}
