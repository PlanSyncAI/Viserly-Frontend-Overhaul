export default function QuickActionCard({ label, icon: Icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-3 p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 hover:border-primary-200 hover:shadow-md hover:shadow-primary-500/5 transition-all duration-200 cursor-pointer group"
    >
      <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center group-hover:bg-primary-100 group-hover:scale-105 transition-all duration-200">
        <Icon size={22} strokeWidth={1.75} className="text-primary-500" />
      </div>
      <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
        {label}
      </span>
    </button>
  )
}
