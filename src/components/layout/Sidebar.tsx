import { NavLink } from 'react-router-dom'
import { CalendarRange, CheckSquare, Globe, Navigation, User, LogOut } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export function Sidebar() {
  const links = [
    { to: '/plan', icon: CalendarRange, label: 'Plan' },
    { to: '/review', icon: CheckSquare, label: 'Review' },
    { to: '/feed', icon: Globe, label: 'Feed' },
    { to: '/leaderboard', icon: Navigation, label: 'Leaders' },
    { to: '/profile', icon: User, label: 'Profile' },
  ]

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen border-r border-brand-200 dark:border-brand-800 bg-white/80 dark:bg-brand-900/80 backdrop-blur-md sticky top-0">
      <div className="p-6">
        <h1 className="text-2xl font-extrabold bg-gradient-to-r from-brand-600 to-violet-500 bg-clip-text text-transparent">TomorrowOS</h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                isActive 
                  ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30' 
                  : 'text-brand-600/70 dark:text-brand-300/70 hover:bg-brand-50 dark:hover:bg-brand-800/50 hover:text-brand-900 dark:hover:text-brand-50'
              }`
            }
          >
            <Icon className="w-5 h-5 mr-3" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-brand-200 dark:border-brand-800">
        <button 
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-brand-600/70 dark:text-brand-300/70 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-xl transition-all duration-300 font-medium"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
