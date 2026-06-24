import { useLink } from 'solito/link'
import { YStack, XStack, H1, Paragraph, Button, EnvBadge } from '@PROJECT_SLUG_PLACEHOLDER/ui'

/**
 * One screen rendered on both web and native. Navigation is shared through
 * Solito: useLink builds a prop set that maps to a Next.js Link on web and a
 * React Navigation / expo-router push on native.
 */
export function HomeScreen() {
  const aboutLink = useLink({ href: '/about' })

  return (
    <YStack flex={1} justifyContent="center" alignItems="center" padding="$6" gap="$4">
      <XStack position="absolute" top="$4" right="$4">
        <EnvBadge />
      </XStack>
      <H1 textAlign="center">Welcome</H1>
      <Paragraph textAlign="center" maxWidth={420} opacity={0.8}>
        This screen is shared by the web and native apps. Edit it once in
        packages/app and both surfaces update.
      </Paragraph>
      <Button {...aboutLink}>Learn more</Button>
    </YStack>
  )
}
