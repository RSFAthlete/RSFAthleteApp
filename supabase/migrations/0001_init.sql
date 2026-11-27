-- RSF Athlete: initial schema.
-- Users sign in with Supabase Auth; every table is protected by row level security.

create type public.user_role as enum ('athlete', 'coach', 'admin');

create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text not null,
  role public.user_role not null default 'athlete',
  sport text,
  position text,
  grad_year int,
  birth_year int,                 -- used to require parental consent under 13 (COPPA)
  parent_consent_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  organization text,
  join_code text unique not null default upper(substr(md5(random()::text), 1, 6)),
  created_by uuid references public.profiles on delete set null,
  created_at timestamptz not null default now()
);

create table public.team_members (
  team_id uuid references public.teams on delete cascade,
  user_id uuid references public.profiles on delete cascade,
  member_role public.user_role not null default 'athlete',
  primary key (team_id, user_id)
);

create table public.modules (
  id int primary key,
  title text not null,
  summary text,
  vimeo_id text,
  pdf_path text,       -- Supabase Storage path
  podcast_path text,
  sort int not null
);

insert into public.modules (id, title, sort) values
  (1, '60 Second Comeback', 1),
  (2, 'Cue Training', 2),
  (3, 'Confidence Through Preparation', 3),
  (4, 'Game Speed Breath', 4),
  (5, 'Mental Workout', 5),
  (6, 'Goal Setting', 6),
  (7, 'One Improvement', 7),
  (8, 'Self Talk', 8);

create table public.module_progress (
  user_id uuid references public.profiles on delete cascade,
  module_id int references public.modules on delete cascade,
  video_done boolean not null default false,
  podcast_done boolean not null default false,
  pdf_done boolean not null default false,
  reflection text,
  percent int not null default 0 check (percent between 0 and 100),
  completed_at timestamptz,
  primary key (user_id, module_id)
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references public.teams on delete cascade,
  title text not null,
  location text,
  starts_at timestamptz not null,
  created_by uuid references public.profiles on delete set null
);

create table public.workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles on delete cascade,
  type text not null,
  detail text,
  minutes int,
  done_on date not null default current_date
);

create table public.journal_links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles on delete cascade,
  title text not null,
  url text not null check (url like 'https://%')
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams on delete cascade,
  user_id uuid not null references public.profiles on delete cascade,
  body text not null check (length(body) between 1 and 2000),
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.coach_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles on delete cascade,
  parent_id uuid references public.coach_posts on delete cascade,
  body text not null check (length(body) between 1 and 4000),
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);

-- Report and block: required by the App Store and Google Play for user-generated content.
create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles on delete cascade,
  message_id uuid references public.messages on delete cascade,
  coach_post_id uuid references public.coach_posts on delete cascade,
  reason text,
  created_at timestamptz not null default now()
);

create table public.blocks (
  blocker_id uuid references public.profiles on delete cascade,
  blocked_id uuid references public.profiles on delete cascade,
  primary key (blocker_id, blocked_id)
);

-- ---------- Row level security ----------
alter table public.profiles enable row level security;
alter table public.teams enable row level security;
alter table public.team_members enable row level security;
alter table public.modules enable row level security;
alter table public.module_progress enable row level security;
alter table public.events enable row level security;
alter table public.workouts enable row level security;
alter table public.journal_links enable row level security;
alter table public.messages enable row level security;
alter table public.coach_posts enable row level security;
alter table public.reports enable row level security;
alter table public.blocks enable row level security;

create function public.is_coach() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid() and role in ('coach', 'admin'));
$$;

create function public.in_team(t uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from team_members where team_id = t and user_id = auth.uid());
$$;

create function public.coaches_user(u uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from team_members c join team_members a on a.team_id = c.team_id
    where c.user_id = auth.uid() and c.member_role = 'coach' and a.user_id = u
  );
$$;

create policy "own profile" on public.profiles for all using (id = auth.uid()) with check (id = auth.uid());
create policy "teammates see profiles" on public.profiles for select using (
  exists (select 1 from team_members a join team_members b on a.team_id = b.team_id where a.user_id = auth.uid() and b.user_id = profiles.id)
);

create policy "members see team" on public.teams for select using (public.in_team(id));
create policy "coaches create teams" on public.teams for insert with check (public.is_coach() and created_by = auth.uid());

create policy "members see roster" on public.team_members for select using (public.in_team(team_id));

create policy "anyone signed in reads modules" on public.modules for select using (auth.uid() is not null);

create policy "own progress" on public.module_progress for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "coach sees team progress" on public.module_progress for select using (public.coaches_user(user_id));

create policy "team sees events" on public.events for select using (public.in_team(team_id));
create policy "coach manages events" on public.events for all using (public.in_team(team_id) and public.is_coach()) with check (public.in_team(team_id) and public.is_coach());

create policy "own workouts" on public.workouts for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "coach sees team workouts" on public.workouts for select using (public.coaches_user(user_id));

create policy "own journal links" on public.journal_links for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "team reads messages" on public.messages for select using (
  public.in_team(team_id) and not hidden
  and not exists (select 1 from blocks where blocker_id = auth.uid() and blocked_id = messages.user_id)
);
create policy "team posts messages" on public.messages for insert with check (public.in_team(team_id) and user_id = auth.uid());

create policy "coaches read portal" on public.coach_posts for select using (public.is_coach() and not hidden);
create policy "coaches post to portal" on public.coach_posts for insert with check (public.is_coach() and user_id = auth.uid());

create policy "file reports" on public.reports for insert with check (reporter_id = auth.uid());
create policy "own blocks" on public.blocks for all using (blocker_id = auth.uid()) with check (blocker_id = auth.uid());

-- Live team chat
alter publication supabase_realtime add table public.messages;
