import { Stack, useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { Button, Card, Chip, Input, Screen, T, usePalette } from '@/components/ui';
import { modules, videoUrl } from '@/lib/data';
import { useStore } from '@/lib/store';
import { brand, fonts } from '@/lib/theme';

export default function ModuleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const m = modules.find((x) => String(x.id) === id);
  const { progress, setProgress } = useStore();
  const [reflection, setReflection] = useState('');
  const p = usePalette();

  if (!m) return <Screen><T>Module not found.</T></Screen>;
  const done = (progress[m.id] ?? 0) >= 100;
  const soon = (what: string) => Alert.alert(`${what} coming soon`, 'This will be added once the files are uploaded.');

  return (
    <Screen>
      <Stack.Screen options={{ title: `Module ${m.id}` }} />
      <T kind="kicker" style={{ color: brand.blue }}>{`Week ${m.id} >>`}</T>
      <T kind="h" style={{ marginTop: 4 }}>{m.title}</T>
      <T kind="mute" style={{ marginTop: 4, marginBottom: 12 }}>{m.summary}</T>

      {/* TODO: once videos are on Vimeo, play inline with a WebView embed and mark progress on the player's "ended" event. */}
      <Pressable onPress={() => WebBrowser.openBrowserAsync(videoUrl(m))} style={s.video} accessibilityRole="button" accessibilityLabel={`Play ${m.title} video`}>
        <View style={s.play}><Text style={{ fontSize: 24, color: brand.black }}>▶</Text></View>
        <Text style={s.videoTag}>RSF / ATHLETE</Text>
      </Pressable>

      <View style={s.media}>
        <Tile label="Video" meta="Watch" onPress={() => WebBrowser.openBrowserAsync(videoUrl(m))} border={p.line} bg={p.card} />
        <Tile label="Podcast" meta="Soon" onPress={() => (m.podcastUrl ? WebBrowser.openBrowserAsync(m.podcastUrl) : soon('Podcast'))} border={p.line} bg={p.card} />
        <Tile label="PDF" meta="Workbook" onPress={() => (m.pdfUrl ? WebBrowser.openBrowserAsync(m.pdfUrl) : soon('PDF workbook'))} border={p.line} bg={p.card} />
      </View>

      <Card>
        <T kind="strong">Reflection</T>
        <T kind="mute" style={{ marginVertical: 6 }}>What is one thing from this module you will use this week?</T>
        <Input value={reflection} onChangeText={setReflection} multiline accessibilityLabel="Reflection" />
      </Card>

      {done ? <Chip label="Completed" tone="done" /> : <Button title="Mark module complete" onPress={() => setProgress(m.id, 100)} />}
    </Screen>
  );
}

function Tile({ label, meta, onPress, border, bg }: { label: string; meta: string; onPress: () => void; border: string; bg: string }) {
  return (
    <Pressable onPress={onPress} style={[s.tile, { borderColor: border, backgroundColor: bg }]} accessibilityRole="button">
      <T kind="strong" style={{ fontSize: 14 }}>{label}</T>
      <T kind="mute">{meta}</T>
    </Pressable>
  );
}

const s = StyleSheet.create({
  video: { aspectRatio: 16 / 9, backgroundColor: '#2c4a57', alignItems: 'center', justifyContent: 'center' },
  play: { width: 60, height: 60, borderRadius: 30, backgroundColor: brand.volt, alignItems: 'center', justifyContent: 'center' },
  videoTag: { position: 'absolute', left: 12, bottom: 10, fontFamily: fonts.mono, fontSize: 11, color: brand.volt },
  media: { flexDirection: 'row', gap: 8, marginVertical: 12 },
  tile: { flex: 1, borderWidth: 1, minHeight: 72, alignItems: 'center', justifyContent: 'center', gap: 4 },
});
