import { Text } from 'tamagui'

// Reads the active environment label from whichever runtime is hosting the
// shared UI. Web sets NEXT_PUBLIC_APP_ENV; native sets EXPO_PUBLIC_APP_ENV.
function resolveAppEnv(): string {
  const env =
    process.env.NEXT_PUBLIC_APP_ENV ??
    process.env.EXPO_PUBLIC_APP_ENV ??
    'development'
  return env
}

export function EnvBadge() {
  const env = resolveAppEnv()
  const isProd = env === 'production'

  return (
    <Text
      fontSize={11}
      fontWeight="700"
      letterSpacing={1}
      textTransform="uppercase"
      paddingHorizontal="$2"
      paddingVertical="$1"
      borderRadius="$3"
      color={isProd ? '$color1' : '$color12'}
      backgroundColor={isProd ? '$green10' : '$yellow8'}
    >
      {env}
    </Text>
  )
}
