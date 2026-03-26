import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Send,
  CheckCircle2,
  Eye,
  MousePointerClick,
  AlertTriangle,
  BarChart3,
  Percent,
  History,
  MessageSquare,
} from 'lucide-react'
import AnimatedCounter from '../components/ui/AnimatedCounter'
import Sparkline from '../components/ui/Sparkline'
import MiniProgressRing from '../components/ui/MiniProgressRing'
import {
  COMMUNICATION_HISTORY,
  getCommStats,
  getUniqueCampaigns,
} from '../lib/communicationData'
import CommHistoryTable from '../components/ui/CommHistoryTable'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.075, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.075 } },
}

const SPARKLINE_SENT = [5, 8, 12, 15, 20, 28, 35]
const SPARKLINE_DELIVERED = [4, 7, 11, 14, 18, 25, 32]
const SPARKLINE_OPENED = [2, 4, 6, 8, 11, 15, 19]

/* ─── Funnel Bar ───────────────────────────────────────────────────────────── */
function FunnelBar({ label, value, maxValue, color, delay = 0 }) {
  const pct = maxValue > 0 ? (value / maxValue) * 100 : 0
  return (
    <div className="flex items-center gap-3">
      <span className="text-[11px] text-slate-400 dark:text-slate-500 w-16 text-right shrink-0">{label}</span>
      <div className="flex-1 h-3.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      </div>
      <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 w-8 tabular-nums">{value}</span>
    </div>
  )
}

export default function CommunicationHistory() {
  const stats = useMemo(() => getCommStats(COMMUNICATION_HISTORY), [])
  const campaigns = useMemo(() => getUniqueCampaigns(), [])

  const kpiCards = [
    { label: 'Total Sent', value: stats.sent, icon: Send, color: 'blue', sparkData: SPARKLINE_SENT },
    { label: 'Delivered', value: stats.delivered, icon: CheckCircle2, color: 'emerald', sparkData: SPARKLINE_DELIVERED },
    { label: 'Opened', value: stats.opened, icon: Eye, color: 'purple', sparkData: SPARKLINE_OPENED },
    { label: 'Open Rate', value: parseFloat(stats.openRate), suffix: '%', icon: Percent, color: 'amber', ring: parseFloat(stats.openRate) },
  ]

  const kpiColors = {
    blue: { bg: 'bg-blue-50 dark:bg-blue-500/15', icon: 'text-blue-500', spark: '#3B82F6' },
    emerald: { bg: 'bg-emerald-50 dark:bg-emerald-500/15', icon: 'text-emerald-500', spark: '#10B981' },
    purple: { bg: 'bg-purple-50 dark:bg-purple-500/15', icon: 'text-purple-500', spark: '#8B5CF6' },
    amber: { bg: 'bg-amber-50 dark:bg-amber-500/15', icon: 'text-amber-500', spark: '#F59E0B' },
  }

  return (
    <motion.div
      className="p-8 mx-auto space-y-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* ── Hero Header ──────────────────────────────────────────── */}
      <motion.div
        variants={fadeUp}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-50 via-white to-purple-50/40 dark:from-primary-500/5 dark:via-slate-900 dark:to-purple-500/5 border border-slate-200/60 dark:border-slate-800 px-8 py-8"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,91,255,0.06),transparent_50%)]" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center">
              <History size={20} className="text-primary-600 dark:text-primary-400" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Communication History</h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg">
            Review all emails, triggers, and campaign communications across your book of business.
          </p>
          <div className="flex items-center gap-4 mt-4">
            {[
              { label: 'Total Records', value: stats.total },
              { label: 'Sent', value: stats.sent },
              { label: 'Bounced', value: stats.bounced },
              { label: 'Campaigns', value: campaigns.length },
            ].map((b) => (
              <div key={b.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/60 dark:bg-slate-800/60 border border-slate-200/40 dark:border-slate-700/40">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 tabular-nums">{b.value}</span>
                <span className="text-[10px] text-slate-400">{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── KPI Cards ────────────────────────────────────────────── */}
      <motion.div variants={fadeUp} className="grid grid-cols-4 gap-4">
        {kpiCards.map((card) => {
          const colors = kpiColors[card.color]
          const Icon = card.icon
          return (
            <motion.div
              key={card.label}
              whileHover={{ y: -2, boxShadow: '0 8px 25px -5px rgba(0,0,0,0.08)' }}
              className="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-5 text-left overflow-hidden"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center`}>
                  <Icon size={20} strokeWidth={1.75} className={colors.icon} />
                </div>
                {card.sparkData && <Sparkline data={card.sparkData} color={colors.spark} />}
                {card.ring !== undefined && <MiniProgressRing value={card.ring} color="#F59E0B" />}
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight tabular-nums">
                <AnimatedCounter value={card.value} />{card.suffix || ''}
              </p>
              <p className="text-xs font-medium text-slate-400 mt-1">{card.label}</p>
            </motion.div>
          )
        })}
      </motion.div>

      {/* ── Campaign Performance Cards ────────────────────────────── */}
      <motion.div variants={fadeUp}>
        <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
          Campaign Performance
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {campaigns.map((c, idx) => {
            const maxVal = Math.max(c.stats.sent, 1)
            return (
              <motion.div
                key={c.name}
                whileHover={{ y: -2, boxShadow: '0 8px 25px -5px rgba(0,0,0,0.08)' }}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-5 transition-all duration-200"
              >
                {/* Campaign name */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MessageSquare size={16} className="text-primary-500" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">{c.name}</h4>
                    <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                      {c.templateName || 'Multiple templates'}{c.segmentName ? ` \u00B7 ${c.segmentName}` : ''}
                    </p>
                  </div>
                </div>

                {/* Funnel bars */}
                <div className="space-y-1.5 mb-4">
                  <FunnelBar label="Sent" value={c.stats.sent} maxValue={maxVal} color="#3B82F6" delay={idx * 0.1} />
                  <FunnelBar label="Delivered" value={c.stats.delivered} maxValue={maxVal} color="#10B981" delay={idx * 0.1 + 0.1} />
                  <FunnelBar label="Opened" value={c.stats.opened} maxValue={maxVal} color="#8B5CF6" delay={idx * 0.1 + 0.2} />
                  <FunnelBar label="Clicked" value={c.stats.clicked} maxValue={maxVal} color="#6366F1" delay={idx * 0.1 + 0.3} />
                </div>

                {/* Metrics row */}
                <div className="flex items-center gap-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="text-center flex-1">
                    <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">{c.stats.openRate}%</p>
                    <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase">Open Rate</p>
                  </div>
                  <div className="w-px h-8 bg-slate-100 dark:bg-slate-800" />
                  <div className="text-center flex-1">
                    <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">{c.stats.clickRate}%</p>
                    <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase">Click Rate</p>
                  </div>
                  <div className="w-px h-8 bg-slate-100 dark:bg-slate-800" />
                  <div className="text-center flex-1">
                    <p className="text-lg font-bold text-slate-700 dark:text-slate-200 tabular-nums">{c.stats.sent}</p>
                    <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase">Total Sent</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* ── Full History Table ────────────────────────────────────── */}
      <motion.div variants={fadeUp}>
        <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
          All Communications
        </h3>
        <CommHistoryTable records={COMMUNICATION_HISTORY} />
      </motion.div>
    </motion.div>
  )
}
