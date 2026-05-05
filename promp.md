# TomorrowOS — MCP / System Prompt for AI-Assisted Development

> Paste this entire file as the **system prompt** in Cursor, Windsurf, or any AI coding agent.
> It works as an MCP-style spec: the model knows the full schema, feature set, and conventions before writing a single line.

---

## 🎯 Project Identity

You are building **TomorrowOS** — a personal productivity web app where users:
1. **Plan tomorrow's tasks** (the night before)
2. **Score each task at end of day** (0–5 points, how much they completed it)
3. **See a global community feed** and **leaderboard** of other users' progress

**Tagline**: *"Plan tonight. Score tomorrow."*

---

## 🗂️ Tech Stack (exact versions, do not deviate)

| Layer | Choice |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS v3 |
| Backend | Supabase (Auth, DB, Realtime, Storage) |
| Data fetching | TanStack Query (React Query) v5 |
| State | Zustand (UI state only; server state via React Query) |
| Routing | React Router v6 |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |
| Deploy | Vercel |
| Language | TypeScript (strict mode) |

---

## 🗄️ Supabase Schema

Run these migrations in order. Use `supabase/migrations/` folder.

### `profiles` table
```sql
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
```

### `tasks` table
```sql
create table public.tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  planned_for date not null,           -- the date this task is planned FOR (tomorrow)
  planned_at timestamptz default now() not null,  -- when it was planned
  target_points integer default 5 check (target_points between 1 and 5),
  actual_points integer check (actual_points between 0 and 5),
  scored_at timestamptz,
  is_public boolean default true not null,
  created_at timestamptz default now() not null
);

-- Index for date queries
create index tasks_user_date_idx on public.tasks(user_id, planned_for);
create index tasks_date_public_idx on public.tasks(planned_for, is_public);
```

### `daily_summaries` table
```sql
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
```

### Row Level Security (RLS) — CRITICAL
```sql
-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.tasks enable row level security;
alter table public.daily_summaries enable row level security;

-- profiles: users read all, update own
create policy "profiles_read_all" on public.profiles for select using (true);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- tasks: read own + public; write own only
create policy "tasks_read_own" on public.tasks for select
  using (auth.uid() = user_id or is_public = true);
create policy "tasks_insert_own" on public.tasks for insert
  with check (auth.uid() = user_id);
create policy "tasks_update_own" on public.tasks for update
  using (auth.uid() = user_id);
create policy "tasks_delete_own" on public.tasks for delete
  using (auth.uid() = user_id);

-- daily_summaries: read all (for global), write own
create policy "summaries_read_all" on public.daily_summaries for select using (true);
create policy "summaries_write_own" on public.daily_summaries for all
  using (auth.uid() = user_id);
```

### Leaderboard View
```sql
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
```

---

## 📁 Project Structure

```
src/
├── main.tsx
├── App.tsx
├── routes/
│   ├── index.tsx            # React Router config
│   ├── AuthPage.tsx
│   ├── PlanPage.tsx         # Plan tomorrow's tasks
│   ├── ReviewPage.tsx       # Score today's tasks
│   ├── GlobalFeedPage.tsx   # Community feed
│   ├── LeaderboardPage.tsx  
│   └── ProfilePage.tsx      
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx     # Nav + layout wrapper
│   │   └── BottomNav.tsx    # Mobile bottom nav
│   ├── tasks/
│   │   ├── TaskCard.tsx
│   │   ├── TaskForm.tsx
│   │   └── ScoreSlider.tsx  # 0–5 point scoring widget
│   ├── feed/
│   │   ├── FeedItem.tsx
│   │   └── FeedList.tsx
│   ├── leaderboard/
│   │   └── LeaderboardRow.tsx
│   └── ui/
│       ├── Avatar.tsx
│       ├── ProgressRing.tsx # SVG ring showing daily completion %
│       └── StreakBadge.tsx
├── hooks/
│   ├── useTasks.ts
│   ├── useReview.ts
│   ├── useGlobalFeed.ts
│   └── useLeaderboard.ts
├── lib/
│   ├── supabase.ts          # Supabase client singleton
│   ├── queryClient.ts       # TanStack Query config
│   └── scoring.ts           # Scoring utility functions
├── store/
│   └── uiStore.ts           # Zustand: modals, active date, etc.
├── types/
│   └── index.ts             # All TypeScript interfaces
└── styles/
    └── globals.css          # Tailwind + custom CSS vars
```

---

## 🔌 `src/lib/supabase.ts` (exact implementation)

