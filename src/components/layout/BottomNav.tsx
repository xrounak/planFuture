import { NavLink } from 'react-router-dom'
import { CalendarRange, CheckSquare, Globe, Navigation, User } from 'lucide-react'

export function BottomNav() {
  const links = [
    { to: '/plan', icon: CalendarRange, label: 'Plan' },
    { to: '/review', icon: CheckSquare, label: 'Review' },
    { to: '/feed', icon: Globe, label: 'Feed' },
    { to: '/leaderboard', icon: Navigation, label: 'Leaders' },
    { to: '/profile', icon: User, label: 'Profile' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-brand-900/80 backdrop-blur-lg border-t border-brand-200 dark:border-brand-800 md:hidden z-50 safe-area-pb">
      <div className="flex justify-around items-center px-2 py-2">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center p-2 rounded-xl text-[10px] font-semibold transition-all duration-300 ${isActive
                ? 'text-brand-600 dark:text-brand-300 transform scale-110'
                : 'text-brand-400/70 dark:text-brand-500/70 hover:text-brand-600 dark:hover:text-brand-400'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-6 h-6 mb-1 ${isActive ? 'drop-shadow-md' : ''}`} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
