import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'
import { Sidebar } from './Sidebar'
import { useDarkMode } from '../../hooks/useDarkMode'
import { Moon, Sun } from 'lucide-react'

export function AppShell() {
  const { isDark, setIsDark } = useDarkMode()

  return (
    <div className="flex min-h-screen bg-carbon-50 dark:bg-black transition-colors duration-500">
      <Sidebar />
      
      <div className="flex-1 flex flex-col relative pb-20 md:pb-0">
        <header className="sticky top-0 z-40 bg-white/50 dark:bg-black/50 backdrop-blur-xl border-b border-carbon-100 dark:border-white/5 px-4 py-4 flex justify-between items-center md:px-12 transition-colors duration-500">
          <div className="md:hidden">
            <h1 className="text-xl font-black tracking-tighter text-black dark:text-white uppercase italic">TOS</h1>
          </div>
          <div className="hidden md:block"></div>
          
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2.5 bg-black text-white dark:bg-white dark:text-black rounded-full shadow-lg hover:scale-110 transition-all duration-300 active:scale-95"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </header>
        
        <main className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-12 overflow-x-hidden">
          <Outlet />
        </main>
        
        <BottomNav />
      </div>
    </div>
  )
}