```typescript
import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'  // generate with: supabase gen types typescript

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: { eventsPerSecond: 5 }
  }
})
```

---

## 🏗️ TypeScript Types (`src/types/index.ts`)

```typescript
export interface Profile {
  id: string
  username: string
  avatar_url: string | null
  total_points: number
  weekly_points: number
  current_streak: number
  longest_streak: number
  created_at: string
}

export interface Task {
  id: string
  user_id: string
  title: string
  description: string | null
  planned_for: string           // ISO date string 'YYYY-MM-DD'
  planned_at: string
  target_points: 1 | 2 | 3 | 4 | 5
  actual_points: 0 | 1 | 2 | 3 | 4 | 5 | null
  scored_at: string | null
  is_public: boolean
  created_at: string
  // joined
  profiles?: Pick<Profile, 'username' | 'avatar_url'>
}

export interface DailySummary {
  id: string
  user_id: string
  date: string
  total_tasks: number
  scored_tasks: number
  total_possible: number
  total_earned: number
  completion_pct: number
}

export interface LeaderboardEntry {
  id: string
  username: string
  avatar_url: string | null
  total_points: number
  weekly_points: number
  current_streak: number
  alltime_rank: number
  weekly_rank: number
  days_active: number
}

export type ScoreValue = 0 | 1 | 2 | 3 | 4 | 5

// Score labels for the ScoreSlider component
export const SCORE_LABELS: Record<ScoreValue, string> = {
  0: 'Not done',
  1: 'Barely started',
  2: 'Made progress',
  3: 'Halfway there',
  4: 'Almost done',
  5: 'Completed!',
}
```

---

## 🎣 Custom Hooks (implement these)

### `src/hooks/useTasks.ts`
```typescript
// Fetch tasks for a specific date for the logged-in user
export function useTasks(date: string) { ... }

// Create a new task (plan phase)
export function useCreateTask() { ... }

// Update task score (review phase) — also updates daily_summaries + profiles.total_points
export function useScoreTask() { ... }

// Delete a task
export function useDeleteTask() { ... }
```

### `src/hooks/useGlobalFeed.ts`
```typescript
// Fetch recent public tasks with profiles joined
// Subscribe to Supabase Realtime for live updates
// Return tasks from the last 48h, is_public=true, scored or not
export function useGlobalFeed() { ... }
```

### `src/hooks/useLeaderboard.ts`
```typescript
// Query the leaderboard view
// tab: 'weekly' | 'alltime'
export function useLeaderboard(tab: 'weekly' | 'alltime') { ... }
```

---

## 📱 Page Specifications

### `PlanPage.tsx` — Plan Tomorrow

**URL**: `/plan`
**Access**: authenticated
**Logic**:
- Default date = tomorrow (`new Date() + 1 day`)
- User can only plan for future dates (today or tomorrow)
- Tasks list for selected date
- Floating "+ Add Task" button → modal with `TaskForm`
- TaskForm fields: `title` (required), `description` (optional), `target_points` (1–5 stars, default 5), `is_public` toggle

**UX rules**:
- If it's past 6 PM, automatically suggest planning for tomorrow
- Show task count per day in date picker
- Drag-to-reorder tasks (use `@dnd-kit/core`)

---

### `ReviewPage.tsx` — Score Today's Tasks

**URL**: `/review`
**Access**: authenticated
**Logic**:
- Defaults to today's tasks
- Show each task with `ScoreSlider` (0–5)
- Disable scoring if `scored_at` is already set (show score as read-only)
- "Submit Review" button — saves all scores, computes daily_summary, updates profile.total_points
- Show `ProgressRing` with today's completion % after submission

**ScoreSlider design**:
- Horizontal slider 0–5 with emoji + label below
- 0 = ❌, 1 = 🌱, 2 = 🔄, 3 = ⚡, 4 = 🎯, 5 = ✅
- Color transitions from red → yellow → green

**Score computation** (in `src/lib/scoring.ts`):
```typescript
export function computeDailyScore(tasks: Task[]): {
  total_possible: number
  total_earned: number
  completion_pct: number
} {
  const scored = tasks.filter(t => t.actual_points !== null)
  const total_possible = scored.reduce((s, t) => s + t.target_points, 0)
  const total_earned = scored.reduce((s, t) => s + (t.actual_points ?? 0), 0)
  return {
    total_possible,
    total_earned,
    completion_pct: total_possible > 0 ? Math.round((total_earned / total_possible) * 100) : 0,
  }
}
```

---

### `GlobalFeedPage.tsx` — Community Feed

