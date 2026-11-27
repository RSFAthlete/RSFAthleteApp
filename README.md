# RSF Athlete

The RSF Athlete app: an 8-week mental performance system for youth athletes ("strength and conditioning for the mind"), developed with Dr. Jason Selk. Athlete-owned, coach-reinforced.

One codebase runs on iPhone, Android and the web, built with [Expo](https://expo.dev) (SDK 58) and Expo Router.

## What's in this first version

| Area | Athletes | Coaches |
|---|---|---|
| Home | Progress, next module, intro videos, team chat, journal links | Team progress, check-ins, toolkit |
| Modules | All 8 modules with video, podcast, PDF and reflection | Same |
| Team | Group chat | Group chat for each team |
| RSF Bot | Mental performance coaching | Coaching help for their team |
| Training | Schedule and workout log | |
| Coaches portal | | Posts from every coach using RSF |
| Profile | Module completion chart | Groups |

Data is sample data kept on the device for now (`lib/data.ts`, `lib/store.tsx`). The Supabase schema in `supabase/migrations` is the next step: accounts, teams, progress, chat, coach posts, and report and block tools.

The module videos currently open from Google Drive. Once they are uploaded to Vimeo, add each `vimeoId` in `lib/data.ts` and they will play from Vimeo instead.

## Run it

```bash
npm install
npx expo start        # then press i (iOS), a (Android) or w (web)
```

Checks:

```bash
npm run typecheck
npm run lint
```

## Turn on the backend and the RSF Bot

1. Create a project at [supabase.com](https://supabase.com).
2. Run the schema: `npx supabase db push` (or paste `supabase/migrations/0001_init.sql` into the SQL editor).
3. Deploy the bot and add the Claude API key:
   ```bash
   npx supabase functions deploy rsf-bot
   npx supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
   ```
4. Copy `.env.example` to `.env` and fill in the Supabase URL and anon key.

The bot's prompt lives in `supabase/functions/rsf-bot/index.ts`. The API key stays on the server and never ships in the app.

## Ship to the App Store and Google Play

Builds and submissions use EAS, so no Mac or Android Studio is needed.

```bash
npx eas-cli@latest login
npx eas-cli@latest build --platform all
npx eas-cli@latest submit --platform ios
npx eas-cli@latest submit --platform android
```

Needed first: an Apple Developer account ($99 a year, in RSF's company name with a D-U-N-S number) and a Google Play Console account ($25 once). The bundle ID is `com.rsfathlete.app`; change it in `app.json` before the first build if you want another.

## Before launch

- Sign-in with Supabase Auth, and parental consent for athletes under 13 (COPPA).
- Report and block in team chat and the coaches portal (tables are in the schema).
- A privacy policy and support URL for the store listings.
- Swap the stand-in fonts (JetBrains Mono, Poppins, Archivo) for the licensed brand fonts (Config Mono, ITC Avant Garde, Manifold Extd).
- Dr. Selk's sign-off on the RSF Bot's voice.
