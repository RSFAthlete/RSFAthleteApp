import type { BotMsg, Role } from './store';

// The RSF Bot runs server-side (supabase/functions/rsf-bot) so the Claude API key
// never ships inside the app. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.
const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anon = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const botConfigured = Boolean(url && anon);

export async function askBot(role: Role, messages: BotMsg[]): Promise<string> {
  if (!botConfigured) {
    return 'The RSF Bot is not connected yet. Add the Supabase settings from the README to turn it on.';
  }
  const res = await fetch(`${url}/functions/v1/rsf-bot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${anon}`, apikey: anon! },
    body: JSON.stringify({ role, messages }),
  });
  if (res.status === 429) return 'Lots of questions right now. Take a centering breath and try again in a minute.';
  if (!res.ok) return 'Something went wrong. Try again.';
  const data = (await res.json()) as { text?: string };
  return data.text ?? 'Something went wrong. Try again.';
}
