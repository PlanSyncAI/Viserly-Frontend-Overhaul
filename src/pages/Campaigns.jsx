import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Plus,
  Search,
  Megaphone,
  Send,
  Eye,
  MousePointerClick,
  CalendarClock,
  Clock,
  ChevronRight,
  ChevronsUpDown,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
} from 'lucide-react'
import AnimatedCounter from '../components/ui/AnimatedCounter'
import MiniProgressRing from '../components/ui/MiniProgressRing'
import Sparkline from '../components/ui/Sparkline'
import { DUMMY_CAMPAIGNS, STATUS_STYLES, getAggregateStats, formatTimeUntil } from '../lib/campaignData'

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

const PAGE_SIZE = 10
const SPARKLINE_CAMPAIGNS = [3, 4, 5, 5, 6, 8, 10]
const SPARKLINE_EMAILS = [8, 12, 15, 14, 18, 22, 26]

/* ─── Funnel Bar (reused from Home) ─────────────────────────────────────────── */
function FunnelBar({ label, value, maxValue, color, delay = 0 }) {
  const pct = maxValue > 0 ? (value / maxValue) * 100 : 0
  return (
    <div className="flex items-center gap-3">
      <span className="text-[11px] text-slate-400 w-16 text-right shrink-0">{label}</span>
      <div className="flex-1 h-4 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
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

export default function Campaigns() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortKey, setSortKey] = useState('createdAt')
  const [sortDir, setSortDir] = useState('desc')
  const [page, setPage] = useState(1)

  const aggStats = useMemo(() => getAggregateStats(), [])

  const activeCampaigns = DUMMY_CAMPAIGNS.filter((c) => c.status === 'Active' || c.status === 'Scheduled')

  const filtered = useMemo(() => {
    let data = DUMMY_CAMPAIGNS

    if (statusFilter !== 'all') data = data.filter((c) => c.status === statusFilter)

    if (search) {
      const q = search.toLowerCase()
      data = data.filter((c) =>
        c.name.toLowerCase().includes(q) ||
        (c.segmentName || '').toLowerCase().includes(q) ||
        (c.templateName || '').toLowerCase().includes(q)
      )
    }

    data = [...data].sort((a, b) => {
      let aVal = a[sortKey]
      let bVal = b[sortKey]
      if (sortKey === 'createdAt' || sortKey === 'scheduledAt') {
        return sortDir === 'asc'
          ? new Date(aVal || 0) - new Date(bVal || 0)
          : new Date(bVal || 0) - new Date(aVal || 0)
      }
      if (typeof aVal === 'number') return sortDir === 'asc' ? aVal - bVal : bVal - aVal
      aVal = String(aVal || '').toLowerCase()
      bVal = String(bVal || '').toLowerCase()
      return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    })

    return data
  }, [search, statusFilter, sortKey, sortDir])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function handleSort(key) {
    if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
    setPage(1)
  }

  function SortIcon({ colKey }) {
    if (sortKey !== colKey) return <ChevronsUpDown size={13} className="text-slate-300" />
    return sortDir === 'asc'
      ? <ChevronUp size={13} className="text-primary-500" />
      : <ChevronDown size={13} className="text-primary-500" />
  }

  function formatDate(iso) {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const columns = [
    { key: 'name', label: 'Campaign' },
    { key: 'status', label: 'Status' },
    { key: 'segmentName', label: 'Segment' },
    { key: 'recipients', label: 'Recipients' },
    { key: 'scheduledAt', label: 'Send Date' },
    { key: 'openRate', label: 'Open Rate' },
    { key: 'clickRate', label: 'Click Rate' },
  ]

  return (
    <motion.div
      className="p-8 max-w-[1400px] mx-auto space-y-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* ── Hero Header ──────────────────────────────────────────── */}
      <motion.div
        variants={fadeUp}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-50 via-white to-blue-50/40 dark:from-primary-500/5 dark:via-slate-900 dark:to-blue-500/5 border border-slate-200/60 dark:border-slate-800 px-8 py-8"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,91,255,0.06),transparent_50%)]" />
        <div className="relative flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center">
                <Megaphone size={20} className="text-primary-600 dark:text-primary-400" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Campaigns</h1>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg">
              Create, manage, and track your email campaigns. Monitor engagement and optimize your outreach.
            </p>
            {/* Inline badges */}
            <div className="flex items-center gap-4 mt-4">
              {[
                { label: 'Total', value: DUMMY_CAMPAIGNS.length },
                { label: 'Active', value: DUMMY_CAMPAIGNS.filter((c) => c.status === 'Active').length },
                { label: 'Scheduled', value: DUMMY_CAMPAIGNS.filter((c) => c.status === 'Scheduled').length },
                { label: 'Avg Open', value: aggStats.avgOpenRate + '%' },
              ].map((b) => (
                <div key={b.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/60 dark:bg-slate-800/60 border border-slate-200/40 dark:border-slate-700/40">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200 tabular-nums">{b.value}</span>
                  <span className="text-[10px] text-slate-400">{b.label}</span>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => navigate('/campaigns/new')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-500 dark:bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-600 active:bg-primary-700 transition-colors cursor-pointer shadow-sm"
          >
            <Plus size={16} />
            Create Campaign
          </button>
        </div>
      </motion.div>

      {/* ── KPI Cards ────────────────────────────────────────────── */}
      <motion.div variants={fadeUp} className="grid grid-cols-4 gap-4">
        {[
          {
            label: 'Total Campaigns',
            value: DUMMY_CAMPAIGNS.length,
            icon: Megaphone,
            color: 'primary',
            sparkData: SPARKLINE_CAMPAIGNS,
            onClick: () => {},
          },
          {
            label: 'Emails Sent',
            value: aggStats.totalSent,
            icon: Send,
            color: 'blue',
            sparkData: SPARKLINE_EMAILS,
            onClick: () => navigate('/communication-history'),
          },
          {
            label: 'Avg Open Rate',
            value: aggStats.avgOpenRate,
            suffix: '%',
            icon: Eye,
            color: 'purple',
            ring: parseFloat(aggStats.avgOpenRate),
            onClick: () => {},
          },
          {
            label: 'Avg Click Rate',
            value: aggStats.avgClickRate,
            suffix: '%',
            icon: MousePointerClick,
            color: 'emerald',
            ring: parseFloat(aggStats.avgClickRate),
            onClick: () => {},
          },
        ].map((card) => {
          const colors = {
            primary: { bg: 'bg-primary-50 dark:bg-primary-500/15', icon: 'text-primary-500' },
            blue: { bg: 'bg-blue-50 dark:bg-blue-500/15', icon: 'text-blue-500' },
            purple: { bg: 'bg-purple-50 dark:bg-purple-500/15', icon: 'text-purple-500' },
            emerald: { bg: 'bg-emerald-50 dark:bg-emerald-500/15', icon: 'text-emerald-500' },
          }[card.color]
          const Icon = card.icon
          return (
            <motion.button
              key={card.label}
              whileHover={{ y: -2, boxShadow: '0 8px 25px -5px rgba(0,0,0,0.08)' }}
              whileTap={{ scale: 0.98 }}
              onClick={card.onClick}
              className="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-5 text-left cursor-pointer overflow-hidden group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center`}>
                  <Icon size={20} strokeWidth={1.75} className={colors.icon} />
                </div>
                {card.sparkData && <Sparkline data={card.sparkData} color={card.color === 'primary' ? '#635BFF' : card.color === 'blue' ? '#3B82F6' : '#10B981'} />}
                {card.ring !== undefined && <MiniProgressRing value={card.ring} color={card.color === 'purple' ? '#8B5CF6' : '#10B981'} />}
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight tabular-nums">
                <AnimatedCounter value={parseFloat(card.value)} />{card.suffix || ''}
              </p>
              <p className="text-xs font-medium text-slate-400 mt-1">{card.label}</p>
            </motion.button>
          )
        })}
      </motion.div>

      {/* ── Active / Scheduled Highlights ─────────────────────────── */}
      {activeCampaigns.length > 0 && (
        <motion.div variants={fadeUp}>
          <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
            Active & Upcoming
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {activeCampaigns.slice(0, 4).map((c) => (
              <motion.div
                key={c.id}
                whileHover={{ y: -2 }}
                onClick={() => navigate(`/campaigns/${c.id}`)}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 p-5 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{c.name}</h4>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${STATUS_STYLES[c.status]}`}>
                        {c.status === 'Scheduled' && <span className="w-1.5 h-1.5 rounded-full bg-current mr-1 animate-pulse" />}
                        {c.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{c.segmentName || 'All Contacts'} · {c.recipients} recipients</p>
                  </div>
                  {c.status === 'Scheduled' && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-500/10">
                      <Clock size={12} className="text-blue-500" />
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400 tabular-nums">
                        {formatTimeUntil(c.scheduledAt)}
                      </span>
                    </div>
                  )}
                </div>
                {c.stats.sent > 0 && (
                  <div className="space-y-1.5">
                    <FunnelBar label="Sent" value={c.stats.sent} maxValue={c.stats.sent} color="#635BFF" delay={0} />
                    <FunnelBar label="Opened" value={c.stats.opened} maxValue={c.stats.sent} color="#8B5CF6" delay={0.1} />
                    <FunnelBar label="Clicked" value={c.stats.clicked} maxValue={c.stats.sent} color="#10B981" delay={0.2} />
                  </div>
                )}
                {c.stats.sent === 0 && (
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                    <CalendarClock size={13} />
                    <span>Sends {formatDate(c.scheduledAt)}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Search & Filter ──────────────────────────────────────── */}
      <motion.div variants={fadeUp} className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search campaigns by name, segment, or template..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-all"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
          className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 cursor-pointer appearance-none pr-10 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_12px_center] bg-no-repeat"
        >
          <option value="all">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Scheduled">Scheduled</option>
          <option value="Completed">Completed</option>
          <option value="Draft">Draft</option>
        </select>
      </motion.div>

      {/* ── Campaign Table ───────────────────────────────────────── */}
      <motion.div variants={fadeUp} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-5 py-3 cursor-pointer hover:text-slate-700 select-none"
                    onClick={() => handleSort(col.key)}
                  >
                    <div className="flex items-center gap-1.5">
                      {col.label}
                      <SortIcon colKey={col.key} />
                    </div>
                  </th>
                ))}
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="text-center py-12 text-sm text-slate-400 dark:text-slate-500">
                    No campaigns match your search.
                  </td>
                </tr>
              ) : (
                paged.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => navigate(`/campaigns/${c.id}`)}
                    className="border-b border-slate-50 dark:border-slate-800 last:border-0 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                  >
                    <td className="px-5 py-3.5">
                      <div>
                        <span className="text-sm font-medium text-primary-600 dark:text-primary-400 group-hover:text-primary-700">
                          {c.name}
                        </span>
                        <p className="text-[11px] text-slate-400 mt-0.5 truncate max-w-[220px]">{c.templateName}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[c.status]}`}>
                        {c.status === 'Scheduled' && <span className="w-1.5 h-1.5 rounded-full bg-current mr-1 animate-pulse" />}
                        {c.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-600 dark:text-slate-300">
                      {c.segmentName || <span className="text-slate-400">—</span>}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-600 dark:text-slate-300 tabular-nums">{c.recipients.toLocaleString()}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {formatDate(c.scheduledAt)}
                    </td>
                    <td className="px-5 py-3.5 text-sm font-medium text-slate-700 dark:text-slate-200 tabular-nums">
                      {c.stats.sent > 0 ? c.stats.openRate + '%' : '—'}
                    </td>
                    <td className="px-5 py-3.5 text-sm font-medium text-slate-700 dark:text-slate-200 tabular-nums">
                      {c.stats.sent > 0 ? c.stats.clickRate + '%' : '—'}
                    </td>
                    <td className="px-5 py-3.5">
                      <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filtered.length > PAGE_SIZE && (
          <div className="border-t border-slate-100 dark:border-slate-800 px-5 py-3 flex items-center justify-between">
            <p className="text-sm text-slate-400">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-1.5">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer">
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm text-slate-500 dark:text-slate-400 px-2">Page {page} of {totalPages}</span>
              <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
