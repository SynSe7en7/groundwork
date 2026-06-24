import { useState } from 'react';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, H2, Input, Paragraph, YStack } from 'tamagui';

import { supabase } from '../../src/lib/supabase';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSignIn() {
    setBusy(true);
    setStatus(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      setStatus(error.message);
      return;
    }
    router.replace('/');
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack flex={1} padding="$6" gap="$4" justifyContent="center">
        <H2>Sign in</H2>
        <Input
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          autoCapitalize="none"
          keyboardType="email-address"
          inputMode="email"
        />
        <Input
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
        />
        <Button disabled={busy} onPress={onSignIn}>
          {busy ? 'Signing in...' : 'Sign in'}
        </Button>
        {status ? <Paragraph color="$red10">{status}</Paragraph> : null}
      </YStack>
    </SafeAreaView>
  );
}
