import { router } from 'expo-router';
import { View } from 'react-native';

import { Bar, Card, Chip, NumBox, Row, Screen, T } from '@/components/ui';
import { modules } from '@/lib/data';
import { useStore } from '@/lib/store';

export default function Modules() {
  const { progress, overallPct } = useStore();
  return (
    <Screen>
      <T kind="h" style={{ marginBottom: 12 }}>Modules _</T>
      <Card>
        <Row style={{ marginBottom: 8 }}>
          <T kind="strong" style={{ flex: 1 }}>Your progress</T>
          <T kind="mute">{`${overallPct}%`}</T>
        </Row>
        <Bar pct={overallPct} />
      </Card>
      {modules.map((m) => {
        const pct = progress[m.id] ?? 0;
        const done = pct >= 100;
        return (
          <Card key={m.id} onPress={() => router.push(`/module/${m.id}`)}>
            <Row>
              <NumBox done={done}>{done ? '✓' : String(m.id)}</NumBox>
              <View style={{ flex: 1 }}>
                <T kind="strong">{m.title}</T>
                <T kind="mute">{m.summary}</T>
              </View>
              {done ? <Chip label="Done" tone="done" /> : pct > 0 ? <Chip label={`${pct}%`} /> : null}
            </Row>
          </Card>
        );
      })}
    </Screen>
  );
}
