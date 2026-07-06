-- The Biohacker Operating System™ — Supabase schema
-- Two layers:
--   A) "vaults" — whole-document sync (what SupabaseAdapter uses today)
--   B) normalized tables — optional future migration for per-record queries
-- Run in the Supabase SQL editor.

-- ————————————————— A) Document vault —————————————————

create table if not exists public.vaults (
  user_id uuid primary key references auth.users (id) on delete cascade,
  doc jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.vaults enable row level security;

create policy "own vault read"  on public.vaults for select using (auth.uid() = user_id);
create policy "own vault write" on public.vaults for insert with check (auth.uid() = user_id);
create policy "own vault update" on public.vaults for update using (auth.uid() = user_id);

-- ————————————————— B) Normalized layer (optional) —————————————————
-- Every record is scoped to (user_id, profile_id) mirroring the app's types.

create table if not exists public.profiles (
  id text not null,
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null check (kind in ('self','spouse','child','parent','custom')),
  name text not null,
  emoji text not null default '🌿',
  created_at date not null default current_date,
  primary key (user_id, id)
);

create table if not exists public.records (
  id text not null,
  user_id uuid not null references auth.users (id) on delete cascade,
  profile_id text not null,
  kind text not null,           -- 'injectable' | 'injection_log' | 'hormone' | 'symptom_log'
                                -- | 'supplement' | 'supplement_check' | 'red_light' | 'cold_plunge'
                                -- | 'sauna' | 'tool_session' | 'daily_log' | 'lab' | 'appointment'
                                -- | 'wearable' | 'lifestyle' | 'provider_question' | 'pet'
  data jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);

create index if not exists records_by_kind on public.records (user_id, profile_id, kind);

alter table public.profiles enable row level security;
alter table public.records  enable row level security;

create policy "own profiles" on public.profiles for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own records" on public.records for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
