import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { Button, Card, Input, Row, Screen, Segmented, T, usePalette } from '@/components/ui';
import { sampleSchedule } from '@/lib/data';
import { useStore } from '@/lib/store';
import { brand, fonts } from '@/lib/theme';

const types = ['Strength', 'Conditioning', 'Practice', 'Recovery'];

export default function Training() {
  const [view, setView] = useState<'schedule' | 'log'>('schedule');
  const { workouts, addWorkout } = useStore();
  const [type, setType] = useState(types[0]);
  const [detail, setDetail] = useState('');
  const [minutes, setMinutes] = useState('45');
  const p = usePalette();

  const save = () => {
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    addWorkout({ date: today, type, detail: detail.trim() || type, minutes: Number(minutes) || 0 });
    setDetail('');
  };

  return (
    <Screen>
      <Segmented options={[['schedule', 'Schedule'], ['log', 'Workout log']]} value={view} onChange={setView} />
      {view === 'schedule'
        ? sampleSchedule.map((e) => (
            <Card key={e.day + e.title}>
              <Row>
                <T style={{ fontFamily: fonts.monoBold, color: brand.blue, width: 56 }}>{e.day}</T>
                <View style={{ flex: 1 }}>
                  <T kind="strong">{e.title}</T>
                  <T kind="mute">{`${e.time} · ${e.place}`}</T>
                </View>
              </Row>
            </Card>
          ))
        : (
          <>
            <Card>
              <T kind="strong">Log a workout</T>
              <T kind="label" style={{ marginTop: 12, marginBottom: 6 }}>Type</T>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                {types.map((t) => (
                  <Pressable key={t} onPress={() => setType(t)} accessibilityRole="radio" accessibilityState={{ selected: type === t }}
                    style={{ borderWidth: 1, borderColor: p.ink, paddingHorizontal: 12, minHeight: 36, justifyContent: 'center', backgroundColor: type === t ? p.ink : 'transparent' }}>
                    <T kind="label" style={{ color: type === t ? p.bg : p.ink }}>{t}</T>
                  </Pressable>
                ))}
              </View>
              <T kind="label" style={{ marginBottom: 6 }}>What you did</T>
              <Row><Input value={detail} onChangeText={setDetail} placeholder="e.g. Squat 5x5" /></Row>
              <T kind="label" style={{ marginTop: 12, marginBottom: 6 }}>Minutes</T>
              <Row><Input value={minutes} onChangeText={setMinutes} keyboardType="number-pad" /></Row>
              <Button title="Save workout" onPress={save} style={{ marginTop: 12 }} />
            </Card>
            {workouts.map((w, i) => (
              <Card key={i}>
                <Row>
                  <T style={{ fontFamily: fonts.monoBold, color: brand.blue, width: 64 }}>{w.date}</T>
                  <View style={{ flex: 1 }}>
                    <T kind="strong">{w.type}</T>
                    <T kind="mute">{w.detail}</T>
                  </View>
                  <T kind="mute">{`${w.minutes} min`}</T>
                </Row>
              </Card>
            ))}
          </>
        )}
    </Screen>
  );
}
