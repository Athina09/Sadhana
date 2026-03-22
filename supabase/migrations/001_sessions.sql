-- Paste into Supabase → SQL Editor → Run

create table if not exists public.sessions (
  id uuid primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  ended_at timestamptz not null,
  session_name text not null,
  total_questions int not null,
  time_per_question int not null,
  questions jsonb not null default '[]'::jsonb,
  inserted_at timestamptz not null default now()
);

create index if not exists sessions_user_ended_idx
  on public.sessions (user_id, ended_at desc);

alter table public.sessions enable row level security;

create policy "sessions_select_own" on public.sessions for select
  using (auth.uid() = user_id);
create policy "sessions_insert_own" on public.sessions for insert
  with check (auth.uid() = user_id);
create policy "sessions_update_own" on public.sessions for update
  using (auth.uid() = user_id);
create policy "sessions_delete_own" on public.sessions for delete
  using (auth.uid() = user_id);
