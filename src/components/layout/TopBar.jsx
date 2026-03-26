import { Search, Bell, Moon, Sun } from 'lucide-react'
import { useTheme } from '../../lib/useTheme'

export default function TopBar({ title }) {
  const { dark, toggle } = useTheme()

  return (
    <header className="h-16 flex items-center justify-between px-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-100 dark:border-slate-800 sticky top-0 z-30">
      <h1 className="text-lg font-semibold text-slate-900 dark:text-white tracking-tight">{title}</h1>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-9 pr-4 py-2 w-64 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 dark:focus:border-primary-500 transition-all"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium text-slate-400 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded px-1.5 py-0.5">
            /
          </kbd>
        </div>

        {/* Dark mode toggle */}
        <button
          onClick={toggle}
          className="relative p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {dark ? <Sun size={20} strokeWidth={1.75} /> : <Moon size={20} strokeWidth={1.75} />}
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
          <Bell size={20} strokeWidth={1.75} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full" />
        </button>

        {/* User Avatar */}
        <button className="flex items-center gap-2.5 pl-3 pr-1 py-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Cameron</span>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
            <span className="text-white text-xs font-semibold">CA</span>
          </div>
        </button>
      </div>
    </header>
  )
}
