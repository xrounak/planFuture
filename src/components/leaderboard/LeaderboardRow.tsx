import type { LeaderboardEntry } from '../../types'
import { Trophy, Flame } from 'lucide-react'
import { useRef } from 'react'

interface Props {
  entry: LeaderboardEntry
  tab: 'weekly' | 'alltime'
  isCurrentUser: boolean
}

export function LeaderboardRow({ entry, tab, isCurrentUser }: Props) {
  const rank = tab === 'weekly' ? entry.weekly_rank : entry.alltime_rank
  const points = tab === 'weekly' ? entry.weekly_points : entry.total_points
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    cardRef.current.style.setProperty('--mouse-x', `${x}%`)
    cardRef.current.style.setProperty('--mouse-y', `${y}%`)
  }

  let rankDisplay = <span className="font-black text-carbon-400 w-8 text-center text-xl tracking-tighter">{rank}</span>
  if (rank === 1) rankDisplay = <Trophy className="w-7 h-7 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
  else if (rank === 2) rankDisplay = <Trophy className="w-6 h-6 text-carbon-300" />
  else if (rank === 3) rankDisplay = <Trophy className="w-6 h-6 text-carbon-600" />

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`premium-card p-4 flex items-center gap-5 transition-all duration-500 ${
        isCurrentUser ? 'border-white/30 bg-white/5 dark:bg-white/10 shadow-2xl z-10' : ''
      }`}
    >
      <div className="flex items-center justify-center w-10">
        {rankDisplay}
      </div>

      <div className="w-12 h-12 rounded-full bg-black text-white dark:bg-white dark:text-black border border-white/10 dark:border-black/10 flex items-center justify-center overflow-hidden flex-shrink-0 text-md font-black italic tracking-tighter">
        {entry.avatar_url ? (
          <img src={entry.avatar_url} alt={entry.username} className="w-full h-full object-cover" />
        ) : (
          entry.username.substring(0, 2).toUpperCase()
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-black text-lg text-black dark:text-white uppercase italic tracking-tight truncate">
          {entry.username}
          {isCurrentUser && <span className="ml-2 text-[10px] bg-black text-white dark:bg-white dark:text-black px-2 py-0.5 rounded-full not-italic">YOU</span>}
        </h4>
        <div className="flex items-center gap-4 mt-1">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-carbon-400 uppercase tracking-tighter">Score</span>
            <span className="font-black text-black dark:text-white leading-none">{points}</span>
          </div>
          <div className="flex flex-col border-l border-carbon-100 dark:border-white/5 pl-4">
            <span className="text-[10px] font-black text-carbon-400 uppercase tracking-tighter">Streak</span>
            <div className="flex items-center gap-1 font-black text-black dark:text-white leading-none">
              <Flame className="w-3.5 h-3.5 text-black dark:text-white" />
              {entry.current_streak}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
