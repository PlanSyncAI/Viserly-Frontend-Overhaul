import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Plus,
  Search,
  Target,
  DollarSign,
  TrendingUp,
  CircleDollarSign,
  LayoutGrid,
  List,
  ChevronRight,
  ChevronLeft,
  ChevronsUpDown,
  ChevronUp,
  ChevronDown,
} from 'lucide-react'
import AnimatedCounter from '../components/ui/AnimatedCounter'
import MiniProgressRing from '../components/ui/MiniProgressRing'
import Sparkline from '../components/ui/Sparkline'
import KanbanBoard from '../components/ui/KanbanBoard'
import {
  DUMMY_DEALS,
  DEAL_STAGES,
  STAGE_STYLES,
  PRIORITY_STYLES,
  getPipelineStats,
  getStageLabel,
} from '../lib/pipelineData'

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
const SPARKLINE_VALUE = [180, 220, 310, 380, 420, 490, 550]
const SPARKLINE_DEALS = [2, 3, 5, 6, 8, 10, 11]
const SPARKLINE_REVENUE = [1.8, 2.2, 3.1, 3.8, 4.2, 4.9, 5.5]

export default function Pipeline() {
  const navigate = useNavigate()
  const [view, setView] = useState('board')
  const [search, setSearch] = useState('')
  const [stageFilter, setStageFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [sortKey, setSortKey] = useState('createdAt')
  const [sortDir, setSortDir] = useState('desc')
  const [page, setPage] = useState(1)
  const [deals, setDeals] = useState(DUMMY_DEALS)

  const stats = useMemo(() => getPipelineStats(deals), [deals])

  const filtered = useMemo(() => {
    let data = deals
    if (stageFilter !== 'all') data = data.filter((d) => d.stage === stageFilter)
    if (priorityFilter !== 'all') data = data.filter((d) => d.priority === priorityFilter)
    if (search) {
      const q = search.toLowerCase()
      data = data.filter((d) =>
        d.participantName.toLowerCase().includes(q) ||
        d.accountName.toLowerCase().includes(q) ||
        d.source.toLowerCase().includes(q)
      )
    }
    data = [...data].sort((a, b) => {
      let aVal = a[sortKey]
      let bVal = b[sortKey]
      if (sortKey === 'createdAt' || sortKey === 'nextActionDate') {
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
  }, [deals, search, stageFilter, priorityFilter, sortKey, sortDir])

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

  function formatCurrency(val) {
    return '$' + val.toLocaleString()
  }

  function handleStageChange(dealId, newStage) {
    setDeals((prev) =>
      prev.map((d) =>
        d.id === dealId
          ? { ...d, stage: newStage, updatedAt: new Date().toISOString(), closedAt: (newStage === 'won' || newStage === 'lost') ? new Date().toISOString() : d.closedAt }
          : d
      )
    )
  }

  function handleBulkStageChange(dealIds, newStage) {
    const idSet = new Set(dealIds)
    setDeals((prev) =>
      prev.map((d) =>
        idSet.has(d.id)
          ? { ...d, stage: newStage, updatedAt: new Date().toISOString(), closedAt: (newStage === 'won' || newStage === 'lost') ? new Date().toISOString() : d.closedAt }
          : d
      )
    )
  }

  const columns = [
    { key: 'participantName', label: 'Prospect' },
    { key: 'stage', label: 'Stage' },
    { key: 'priority', label: 'Priority' },
    { key: 'dealValue', label: 'Deal Value' },
    { key: 'estimatedRevenue', label: 'Est. Revenue' },
    { key: 'source', label: 'Source' },
    { key: 'nextActionDate', label: 'Next Action' },
    { key: 'createdAt', label: 'Created' },
  ]

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
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-50 via-white to-emerald-50/40 dark:from-primary-500/5 dark:via-slate-900 dark:to-emerald-500/5 border border-slate-200/60 dark:border-slate-800 px-8 py-8"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,91,255,0.06),transparent_50%)]" />
        <div className="relative flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center">
                <Target size={20} className="text-primary-600 dark:text-primary-400" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Deal Pipeline</h1>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg">
              Track and manage prospect conversions from plan participants to wealth management clients.
            </p>
            <div className="flex items-center gap-4 mt-4">
              {[
                { label: 'Total Deals', value: stats.totalDeals },
                { label: 'Active', value: stats.activeDeals },
                { label: 'Pipeline Value', value: formatCurrency(stats.totalValue) },
                { label: 'Win Rate', value: stats.winRate + '%' },
              ].map((b) => (
                <div key={b.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/60 dark:bg-slate-800/60 border border-slate-200/40 dark:border-slate-700/40">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200 tabular-nums">{b.value}</span>
                  <span className="text-[10px] text-slate-400">{b.label}</span>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => navigate('/pipeline/new')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-500 dark:bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-600 active:bg-primary-700 transition-colors cursor-pointer shadow-sm"
          >
            <Plus size={16} />
            New Deal
          </button>
        </div>
      </motion.div>

      {/* ── KPI Cards ────────────────────────────────────────────── */}
      <motion.div variants={fadeUp} className="grid grid-cols-4 gap-4">
        {[
          {
            label: 'Total Pipeline Value',
            value: stats.totalValue,
            prefix: '$',
            icon: DollarSign,
            color: 'primary',
            sparkData: SPARKLINE_VALUE,
          },
          {
            label: 'Active Deals',
            value: stats.activeDeals,
            icon: Target,
            color: 'blue',
            sparkData: SPARKLINE_DEALS,
          },
          {
            label: 'Win Rate',
            value: stats.winRate,
            suffix: '%',
            icon: TrendingUp,
            color: 'emerald',
            ring: parseFloat(stats.winRate),
          },
          {
            label: 'Est. Annual Revenue',
            value: stats.totalRevenue,
            prefix: '$',
            icon: CircleDollarSign,
            color: 'purple',
            sparkData: SPARKLINE_REVENUE,
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
            <motion.div
              key={card.label}
              whileHover={{ y: -2, boxShadow: '0 8px 25px -5px rgba(0,0,0,0.08)' }}
              className="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-5 text-left overflow-hidden"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center`}>
                  <Icon size={20} strokeWidth={1.75} className={colors.icon} />
                </div>
                {card.sparkData && <Sparkline data={card.sparkData} color={card.color === 'primary' ? '#635BFF' : card.color === 'blue' ? '#3B82F6' : '#8B5CF6'} />}
                {card.ring !== undefined && <MiniProgressRing value={card.ring} color="#10B981" />}
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight tabular-nums">
                {card.prefix || ''}<AnimatedCounter value={parseFloat(card.value)} />{card.suffix || ''}
              </p>
              <p className="text-xs font-medium text-slate-400 mt-1">{card.label}</p>
            </motion.div>
          )
        })}
      </motion.div>

      {/* ── View Toggle + Search + Filters ──────────────────────── */}
      <motion.div variants={fadeUp} className="flex items-center gap-3">
        {/* View toggle */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
          <button
            onClick={() => setView('board')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              view === 'board'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
            }`}
          >
            <LayoutGrid size={14} />
            Board
          </button>
          <button
            onClick={() => setView('table')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              view === 'table'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
            }`}
          >
            <List size={14} />
            Table
          </button>
        </div>

        {/* Search */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search deals by name, account, or source..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-all"
          />
        </div>

        {/* Stage filter */}
        <select
          value={stageFilter}
          onChange={(e) => { setStageFilter(e.target.value); setPage(1) }}
          className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 cursor-pointer appearance-none pr-10 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_12px_center] bg-no-repeat"
        >
          <option value="all">All Stages</option>
          {DEAL_STAGES.map((s) => (
            <option key={s.key} value={s.key}>{s.label}</option>
          ))}
        </select>

        {/* Priority filter */}
        <select
          value={priorityFilter}
          onChange={(e) => { setPriorityFilter(e.target.value); setPage(1) }}
          className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 cursor-pointer appearance-none pr-10 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_12px_center] bg-no-repeat"
        >
          <option value="all">All Priorities</option>
          <option value="Hot">Hot</option>
          <option value="Warm">Warm</option>
          <option value="Cold">Cold</option>
        </select>
      </motion.div>

      {/* ── Board View ───────────────────────────────────────────── */}
      {view === 'board' && (
        <motion.div variants={fadeUp}>
          <KanbanBoard
            deals={filtered}
            onStageChange={handleStageChange}
            onBulkStageChange={handleBulkStageChange}
            onDealClick={(id) => navigate(`/pipeline/${id}`)}
          />
        </motion.div>
      )}

      {/* ── Table View ───────────────────────────────────────────── */}
      {view === 'table' && (
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
                      No deals match your search.
                    </td>
                  </tr>
                ) : (
                  paged.map((d) => (
                    <tr
                      key={d.id}
                      onClick={() => navigate(`/pipeline/${d.id}`)}
                      className="border-b border-slate-50 dark:border-slate-800 last:border-0 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                    >
                      <td className="px-5 py-3.5">
                        <div>
                          <span className="text-sm font-medium text-primary-600 dark:text-primary-400 group-hover:text-primary-700">
                            {d.participantName}
                          </span>
                          <p className="text-[11px] text-slate-400 mt-0.5 truncate max-w-[200px]">{d.accountName}</p>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STAGE_STYLES[d.stage]}`}>
                          {getStageLabel(d.stage)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${PRIORITY_STYLES[d.priority]}`}>
                          {d.priority}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-sm font-medium text-slate-700 dark:text-slate-200 tabular-nums">
                        {formatCurrency(d.dealValue)}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-slate-600 dark:text-slate-300 tabular-nums">
                        {formatCurrency(d.estimatedRevenue)}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-slate-600 dark:text-slate-300">
                        <span className="truncate max-w-[160px] block">{d.source}</span>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {formatDate(d.nextActionDate)}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {formatDate(d.createdAt)}
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
      )}
    </motion.div>
  )
}
