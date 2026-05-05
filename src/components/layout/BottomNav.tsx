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
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-brand-900 border-t border-brand-100 dark:border-brand-800 md:hidden z-50">
      <div className="flex justify-around">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center p-3 text-xs font-medium transition-colors ${
                isActive ? 'text-brand-500' : 'text-brand-600/60 dark:text-brand-100/60 hover:text-brand-600 dark:hover:text-brand-100'
              }`
            }
          >
            <Icon className="w-6 h-6 mb-1" />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
