import { useState, useMemo, useId, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  UserPlus,
  Mail,
  Upload,
  Link,
  Users,
  Send,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Eye,
  MessageSquareReply,
  MousePointerClick,
  Zap,
  ChevronRight,
  X,
  AlertTriangle,
  Lightbulb,
  CalendarClock,
  Clock,
  Sparkles,
  Target,
  DollarSign,
} from 'lucide-react'
import AnimatedCounter from '../components/ui/AnimatedCounter'
import Sparkline from '../components/ui/Sparkline'
import MiniProgressRing from '../components/ui/MiniProgressRing'
import LinkPayrollModal from '../components/ui/LinkPayrollModal'
import {
  COMMUNICATION_HISTORY,
  getCommStats,
  getUniqueCampaigns,
  COMM_STATUS_STYLES,
} from '../lib/communicationData'
import { DUMMY_SEGMENTATIONS } from '../lib/segmentationData'
import { DUMMY_DEALS, DEAL_STAGES, STAGE_DOT_COLORS, getPipelineStats } from '../lib/pipelineData'

/* ─── Animation Variants ────────────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.075, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.075 } },
}

/* ─── Mock sparkline data ───────────────────────────────────────────────────── */
const SPARKLINE_CONTACTS = [680, 695, 700, 712, 720, 738, 751]
const SPARKLINE_EMAILS = [22, 18, 31, 26, 29, 24, 32]
const SPARKLINE_CAMPAIGNS = [1, 1, 2, 2, 3, 3, 3]

/* ─── Upcoming scheduled sends (mock) ───────────────────────────────────────── */
const UPCOMING_SENDS = [
  {
    id: 1,
    name: 'Q2 Benefits Enrollment Reminder',
    segment: 'High Balance Participants',
    recipients: 87,
    scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
  },
  {
    id: 2,
    name: 'New Hire Welcome Campaign',
    segment: 'New Hires 2026',
    recipients: 34,
    scheduledAt: new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString(), // ~1 day from now
  },
  {
    id: 3,
    name: 'Birthday Outreach - April',
    segment: 'California Employees',
    recipients: 112,
    scheduledAt: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(), // ~3 days from now
  },
]

function formatTimeUntil(isoDate) {
  const diff = new Date(isoDate) - new Date()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(hours / 24)
  if (days > 0) return `${days}d ${hours % 24}h`
  if (hours > 0) return `${hours}h`
  return 'Soon'
}

