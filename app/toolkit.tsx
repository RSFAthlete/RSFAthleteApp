import { useState } from 'react';
import { Alert } from 'react-native';

import { Button, Card, Hero, NumBox, Row, Screen, Section, Segmented, T } from '@/components/ui';
import { modules, toolkit } from '@/lib/data';
import { brand } from '@/lib/theme';

export default function Toolkit() {
  const [pick, setPick] = useState('1');
  return (
    <Screen>
      <Hero kicker=">> Coaches toolkit" title="Run the 8-week system">
        <T style={{ color: brand.black, marginTop: 8 }}>Everything you need to run the RSF modules with your team.</T>
      </Hero>
      {toolkit.map((t) => (
        <Card key={t.title} onPress={() => Alert.alert(t.title, 'File coming soon.')}>
          <Row>
            <NumBox>PDF</NumBox>
            <Row style={{ flex: 1 }}>
              <T kind="strong" style={{ flex: 1 }}>{t.title}</T>
            </Row>
            <T kind="mute">{t.meta}</T>
          </Row>
        </Card>
      ))}
      <Section title="Assign a module" />
      <Card>
        <Segmented options={modules.slice(0, 4).map((m) => [String(m.id), String(m.id)] as [string, string])} value={pick} onChange={setPick} />
        <Segmented options={modules.slice(4).map((m) => [String(m.id), String(m.id)] as [string, string])} value={pick} onChange={setPick} />
        <T style={{ marginBottom: 12 }}>{`Module ${pick}: ${modules.find((m) => String(m.id) === pick)?.title}`}</T>
        <Button title="Assign to Varsity Soccer" onPress={() => Alert.alert('Assigned', `Module ${pick} assigned to Varsity Soccer.`)} />
      </Card>
    </Screen>
  );
}
