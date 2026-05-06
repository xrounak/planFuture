import { useState } from 'react'
import { Loader2, Trophy } from 'lucide-react'
import { useLeaderboard } from '../hooks/useLeaderboard'
import { LeaderboardRow } from '../components/leaderboard/LeaderboardRow'
import { useAuth } from '../hooks/useAuth'

export function LeaderboardPage() {
  const [tab, setTab] = useState<'weekly' | 'alltime'>('weekly')
  const { data: entries, isLoading } = useLeaderboard(tab)
  const { session } = useAuth()

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-end border-b border-carbon-100 dark:border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-2 text-carbon-400 dark:text-carbon-500 mb-2 font-black uppercase tracking-[0.2em] text-xs">
            <Trophy className="w-4 h-4" />
            Rankings
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-black dark:text-white italic uppercase leading-none">Leaders</h1>
          <div className="flex bg-carbon-100/50 dark:bg-white/5 p-1 rounded-full mt-4 w-fit">
            <button
              onClick={() => setTab('weekly')}
              className={`px-6 py-1.5 text-xs font-black uppercase tracking-tighter rounded-full transition-all ${tab === 'weekly' ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg' : 'text-carbon-500 hover:text-black dark:hover:text-white'}`}
            >
              Weekly
            </button>
            <button
              onClick={() => setTab('alltime')}
              className={`px-6 py-1.5 text-xs font-black uppercase tracking-tighter rounded-full transition-all ${tab === 'alltime' ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg' : 'text-carbon-500 hover:text-black dark:hover:text-white'}`}
            >
              All Time
            </button>
          </div>
        </div>
        <div className="text-right hidden sm:block">
          <div className="text-sm font-black text-carbon-400 uppercase tracking-widest mb-1">Status</div>
          <div className="text-2xl font-black text-black dark:text-white uppercase italic tracking-tighter">Elite Tier</div>
        </div>
      </header>

      <div className="pb-32 space-y-3">
        {isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-10 h-10 animate-spin text-black dark:text-white" />
          </div>
        ) : entries && entries.length > 0 ? (
          <div className="space-y-4">
            {entries.map((entry) => (
              <LeaderboardRow 
                key={entry.id} 
                entry={entry} 
                tab={tab} 
                isCurrentUser={session?.user.id === entry.id} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center p-20 premium-card border-dashed bg-transparent">
             <p className="text-carbon-400 font-bold uppercase tracking-widest text-sm">No legends yet recorded</p>
          </div>
        )}
      </div>
    </div>
  )
}
