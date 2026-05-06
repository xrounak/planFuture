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
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-lg bg-black/90 dark:bg-white/90 backdrop-blur-xl border border-white/10 dark:border-black/10 rounded-full md:hidden z-50 shadow-2xl transition-all duration-500 overflow-hidden">
      <div className="flex justify-around items-center px-4 py-3">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center p-2 transition-all duration-500 ${
                isActive 
                  ? 'text-white dark:text-black scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' 
                  : 'text-carbon-500/50 dark:text-carbon-400/50 hover:text-white dark:hover:text-black'
              }`
            }
          >
            <Icon className="w-6 h-6" />
            <span className="text-[10px] font-black uppercase tracking-tighter mt-0.5">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