**URL**: `/feed`
**Access**: public (but show "login to plan" CTA for guests)
**Logic**:
- Show recent scored tasks (is_public=true) from all users
- Group by user + date: show avatar, username, "scored X tasks today, earned Y/Z points"
- Subscribe to Supabase Realtime channel `tasks` INSERT/UPDATE for live updates
- Infinite scroll pagination (page size: 20)

**Feed item design**:
- Left: user avatar (initials fallback)
- Right: task title, score badge (actual/target), time ago
- Highlight tasks with 5/5 score with a subtle glow or star icon

---

### `LeaderboardPage.tsx`

**URL**: `/leaderboard`
**Access**: public
**Logic**:
- Two tabs: "This Week" (weekly_points) / "All Time" (total_points)
- Show top 50 users
- Highlight current user's row (sticky if off-screen)
- Show: rank, avatar, username, points, streak

---

### `ProfilePage.tsx`

**URL**: `/profile` (own) or `/profile/:username` (others)
**Logic**:
- Stats: total_points, current_streak, longest_streak, days_active, avg completion %
- Task history calendar heatmap (like GitHub — use `react-calendar-heatmap`)
- Recent scored tasks list

---

## 🎨 Design System

Use Tailwind with this custom color palette in `tailwind.config.js`:

```javascript
colors: {
  brand: {
    50:  '#f0fdf4',
    100: '#dcfce7',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    900: '#14532d',
  },
  score: {
    0: '#ef4444',   // red — not done
    1: '#f97316',   // orange
    2: '#eab308',   // yellow
    3: '#84cc16',   // lime
    4: '#22c55e',   // green
    5: '#10b981',   // emerald
  }
}
```

**Dark mode**: use `class` strategy in Tailwind. Detect from system preference via `useMediaQuery`.

---

## ⚡ Realtime Subscription Pattern

```typescript
// In useGlobalFeed.ts
useEffect(() => {
  const channel = supabase
    .channel('global-tasks')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'tasks',
        filter: 'is_public=eq.true',
      },
      (payload) => {
        queryClient.invalidateQueries({ queryKey: ['global-feed'] })
      }
    )
    .subscribe()

  return () => { supabase.removeChannel(channel) }
}, [])
```

---

## 🔑 Auth Flow

- Use **Supabase Magic Link** (email OTP) — no passwords
- `AuthPage.tsx`: single email input → send magic link → confirm screen
- Protect all routes except `/feed` and `/leaderboard` using a `<ProtectedRoute>` wrapper
- On session restore, redirect to `/plan`

---

## 🌍 Environment Variables

Create `.env.local`:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 📐 Coding Conventions

1. **No `any` types** — use `unknown` or proper generics
2. **All Supabase queries** use the typed client: `supabase.from('tasks').select()` returns typed rows
3. **Date handling** — always use `date-fns` library. Never raw `new Date()` arithmetic.
   - `format(new Date(), 'yyyy-MM-dd')` for DB queries
   - `addDays(new Date(), 1)` for tomorrow
4. **React Query keys** — always namespaced: `['tasks', userId, date]`, `['leaderboard', tab]`
5. **Error boundaries** — wrap each page in `<ErrorBoundary fallback={<ErrorState />}>`
6. **Loading states** — every query shows a skeleton, not a spinner
7. **Optimistic updates** — `useScoreTask` must update cache before server confirms
8. **Mobile-first** — design for 375px width, then scale up

---

## 🚀 Build Order (implement in this sequence)

1. Supabase project setup + schema migrations
2. `src/lib/supabase.ts` + type generation
3. Auth flow (`AuthPage`, `ProtectedRoute`, session hook)
4. `PlanPage` — task creation, listing, deletion
5. `ReviewPage` — `ScoreSlider`, scoring logic, daily summary write
6. `LeaderboardPage` — leaderboard view query
7. `GlobalFeedPage` — feed query + Realtime subscription
8. `ProfilePage` — stats + heatmap
9. Polish: animations, dark mode, PWA manifest

---

## 🧪 Test Checklist

Before each PR, manually verify:
- [ ] Can create tasks for tomorrow
- [ ] Cannot score tasks that aren't today's
- [ ] Score submission updates `total_points` in `profiles`
- [ ] Global feed shows other users' public tasks in realtime
- [ ] Leaderboard correctly ranks by weekly vs all-time
- [ ] RLS: user cannot see/edit other users' private tasks
- [ ] Streak updates correctly when a day is skipped

---

*End of MCP Prompt — TomorrowOS v1.0*
