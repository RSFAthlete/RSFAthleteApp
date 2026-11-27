import { useState } from 'react';

import { Button, Card, Input, Row, Screen, T } from '@/components/ui';
import { useStore } from '@/lib/store';

// Community for every coach using RSF Athlete. Backed by the coach_posts table later.
export default function Portal() {
  const { coachPosts, addCoachPost } = useStore();
  const [text, setText] = useState('');
  const post = () => {
    const t = text.trim();
    if (!t) return;
    addCoachPost(t);
    setText('');
  };
  return (
    <Screen>
      <T kind="h" style={{ marginBottom: 4 }}>Coaches portal _</T>
      <T kind="mute" style={{ marginBottom: 12 }}>Connect with every coach using RSF Athlete.</T>
      <Card>
        <Row><Input value={text} onChangeText={setText} placeholder="Share an idea or ask other coaches" multiline /></Row>
        <Button title="Post" onPress={post} style={{ marginTop: 8, alignSelf: 'flex-start' }} />
      </Card>
      {coachPosts.map((p, i) => (
        <Card key={i}>
          <T kind="strong">{p.author}</T>
          <T style={{ marginVertical: 6 }}>{p.text}</T>
          <T kind="mute">{`${p.replies} replies`}</T>
        </Card>
      ))}
    </Screen>
  );
}
