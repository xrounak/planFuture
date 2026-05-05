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
