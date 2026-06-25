import { StyleSheet, Text, View } from 'react-native';

import { env, isProd } from '../src/lib/env';

// Renders a small environment badge everywhere except production, so a build is
// never mistaken for prod during review or a demo.
export function DevelopBadge() {
  if (isProd) {
    return null;
  }

  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{env.appEnv.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#fef9c3',
    borderColor: '#eab308',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  text: { color: '#854d0e', fontWeight: '700', fontSize: 12 },
});
