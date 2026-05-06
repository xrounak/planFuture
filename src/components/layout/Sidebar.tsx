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
    <aside className="hidden md:flex flex-col w-64 h-screen border-r border-carbon-200 dark:border-white/10 bg-white dark:bg-black sticky top-0 transition-colors duration-500">
      <div className="p-8">
        <h1 className="text-2xl font-black tracking-tighter text-black dark:text-white uppercase italic">Tomorrow OS</h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-1 mt-4">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-2xl transition-all duration-300 font-bold tracking-tight ${
                isActive 
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-xl shadow-black/10 dark:shadow-white/5' 
                  : 'text-carbon-400 hover:text-black dark:text-carbon-600 dark:hover:text-white hover:bg-carbon-100 dark:hover:bg-white/5'
              }`
            }
          >
            <Icon className="w-5 h-5 mr-3" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-6">
        <button 
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-carbon-400 dark:text-carbon-600 hover:text-red-500 transition-all duration-300 font-bold"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </aside>
  )
}
