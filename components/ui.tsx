import { ReactNode } from 'react';
import {
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import { useColorScheme } from '@/components/useColorScheme';
import { brand, colors, fonts, Palette } from '@/lib/theme';

export function usePalette(): Palette {
  return colors[useColorScheme()];
}

export function Logo({ size = 20 }: { size?: number }) {
  return (
    <View style={[s.logo, { paddingHorizontal: size * 0.55, paddingVertical: size * 0.28 }]} accessibilityLabel="RSF Athlete">
      <Text style={{ fontFamily: fonts.wordmark, fontSize: size, color: brand.offWhite, letterSpacing: size * 0.12 }}>RSF</Text>
      <Text style={{ fontFamily: fonts.accent, fontSize: size * 0.62, color: brand.offWhite, marginLeft: size * 0.5 }}>/Athlete</Text>
    </View>
  );
}

export function Screen({ children, scroll = true }: { children: ReactNode; scroll?: boolean }) {
  const p = usePalette();
  if (!scroll) return <View style={{ flex: 1, backgroundColor: p.bg, padding: 16 }}>{children}</View>;
  return (
    <ScrollView style={{ flex: 1, backgroundColor: p.bg }} contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
      {children}
    </ScrollView>
  );
}

export function T({ children, style, kind = 'body' }: { children: ReactNode; style?: StyleProp<TextStyle>; kind?: 'body' | 'mute' | 'strong' | 'h' | 'kicker' | 'label' }) {
  const p = usePalette();
  const styles: Record<string, TextStyle> = {
    body: { fontFamily: fonts.body, fontSize: 16, color: p.ink, lineHeight: 22 },
    mute: { fontFamily: fonts.body, fontSize: 14, color: p.mute, lineHeight: 20 },
    strong: { fontFamily: fonts.bodyMedium, fontSize: 16, color: p.ink },
    h: { fontFamily: fonts.mono, fontSize: 24, color: p.ink, textTransform: 'uppercase', letterSpacing: -0.5 },
    kicker: { fontFamily: fonts.accent, fontSize: 13, color: p.ink, textTransform: 'uppercase' },
    label: { fontFamily: fonts.mono, fontSize: 12, color: p.ink, textTransform: 'uppercase', letterSpacing: 0.5 },
  };
  return <Text style={[styles[kind], style]}>{children}</Text>;
}

export function Section({ title }: { title: string }) {
  return (
    <T kind="label" style={{ marginTop: 20, marginBottom: 8 }}>
      <Text style={{ color: brand.blue }}>{'>> '}</Text>
      {title}
    </T>
  );
}

export function Card({ children, style, onPress }: { children: ReactNode; style?: StyleProp<ViewStyle>; onPress?: () => void }) {
  const p = usePalette();
  const box = [s.card, { backgroundColor: p.card, borderColor: p.line }, style];
  if (!onPress) return <View style={box}>{children}</View>;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [box, pressed && { opacity: 0.7 }]} accessibilityRole="button">
      {children}
    </Pressable>
  );
}

export function Hero({ kicker, title, children }: { kicker?: string; title: string; children?: ReactNode }) {
  return (
    <View style={s.hero}>
      <Text style={s.asterisk} accessible={false}>✱</Text>
      {kicker ? <T kind="kicker" style={{ color: brand.black, marginBottom: 8 }}>{kicker}</T> : null}
      <Text style={s.heroTitle}>{title}</Text>
      {children}
    </View>
  );
}

export function Bar({ pct, onBlue }: { pct: number; onBlue?: boolean }) {
  return (
    <View style={[s.bar, { backgroundColor: onBlue ? 'rgba(33,33,32,0.22)' : 'rgba(127,127,127,0.22)' }]}>
      <View style={{ width: `${Math.max(0, Math.min(100, pct))}%`, height: '100%', backgroundColor: onBlue ? brand.black : brand.volt }} />
    </View>
  );
}

