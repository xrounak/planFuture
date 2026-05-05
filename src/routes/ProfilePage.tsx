import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { format, subDays, parseISO } from 'date-fns'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import CalendarHeatmap from 'react-calendar-heatmap'
import 'react-calendar-heatmap/dist/styles.css'
import { Loader2, Zap, Trophy, Target, Activity } from 'lucide-react'
import type { Profile, DailySummary, Task } from '../types'
import { FeedItem } from '../components/feed/FeedItem'

export function ProfilePage() {
  const { username } = useParams()
  const { session } = useAuth()
  
  const [profile, setProfile] = useState<Profile | null>(null)
  const [summaries, setSummaries] = useState<DailySummary[]>([])
  const [recentTasks, setRecentTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      let userId = session?.user?.id
      
      if (username) {
        const { data: p } = (await supabase.from('profiles').select('*').eq('username', username).single()) as any
        if (p) userId = p.id
      }

      if (!userId) {
        setLoading(false)
        return
      }

      const { data: pData } = (await supabase.from('profiles').select('*').eq('id', userId).single()) as any
      if (pData) setProfile(pData as Profile)

      const oneYearAgo = subDays(new Date(), 365).toISOString()
      const { data: sData } = await supabase
        .from('daily_summaries')
        .select('*')
        .eq('user_id', userId)
        .gte('date', oneYearAgo)

      if (sData) setSummaries(sData as DailySummary[])

      const { data: tData } = await supabase
        .from('tasks')
        .select('*, profiles(username, avatar_url)')
        .eq('user_id', userId)
        .not('actual_points', 'is', null)
        .order('scored_at', { ascending: false })
        .limit(10)

      if (tData) setRecentTasks(tData as Task[])
      setLoading(false)
    }
    
    loadData()
  }, [username, session?.user.id])

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-brand-500" /></div>
  if (!profile) return <div className="text-center p-8">Profile not found</div>

  const heatmapData = summaries.map(s => ({
    date: s.date,
    count: s.completion_pct
  }))

  const totalPossible = summaries.reduce((acc, obj) => acc + obj.total_possible, 0)
  const totalEarned = summaries.reduce((acc, obj) => acc + obj.total_earned, 0)
  const avgCompletion = totalPossible > 0 ? Math.round((totalEarned / totalPossible) * 100) : 0

  return (
    <div className="space-y-6 pb-24">
      <div className="bg-white dark:bg-brand-900 rounded-2xl shadow-sm border border-brand-100 dark:border-brand-800 p-6 flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
        <div className="w-24 h-24 rounded-full bg-brand-200 text-brand-700 dark:bg-brand-700 dark:text-brand-300 flex items-center justify-center overflow-hidden text-3xl font-bold">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt={profile.username} className="w-full h-full object-cover" />
          ) : (
            profile.username.substring(0, 2).toUpperCase()
          )}
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-brand-900 dark:text-brand-50">{profile.username}</h1>
          <p className="text-sm text-brand-500 mt-1">Joined {format(parseISO(profile.created_at), 'MMM yyyy')}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-brand-900 p-4 rounded-xl border border-brand-100 dark:border-brand-800">
           <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 mb-2"><Trophy className="w-4 h-4" /> Points</div>
           <div className="text-2xl font-bold">{profile.total_points}</div>
        </div>
        <div className="bg-white dark:bg-brand-900 p-4 rounded-xl border border-brand-100 dark:border-brand-800">
           <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 mb-2"><Zap className="w-4 h-4" /> Streak</div>
           <div className="text-2xl font-bold">{profile.current_streak}</div>
        </div>
        <div className="bg-white dark:bg-brand-900 p-4 rounded-xl border border-brand-100 dark:border-brand-800">
           <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 mb-2"><Activity className="w-4 h-4" /> Best</div>
           <div className="text-2xl font-bold">{profile.longest_streak} <span className="text-sm font-normal text-brand-400">Days</span></div>
        </div>
        <div className="bg-white dark:bg-brand-900 p-4 rounded-xl border border-brand-100 dark:border-brand-800">
           <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 mb-2"><Target className="w-4 h-4" /> Avg</div>
           <div className="text-2xl font-bold">{avgCompletion}%</div>
        </div>
      </div>

      <div className="bg-white dark:bg-brand-900 p-6 rounded-2xl shadow-sm border border-brand-100 dark:border-brand-800">
        <h3 className="font-bold mb-4">Activity Heatmap</h3>
        <CalendarHeatmap
          startDate={subDays(new Date(), 365)}
          endDate={new Date()}
          values={heatmapData}
          classForValue={(value: any) => {
            if (!value) return 'fill-brand-100 dark:fill-brand-950'
            if (value.count >= 100) return 'fill-score-5'
            if (value.count >= 80) return 'fill-score-4'
            if (value.count >= 50) return 'fill-score-3'
            if (value.count >= 25) return 'fill-score-2'
            if (value.count > 0) return 'fill-score-1'
            return 'fill-brand-100 dark:fill-brand-950'
          }}
          tooltipDataAttrs={(value: any) => {
            if (!value || !value.date) return {} as any
            return {
              'data-tip': `${value.date}: ${value.count}% completion`,
            } as any
          }}
        />
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-lg px-2">Recent Scored Tasks</h3>
        {recentTasks.map(task => (
           <FeedItem key={task.id} task={task} />
        ))}
        {recentTasks.length === 0 && <p className="text-center text-brand-600/70 p-4">No recently scored tasks.</p>}
      </div>
    </div>
  )
}
