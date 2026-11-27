import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Text, View } from 'react-native';

import { Bar, Button, Card, Chip, Hero, NumBox, Row, Screen, Section, T } from '@/components/ui';
import { driveUrl, introVideos, modules, sampleJournal, sampleTeamProgress } from '@/lib/data';
import { useStore } from '@/lib/store';
import { brand } from '@/lib/theme';

export default function Home() {
  const { role } = useStore();
  return role === 'coach' ? <CoachHome /> : <AthleteHome />;
}

function AthleteHome() {
  const { progress, doneCount, overallPct, teamChat } = useStore();
  const next = modules.find((m) => (progress[m.id] ?? 0) < 100) ?? modules[modules.length - 1];
  const last = teamChat[teamChat.length - 1];

  return (
    <Screen>
      <Hero kicker={`Week ${next.id} of 8`} title="Let's go, Jordan">
        <T style={{ color: brand.black, marginVertical: 8 }}>{doneCount} of 8 modules complete</T>
        <Bar pct={overallPct} onBlue />
        <Button title={`Continue module ${next.id} >>`} onPress={() => router.push(`/module/${next.id}`)} style={{ marginTop: 14, alignSelf: 'flex-start' }} />
      </Hero>

      <View style={{ backgroundColor: brand.black, padding: 12, flexDirection: 'row', gap: 10, alignItems: 'center' }}>
        <T kind="kicker" style={{ color: brand.volt }}>{"Today's rep"}</T>
        <T style={{ color: brand.offWhite, flex: 1, fontSize: 14 }}>Pressure is inevitable. Response is trainable.</T>
      </View>

      <Section title="Start here" />
      {introVideos.map((v) => (
        <Card key={v.title} onPress={() => WebBrowser.openBrowserAsync(driveUrl(v.driveVideoId))}>
          <Row>
            <NumBox>▶</NumBox>
            <View style={{ flex: 1 }}>
              <T kind="strong">{v.title}</T>
              <T kind="mute">Video</T>
            </View>
          </Row>
        </Card>
      ))}

      <Section title="Team chat" />
      <Card onPress={() => router.push('/team')}>
        <Row>
          <NumBox>VS</NumBox>
          <View style={{ flex: 1 }}>
            <T kind="strong">Varsity Soccer</T>
            <T kind="mute">{`${last.from}: ${last.text}`}</T>
          </View>
          <Chip label="New" tone="new" />
        </Row>
      </Card>

      <Section title="Journal links" />
      {sampleJournal.map((j) => (
        <Card key={j.title} onPress={() => WebBrowser.openBrowserAsync(j.url)}>
          <Row>
            <View style={{ flex: 1 }}>
              <T kind="strong">{j.title}</T>
              <T kind="mute">{j.kind}</T>
            </View>
            <Text style={{ fontSize: 18 }}>↗</Text>
          </Row>
        </Card>
      ))}
    </Screen>
  );
}

function CoachHome() {
  const avg = Math.round(sampleTeamProgress.reduce((a, b) => a + b.pct, 0) / sampleTeamProgress.length);
  return (
    <Screen>
      <Hero kicker="Coach-reinforced" title="Welcome back, Coach Davis">
        <T style={{ color: brand.black, marginVertical: 8 }}>Varsity Soccer · 24 athletes</T>
        <Bar pct={avg} onBlue />
        <T style={{ color: brand.black, fontSize: 13, marginTop: 8 }}>{`Team average: ${avg}% of modules complete`}</T>
      </Hero>

      <Row style={{ alignItems: 'stretch' }}>
        <Card style={{ flex: 1 }}>
          <T kind="h">18</T>
          <T kind="mute">active this week</T>
        </Card>
        <Card style={{ flex: 1 }}>
          <T kind="h">3</T>
          <T kind="mute">need a check-in</T>
        </Card>
      </Row>

      <Section title="Athlete progress" />
      {sampleTeamProgress.map((a) => (
        <Card key={a.name}>
          <Row style={{ marginBottom: 8 }}>
            <T kind="strong" style={{ flex: 1 }}>{a.name}</T>
            <T kind="mute">{`${a.pct}%`}</T>
          </Row>
          <Bar pct={a.pct} />
        </Card>
      ))}
      <Button title="Open coaches toolkit" onPress={() => router.push('/toolkit')} />
    </Screen>
  );
}
