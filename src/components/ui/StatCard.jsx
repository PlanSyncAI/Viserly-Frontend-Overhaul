import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export default function StatCard({ label, value, icon: Icon, trend, trendLabel }) {
  const trendColor =
    trend === 'up' ? 'text-emerald-600 bg-emerald-50' :
    trend === 'down' ? 'text-red-500 bg-red-50' :
    'text-slate-400 bg-slate-50'

  const TrendIcon =
    trend === 'up' ? TrendingUp :
    trend === 'down' ? TrendingDown :
    Minus

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 p-4 md:p-5 hover:shadow-md dark:hover:shadow-slate-900/50 hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-200 group">
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
        {Icon && (
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-primary-50 transition-colors">
            <Icon size={18} strokeWidth={1.75} className="text-slate-400 group-hover:text-primary-500 transition-colors" />
          </div>
        )}
      </div>
      <div className="flex items-end gap-3">
        <span className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight leading-none">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
        {trendLabel && (
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${trendColor}`}>
            <TrendIcon size={12} />
            <span>{trendLabel}</span>
          </div>
        )}
      </div>
    </div>
  )
}
