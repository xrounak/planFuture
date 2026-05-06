import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { format, subDays, parseISO } from 'date-fns'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import CalendarHeatmap from 'react-calendar-heatmap'
import 'react-calendar-heatmap/dist/styles.css'
import { Loader2, Zap, Trophy, Target, Activity, Edit3, User } from 'lucide-react'
import type { Profile, DailySummary, Task } from '../types'
import { FeedItem } from '../components/feed/FeedItem'
import { EditProfileModal } from '../components/profile/EditProfileModal'

export function ProfilePage() {
  const { username } = useParams()
  const { session } = useAuth()
  
  const [profile, setProfile] = useState<Profile | null>(null)
  const [summaries, setSummaries] = useState<DailySummary[]>([])
  const [recentTasks, setRecentTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)

  const isOwnProfile = profile && session?.user.id === profile.id

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

  if (loading) return (
    <div className="flex justify-center p-20">
      <Loader2 className="w-12 h-12 animate-spin text-black dark:text-white" />
    </div>
  )
  
  if (!profile) return (
    <div className="text-center p-20 premium-card border-dashed bg-transparent">
      <p className="text-carbon-400 font-bold uppercase tracking-widest text-sm">Entity not found</p>
    </div>
  )

  const heatmapData = summaries.map(s => ({
    date: s.date,
    count: s.completion_pct
  }))

  const totalPossible = summaries.reduce((acc, obj) => acc + obj.total_possible, 0)
  const totalEarned = summaries.reduce((acc, obj) => acc + obj.total_earned, 0)
  const avgCompletion = totalPossible > 0 ? Math.round((totalEarned / totalPossible) * 100) : 0

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6 border-b border-carbon-100 dark:border-white/5 pb-10">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 sm:gap-8 text-center md:text-left w-full md:w-auto">
          <div className="relative group">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center overflow-hidden text-2xl sm:text-4xl font-black italic border-4 border-white dark:border-black shadow-2xl transition-transform group-hover:scale-105">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.username} className="w-full h-full object-cover" />
              ) : (
                profile.username.substring(0, 2).toUpperCase()
              )}
            </div>
            {isOwnProfile && (
              <button 
                onClick={() => setIsEditing(true)}
                className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 p-2.5 sm:p-3 bg-black text-white dark:bg-white dark:text-black rounded-full shadow-xl hover:scale-110 active:scale-90 transition-all border-2 border-white dark:border-black"
              >
                <Edit3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 text-carbon-400 dark:text-carbon-500 mb-2 font-black uppercase tracking-[0.2em] text-[10px] sm:text-xs justify-center md:justify-start">
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Operator Profile
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tighter text-black dark:text-white italic uppercase leading-none">
              {profile.nickname || profile.username}
            </h1>
            {profile.nickname && (
               <p className="text-md sm:text-lg text-carbon-500 font-bold mt-2 uppercase tracking-tight">@{profile.username}</p>
            )}
            <p className="text-[9px] sm:text-[10px] font-black text-carbon-400 uppercase tracking-widest mt-3 sm:mt-4">
              Active since {format(parseISO(profile.created_at), 'MM.yyyy')}
            </p>
          </div>
        </div>
        <div className="text-center md:text-right hidden sm:block">
          <div className="text-3xl sm:text-5xl font-black text-black dark:text-white tabular-nums tracking-tighter">
            {profile.total_points}
          </div>
          <div className="text-xs font-black text-carbon-400 uppercase tracking-widest mt-1">Accumulated Value</div>
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Points', value: profile.total_points, icon: Trophy },
          { label: 'Streak', value: profile.current_streak, icon: Zap },
          { label: 'Record', value: profile.longest_streak, icon: Activity },
          { label: 'Efficiency', value: `${avgCompletion}%`, icon: Target },
        ].map((stat, i) => (
          <div key={i} className="premium-card p-6 flex flex-col items-center justify-center text-center">
            <stat.icon className="w-5 h-5 text-carbon-400 mb-3" />
            <div className="text-2xl font-black text-black dark:text-white tracking-tighter tabular-nums">{stat.value}</div>
            <div className="text-[10px] font-black text-carbon-400 uppercase tracking-[0.2em] mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="premium-card p-8 bg-transparent">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-carbon-400 mb-8">Performance Heatmap</h3>
        <div className="heatmap-container">
          <CalendarHeatmap
            startDate={subDays(new Date(), 365)}
            endDate={new Date()}
            values={heatmapData}
            classForValue={(value: any) => {
              if (!value || value.count === 0) return 'fill-carbon-100 dark:fill-white/5'
              if (value.count >= 90) return 'fill-black dark:fill-white opacity-100'
              if (value.count >= 70) return 'fill-black dark:fill-white opacity-80'
              if (value.count >= 50) return 'fill-black dark:fill-white opacity-60'
              if (value.count >= 25) return 'fill-black dark:fill-white opacity-40'
              return 'fill-black dark:fill-white opacity-20'
            }}
          />
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-carbon-400 px-2">Historical Logs</h3>
        <div className="space-y-4">
          {recentTasks.map(task => (
             <FeedItem key={task.id} task={task} />
          ))}
          {recentTasks.length === 0 && (
            <div className="text-center p-12 premium-card border-dashed bg-transparent">
              <p className="text-carbon-400 font-bold uppercase tracking-widest text-[10px]">No recent data points recorded</p>
            </div>
          )}
        </div>
      </div>

      {isEditing && profile && (
        <EditProfileModal 
          profile={profile} 
          onClose={() => setIsEditing(false)} 
          onUpdate={(updatedProfile) => {
            setProfile(updatedProfile)
            setIsEditing(false)
          }} 
        />
      )}
    </div>
  )
}
