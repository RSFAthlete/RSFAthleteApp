// RSF 10-Minute Bodyweight Workout for youth athletes (about ages 10 to 18).
// No equipment. 2 min warm-up, 6 min circuit (six moves, 40s work / 20s rest, ending in a walk-off), 2 min cool-down
// that ends with a centering breath to connect the body work to the mental work.
// Every move has an easier and a harder option so one routine fits every age and level.

export type Step = {
  name: string;
  seconds: number;
  phase: 'Warm-up' | 'Circuit' | 'Rest' | 'Cool-down';
  cue: string; // one coaching cue, said like a coach would
  easier?: string;
  harder?: string;
};

const rest = (next: string): Step => ({ name: 'Rest', seconds: 20, phase: 'Rest', cue: `Shake it out. Next: ${next}.` });

export const tenMinuteWorkout: Step[] = [
  // Warm-up: 2:00
  { name: 'Jumping jacks', seconds: 30, phase: 'Warm-up', cue: 'Light on your feet. Find a rhythm.', easier: 'Step jacks, one foot at a time', harder: 'Seal jacks, clap arms in front' },
  { name: 'Arm circles and leg swings', seconds: 30, phase: 'Warm-up', cue: '15 seconds arms, 15 seconds legs. Big, smooth circles.' },
  { name: 'High knees', seconds: 30, phase: 'Warm-up', cue: 'Drive your knees to hip height. Pump your arms.', easier: 'Marching high knees', harder: 'Sprint pace' },
  { name: 'Inchworms', seconds: 30, phase: 'Warm-up', cue: 'Walk your hands out to a plank, then walk them back.', easier: 'Bend your knees as much as you need', harder: 'Add a push-up at the bottom' },

  // Circuit: 6 moves, 40s work / 20s rest, plus walk-off = 6:00
  { name: 'Bodyweight squats', seconds: 40, phase: 'Circuit', cue: 'Chest up, knees track over toes, sit back like there is a chair.', easier: 'Squat to a chair or bench', harder: 'Jump squats, land soft' },
  rest('Push-ups'),
  { name: 'Push-ups', seconds: 40, phase: 'Circuit', cue: 'Straight line from head to heels. Quality over quantity.', easier: 'Knees down or hands on a wall', harder: 'Feet elevated or pause at the bottom' },
  rest('Reverse lunges'),
  { name: 'Reverse lunges', seconds: 40, phase: 'Circuit', cue: 'Step back, front knee over ankle, alternate legs.', easier: 'Hold a wall for balance', harder: 'Add a knee drive when you come up' },
  rest('Glute bridges'),
  { name: 'Glute bridges', seconds: 40, phase: 'Circuit', cue: 'Squeeze at the top for one second. Ribs down.', easier: 'Smaller range', harder: 'Single-leg bridge, switch at 20 seconds' },
  rest('Mountain climbers'),
  { name: 'Mountain climbers', seconds: 40, phase: 'Circuit', cue: 'Hands under shoulders. Knees in fast, hips stay low.', easier: 'Slow, step the feet in', harder: 'Cross-body climbers' },
  rest('Forearm plank'),
  { name: 'Forearm plank', seconds: 40, phase: 'Circuit', cue: 'Brace like someone is about to poke your stomach. Breathe.', easier: 'Knees down', harder: 'Shoulder taps from a high plank' },
  { name: 'Walk it off', seconds: 20, phase: 'Rest', cue: 'Circuit done. Easy walk, slow your breathing.' },

  // Cool-down: 2:00
  { name: 'Hamstring stretch', seconds: 30, phase: 'Cool-down', cue: 'Sit tall, reach toward your toes. No bouncing.' },
  { name: 'Quad stretch', seconds: 30, phase: 'Cool-down', cue: '15 seconds each leg. Hold a wall if you need it.' },
  { name: "Child's pose", seconds: 30, phase: 'Cool-down', cue: 'Sink your hips back. Let your back relax.' },
  { name: 'Centering breath', seconds: 30, phase: 'Cool-down', cue: 'Breathe in for 6, hold for 2, out for 7. Then name one thing you did well.' },
];

export const totalSeconds = tenMinuteWorkout.reduce((a, s) => a + s.seconds, 0); // 600

export const workoutSafety = [
  'Form beats speed. Do fewer reps well.',
  'Stop if anything hurts (sharp pain, not effort) and tell a coach or parent.',
  'Drink water before and after.',
  'Athletes under 13 should do this with an adult nearby.',
];

export const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