export function Button({ title, onPress, variant = 'solid', style, disabled }: { title: string; onPress: () => void; variant?: 'solid' | 'ghost' | 'volt'; style?: StyleProp<ViewStyle>; disabled?: boolean }) {
  const p = usePalette();
  const bg = variant === 'solid' ? brand.black : variant === 'volt' ? brand.volt : 'transparent';
  const fg = variant === 'solid' ? brand.offWhite : variant === 'volt' ? brand.black : p.ink;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => [s.btn, { backgroundColor: bg, borderColor: variant === 'ghost' ? p.ink : bg, opacity: disabled ? 0.5 : pressed ? 0.8 : 1 }, style]}>
      <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 16, color: fg }}>{title}</Text>
    </Pressable>
  );
}

export function Chip({ label, tone = 'plain' }: { label: string; tone?: 'plain' | 'done' | 'new' }) {
  const p = usePalette();
  const bg = tone === 'done' ? brand.volt : tone === 'new' ? brand.orange : p.line;
  const fg = tone === 'done' ? brand.black : tone === 'new' ? brand.white : p.ink;
  return <Text style={[s.chip, { backgroundColor: bg, color: fg }]}>{label}</Text>;
}

export function NumBox({ children, done }: { children: ReactNode; done?: boolean }) {
  return (
    <View style={[s.num, { backgroundColor: done ? brand.volt : brand.blue }]}>
      {typeof children === 'string' || typeof children === 'number' ? <Text style={s.numText}>{children}</Text> : children}
    </View>
  );
}

export function Input(props: TextInputProps) {
  const p = usePalette();
  return (
    <TextInput
      placeholderTextColor={p.mute}
      {...props}
      style={[s.input, { borderColor: p.line, backgroundColor: p.card, color: p.ink }, props.multiline && { minHeight: 80, paddingTop: 10, textAlignVertical: 'top' }, props.style]}
    />
  );
}

export function Row({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 12 }, style]}>{children}</View>;
}

export function Segmented<K extends string>({ options, value, onChange }: { options: [K, string][]; value: K; onChange: (k: K) => void }) {
  const p = usePalette();
  return (
    <View style={[s.seg, { borderColor: p.ink }]}>
      {options.map(([k, label]) => (
        <Pressable key={k} onPress={() => onChange(k)} style={[s.segBtn, value === k && { backgroundColor: p.ink }]} accessibilityRole="tab" accessibilityState={{ selected: value === k }}>
          <Text style={{ fontFamily: fonts.mono, fontSize: 12, textTransform: 'uppercase', color: value === k ? p.bg : p.mute }}>{label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  logo: { flexDirection: 'row', alignItems: 'baseline', backgroundColor: brand.black, alignSelf: 'flex-start' },
  card: { borderWidth: 1, borderRadius: 4, padding: 14, marginBottom: 10 },
  hero: { backgroundColor: brand.blue, padding: 18, marginBottom: 14, overflow: 'hidden' },
  heroTitle: { fontFamily: fonts.monoBold, fontSize: 26, lineHeight: 28, color: brand.black, textTransform: 'uppercase', maxWidth: '80%' },
  asterisk: { position: 'absolute', right: -4, top: -20, fontSize: 110, color: brand.volt, fontFamily: fonts.wordmark },
  bar: { height: 10, overflow: 'hidden' },
  btn: { minHeight: 44, paddingHorizontal: 16, justifyContent: 'center', alignItems: 'center', borderRadius: 2, borderWidth: 1 },
  chip: { fontFamily: fonts.mono, fontSize: 11, textTransform: 'uppercase', paddingHorizontal: 8, paddingVertical: 3, overflow: 'hidden' },
  num: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  numText: { fontFamily: fonts.monoBold, fontSize: 18, color: brand.black },
  input: { minHeight: 44, borderWidth: 1, borderRadius: 2, paddingHorizontal: 12, fontSize: 16, fontFamily: fonts.body, flex: 1 },
  seg: { flexDirection: 'row', borderWidth: 1, padding: 3, gap: 3, marginBottom: 12 },
  segBtn: { flex: 1, minHeight: 38, alignItems: 'center', justifyContent: 'center' },
});
