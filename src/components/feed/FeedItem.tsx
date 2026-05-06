import { formatDistanceToNow, parseISO } from 'date-fns'
import { Target, Star } from 'lucide-react'
import type { Task } from '../../types'
import { useRef } from 'react'

interface Props {
  task: Task
}

export function FeedItem({ task }: Props) {
  const profile = task.profiles
  const isScored = task.actual_points !== null
  const isPerfect = task.actual_points === task.target_points
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    cardRef.current.style.setProperty('--mouse-x', `${x}%`)
    cardRef.current.style.setProperty('--mouse-y', `${y}%`)
  }

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`premium-card p-4 sm:p-6 flex gap-3 sm:gap-5 transition-all duration-500 ${isPerfect ? 'border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.05)]' : ''}`}
    >
      <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full flex-shrink-0 bg-black text-white dark:bg-white dark:text-black border border-white/10 dark:border-black/10 flex items-center justify-center overflow-hidden text-sm sm:text-lg font-black italic tracking-tighter">
        {profile?.avatar_url ? (
          <img src={profile.avatar_url} alt={profile.username} className="w-full h-full object-cover" />
        ) : (
          profile?.username?.substring(0, 2).toUpperCase() || '??'
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4 className="font-black text-base sm:text-lg text-black dark:text-white tracking-tight leading-none uppercase italic truncate">
            {profile?.username || 'ANONYMOUS'}
          </h4>
          <span className="text-[9px] sm:text-[10px] font-black text-carbon-400 dark:text-carbon-600 uppercase tracking-widest whitespace-nowrap">
            {formatDistanceToNow(parseISO(task.created_at), { addSuffix: true })}
          </span>
        </div>
        
        <p className="text-sm sm:text-md mt-1.5 sm:mt-2 text-carbon-800 dark:text-carbon-100 font-bold leading-tight line-clamp-2">{task.title}</p>
        
        <div className="mt-4 sm:mt-5 flex items-center gap-3 sm:gap-4">
          <div className="flex flex-col">
            <span className="text-[8px] sm:text-[10px] font-black text-carbon-400 uppercase tracking-tighter mb-0.5">Objective</span>
            <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-black text-black dark:text-white bg-carbon-100/50 dark:bg-white/5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-black/5 dark:border-white/5">
              <Target className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
              <span>{task.target_points}</span>
            </div>
          </div>
          
          {isScored && (
            <div className="flex flex-col">
              <span className="text-[8px] sm:text-[10px] font-black text-carbon-400 uppercase tracking-tighter mb-0.5">Achievement</span>
              <div className={`flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-black px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border ${
                isPerfect 
                  ? 'bg-black text-white dark:bg-white dark:text-black border-transparent shadow-lg' 
                  : 'bg-carbon-100/50 dark:bg-white/5 text-black dark:text-white border-black/5 dark:border-white/5'
              }`}>
                <Star className={`w-3 sm:w-3.5 h-3 sm:h-3.5 ${isPerfect ? 'fill-current' : ''}`} />
                <span>{task.actual_points}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
