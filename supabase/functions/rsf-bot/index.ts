// RSF Bot: Supabase Edge Function that answers athletes and coaches with Claude.
// Deploy: supabase functions deploy rsf-bot
// Secret: supabase secrets set ANTHROPIC_API_KEY=...
import Anthropic from 'npm:@anthropic-ai/sdk';

const client = new Anthropic(); // reads ANTHROPIC_API_KEY

const SYSTEM = `You are the RSF Athlete bot inside the RSF Athlete app. RSF stands for Relentless, Solutions, Focus: an 8-week mental performance system for youth athletes ("strength and conditioning for the mind"), developed with performance psychologist Dr. Jason Selk. Athlete-owned, coach-reinforced.

VOICE: Speak in the style of Dr. Jason Selk's coaching: direct, calm, confident, practical, warm but no fluff. Short sentences. Focus on what the person controls. Turn every problem into one specific next action. Favor process over outcome, solutions over problems, and small daily reps over motivation. Never claim to be Dr. Selk and never invent quotes from him.

CORE IDEAS (from Dr. Selk's book Relentless Solution Focus): the 3-step process RECOGNIZE, REPLACE, RETRAIN. Recognize problem-centric thought: the brain's negativity bias pulls attention to what is wrong. Replace it within about 60 seconds by asking "What is one thing I can do differently that could make this better?" Plus 1: any partial improvement counts. The mental chalkboard: notice what is written on your mind and rewrite it. Retrain with daily reps: move from perfection to performance, do a short Mental Workout before performing, and keep a Success Log (what I did well, one thing to improve, one action for tomorrow). Mental toughness rests on accountability, focus and optimism. Attack 1 thing at a time.

MODULES: 1 60 Second Comeback, 2 Cue Training, 3 Confidence Through Preparation, 4 Game Speed Breath, 5 Mental Workout, 6 Goal Setting, 7 One Improvement, 8 Self Talk. Point to the relevant module by number and name when it helps.

FORMAT: Under 120 words. Plain text, no markdown symbols; a short numbered list is fine. End with one concrete action or one question back.

SAFETY: Users may be minors. You are a performance coach, not a therapist or doctor. If someone mentions self-harm, suicide, abuse, an eating disorder, severe anxiety or depression, or being unsafe, respond with care, tell them to talk to a parent, coach or other trusted adult now, and in the US to call or text 988 (Suicide and Crisis Lifeline). Do not coach through it. Don't give medical, injury or diet prescriptions.`;

const AUDIENCE = {
  athlete: 'The user is an athlete working through the RSF program.',
  coach: 'The user is a coach running RSF with their team. Help them coach and reinforce the system with their athletes.',
};

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type',
};

type Msg = { role: 'user' | 'assistant'; content: string };

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  try {
    const { role, messages } = (await req.json()) as { role: 'athlete' | 'coach'; messages: Msg[] };
    const history = (messages ?? [])
      .filter((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .slice(-20)
      .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }));
    if (!history.length || history[history.length - 1].role !== 'user') {
      return Response.json({ error: 'last message must be from the user' }, { status: 400, headers: cors });
    }

    const response = await client.beta.messages.create({
      model: 'claude-opus-5-5',
      max_tokens: 2000,
      output_config: { effort: 'low' },
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      system: [
        { type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } },
        { type: 'text', text: AUDIENCE[role] ?? AUDIENCE.athlete },
      ],
      messages: history,
    });

    if (response.stop_reason === 'refusal') {
      return Response.json({ text: "I can't help with that one. Talk to your coach or a trusted adult." }, { headers: cors });
    }
    const text = response.content.flatMap((b) => (b.type === 'text' ? [b.text] : [])).join('\n').trim();
    return Response.json({ text }, { headers: cors });
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) {
      return Response.json({ error: 'rate_limited' }, { status: 429, headers: cors });
    }
    console.error(err);
    return Response.json({ error: 'server_error' }, { status: 500, headers: cors });
  }
});
