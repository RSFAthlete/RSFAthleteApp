// Content for the 8-week RSF Athlete program.
// Video IDs point at the current Google Drive files; replace with Vimeo IDs once uploaded.

export type Module = {
  id: number;
  title: string;
  summary: string; // placeholder one-liners until the official descriptions are provided
  driveVideoId: string;
  vimeoId?: string;
  pdfUrl?: string;
  podcastUrl?: string;
};

export const modules: Module[] = [
  { id: 1, title: '60 Second Comeback', summary: 'Reset fast after a mistake.', driveVideoId: '1j7JgIn2-osuAbGDN-4i9Koe-A3oL0OMd' },
  { id: 2, title: 'Cue Training', summary: 'Pick the cue that locks you in.', driveVideoId: '1GnBjdqlEX80HP449qqs8WbVVzJggCJFg' },
  { id: 3, title: 'Confidence Through Preparation', summary: 'Confidence is built before the game.', driveVideoId: '10xGJOpau7fsouc1wHPl_XsDuAHrbZRHE' },
  { id: 4, title: 'Game Speed Breath', summary: 'Control your body at game speed.', driveVideoId: '1njNz-LX2L-oKLoVTQ1cn9bErliokeO8q' },
  { id: 5, title: 'Mental Workout', summary: 'Daily reps for the mind.', driveVideoId: '17pFvTXQ4dIB6d3upm7Kt9hawYqtb-b1u' },
  { id: 6, title: 'Goal Setting', summary: 'Process goals that drive results.', driveVideoId: '1bHDAWAIOK9m_FKyCJaZCuMLkI4QswGhT' },
  { id: 7, title: 'One Improvement', summary: 'Attack one thing at a time.', driveVideoId: '1h_C-cCKSrxddARHgc7BvAF-pOikfQks_' },
  { id: 8, title: 'Self Talk', summary: 'Win the conversation in your head.', driveVideoId: '1gmNw12Hr7LkkfRdMNrhcmw4mV_A7Bhnc' },
];

export const introVideos = [
  { title: 'Welcome to RSF Athlete', driveVideoId: '1nI3ZedXiCWkO8rDfwMZc-sQAaaSaWiGC' },
  { title: 'Introduction', driveVideoId: '1MDouYWDdJSYe5yJw40goEbGd9-bifXF3' },
];

export const driveUrl = (id: string) => `https://drive.google.com/file/d/${id}/view`;
export const videoUrl = (m: { driveVideoId: string; vimeoId?: string }) =>
  m.vimeoId ? `https://player.vimeo.com/video/${m.vimeoId}` : driveUrl(m.driveVideoId);

// ---- Sample data below. Replaced by Supabase queries (see supabase/migrations). ----

export const sampleSchedule = [
  { day: 'Mon', time: '6:00 AM', title: 'Strength session', place: 'Weight room' },
  { day: 'Tue', time: '3:30 PM', title: 'Team practice', place: 'Main field' },
  { day: 'Wed', time: '7:00 PM', title: 'Module 3 group call', place: 'Video call' },
  { day: 'Thu', time: '3:30 PM', title: 'Team practice', place: 'Main field' },
  { day: 'Sat', time: '10:00 AM', title: 'Game vs. Eastside', place: 'Away' },
];

export const sampleJournal = [
  { title: 'Daily reflection', kind: 'Google Doc', url: 'https://docs.google.com' },
  { title: 'Week 2 cue journal', kind: 'Notion page', url: 'https://notion.so' },
  { title: 'Season goals', kind: 'Google Doc', url: 'https://docs.google.com' },
];

export const sampleTeamProgress = [
  { name: 'Jordan M.', pct: 57 },
  { name: 'Maya R.', pct: 75 },
  { name: 'Chris T.', pct: 25 },
  { name: 'Ava K.', pct: 12 },
];

export const toolkit = [
  { title: 'Session plans for all 8 modules', meta: 'PDF' },
  { title: 'Team discussion cards', meta: 'PDF' },
  { title: 'Parent intro letter', meta: 'Editable doc' },
  { title: 'Athlete check-in template', meta: 'Editable doc' },
];

export const botPrompts = {
  athlete: ["I get nervous before big games", "I made a mistake and can't let it go", 'How do I do the mental workout?', "I'm not getting playing time"],
  coach: ['My team folds under pressure', 'How do I run the success log with my team?', 'An athlete is in a slump', 'How do I reinforce Module 1 this week?'],
};
