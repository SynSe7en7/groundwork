import { Link } from 'expo-router';
import { Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, H1, Paragraph, YStack } from 'tamagui';

import { DevelopBadge } from '../components/DevelopBadge';
import { runHeavyCompute } from '../src/lib/heavy-compute';

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack flex={1} padding="$6" gap="$4" justifyContent="center">
        <DevelopBadge />
        <H1>Home</H1>
        <Paragraph color="$color11">
          A starting screen wired to Supabase auth and a Modal compute seam.
        </Paragraph>
        <Link href="/(auth)/sign-in" asChild>
          <Button>Sign in</Button>
        </Link>
        <Button
          theme="blue"
          onPress={async () => {
            // Example of the heavy-compute seam. The device never holds the
            // Modal secret; the call goes through a Supabase Edge Function.
            // When the seam is not configured it returns ok: false with a
            // message instead of throwing.
            const result = await runHeavyCompute({ sample: true });
            Alert.alert(
              'Heavy compute',
              result.ok ? 'Job accepted.' : (result.error ?? 'Request failed.'),
            );
          }}
        >
          Run heavy compute
        </Button>
      </YStack>
    </SafeAreaView>
  );
}
