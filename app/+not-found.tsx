import { Link, Stack } from 'expo-router';

import { Screen, T } from '@/components/ui';

export default function NotFoundScreen() {
  return (
    <Screen>
      <Stack.Screen options={{ title: 'Not found' }} />
      <T kind="h" style={{ marginBottom: 12 }}>Page not found _</T>
      <Link href="/">
        <T kind="strong">Go to home</T>
      </Link>
    </Screen>
  );
}
