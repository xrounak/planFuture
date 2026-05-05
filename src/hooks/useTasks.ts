import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Task } from '../types'
import { useAuth } from './useAuth'

export function useTasks(date: string) {
  const { session } = useAuth()
  return useQuery({
    queryKey: ['tasks', session?.user.id, date],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', session!.user.id)
        .eq('planned_for', date)
        .order('created_at', { ascending: true })

      if (error) throw error
      return (data || []) as Task[]
    },
    enabled: !!session?.user.id,
  })
}

export function useCreateTask() {
  const queryClient = useQueryClient()
  const { session } = useAuth()

  return useMutation({
    mutationFn: async (newTask: Omit<Task, 'id' | 'created_at' | 'user_id' | 'planned_at' | 'actual_points' | 'scored_at'>) => {
      const { data, error } = await (supabase.from('tasks') as any)
        .insert({
          ...(newTask as any),
          user_id: session!.user.id,
        })
        .select()
        .single()

      if (error) throw error
      return data!
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', session?.user.id, data?.planned_for] })
    }
  })
}

export function useDeleteTask() {
  const queryClient = useQueryClient()
  const { session } = useAuth()

  return useMutation({
    mutationFn: async ({ id, date }: { id: string, date: string }) => {
      const { error } = await supabase.from('tasks').delete().eq('id', id)
      if (error) throw error
      return { id, date }
    },
    onSuccess: (deleted) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', session?.user.id, deleted.date] })
    }
  })
}

export function useScoreTask() {
  const queryClient = useQueryClient()
  const { session } = useAuth()
  
  return useMutation({
    mutationFn: async ({ id, actual_points }: { id: string, actual_points: number }) => {
      const { data, error } = await (supabase.from('tasks') as any)
        .update({ actual_points, scored_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()
        
      if (error) throw error
      return data as Task
    },
    onSuccess: (data: Task) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', session?.user.id, data.planned_for] })
      queryClient.invalidateQueries({ queryKey: ['daily_summaries'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] })
    }
  })
}
