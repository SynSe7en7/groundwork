import { SizableText, XStack } from 'tamagui';

import { env, isProd } from '../src/lib/env';

// Renders a small environment badge everywhere except production, so a build is
// never mistaken for prod during review or a demo.
export function DevelopBadge() {
  if (isProd) {
    return null;
  }

  return (
    <XStack
      alignSelf="flex-start"
      backgroundColor="$yellow4"
      borderColor="$yellow8"
      borderWidth={1}
      borderRadius="$10"
      paddingHorizontal="$3"
      paddingVertical="$1"
    >
      <SizableText size="$1" color="$yellow11" fontWeight="700">
        {env.appEnv.toUpperCase()}
      </SizableText>
    </XStack>
  );
}
