import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'
import { Sidebar } from './Sidebar'
import { useDarkMode } from '../../hooks/useDarkMode'
import { Moon, Sun } from 'lucide-react'

export function AppShell() {
  const { isDark, setIsDark } = useDarkMode()

  return (
    <div className="flex min-h-screen bg-brand-50/50 dark:bg-slate-950/50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col relative pb-16 md:pb-0">
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-brand-900/80 backdrop-blur-md border-b border-brand-200 dark:border-brand-800 px-4 py-3 flex justify-between items-center md:px-8">
          <div className="md:hidden">
            <h1 className="text-xl font-bold bg-gradient-to-r from-brand-600 to-violet-500 bg-clip-text text-transparent">TomorrowOS</h1>
          </div>
          <div className="hidden md:block"></div> {/* Spacer for desktop */}
          
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 bg-white dark:bg-brand-800 rounded-full shadow-sm border border-brand-200 dark:border-brand-700 text-brand-600 dark:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-700 transition-colors"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </header>
        
        <main className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-8 overflow-x-hidden">
          <Outlet />
        </main>
        
        <BottomNav />
      </div>
    </div>
  )
}
