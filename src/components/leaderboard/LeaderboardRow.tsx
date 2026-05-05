import type { LeaderboardEntry } from '../../types'
import { Trophy, Flame } from 'lucide-react'

interface Props {
  entry: LeaderboardEntry
  tab: 'weekly' | 'alltime'
  isCurrentUser: boolean
}

export function LeaderboardRow({ entry, tab, isCurrentUser }: Props) {
  const rank = tab === 'weekly' ? entry.weekly_rank : entry.alltime_rank
  const points = tab === 'weekly' ? entry.weekly_points : entry.total_points

  let rankDisplay = <span className="font-bold text-brand-500 w-6 text-center">{rank}</span>
  if (rank === 1) rankDisplay = <Trophy className="w-6 h-6 text-yellow-500" />
  else if (rank === 2) rankDisplay = <Trophy className="w-6 h-6 text-slate-400" />
  else if (rank === 3) rankDisplay = <Trophy className="w-6 h-6 text-amber-700" />

  return (
    <div className={`flex items-center gap-4 p-4 rounded-xl ${isCurrentUser ? 'bg-brand-100 dark:bg-brand-800 border-2 border-brand-300 dark:border-brand-500 sticky top-4 bottom-20 shadow-md z-10' : 'bg-white dark:bg-brand-900 border border-brand-50 dark:border-brand-800'}`}>
      <div className="flex items-center justify-center w-8">
        {rankDisplay}
      </div>

      <div className="w-10 h-10 rounded-full bg-brand-200 text-brand-600 dark:bg-brand-700 dark:text-brand-300 flex items-center justify-center overflow-hidden flex-shrink-0">
        {entry.avatar_url ? (
          <img src={entry.avatar_url} alt={entry.username} className="w-full h-full object-cover" />
        ) : (
          <span className="font-bold text-sm">{entry.username.substring(0, 2).toUpperCase()}</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-brand-900 dark:text-brand-50 truncate">{entry.username}</h4>
        <div className="flex items-center gap-2 text-xs font-medium mt-0.5">
          <span className="text-brand-500">{points} pts</span>
          <span className="text-brand-300">&bull;</span>
          <span className="text-brand-600/70 flex items-center gap-0.5">
            <Flame className="w-3 h-3 text-score-1" />
            {entry.current_streak}
          </span>
        </div>
      </div>
    </div>
  )
}
