import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { DailySummary } from '../types'
import { useAuth } from './useAuth'

export function useSubmitDailySummary() {
  const queryClient = useQueryClient()
  const { session } = useAuth()

  return useMutation({
    mutationFn: async (summary: Omit<DailySummary, 'id' | 'created_at' | 'user_id' | 'completion_pct'>) => {
      const { data, error } = await (supabase.from('daily_summaries') as any)
        .upsert({
          ...(summary as any),
          user_id: session!.user.id,
        }, { onConflict: 'user_id,date' })
        .select()
        .single()

      if (error) throw error
      
      const { data: profile } = (await supabase.from('profiles').select('total_points, weekly_points, current_streak, longest_streak').eq('id', session!.user.id).single()) as any
      if (profile) {
        const newStreak = profile.current_streak + 1
        await (supabase.from('profiles') as any).update({
          total_points: profile.total_points + summary.total_earned,
          weekly_points: profile.weekly_points + summary.total_earned,
          current_streak: newStreak,
          longest_streak: Math.max(newStreak, profile.longest_streak)
        }).eq('id', session!.user.id)
      }

      return data as DailySummary
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily_summaries'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] })
    }
  })
}
