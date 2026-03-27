import { Menu, Moon, Sun } from 'lucide-react'
import { useTheme } from '../../lib/useTheme'

export default function MobileHeader({ onMenuOpen }) {
  const { dark, toggle } = useTheme()

  return (
    <header className="h-14 flex items-center justify-between px-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-100 dark:border-slate-800 sticky top-0 z-30">
      <button
        onClick={onMenuOpen}
        className="p-2 -ml-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
      >
        <Menu size={22} strokeWidth={1.75} />
      </button>

      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-sm shadow-primary-500/20">
          <span className="text-white font-bold text-xs">V</span>
        </div>
        <span className="font-semibold text-slate-900 dark:text-white text-base tracking-tight">Viserly</span>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={toggle}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          {dark ? <Sun size={18} strokeWidth={1.75} /> : <Moon size={18} strokeWidth={1.75} />}
        </button>
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
          <span className="text-white text-[10px] font-semibold">CA</span>
        </div>
      </div>
    </header>
  )
}
