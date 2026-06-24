import { defaultConfig } from '@tamagui/config/v4'
import { createTamagui } from 'tamagui'

// Base design-system config shared by web and native. Extend tokens, themes,
// and fonts here so both surfaces stay in lockstep.
export const config = createTamagui(defaultConfig)

export type AppConfig = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config
