import { useMemo } from 'react'
import {
  Send,
  CheckCircle2,
  Eye,
  MousePointerClick,
  AlertTriangle,
  BarChart3,
  Percent,
} from 'lucide-react'
import {
  COMMUNICATION_HISTORY,
  getCommStats,
  getUniqueCampaigns,
} from '../lib/communicationData'
import CommHistoryTable from '../components/ui/CommHistoryTable'

export default function CommunicationHistory() {
  const stats = useMemo(() => getCommStats(COMMUNICATION_HISTORY), [])
  const campaigns = useMemo(() => getUniqueCampaigns(), [])

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white dark:text-white tracking-tight">Communication History</h2>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
          Review all emails, triggers, and campaign communications across your book of business.
        </p>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-7 gap-3">
        {[
          { label: 'Total', value: stats.total, icon: BarChart3, color: 'text-slate-500 bg-slate-50' },
          { label: 'Sent', value: stats.sent, icon: Send, color: 'text-blue-500 bg-blue-50' },
          { label: 'Delivered', value: stats.delivered, icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-50' },
          { label: 'Opened', value: stats.opened, icon: Eye, color: 'text-purple-500 bg-purple-50' },
          { label: 'Clicked', value: stats.clicked, icon: MousePointerClick, color: 'text-indigo-500 bg-indigo-50' },
          { label: 'Bounced', value: stats.bounced, icon: AlertTriangle, color: 'text-red-500 bg-red-50' },
          { label: 'Open Rate', value: stats.openRate + '%', icon: Percent, color: 'text-amber-500 bg-amber-50' },
        ].map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${s.color}`}>
                  <Icon size={14} strokeWidth={2} />
                </div>
              </div>
              <p className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{s.value}</p>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">{s.label}</p>
            </div>
          )
        })}
      </div>

      {/* Campaign summary cards */}
      <div>
        <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
          Campaigns
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {campaigns.map((c) => (
            <div
              key={c.name}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 p-5 hover:shadow-md dark:hover:shadow-slate-900/50 hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-200"
            >
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1 truncate">{c.name}</h4>
              <p className="text-xs text-slate-400 mb-3">
                {c.templateName || 'Multiple templates'} {c.segmentName ? `· ${c.segmentName}` : ''}
              </p>
              <div className="flex items-center gap-4 text-xs">
                <div>
                  <span className="font-bold text-slate-700">{c.stats.sent}</span>
                  <span className="text-slate-400 ml-1">sent</span>
                </div>
                <div>
                  <span className="font-bold text-emerald-600">{c.stats.openRate}%</span>
                  <span className="text-slate-400 ml-1">opened</span>
                </div>
                <div>
                  <span className="font-bold text-indigo-600">{c.stats.clickRate}%</span>
                  <span className="text-slate-400 ml-1">clicked</span>
                </div>
              </div>
              {/* Mini progress bar */}
              <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden flex">
                {c.stats.sent > 0 && (
                  <>
                    <div
                      className="h-full bg-indigo-500 rounded-l-full"
                      style={{ width: `${c.stats.clickRate}%` }}
                    />
                    <div
                      className="h-full bg-purple-400"
                      style={{ width: `${Math.max(0, c.stats.openRate - c.stats.clickRate)}%` }}
                    />
                    <div
                      className="h-full bg-emerald-400"
                      style={{ width: `${Math.max(0, c.stats.deliveryRate - c.stats.openRate)}%` }}
                    />
                  </>
                )}
              </div>
              <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400">
                <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500" />Clicked</div>
                <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-400" />Opened</div>
                <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400" />Delivered</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full history table */}
      <div>
        <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
          All Communications
        </h3>
        <CommHistoryTable records={COMMUNICATION_HISTORY} />
      </div>
    </div>
  )
}
