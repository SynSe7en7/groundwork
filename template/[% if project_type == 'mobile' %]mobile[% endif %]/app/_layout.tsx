import { useColorScheme } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TamaguiProvider } from 'tamagui';

import tamaguiConfig from '../tamagui.config';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme ?? 'light'}>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)/sign-in" options={{ presentation: 'modal' }} />
        </Stack>
      </SafeAreaProvider>
    </TamaguiProvider>
  );
}