/* ─── Area Chart with Hover Tooltip ─────────────────────────────────────────── */
function AreaChart({ data, width = 800, height = 220 }) {
  const id = useId()
  const svgRef = useRef(null)
  const [hover, setHover] = useState(null)

  const padding = { top: 20, right: 20, bottom: 32, left: 44 }
  const chartW = width - padding.left - padding.right
  const chartH = height - padding.top - padding.bottom

  function buildSeries(values, maxVal) {
    const points = values.map((v, i) => ({
      x: padding.left + (i / (values.length - 1)) * chartW,
      y: padding.top + chartH - (v / maxVal) * chartH,
    }))
    let line = `M ${points[0].x},${points[0].y}`
    for (let i = 0; i < points.length - 1; i++) {
      const cpx = (points[i].x + points[i + 1].x) / 2
      line += ` C ${cpx},${points[i].y} ${cpx},${points[i + 1].y} ${points[i + 1].x},${points[i + 1].y}`
    }
    const area = `${line} L ${points[points.length - 1].x},${padding.top + chartH} L ${points[0].x},${padding.top + chartH} Z`
    return { line, area, points }
  }

  const maxVal = Math.max(...data.map((d) => d.sent)) * 1.15
  const sentSeries = buildSeries(data.map((d) => d.sent), maxVal)
  const openedSeries = buildSeries(data.map((d) => d.opened), maxVal)
  const clickedSeries = buildSeries(data.map((d) => d.clicked), maxVal)
  const repliedSeries = buildSeries(data.map((d) => d.replied), maxVal)
  const yTicks = Array.from({ length: 5 }, (_, i) => Math.round((maxVal / 4) * i))

  // Find nearest data point on mouse move
  const handleMouseMove = useCallback((e) => {
    if (!svgRef.current) return
    const rect = svgRef.current.getBoundingClientRect()
    const mouseX = ((e.clientX - rect.left) / rect.width) * width
    // Find closest data point
    let closest = 0
    let minDist = Infinity
    sentSeries.points.forEach((p, i) => {
      const dist = Math.abs(p.x - mouseX)
      if (dist < minDist) { minDist = dist; closest = i }
    })
    setHover(closest)
  }, [sentSeries.points, width])

  const hoverPoint = hover !== null ? sentSeries.points[hover] : null
  const hoverData = hover !== null ? data[hover] : null

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        width="100%"
        viewBox={`0 0 ${width} ${height}`}
        className="overflow-visible"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id={`${id}-sent`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#635BFF" stopOpacity={0.2} />
            <stop offset="100%" stopColor="#635BFF" stopOpacity={0} />
          </linearGradient>
          <linearGradient id={`${id}-opened`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.12} />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id={`${id}-clicked`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10B981" stopOpacity={0.1} />
            <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
          </linearGradient>
          <linearGradient id={`${id}-replied`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#14B8A6" stopOpacity={0.1} />
            <stop offset="100%" stopColor="#14B8A6" stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {yTicks.map((tick) => {
          const y = padding.top + chartH - (tick / maxVal) * chartH
          return (
            <g key={tick}>
              <line x1={padding.left} y1={y} x2={padding.left + chartW} y2={y} stroke="currentColor" className="text-slate-200 dark:text-slate-700" strokeDasharray="4 4" strokeWidth={1} />
              <text x={padding.left - 8} y={y + 4} textAnchor="end" className="text-[10px] fill-slate-400 dark:fill-slate-500">{tick}</text>
            </g>
          )
        })}

        {/* X-axis labels */}
        {data.map((d, i) => {
          const x = padding.left + (i / (data.length - 1)) * chartW
          return i % 2 === 0 ? (
            <text key={d.label} x={x} y={height - 6} textAnchor="middle" className="text-[10px] fill-slate-400 dark:fill-slate-500">{d.label}</text>
          ) : null
        })}

        {/* Areas */}
        <motion.path d={sentSeries.area} fill={`url(#${id}-sent)`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }} />
        <motion.path d={openedSeries.area} fill={`url(#${id}-opened)`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.6 }} />
        <motion.path d={clickedSeries.area} fill={`url(#${id}-clicked)`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.7 }} />
        <motion.path d={repliedSeries.area} fill={`url(#${id}-replied)`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.8 }} />

        {/* Lines */}
        <motion.path d={sentSeries.line} stroke="#635BFF" strokeWidth={1.5} strokeLinecap="round" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: 'easeOut' }} />
        <motion.path d={openedSeries.line} stroke="#8B5CF6" strokeWidth={1.5} strokeLinecap="round" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: 'easeOut', delay: 0.1 }} />
        <motion.path d={clickedSeries.line} stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }} />
        <motion.path d={repliedSeries.line} stroke="#14B8A6" strokeWidth={1.5} strokeLinecap="round" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }} />

        {/* End dots */}
        {[
          { series: sentSeries, color: '#635BFF' },
          { series: openedSeries, color: '#8B5CF6' },
          { series: clickedSeries, color: '#10B981' },
          { series: repliedSeries, color: '#14B8A6' },
        ].map(({ series, color }, idx) => (
          <motion.circle key={color} cx={series.points[series.points.length - 1].x} cy={series.points[series.points.length - 1].y} r={3} fill="white" stroke={color} strokeWidth={1.5} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: 1.2 + idx * 0.1 }} />
        ))}

        {/* Hover crosshair + dots */}
        {hoverPoint && (
          <>
            <line x1={hoverPoint.x} y1={padding.top} x2={hoverPoint.x} y2={padding.top + chartH} stroke="#CBD5E1" strokeWidth={1} strokeDasharray="3 3" />
            <circle cx={sentSeries.points[hover].x} cy={sentSeries.points[hover].y} r={3.5} fill="white" stroke="#635BFF" strokeWidth={1.5} />
            <circle cx={openedSeries.points[hover].x} cy={openedSeries.points[hover].y} r={3} fill="white" stroke="#8B5CF6" strokeWidth={1.5} />
            <circle cx={clickedSeries.points[hover].x} cy={clickedSeries.points[hover].y} r={3} fill="white" stroke="#10B981" strokeWidth={1.5} />
            <circle cx={repliedSeries.points[hover].x} cy={repliedSeries.points[hover].y} r={3} fill="white" stroke="#14B8A6" strokeWidth={1.5} />
          </>
        )}
      </svg>

      {/* Floating tooltip */}
      <AnimatePresence>
        {hoverData && hoverPoint && (
          <motion.div
            className="absolute pointer-events-none z-10 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg px-4 py-3 min-w-[140px]"
            style={{
              left: `${(hoverPoint.x / width) * 100}%`,
              top: `${((padding.top + chartH * 0.1) / height) * 100}%`,
              transform: 'translateX(-50%)',
            }}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
          >
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 mb-2">{hoverData.label}</p>
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#635BFF]" /><span className="text-[11px] text-slate-500">Sent</span></div>
                <span className="text-[11px] font-bold text-slate-700 tabular-nums">{hoverData.sent}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#8B5CF6]" /><span className="text-[11px] text-slate-500">Opened</span></div>
                <span className="text-[11px] font-bold text-slate-700 tabular-nums">{hoverData.opened}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#10B981]" /><span className="text-[11px] text-slate-500">Clicked</span></div>
                <span className="text-[11px] font-bold text-slate-700 tabular-nums">{hoverData.clicked}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#14B8A6]" /><span className="text-[11px] text-slate-500">Replied</span></div>
                <span className="text-[11px] font-bold text-slate-700 tabular-nums">{hoverData.replied}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Campaign Funnel Bar ───────────────────────────────────────────────────── */
function FunnelBar({ label, value, maxValue, color, delay = 0 }) {
  const pct = maxValue > 0 ? (value / maxValue) * 100 : 0
  return (
    <div className="flex items-center gap-3">
      <span className="text-[11px] text-slate-400 w-16 text-right shrink-0">{label}</span>
      <div className="flex-1 h-5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
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

/* ─── Timeline Event Colors ─────────────────────────────────────────────────── */
const EVENT_DOT = {
  'Email Sent': 'bg-blue-500',
  'Email Delivered': 'bg-emerald-500',
  'Email Opened': 'bg-purple-500',
  'Email Clicked': 'bg-indigo-500',
  'Email Replied': 'bg-teal-500',
  'Email Bounced': 'bg-red-500',
  'Trigger Fired': 'bg-amber-500',
  'Campaign Enrolled': 'bg-primary-500',
}

/* ─── Smart Insights Generator ──────────────────────────────────────────────── */
function generateInsights(stats, campaigns, segments) {
  const insights = []

  if (stats.bounced > 0) {
    insights.push({
      type: 'warning',
      icon: AlertTriangle,
      color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20',
      message: `${stats.bounced} email${stats.bounced > 1 ? 's' : ''} bounced recently — consider cleaning your contact list.`,
    })
  }

  if (stats.openRate > 60) {
    insights.push({
      type: 'success',
      icon: TrendingUp,
      color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20',
      message: `Your ${stats.openRate}% open rate is above industry average (21%). Great subject lines!`,
    })
  }

  const growingSegment = segments.find((s) => s.contactCount > 100)
  if (growingSegment) {
    insights.push({
      type: 'tip',
      icon: Lightbulb,
      color: 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-500/10 border-primary-200 dark:border-primary-500/20',
      message: `"${growingSegment.name}" has ${growingSegment.contactCount} contacts — consider a targeted campaign.`,
    })
  }

  if (stats.clickRate > 0) {
    insights.push({
      type: 'insight',
      icon: Sparkles,
      color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/20',
      message: `${stats.clickRate}% click-through rate — recipients are engaging with your content.`,
    })
  }

  return insights.slice(0, 3)
}

/* ═══════════════════════════════════════════════════════════════════════════════
   Main Home Page
   ═══════════════════════════════════════════════════════════════════════════════ */
export default function Home() {
  const navigate = useNavigate()
  const [payrollModalOpen, setPayrollModalOpen] = useState(false)
  const [chartRange, setChartRange] = useState(14)
  const [dismissedInsights, setDismissedInsights] = useState(new Set())

  const today = new Date()
  const greeting = today.getHours() < 12 ? 'Good morning' : today.getHours() < 18 ? 'Good afternoon' : 'Good evening'
  const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

  const stats = useMemo(() => getCommStats(COMMUNICATION_HISTORY), [])
  const campaigns = useMemo(() => getUniqueCampaigns(), [])
  const insights = useMemo(() => generateInsights(stats, campaigns, DUMMY_SEGMENTATIONS), [stats, campaigns])
  const visibleInsights = insights.filter((_, i) => !dismissedInsights.has(i))

  // Build chart data based on selected range
  const chartData = useMemo(() => {
    const days = []
    for (let i = chartRange - 1; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = d.toISOString().slice(0, 10)
      days.push({
        date: key,
        label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        sent: 0,
        opened: 0,
        clicked: 0,
        replied: 0,
      })
    }
    COMMUNICATION_HISTORY.forEach((rec) => {
      if (!rec.sentAt) return
      const key = rec.sentAt.slice(0, 10)
      const day = days.find((d) => d.date === key)
      if (day) {
        day.sent++
        if (rec.openedAt) day.opened++
        if (rec.clickedAt) day.clicked++
        if (rec.repliedAt) day.replied++
      }
    })
    // Fill empty days with slight random so chart isn't flat
    days.forEach((d) => {
      if (d.sent === 0) {
        d.sent = Math.floor(Math.random() * 8) + 2
        d.opened = Math.floor(d.sent * 0.65)
        d.clicked = Math.floor(d.opened * 0.35)
        d.replied = Math.floor(d.clicked * 0.4)
      }
    })
    return days
  }, [chartRange])

  const recentActivity = useMemo(() => {
    return [...COMMUNICATION_HISTORY]
      .sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt))
      .slice(0, 8)
  }, [])

  // Context line for greeting
  const contextLine = `${campaigns.length} active campaign${campaigns.length !== 1 ? 's' : ''} · ${stats.sent} emails sent · ${DUMMY_SEGMENTATIONS.length} segments`

  return (
    <div className="p-4 md:p-8 mx-auto space-y-6 md:space-y-8">

      {/* ═══ Section 1: Premium Welcome Hero ═══ */}
      <motion.div
        className="relative overflow-hidden rounded-2xl p-8 border border-transparent dark:border-slate-800 dark:bg-slate-900"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-blue-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-400/10 dark:bg-primary-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-400/10 dark:bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-purple-400/10 dark:bg-purple-500/8 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

        <div className="relative flex flex-col md:flex-row items-start md:justify-between gap-4">
          <div>
            <motion.h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white" variants={fadeUp} custom={0}>
              {greeting},{' '}
              <span className="bg-gradient-to-r from-primary-600 to-primary-400 dark:from-primary-400 dark:to-primary-300 bg-clip-text text-transparent">Cameron</span>
            </motion.h2>
            <motion.p className="text-sm text-slate-400 mt-1.5" variants={fadeUp} custom={1}>
              {dateStr}
            </motion.p>
            <motion.p className="text-xs text-slate-400/80 mt-1" variants={fadeUp} custom={2}>
              {contextLine}
            </motion.p>
          </div>

          <motion.div className="flex items-center gap-2 flex-wrap" variants={fadeUp} custom={2}>
            {[
              { icon: Send, value: stats.sent, label: 'emails sent', bg: 'bg-primary-50 dark:bg-primary-500/15', color: 'text-primary-500' },
              { icon: Eye, value: `${stats.openRate}%`, label: 'open rate', bg: 'bg-emerald-50 dark:bg-emerald-500/15', color: 'text-emerald-500' },
              { icon: MousePointerClick, value: `${stats.clickRate}%`, label: 'click rate', bg: 'bg-purple-50 dark:bg-purple-500/15', color: 'text-purple-500' },
              { icon: MessageSquareReply, value: stats.replied, label: 'replied', bg: 'bg-teal-50 dark:bg-teal-500/15', color: 'text-teal-500' },
            ].map(({ icon: Icon, value, label, bg, color }) => (
              <div key={label} className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/80 dark:border-slate-700/80 shadow-sm">
                <div className={`w-6 h-6 rounded-md ${bg} flex items-center justify-center`}>
                  <Icon size={12} className={color} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200 tabular-nums">{value}</p>
                  <p className="text-[10px] text-slate-400">{label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* ═══ Quick Actions ═══ */}
      <div>
        <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">Quick Actions</h3>
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {[
            { icon: UserPlus, label: 'Create Contact', desc: 'Add a new participant record', gradient: 'from-primary-500 to-primary-400', href: '/participant-data' },
            { icon: Mail, label: 'Create Email', desc: 'Draft a new email template', gradient: 'from-blue-500 to-blue-400', href: '/templates' },
            { icon: Upload, label: 'Upload Data', desc: 'Import participant or plan data', gradient: 'from-purple-500 to-purple-400', href: '/import-data' },
            { icon: Link, label: 'Link Payroll', desc: 'Connect a payroll provider', gradient: 'from-emerald-500 to-emerald-400', onClick: () => setPayrollModalOpen(true) },
          ].map(({ icon: Icon, label, desc, gradient, onClick, href }) => (
            <motion.button
              key={label}
              onClick={onClick || (() => navigate(href))}
              className="group relative flex items-start gap-4 p-5 bg-white/70 dark:bg-slate-800 backdrop-blur-sm rounded-2xl border border-slate-200/60 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600 hover:shadow-lg hover:shadow-slate-200/40 dark:hover:shadow-slate-900/40 transition-all duration-300 text-left cursor-pointer"
              variants={fadeUp}
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0 shadow-sm group-hover:shadow-md transition-shadow`}>
                <Icon size={18} strokeWidth={1.75} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-slate-800">{label}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{desc}</p>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* ═══ Smart Insights Banner ═══ */}
      <AnimatePresence>
        {visibleInsights.length > 0 && (
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {insights.map((insight, idx) => {
              if (dismissedInsights.has(idx)) return null
              const Icon = insight.icon
              return (
                <motion.div
                  key={idx}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${insight.color}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0, padding: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  layout
                >
                  <Icon size={16} className="shrink-0" />
                  <p className="text-sm flex-1">{insight.message}</p>
                  <button
                    onClick={() => setDismissedInsights((prev) => new Set([...prev, idx]))}
                    className="p-1 rounded-md hover:bg-black/5 transition-colors cursor-pointer shrink-0"
                  >
                    <X size={14} />
                  </button>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ KPI Stat Cards (Clickable) ═══ */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {[
          {
            icon: Users, label: 'Total Contacts', value: 751, trend: '+12.5%', trendDir: 'up',
            sparkline: SPARKLINE_CONTACTS, color: 'primary', sparkColor: '#635BFF', href: '/participant-data',
          },
          {
            icon: Send, label: 'Emails Sent', value: stats.sent, trend: '+8.3%', trendDir: 'up',
            sparkline: SPARKLINE_EMAILS, color: 'blue', sparkColor: '#3B82F6', href: '/communication-history',
          },
          {
            icon: Eye, label: 'Open Rate', value: stats.openRate, suffix: '%', trend: '+3.2%', trendDir: 'up',
            ring: true, color: 'purple', href: '/communication-history',
          },
          {
            icon: Zap, label: 'Active Campaigns', value: campaigns.length, trend: '+2', trendDir: 'up',
            sparkline: SPARKLINE_CAMPAIGNS, color: 'emerald', sparkColor: '#10B981', href: '/campaigns',
          },
        ].map((card) => {
          const Icon = card.icon
          const TrendIcon = card.trendDir === 'up' ? TrendingUp : TrendingDown
          const colorMap = {
            primary: { bg: 'bg-primary-50 dark:bg-primary-500/15', bgHover: 'bg-primary-100 dark:bg-primary-500/25', icon: 'text-primary-500', glow: 'bg-primary-50/40 dark:bg-primary-500/5', glowHover: 'bg-primary-100/50', border: 'hover:from-primary-300/60 hover:via-primary-200/30 hover:to-primary-300/60' },
            blue: { bg: 'bg-blue-50 dark:bg-blue-500/15', bgHover: 'bg-blue-100 dark:bg-blue-500/25', icon: 'text-blue-500', glow: 'bg-blue-50/40 dark:bg-blue-500/5', glowHover: 'bg-blue-100/50', border: 'hover:from-blue-300/60 hover:via-blue-200/30 hover:to-blue-300/60' },
            purple: { bg: 'bg-purple-50 dark:bg-purple-500/15', bgHover: 'bg-purple-100 dark:bg-purple-500/25', icon: 'text-purple-500', glow: 'bg-purple-50/40 dark:bg-purple-500/5', glowHover: 'bg-purple-100/50', border: 'hover:from-purple-300/60 hover:via-purple-200/30 hover:to-purple-300/60' },
            emerald: { bg: 'bg-emerald-50 dark:bg-emerald-500/15', bgHover: 'bg-emerald-100 dark:bg-emerald-500/25', icon: 'text-emerald-500', glow: 'bg-emerald-50/40 dark:bg-emerald-500/5', glowHover: 'bg-emerald-100/50', border: 'hover:from-emerald-300/60 hover:via-emerald-200/30 hover:to-emerald-300/60' },
          }
          const c = colorMap[card.color]

          return (
            <motion.div
              key={card.label}
              className={`group relative rounded-2xl p-[1px] bg-gradient-to-br from-slate-200/80 via-slate-100/50 to-slate-200/80 dark:from-slate-700/80 dark:via-slate-800/50 dark:to-slate-700/80 ${c.border} transition-all duration-300 cursor-pointer`}
              variants={fadeUp}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(card.href)}
            >
              <div className="relative bg-white dark:bg-slate-900 rounded-[15px] p-5 h-full overflow-hidden">
                <div className={`absolute top-0 right-0 w-32 h-32 ${c.glow} rounded-full blur-2xl -translate-y-1/2 translate-x-1/3 group-hover:${c.glowHover} transition-colors duration-300`} />
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-9 h-9 rounded-xl ${c.bg} flex items-center justify-center group-hover:${c.bgHover} transition-colors`}>
                      <Icon size={18} strokeWidth={1.75} className={c.icon} />
                    </div>
                    {card.ring ? (
                      <MiniProgressRing value={stats.openRate} size={36} strokeWidth={3.5} color="#8B5CF6" trackColor="#E2E8F0" />
                    ) : (
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold">
                        <TrendIcon size={11} />
                        {card.trend}
                      </div>
                    )}
                  </div>
                  <AnimatedCounter value={card.value} suffix={card.suffix || ''} className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight tabular-nums block" />
                  <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-0.5">{card.label}</p>
                  {card.sparkline && (
                    <div className="mt-3">
                      <Sparkline data={card.sparkline} color={card.sparkColor} width={140} height={36} />
                    </div>
                  )}
                  {card.ring && (
                    <div className="flex items-center gap-1 mt-3 text-[11px] font-medium text-emerald-600">
                      <TrendingUp size={11} />
                      +3.2% vs last month
                    </div>
                  )}
                </div>
                {/* Click hint */}
                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight size={14} className="text-slate-300" />
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* ═══ Section 3: Email Performance Chart ═══ */}
      <motion.div
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-4 md:p-6 shadow-sm"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={fadeUp}
        custom={1}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Email Performance</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Send volume and engagement over the last {chartRange} days</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {/* Time range selector */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
              {[
                { label: '7d', value: 7 },
                { label: '14d', value: 14 },
                { label: '30d', value: 30 },
              ].map((range) => (
                <button
                  key={range.value}
                  onClick={() => setChartRange(range.value)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    chartRange === range.value
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
            {/* Legend */}
            <div className="flex items-center gap-4">
              {[
                { color: '#635BFF', label: 'Sent' },
                { color: '#8B5CF6', label: 'Opened' },
                { color: '#10B981', label: 'Clicked' },
                { color: '#14B8A6', label: 'Replied' },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <AreaChart data={chartData} />
      </motion.div>

      {/* ═══ Section 4: Campaign Performance ═══ */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Campaign Performance</h3>
          <button onClick={() => navigate('/communication-history')} className="flex items-center gap-1 text-xs font-medium text-primary-500 hover:text-primary-600 transition-colors cursor-pointer">
            View all <ChevronRight size={14} />
          </button>
        </div>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerContainer}
        >
          {campaigns.slice(0, 3).map((campaign) => (
            <motion.div
              key={campaign.name}
              className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-5 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 hover:border-slate-200 dark:hover:border-slate-600 transition-all duration-300 cursor-pointer"
              variants={fadeUp}
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
              onClick={() => navigate('/communication-history')}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{campaign.name}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {campaign.templateName || 'Multiple templates'}
                    {campaign.segmentName ? ` · ${campaign.segmentName}` : ''}
                  </p>
                </div>
                <ArrowUpRight size={16} className="text-slate-300 group-hover:text-primary-400 transition-colors shrink-0" />
              </div>
              <div className="space-y-2">
                <FunnelBar label="Sent" value={campaign.stats.sent} maxValue={campaign.stats.sent} color="#3B82F6" delay={0.2} />
                <FunnelBar label="Delivered" value={Math.round(campaign.stats.sent * campaign.stats.deliveryRate / 100)} maxValue={campaign.stats.sent} color="#10B981" delay={0.3} />
                <FunnelBar label="Opened" value={Math.round(campaign.stats.sent * campaign.stats.openRate / 100)} maxValue={campaign.stats.sent} color="#8B5CF6" delay={0.4} />
                <FunnelBar label="Clicked" value={Math.round(campaign.stats.sent * campaign.stats.clickRate / 100)} maxValue={campaign.stats.sent} color="#635BFF" delay={0.5} />
                <FunnelBar label="Replied" value={campaign.stats.replied} maxValue={campaign.stats.sent} color="#14B8A6" delay={0.6} />
              </div>
              <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-100 dark:border-slate-700">
                <div className="text-center flex-1">
                  <p className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">{campaign.stats.openRate}%</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">Open</p>
                </div>
                <div className="w-px h-8 bg-slate-100" />
                <div className="text-center flex-1">
                  <p className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">{campaign.stats.clickRate}%</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">Click</p>
                </div>
                <div className="w-px h-8 bg-slate-100" />
                <div className="text-center flex-1">
                  <p className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">{campaign.stats.replyRate}%</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">Reply</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ═══ Section 4b: Deal Pipeline Snapshot ═══ */}
      <motion.div
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-4 md:p-6 shadow-sm"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={fadeUp}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-50 dark:bg-primary-500/15 flex items-center justify-center">
              <Target size={18} strokeWidth={1.75} className="text-primary-500" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Deal Pipeline</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Prospect conversion snapshot</p>
            </div>
          </div>
          <button onClick={() => navigate('/pipeline')} className="flex items-center gap-1 text-xs font-medium text-primary-500 hover:text-primary-600 transition-colors cursor-pointer">
            View pipeline <ChevronRight size={14} />
          </button>
        </div>

        {/* Stage bar */}
        {(() => {
          const pStats = getPipelineStats(DUMMY_DEALS)
          const activeDeals = DUMMY_DEALS.filter((d) => d.stage !== 'won' && d.stage !== 'lost')
          const total = activeDeals.length || 1
          return (
            <>
              <div className="flex rounded-lg overflow-hidden h-3 mb-4">
                {DEAL_STAGES.filter((s) => s.key !== 'won' && s.key !== 'lost').map((stage) => {
                  const count = activeDeals.filter((d) => d.stage === stage.key).length
                  if (count === 0) return null
                  return (
                    <div
                      key={stage.key}
                      className={`${STAGE_DOT_COLORS[stage.key]} transition-all`}
                      style={{ width: `${(count / total) * 100}%` }}
                      title={`${stage.label}: ${count}`}
                    />
                  )
                })}
              </div>
              <div className="flex items-center gap-4 mb-4 flex-wrap">
                {DEAL_STAGES.filter((s) => s.key !== 'won' && s.key !== 'lost').map((stage) => {
                  const count = DUMMY_DEALS.filter((d) => d.stage === stage.key).length
                  if (count === 0) return null
                  return (
                    <div key={stage.key} className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${STAGE_DOT_COLORS[stage.key]}`} />
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">{stage.label}</span>
                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">{count}</span>
                    </div>
                  )
                })}
              </div>
              <div className="grid grid-cols-3 gap-3 md:gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="text-center">
                  <p className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">${(pStats.totalValue / 1000).toFixed(0)}k</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">Pipeline Value</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">{pStats.winRate}%</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">Win Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">{pStats.activeDeals}</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">Active Deals</p>
                </div>
              </div>
            </>
          )
        })()}
      </motion.div>

      {/* ═══ Section 5: Upcoming Scheduled Sends ═══ */}
      <motion.div
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-4 md:p-6 shadow-sm"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={fadeUp}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-500/15 flex items-center justify-center">
              <CalendarClock size={18} strokeWidth={1.75} className="text-amber-500" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Upcoming Sends</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Scheduled campaigns ready to go</p>
            </div>
          </div>
          <button onClick={() => navigate('/campaigns')} className="flex items-center gap-1 text-xs font-medium text-primary-500 hover:text-primary-600 transition-colors cursor-pointer">
            Schedule new <ChevronRight size={14} />
          </button>
        </div>

        <motion.div className="space-y-3" variants={staggerContainer}>
          {UPCOMING_SENDS.map((send, idx) => (
            <motion.div
              key={send.id}
              className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-all group cursor-pointer"
              variants={fadeUp}
              whileHover={{ x: 2, transition: { duration: 0.15 } }}
              onClick={() => navigate('/campaigns')}
            >
              {/* Countdown badge */}
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex flex-col items-center justify-center shrink-0 border border-slate-200/60 dark:border-slate-600">
                <Clock size={14} className="text-slate-400 mb-0.5" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 tabular-nums">{formatTimeUntil(send.scheduledAt)}</span>
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{send.name}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                  {send.segment} · {send.recipients} recipients
                </p>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[11px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  Scheduled
                </span>
                <ArrowUpRight size={14} className="text-slate-300 group-hover:text-primary-400 transition-colors" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* ═══ Section 6: Activity Timeline ═══ */}
      <motion.div
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-4 md:p-6 shadow-sm"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={fadeUp}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent Activity</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Latest engagement events across your book of business</p>
          </div>
          <button onClick={() => navigate('/communication-history')} className="flex items-center gap-1 text-xs font-medium text-primary-500 hover:text-primary-600 transition-colors cursor-pointer">
            View all <ChevronRight size={14} />
          </button>
        </div>

        <div className="relative">
          <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gradient-to-b from-slate-200 dark:from-slate-700 via-slate-200 dark:via-slate-700 to-transparent" />
          <motion.div className="space-y-0.5" variants={staggerContainer}>
            {recentActivity.map((event, idx) => (
              <motion.div
                key={event.id}
                className="relative flex items-start gap-4 pl-8 py-3 rounded-xl hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors group"
                variants={{
                  hidden: { opacity: 0, x: -10 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.35, delay: idx * 0.05 } },
                }}
              >
                <div className={`absolute left-1 top-4.5 w-[10px] h-[10px] rounded-full border-2 border-white dark:border-slate-900 shadow-sm ${EVENT_DOT[event.type] || 'bg-slate-400'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 cursor-pointer" onClick={() => navigate(`/participant-data/${event.contactId}`)}>
                      {event.contactName}
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${COMM_STATUS_STYLES[event.type] || 'bg-slate-100 text-slate-600'}`}>
                      {event.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                    {event.templateName || event.subject}
                    {event.campaignName ? ` · ${event.campaignName}` : ''}
                  </p>
                </div>
                <span className="text-[11px] text-slate-400 whitespace-nowrap shrink-0 tabular-nums">
                  {new Date(event.sentAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}{', '}
                  {new Date(event.sentAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      <LinkPayrollModal open={payrollModalOpen} onClose={() => setPayrollModalOpen(false)} />
    </div>
  )
}
