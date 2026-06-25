import { defaultConfig } from '@tamagui/config/v4';
import { createTamagui } from 'tamagui';

export const tamaguiConfig = createTamagui(defaultConfig);

export default tamaguiConfig;

export type AppTamaguiConfig = typeof tamaguiConfig;

declare module 'tamagui' {
  // Gives every Tamagui component full type inference for our tokens and themes.
  interface TamaguiCustomConfig extends AppTamaguiConfig {}
}
