import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useLeaderboard } from '../hooks/useLeaderboard'
import { LeaderboardRow } from '../components/leaderboard/LeaderboardRow'
import { useAuth } from '../hooks/useAuth'

export function LeaderboardPage() {
  const [tab, setTab] = useState<'weekly' | 'alltime'>('weekly')
  const { data: entries, isLoading } = useLeaderboard(tab)
  const { session } = useAuth()

  return (
    <div className="space-y-6 pb-24">
      <div className="bg-white dark:bg-brand-900 p-6 rounded-2xl shadow-sm border border-brand-100 dark:border-brand-800 text-center">
        <h1 className="text-2xl font-bold mb-4">Leaderboard</h1>
        <div className="flex mx-auto bg-brand-50 dark:bg-brand-800 rounded-lg p-1 max-w-xs">
          <button
            onClick={() => setTab('weekly')}
            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${tab === 'weekly' ? 'bg-white dark:bg-brand-700 shadow text-brand-900 dark:text-brand-50' : 'text-brand-600 dark:text-brand-400 hover:text-brand-800'}`}
          >
            This Week
          </button>
          <button
            onClick={() => setTab('alltime')}
            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${tab === 'alltime' ? 'bg-white dark:bg-brand-700 shadow text-brand-900 dark:text-brand-50' : 'text-brand-600 dark:text-brand-400 hover:text-brand-800'}`}
          >
            All Time
          </button>
        </div>
      </div>

      <div className="space-y-2 relative">
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
          </div>
        ) : entries && entries.length > 0 ? (
          entries.map((entry) => (
            <LeaderboardRow 
              key={entry.id} 
              entry={entry} 
              tab={tab} 
              isCurrentUser={session?.user.id === entry.id} 
            />
          ))
        ) : (
          <div className="text-center p-8 text-brand-600/70">No activity yet. Be the first!</div>
        )}
      </div>
    </div>
  )
}
