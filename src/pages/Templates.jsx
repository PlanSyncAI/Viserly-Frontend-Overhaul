import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Search,
  Plus,
  ChevronsUpDown,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  Sparkles,
  Mail,
  Braces,
} from 'lucide-react'
import AnimatedCounter from '../components/ui/AnimatedCounter'
import MiniProgressRing from '../components/ui/MiniProgressRing'
import Sparkline from '../components/ui/Sparkline'
import {
  DUMMY_TEMPLATES,
  MERGE_FIELDS,
  TEMPLATE_STATUS_STYLES,
  getTemplateStats,
} from '../lib/templateData'

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
const SPARKLINE_TEMPLATES = [4, 5, 6, 7, 8, 9, 10]
const SPARKLINE_VISERLY = [2, 2, 3, 3, 3, 4, 4]
const SPARKLINE_CUSTOM = [2, 3, 3, 4, 5, 5, 6]

export default function Templates() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [sourceFilter, setSourceFilter] = useState('all')
  const [sortKey, setSortKey] = useState('name')
  const [sortDir, setSortDir] = useState('asc')
  const [page, setPage] = useState(1)

  const stats = useMemo(() => getTemplateStats(), [])

  const filtered = useMemo(() => {
    let data = DUMMY_TEMPLATES

    if (sourceFilter === 'viserly') data = data.filter((t) => t.source === 'Viserly')
    else if (sourceFilter === 'custom') data = data.filter((t) => t.source !== 'Viserly')

    if (search) {
      const q = search.toLowerCase()
      data = data.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.subject.toLowerCase().includes(q) ||
          t.createdBy.toLowerCase().includes(q) ||
          (t.category || '').toLowerCase().includes(q)
      )
    }

    data = [...data].sort((a, b) => {
      let aVal = a[sortKey]
      let bVal = b[sortKey]
      if (sortKey === 'usageCount') {
        return sortDir === 'asc' ? (aVal || 0) - (bVal || 0) : (bVal || 0) - (aVal || 0)
      }
      aVal = String(aVal || '').toLowerCase()
      bVal = String(bVal || '').toLowerCase()
      return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    })

    return data
  }, [search, sourceFilter, sortKey, sortDir])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function handleSort(key) {
    if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
    setPage(1)
  }

  function SortIcon({ colKey }) {
    if (sortKey !== colKey) return <ChevronsUpDown size={13} className="text-slate-300" />
    return sortDir === 'asc'
      ? <ChevronUp size={13} className="text-primary-500" />
      : <ChevronDown size={13} className="text-primary-500" />
  }

  function formatDate(dateStr) {
    if (!dateStr) return '\u2014'
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    })
  }

  const tabCounts = useMemo(() => ({
    all: DUMMY_TEMPLATES.length,
    viserly: DUMMY_TEMPLATES.filter((t) => t.source === 'Viserly').length,
    custom: DUMMY_TEMPLATES.filter((t) => t.source !== 'Viserly').length,
  }), [])

  const columns = [
    { key: 'name', label: 'Template' },
    { key: 'subject', label: 'Subject' },
    { key: 'status', label: 'Status' },
    { key: 'usageCount', label: 'Usage' },
    { key: 'lastModifiedDate', label: 'Last Modified' },
    { key: 'createdBy', label: 'Created By' },
  ]

  const kpiCards = [
    {
      label: 'Total Templates',
      value: stats.total,
      icon: FileText,
      color: 'primary',
      sparkData: SPARKLINE_TEMPLATES,
    },
    {
      label: 'Viserly Templates',
      value: stats.viserly,
      icon: Sparkles,
      color: 'blue',
      sparkData: SPARKLINE_VISERLY,
    },
    {
      label: 'Custom Templates',
      value: stats.custom,
      icon: Mail,
      color: 'purple',
      sparkData: SPARKLINE_CUSTOM,
    },
    {
      label: 'Merge Fields',
      value: stats.totalMergeFields,
      icon: Braces,
      color: 'emerald',
      ring: Math.min(100, Math.round((stats.totalMergeFields / 50) * 100)),
    },
  ]

  const kpiColors = {
    primary: { bg: 'bg-primary-50 dark:bg-primary-500/15', icon: 'text-primary-500', spark: '#635BFF' },
    blue: { bg: 'bg-blue-50 dark:bg-blue-500/15', icon: 'text-blue-500', spark: '#3B82F6' },
    purple: { bg: 'bg-purple-50 dark:bg-purple-500/15', icon: 'text-purple-500', spark: '#8B5CF6' },
    emerald: { bg: 'bg-emerald-50 dark:bg-emerald-500/15', icon: 'text-emerald-500', spark: '#10B981' },
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
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-50 via-white to-blue-50/40 dark:from-primary-500/5 dark:via-slate-900 dark:to-blue-500/5 border border-slate-200/60 dark:border-slate-800 px-8 py-8"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,91,255,0.06),transparent_50%)]" />
        <div className="relative flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center">
                <FileText size={20} className="text-primary-600 dark:text-primary-400" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Email Templates</h1>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg">
              Create, manage, and customize email templates for participant outreach. Leverage merge fields for personalized communications.
            </p>
            <div className="flex items-center gap-4 mt-4">
              {[
                { label: 'Total', value: stats.total },
                { label: 'Active', value: stats.active },
                { label: 'Viserly', value: stats.viserly },
                { label: 'Total Sends', value: stats.totalUsage },
              ].map((b) => (
                <div key={b.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/60 dark:bg-slate-800/60 border border-slate-200/40 dark:border-slate-700/40">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200 tabular-nums">{b.value}</span>
                  <span className="text-[10px] text-slate-400">{b.label}</span>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => navigate('/templates/new')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-500 dark:bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-600 active:bg-primary-700 transition-colors cursor-pointer shadow-sm"
          >
            <Plus size={16} />
            Create Template
          </button>
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
                {card.ring !== undefined && <MiniProgressRing value={card.ring} color="#10B981" />}
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight tabular-nums">
                <AnimatedCounter value={parseFloat(card.value)} />
              </p>
              <p className="text-xs font-medium text-slate-400 mt-1">{card.label}</p>
            </motion.div>
          )
        })}
      </motion.div>

      {/* ── Tabs + Search ────────────────────────────────────────── */}
      <motion.div variants={fadeUp} className="flex items-end gap-4">
        <div className="flex items-center border-b border-slate-200 dark:border-slate-700">
          {[
            { key: 'all', label: 'All' },
            { key: 'viserly', label: 'Viserly' },
            { key: 'custom', label: 'Custom' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setSourceFilter(tab.key); setPage(1) }}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors cursor-pointer ${
                sourceFilter === tab.key
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              {tab.label}
              <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
                sourceFilter === tab.key
                  ? 'bg-primary-100 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
              }`}>
                {tabCounts[tab.key]}
              </span>
            </button>
          ))}
        </div>

        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search templates by name, subject, or creator..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-all"
          />
        </div>
      </motion.div>

      {/* ── Table ────────────────────────────────────────────────── */}
      <motion.div
        variants={fadeUp}
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-5 py-3 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 select-none transition-colors"
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
                  <td colSpan={columns.length + 1} className="text-center py-16 text-sm text-slate-400 dark:text-slate-500">
                    <FileText size={32} className="mx-auto mb-3 text-slate-200 dark:text-slate-700" />
                    No templates found.
                  </td>
                </tr>
              ) : (
                paged.map((tpl) => (
                  <tr
                    key={tpl.id}
                    className="border-b border-slate-50 dark:border-slate-800 last:border-0 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                    onClick={() => navigate(`/templates/${tpl.id}`)}
                  >
                    {/* Template name + source badge + category */}
                    <td className="px-5 py-3.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-primary-600 dark:text-primary-400 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">
                            {tpl.name}
                          </span>
                          {tpl.source === 'Viserly' && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-primary-50 dark:bg-primary-500/15 text-primary-600 dark:text-primary-400">
                              Viserly
                            </span>
                          )}
                        </div>
                        {tpl.category && (
                          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{tpl.category}</p>
                        )}
                      </div>
                    </td>

                    {/* Subject */}
                    <td className="px-5 py-3.5 text-sm text-slate-600 dark:text-slate-300 max-w-[280px] truncate">
                      {tpl.subject}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${TEMPLATE_STATUS_STYLES[tpl.status]}`}>
                        {tpl.status}
                      </span>
                    </td>

                    {/* Usage */}
                    <td className="px-5 py-3.5 text-sm text-slate-600 dark:text-slate-300 tabular-nums">
                      {tpl.usageCount}
                    </td>

                    {/* Last Modified */}
                    <td className="px-5 py-3.5 text-sm text-slate-500 dark:text-slate-400">
                      {formatDate(tpl.lastModifiedDate)}
                    </td>

                    {/* Created By */}
                    <td className="px-5 py-3.5 text-sm text-slate-600 dark:text-slate-300">
                      {tpl.createdBy}
                    </td>

                    {/* Chevron */}
                    <td className="px-3 py-3.5">
                      <ChevronRight size={14} className="text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filtered.length > PAGE_SIZE && (
          <div className="border-t border-slate-100 dark:border-slate-800 px-5 py-3 flex items-center justify-between">
            <p className="text-sm text-slate-400 dark:text-slate-500">
              Showing {(page - 1) * PAGE_SIZE + 1}&ndash;{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm text-slate-500 dark:text-slate-400 px-2 tabular-nums">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
