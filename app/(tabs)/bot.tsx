import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import type { ScrollViewInstance } from 'react-native';

import { Button, Input, Row, T, usePalette } from '@/components/ui';
import { askBot, botConfigured } from '@/lib/bot';
import { botPrompts } from '@/lib/data';
import { BotMsg, useStore } from '@/lib/store';
import { brand, fonts } from '@/lib/theme';
import { Bubble } from './team';

const greeting = {
  athlete: "Jordan, I'm the RSF Athlete bot. Pressure is inevitable. Response is trainable. What do you want to work on today?",
  coach: "Coach, I'm the RSF Athlete bot. Tell me what you're seeing with your athletes and we'll find the next rep.",
};

export default function Bot() {
  const { role, bot, setBot } = useStore();
  const msgs = bot[role];
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const scroller = useRef<ScrollViewInstance>(null);
  const p = usePalette();

  const ask = async (q: string) => {
    const t = q.trim();
    if (!t || busy) return;
    const next: BotMsg[] = [...msgs, { role: 'user', content: t }];
    setBot(role, next);
    setText('');
    setBusy(true);
    try {
      const reply = await askBot(role, next);
      setBot(role, [...next, { role: 'assistant', content: reply }]);
    } catch {
      setBot(role, [...next, { role: 'assistant', content: 'Something went wrong. Check your connection and try again.' }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: p.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView ref={scroller} contentContainerStyle={{ padding: 16, gap: 8 }} onContentSizeChange={() => scroller.current?.scrollToEnd()}>
        <View style={{ backgroundColor: brand.black, padding: 12, flexDirection: 'row', gap: 10, marginBottom: 6 }}>
          <T kind="kicker" style={{ color: brand.volt }}>RSF Bot</T>
          <T style={{ color: brand.offWhite, flex: 1, fontSize: 14 }}>{`Mental performance coaching for ${role === 'athlete' ? 'athletes' : 'coaches'}.`}</T>
        </View>
        <Bubble from="RSF Bot" text={greeting[role]} />
        {msgs.map((m, i) => (
          <Bubble key={i} mine={m.role === 'user'} from="RSF Bot" text={m.content} />
        ))}
        {busy ? <Bubble from="RSF Bot" text="Thinking…" /> : null}
        {msgs.length === 0 ? (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
            {botPrompts[role].map((q) => (
              <Pressable key={q} onPress={() => ask(q)} style={{ borderWidth: 1, borderColor: p.ink, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8 }} accessibilityRole="button">
                <Text style={{ fontFamily: fonts.body, fontSize: 13, color: p.ink }}>{q}</Text>
              </Pressable>
            ))}
          </View>
        ) : null}
        <T kind="mute" style={{ fontSize: 12, marginTop: 8 }}>
          {botConfigured
            ? 'AI coaching, not a counselor or doctor. In a crisis in the US, call or text 988.'
            : 'The bot is not connected yet. See the README to turn it on.'}
        </T>
      </ScrollView>
      <Row style={{ padding: 16 }}>
        <Input value={text} onChangeText={setText} placeholder={role === 'athlete' ? "What's on your mind?" : 'Ask about your team'} onSubmitEditing={() => ask(text)} editable={!busy} />
        <Button title="Ask" onPress={() => ask(text)} disabled={busy} />
      </Row>
    </KeyboardAvoidingView>
  );
}
