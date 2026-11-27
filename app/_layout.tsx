import { Archivo_300Light } from '@expo-google-fonts/archivo/300Light';
import { DMSans_300Light } from '@expo-google-fonts/dm-sans/300Light';
import { DMSans_400Regular } from '@expo-google-fonts/dm-sans/400Regular';
import { DMSans_500Medium } from '@expo-google-fonts/dm-sans/500Medium';
import { JetBrainsMono_500Medium } from '@expo-google-fonts/jetbrains-mono/500Medium';
import { JetBrainsMono_700Bold } from '@expo-google-fonts/jetbrains-mono/700Bold';
import { Poppins_800ExtraBold_Italic } from '@expo-google-fonts/poppins/800ExtraBold_Italic';
import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import { StoreProvider } from '@/lib/store';
import { brand, colors, fonts } from '@/lib/theme';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = { anchor: '(tabs)' };

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Archivo_300Light,
    DMSans_300Light,
    DMSans_400Regular,
    DMSans_500Medium,
    JetBrainsMono_500Medium,
    JetBrainsMono_700Bold,
    Poppins_800ExtraBold_Italic,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <StoreProvider>
      <RootNav />
    </StoreProvider>
  );
}

function RootNav() {
  const scheme = useColorScheme();
  const p = colors[scheme];
  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  const theme = { ...base, colors: { ...base.colors, primary: brand.blue, background: p.bg, card: p.bg, text: p.ink, border: p.line } };

  return (
    <ThemeProvider value={theme}>
      <Stack screenOptions={{ headerTitleStyle: { fontFamily: fonts.mono }, headerTintColor: p.ink, headerShadowVisible: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="module/[id]" options={{ title: 'Module' }} />
        <Stack.Screen name="profile" options={{ title: 'Profile' }} />
        <Stack.Screen name="toolkit" options={{ title: 'Coaches toolkit' }} />
      </Stack>
    </ThemeProvider>
  );
}
