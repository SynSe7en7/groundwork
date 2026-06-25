import { Link } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DevelopBadge } from '../components/DevelopBadge';
import { runHeavyCompute } from '../src/lib/heavy-compute';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <DevelopBadge />
        <Text style={styles.h1}>Home</Text>
        <Text style={styles.body}>
          A starting screen wired to Supabase auth and a Modal compute seam.
        </Text>
        <Link href="/(auth)/sign-in" asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Sign in</Text>
          </Pressable>
        </Link>
        <Pressable
          style={[styles.button, styles.buttonSecondary]}
          onPress={async () => {
            // The device never holds the Modal secret; the call goes through a
            // Supabase Edge Function. When the seam is not configured it returns
            // ok: false with a message instead of throwing.
            const result = await runHeavyCompute({ sample: true });
            Alert.alert(
              'Heavy compute',
              result.ok ? 'Job accepted.' : (result.error ?? 'Request failed.'),
            );
          }}
        >
          <Text style={styles.buttonText}>Run heavy compute</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1, padding: 24, gap: 16, justifyContent: 'center' },
  h1: { fontSize: 28, fontWeight: '700' },
  body: { fontSize: 15, opacity: 0.8 },
  button: { backgroundColor: '#111', borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  buttonSecondary: { backgroundColor: '#2563eb' },
  buttonText: { color: '#fff', fontWeight: '600' },
});
