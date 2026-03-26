import { Download } from 'lucide-react'

export default function ImportData() {
  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center mb-5">
          <Download size={28} strokeWidth={1.5} className="text-primary-500" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Import Data</h2>
        <p className="text-sm text-slate-400 dark:text-slate-500 max-w-md">
          Upload and import participant, plan, and payroll data. This page is coming soon.
        </p>
      </div>
    </div>
  )
}
