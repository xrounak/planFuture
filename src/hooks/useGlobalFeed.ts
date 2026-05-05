import { useEffect } from 'react'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Task } from '../types'

export function useGlobalFeed() {
  const queryClient = useQueryClient()

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
        () => {
          queryClient.invalidateQueries({ queryKey: ['global-feed'] })
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [queryClient])

  return useInfiniteQuery({
    queryKey: ['global-feed'],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          profiles (
            username,
            avatar_url
          )
        `)
        .eq('is_public', true)
        .gte('created_at', new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .range(pageParam * 20, (pageParam + 1) * 20 - 1)

      if (error) throw error
      return data as Task[]
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 20 ? allPages.length : undefined
    }
  })
}
