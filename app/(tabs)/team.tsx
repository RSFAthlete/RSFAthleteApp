import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { ScrollViewInstance } from 'react-native';

import { Button, Input, Row, Segmented, usePalette } from '@/components/ui';
import { useStore } from '@/lib/store';
import { brand, fonts } from '@/lib/theme';

// Group messaging. Moves to Supabase Realtime (messages table) with report/block before launch.
export default function Team() {
  const { teamChat, sendTeamMessage } = useStore();
  const [group, setGroup] = useState<'varsity' | 'jv'>('varsity');
  const [text, setText] = useState('');
  const scroller = useRef<ScrollViewInstance>(null);
  const p = usePalette();

  const send = () => {
    const t = text.trim();
    if (!t) return;
    sendTeamMessage(t);
    setText('');
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: p.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={{ padding: 16, paddingBottom: 0 }}>
        <Segmented options={[['varsity', 'Varsity Soccer'], ['jv', 'JV Soccer']]} value={group} onChange={setGroup} />
      </View>
      <ScrollView ref={scroller} contentContainerStyle={{ padding: 16, gap: 8 }} onContentSizeChange={() => scroller.current?.scrollToEnd()}>
        {(group === 'varsity' ? teamChat : []).map((m, i) => (
          <Bubble key={i} mine={m.mine} from={m.from} text={m.text} />
        ))}
      </ScrollView>
      <Row style={{ padding: 16 }}>
        <Input value={text} onChangeText={setText} placeholder="Message the team" onSubmitEditing={send} returnKeyType="send" />
        <Button title="Send" onPress={send} />
      </Row>
    </KeyboardAvoidingView>
  );
}

export function Bubble({ mine, from, text }: { mine?: boolean; from?: string; text: string }) {
  const p = usePalette();
  return (
    <View style={[s.bubble, mine ? s.mine : [s.theirs, { backgroundColor: p.card, borderColor: p.line }]]}>
      {!mine && from ? <Text style={[s.from, { color: p.mute }]}>{from}</Text> : null}
      <Text style={{ fontFamily: fonts.body, fontSize: 15, lineHeight: 21, color: mine ? brand.black : p.ink }}>{text}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  bubble: { maxWidth: '82%', paddingHorizontal: 12, paddingVertical: 9, borderRadius: 14, borderWidth: 1 },
  mine: { alignSelf: 'flex-end', backgroundColor: brand.blue, borderColor: brand.blue, borderBottomRightRadius: 3 },
  theirs: { alignSelf: 'flex-start', borderBottomLeftRadius: 3 },
  from: { fontFamily: fonts.mono, fontSize: 11, textTransform: 'uppercase', marginBottom: 2 },
});
