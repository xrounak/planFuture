-- profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  avatar_url text,
  total_points integer default 0 not null,
  weekly_points integer default 0 not null,
  current_streak integer default 0 not null,
  longest_streak integer default 0 not null,
  created_at timestamptz default now() not null
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (new.id, split_part(new.email, '@', 1));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- tasks table
create table public.tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  planned_for date not null,
  planned_at timestamptz default now() not null,
  target_points integer default 5 check (target_points between 1 and 5),
  actual_points integer check (actual_points between 0 and 5),
  scored_at timestamptz,
  is_public boolean default true not null,
  created_at timestamptz default now() not null
);

create index tasks_user_date_idx on public.tasks(user_id, planned_for);
create index tasks_date_public_idx on public.tasks(planned_for, is_public);

-- daily_summaries table
create table public.daily_summaries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  date date not null,
  total_tasks integer default 0,
  scored_tasks integer default 0,
  total_possible integer default 0,
  total_earned integer default 0,
  completion_pct numeric(5,2) generated always as (
    case when total_possible > 0
    then round((total_earned::numeric / total_possible::numeric) * 100, 2)
    else 0 end
  ) stored,
  created_at timestamptz default now() not null,
  unique(user_id, date)
);

-- RLS
alter table public.profiles enable row level security;
alter table public.tasks enable row level security;
alter table public.daily_summaries enable row level security;

create policy "profiles_read_all" on public.profiles for select using (true);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

create policy "tasks_read_own" on public.tasks for select using (auth.uid() = user_id or is_public = true);
create policy "tasks_insert_own" on public.tasks for insert with check (auth.uid() = user_id);
create policy "tasks_update_own" on public.tasks for update using (auth.uid() = user_id);
create policy "tasks_delete_own" on public.tasks for delete using (auth.uid() = user_id);

create policy "summaries_read_all" on public.daily_summaries for select using (true);
create policy "summaries_write_own" on public.daily_summaries for all using (auth.uid() = user_id);

-- Leaderboard View
create or replace view public.leaderboard as
select
  p.id,
  p.username,
  p.avatar_url,
  p.total_points,
  p.weekly_points,
  p.current_streak,
  rank() over (order by p.total_points desc) as alltime_rank,
  rank() over (order by p.weekly_points desc) as weekly_rank,
  count(distinct t.planned_for) as days_active
from public.profiles p
left join public.tasks t on t.user_id = p.id and t.actual_points is not null
group by p.id, p.username, p.avatar_url, p.total_points, p.weekly_points, p.current_streak;
