import { Text, View } from 'tamagui'

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

  // Padding, radius, and background are view style props, so they belong on the
  // containing View; the Text carries only text style props. These use Tamagui's
  // configured shorthands (px/py/rounded/bg), which the v4 config requires.
  return (
    <View
      px="$2"
      py="$1"
      rounded="$3"
      bg={isProd ? '$green10' : '$yellow8'}
    >
      <Text
        fontSize={11}
        fontWeight="700"
        letterSpacing={1}
        textTransform="uppercase"
        color={isProd ? '$color1' : '$color12'}
      >
        {env}
      </Text>
    </View>
  )
}
