import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { LeaderboardEntry } from '../types'

export function useLeaderboard(tab: 'weekly' | 'alltime') {
  return useQuery({
    queryKey: ['leaderboard', tab],
    queryFn: async () => {
      const orderColumn = tab === 'weekly' ? 'weekly_points' : 'total_points'
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order(orderColumn, { ascending: false })
        .limit(50)

      if (error) throw error
      return data as LeaderboardEntry[]
    }
  })
}
