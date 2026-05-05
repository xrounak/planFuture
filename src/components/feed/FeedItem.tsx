import { formatDistanceToNow, parseISO } from 'date-fns'
import { Target, Star } from 'lucide-react'
import type { Task } from '../../types'

interface Props {
  task: Task
}

export function FeedItem({ task }: Props) {
  const profile = task.profiles
  const isScored = task.actual_points !== null
  const isPerfect = task.actual_points === task.target_points

  return (
    <div className={`flex gap-4 p-4 rounded-xl transition-all ${isPerfect ? 'bg-brand-50 dark:bg-brand-800/80 border border-brand-300 dark:border-brand-500 shadow-sm' : 'bg-white dark:bg-brand-900 border border-brand-100 dark:border-brand-800'}`}>
      <div className="w-12 h-12 rounded-full flex-shrink-0 bg-brand-200 text-brand-700 dark:bg-brand-700 dark:text-brand-300 flex items-center justify-center overflow-hidden">
        {profile?.avatar_url ? (
          <img src={profile.avatar_url} alt={profile.username} className="w-full h-full object-cover" />
        ) : (
          <span className="font-bold">{profile?.username?.substring(0, 2).toUpperCase() || '??'}</span>
        )}
      </div>
      
      <div className="flex-1 min-w-0 pt-1">
        <div className="flex items-baseline justify-between gap-2">
          <h4 className="font-bold text-sm text-brand-900 dark:text-brand-50">{profile?.username || 'Unknown User'}</h4>
          <span className="text-xs text-brand-500/80 flex-shrink-0">{formatDistanceToNow(parseISO(task.created_at), { addSuffix: true })}</span>
        </div>
        
        <p className="text-sm mt-1 text-brand-800 dark:text-brand-100 break-words">{task.title}</p>
        {task.description && <p className="text-xs mt-1 text-brand-600/70">{task.description}</p>}
        
        <div className="mt-3 flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-brand-400 bg-brand-100/50 dark:bg-brand-950 px-2 py-1 rounded-md">
            <Target className="w-3.5 h-3.5" />
            <span>Target: {task.target_points}</span>
          </div>
          
          {isScored && (
            <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md ${isPerfect ? 'bg-score-5 text-white shadow-sm' : 'bg-brand-100 dark:bg-brand-800 text-brand-700 dark:text-brand-300'}`}>
              <Star className={`w-3.5 h-3.5 ${isPerfect ? 'fill-current' : ''}`} />
              <span>Score: {task.actual_points}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
