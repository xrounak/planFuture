import { Link } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useGlobalFeed } from '../hooks/useGlobalFeed'
import { FeedItem } from '../components/feed/FeedItem'
import { useAuth } from '../hooks/useAuth'

export function GlobalFeedPage() {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useGlobalFeed()
  const { session } = useAuth()

  return (
    <div className="space-y-6 pb-24">
      <div className="bg-white dark:bg-brand-900 p-6 rounded-2xl shadow-sm border border-brand-100 dark:border-brand-800 flex justify-between items-center text-center px-4 md:px-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Community Feed</h1>
          <p className="text-sm text-brand-600 dark:text-brand-300">See what others are accomplishing</p>
        </div>
        {!session && (
          <Link to="/auth" className="px-4 py-2 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600">
            Login
          </Link>
        )}
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
          </div>
        ) : data?.pages.length && data.pages[0].length > 0 ? (
          <div className="space-y-4">
            {data.pages.map((page, i) => (
              <div key={i} className="space-y-4">
                {page.map((task) => (
                  <FeedItem key={task.id} task={task} />
                ))}
              </div>
            ))}
            
            {hasNextPage && (
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="w-full py-4 text-brand-600 dark:text-brand-400 font-medium hover:bg-brand-50 dark:hover:bg-brand-800 rounded-xl transition-colors disabled:opacity-50"
              >
                {isFetchingNextPage ? 'Loading more...' : 'Load older tasks'}
              </button>
            )}
          </div>
        ) : (
          <div className="text-center p-8 text-brand-600/70 bg-white dark:bg-brand-900 rounded-2xl border border-brand-100 dark:border-brand-800">
            No public tasks found in the last 48h.
          </div>
        )}
      </div>
    </div>
  )
}
