import { router } from 'expo-router';
import { View } from 'react-native';

import { Bar, Button, Card, Row, Screen, Section, T } from '@/components/ui';
import { modules } from '@/lib/data';
import { useStore } from '@/lib/store';
import { brand, fonts } from '@/lib/theme';

export default function Profile() {
  const { role, setRole, progress, doneCount, workouts } = useStore();
  const athlete = role === 'athlete';
  return (
    <Screen>
      <Row style={{ marginBottom: 16 }}>
        <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: brand.blue, alignItems: 'center', justifyContent: 'center' }}>
          <T style={{ fontFamily: fonts.monoBold, fontSize: 22, color: brand.black }}>{athlete ? 'JM' : 'CD'}</T>
        </View>
        <View style={{ flex: 1 }}>
          <T kind="h">{athlete ? 'Jordan Miles' : 'Coach Davis'}</T>
          <T kind="mute">{athlete ? 'Midfielder · Class of 2027' : 'Head coach · Varsity Soccer'}</T>
        </View>
      </Row>

      {athlete ? (
        <>
          <Row style={{ alignItems: 'stretch' }}>
            <Card style={{ flex: 1 }}><T kind="h">{`${doneCount}/8`}</T><T kind="mute">modules</T></Card>
            <Card style={{ flex: 1 }}><T kind="h">{String(workouts.length)}</T><T kind="mute">workouts logged</T></Card>
          </Row>
          <Section title="Module completion" />
          <Card>
            {modules.map((m) => (
              <Row key={m.id} style={{ marginVertical: 5 }}>
                <T kind="mute" style={{ width: 28 }}>{`M${m.id}`}</T>
                <View style={{ flex: 1 }}><Bar pct={progress[m.id] ?? 0} /></View>
              </Row>
            ))}
          </Card>
        </>
      ) : null}

      <Section title="Groups" />
      <Card><T>{athlete ? 'Varsity Soccer' : 'Varsity Soccer, JV Soccer'}</T></Card>

      <Button
        title={`Switch to ${athlete ? 'coach' : 'athlete'} view (demo)`}
        variant="ghost"
        onPress={() => {
          setRole(athlete ? 'coach' : 'athlete');
          router.back();
        }}
        style={{ marginTop: 12 }}
      />
    </Screen>
  );
}
