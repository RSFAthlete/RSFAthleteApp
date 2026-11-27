import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Button, Card, Hero, Row, Screen, Section, Segmented, T } from '@/components/ui';
import { sampleSchedule } from '@/lib/data';
import { useStore } from '@/lib/store';
import { brand, fonts } from '@/lib/theme';
import { fmt, tenMinuteWorkout, workoutSafety } from '@/lib/workout';

const phases = ['Warm-up', 'Circuit', 'Cool-down'] as const;

export default function Training() {
  const [view, setView] = useState<'workout' | 'schedule'>('workout');
  const { workouts } = useStore();

  return (
    <Screen>
      <Segmented options={[['workout', '10-min workout'], ['schedule', 'Schedule']]} value={view} onChange={setView} />
      {view === 'schedule' ? (
        sampleSchedule.map((e) => (
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
      ) : (
        <>
          <Hero kicker="No equipment · 10:00" title="RSF bodyweight workout">
            <T style={{ color: brand.black, marginVertical: 8 }}>Warm up, six strength moves, cool down, centering breath. Every move has an easier and harder option.</T>
            <Button title="Start workout >>" onPress={() => router.push('/workout')} style={{ alignSelf: 'flex-start' }} />
          </Hero>

          {phases.map((ph) => {
            const moves = tenMinuteWorkout.filter((s) => s.phase === ph);
            const secs = moves.reduce((a, s) => a + s.seconds, 0);
            return (
              <Card key={ph}>
                <Row style={{ marginBottom: 6 }}>
                  <T kind="label" style={{ flex: 1 }}>{ph}</T>
                  <T kind="mute">{ph === 'Circuit' ? '40s on / 20s rest' : fmt(secs)}</T>
                </Row>
                {moves.map((m) => (
                  <T key={m.name} style={{ fontSize: 15 }}>{`· ${m.name}`}</T>
                ))}
              </Card>
            );
          })}

          <Section title="Play it safe" />
          <Card>
            {workoutSafety.map((t) => (
              <T key={t} kind="mute" style={{ marginBottom: 4 }}>{`· ${t}`}</T>
            ))}
          </Card>

          <Section title="Workout log" />
          {workouts.length === 0 ? <T kind="mute">Finish a workout and it shows up here.</T> : null}
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
