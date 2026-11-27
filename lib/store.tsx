import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

import { modules } from './data';

export type Role = 'athlete' | 'coach';
export type Workout = { date: string; type: string; detail: string; minutes: number };
export type ChatMsg = { from: string; text: string; mine?: boolean };
export type BotMsg = { role: 'user' | 'assistant'; content: string };
export type CoachPost = { author: string; text: string; replies: number };

type State = {
  role: Role;
  progress: Record<number, number>; // module id -> percent complete
  workouts: Workout[];
  teamChat: ChatMsg[];
  coachPosts: CoachPost[];
  bot: Record<Role, BotMsg[]>;
};

// Sample starting state for the demo. Supabase becomes the source of truth later.
const initial: State = {
  role: 'athlete',
  progress: { 1: 100, 2: 100, 3: 60 },
  workouts: [
    { date: 'Nov 25', type: 'RSF 10-Minute', detail: 'Bodyweight workout', minutes: 10 },
    { date: 'Nov 24', type: 'RSF 10-Minute', detail: 'Bodyweight workout', minutes: 10 },
  ],
  teamChat: [
    { from: 'Coach Davis', text: 'Great work today. Film review at 3 before practice tomorrow.' },
    { from: 'Maya', text: 'Can someone share the Module 3 worksheet?' },
    { from: 'You', text: 'Posted it in Files', mine: true },
  ],
  coachPosts: [
    { author: 'Coach Rivera · Ohio', text: 'How are you running the 60 Second Comeback session with freshmen?', replies: 12 },
    { author: 'Coach Lee · Texas', text: 'Sharing our weekly check-in template that pairs with the Mental Workout module.', replies: 8 },
  ],
  bot: { athlete: [], coach: [] },
};

const KEY = 'rsf-state-v2';

type Ctx = State & {
  setRole: (r: Role) => void;
  setProgress: (id: number, pct: number) => void;
  addWorkout: (w: Workout) => void;
  sendTeamMessage: (text: string) => void;
  addCoachPost: (text: string) => void;
  setBot: (r: Role, msgs: BotMsg[]) => void;
  overallPct: number;
  doneCount: number;
};

const StoreContext = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [s, set] = useState<State>(initial);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => raw && set({ ...initial, ...JSON.parse(raw) }))
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (loaded) AsyncStorage.setItem(KEY, JSON.stringify(s)).catch(() => {});
  }, [s, loaded]);

  const value = useMemo<Ctx>(() => {
    const total = modules.reduce((a, m) => a + (s.progress[m.id] ?? 0), 0);
    return {
      ...s,
      overallPct: Math.round(total / modules.length),
      doneCount: modules.filter((m) => (s.progress[m.id] ?? 0) >= 100).length,
      setRole: (role) => set((p) => ({ ...p, role })),
      setProgress: (id, pct) => set((p) => ({ ...p, progress: { ...p.progress, [id]: pct } })),
      addWorkout: (w) => set((p) => ({ ...p, workouts: [w, ...p.workouts] })),
      sendTeamMessage: (text) => set((p) => ({ ...p, teamChat: [...p.teamChat, { from: 'You', text, mine: true }] })),
      addCoachPost: (text) => set((p) => ({ ...p, coachPosts: [{ author: 'You · Coach Davis', text, replies: 0 }, ...p.coachPosts] })),
      setBot: (r, msgs) => set((p) => ({ ...p, bot: { ...p.bot, [r]: msgs } })),
    };
  }, [s]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}
