import type { Task } from '../types'

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
