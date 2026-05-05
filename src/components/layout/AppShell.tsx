import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'
import { useDarkMode } from '../../hooks/useDarkMode'
import { Moon, Sun } from 'lucide-react'

export function AppShell() {
  const { isDark, setIsDark } = useDarkMode()

  return (
    <div className="pb-16 md:pb-0 relative">
      <header className="absolute top-4 right-4 z-50">
        <button
          onClick={() => setIsDark(!isDark)}
          className="p-2 bg-white dark:bg-brand-900 rounded-full shadow-sm border border-brand-100 dark:border-brand-800 text-brand-600 dark:text-brand-300"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </header>
      <main className="max-w-2xl mx-auto min-h-screen p-4 md:p-8 pt-16">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
