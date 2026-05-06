import { Link } from 'react-router-dom'
import { Loader2, Globe } from 'lucide-react'
import { useGlobalFeed } from '../hooks/useGlobalFeed'
import { FeedItem } from '../components/feed/FeedItem'
import { useAuth } from '../hooks/useAuth'

export function GlobalFeedPage() {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useGlobalFeed()
  const { session } = useAuth()

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-end border-b border-carbon-100 dark:border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-2 text-carbon-400 dark:text-carbon-500 mb-2 font-black uppercase tracking-[0.2em] text-xs">
            <Globe className="w-4 h-4" />
            Global Pulse
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-black dark:text-white italic uppercase leading-none">Community</h1>
          <p className="text-lg text-carbon-500 font-medium mt-3 uppercase tracking-tight">Public Achievement Log</p>
        </div>
        {!session && (
          <Link to="/auth" className="px-8 py-3 bg-black text-white dark:bg-white dark:text-black rounded-full font-black uppercase tracking-tighter hover:scale-105 transition-transform">
            Join Now
          </Link>
        )}
      </header>

      <div className="pb-32">
        {isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-10 h-10 animate-spin text-black dark:text-white" />
          </div>
        ) : data?.pages.length && data.pages[0].length > 0 ? (
          <div className="space-y-6">
            {data.pages.map((page, i) => (
              <div key={i} className="space-y-6">
                {page.map((task) => (
                  <FeedItem key={task.id} task={task} />
                ))}
              </div>
            ))}
            
            {hasNextPage && (
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="w-full py-6 text-carbon-500 dark:text-carbon-400 font-black uppercase tracking-widest hover:text-black dark:hover:text-white transition-colors disabled:opacity-50"
              >
                {isFetchingNextPage ? 'Retrieving Data...' : 'Scroll to Load More'}
              </button>
            )}
          </div>
        ) : (
          <div className="text-center p-20 premium-card border-dashed bg-transparent">
            <p className="text-carbon-400 font-bold uppercase tracking-widest text-sm">Silence in the ether</p>
          </div>
        )}
      </div>
    </div>
  )
}
