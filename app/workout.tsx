import { router, Stack } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Bar, Button, Card, Screen, T, usePalette } from '@/components/ui';
import { useStore } from '@/lib/store';
import { brand, fonts } from '@/lib/theme';
import { fmt, tenMinuteWorkout as steps, totalSeconds } from '@/lib/workout';

// Guided timer for the RSF 10-Minute Bodyweight Workout.
export default function WorkoutPlayer() {
  const { addWorkout } = useStore();
  const p = usePalette();
  const [pos, setPos] = useState({ i: 0, left: steps[0].seconds });
  const [running, setRunning] = useState(false);
  const logged = useRef(false);

  const finished = pos.i >= steps.length;
  const i = Math.min(pos.i, steps.length - 1);
  const left = finished ? 0 : pos.left;
  const step = steps[i];
  const next = steps[i + 1];
  const elapsed = finished ? totalSeconds : steps.slice(0, i).reduce((a, s) => a + s.seconds, 0) + (step.seconds - left);

  const logIt = () => {
    if (logged.current) return;
    logged.current = true;
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    addWorkout({ date: today, type: 'RSF 10-Minute', detail: 'Bodyweight workout', minutes: 10 });
  };

  // Move to the next step, or past the last one (finished).
  const stepAfter = (cur: { i: number; left: number }) =>
    cur.i + 1 < steps.length ? { i: cur.i + 1, left: steps[cur.i + 1].seconds } : { i: steps.length, left: 0 };

  const advance = () => {
    const n = stepAfter(pos);
    if (n.i >= steps.length) {
      setRunning(false);
      logIt();
    }
    setPos(n);
  };

  const posRef = useRef(pos);
  useEffect(() => {
    posRef.current = pos;
  }, [pos]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      const cur = posRef.current;
      const n = cur.left > 1 ? { i: cur.i, left: cur.left - 1 } : stepAfter(cur);
      if (n.i >= steps.length) {
        setRunning(false);
        logIt();
      }
      setPos(n);
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  if (finished) {
    return (
      <Screen>
        <Stack.Screen options={{ title: 'Workout done' }} />
        <View style={[s.panel, { backgroundColor: brand.volt }]}>
          <T kind="kicker" style={{ color: brand.black }}>Rep complete</T>
          <Text style={s.big}>10:00</Text>
          <T style={{ color: brand.black }}>Logged to your training. Success Log: what is one thing you did well today?</T>
        </View>
        <Button title="Back to training" onPress={() => router.back()} />
      </Screen>
    );
  }

  const phaseColor = step.phase === 'Rest' ? p.card : step.phase === 'Circuit' ? brand.blue : brand.black;
  const phaseInk = step.phase === 'Rest' ? p.ink : step.phase === 'Circuit' ? brand.black : brand.offWhite;

  return (
    <Screen>
      <Stack.Screen options={{ title: '10-minute workout' }} />
      <View style={{ marginBottom: 12 }}>
        <Bar pct={(elapsed / totalSeconds) * 100} />
        <T kind="mute" style={{ marginTop: 6 }}>{`${fmt(elapsed)} of ${fmt(totalSeconds)} · step ${i + 1} of ${steps.length}`}</T>
      </View>

      <View style={[s.panel, { backgroundColor: phaseColor, borderColor: p.line }]}>
        <T kind="kicker" style={{ color: step.phase === 'Warm-up' || step.phase === 'Cool-down' ? brand.volt : phaseInk }}>{step.phase}</T>
        <Text style={[s.name, { color: phaseInk }]}>{step.name}</Text>
        <Text style={[s.big, { color: phaseInk }]} accessibilityLiveRegion="polite">{fmt(Math.max(0, left))}</Text>
        <T style={{ color: phaseInk }}>{step.cue}</T>
      </View>

      {step.easier || step.harder ? (
        <Card>
          {step.easier ? <T kind="mute">{`Easier: ${step.easier}`}</T> : null}
          {step.harder ? <T kind="mute" style={{ marginTop: 4 }}>{`Harder: ${step.harder}`}</T> : null}
        </Card>
      ) : null}

      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
        <Button title={running ? 'Pause' : elapsed === 0 ? 'Start' : 'Resume'} onPress={() => setRunning(!running)} variant="volt" style={{ flex: 2 }} />
        <Button title="Skip" onPress={advance} variant="ghost" style={{ flex: 1 }} />
      </View>

      {next ? <T kind="mute">{`Up next: ${next.name}`}</T> : null}
    </Screen>
  );
}

const s = StyleSheet.create({
  panel: { padding: 20, marginBottom: 12, borderWidth: 1, gap: 6 },
  name: { fontFamily: fonts.monoBold, fontSize: 24, textTransform: 'uppercase' },
  big: { fontFamily: fonts.monoBold, fontSize: 72, lineHeight: 80, color: brand.black },
});
