import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Search,
  Plus,
  Building2,
  Phone,
  Landmark,
  Mail,
  Upload,
  Link as LinkIcon,
  ChevronsUpDown,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Users,
} from 'lucide-react'
import { DUMMY_ACCOUNTS, getAccountStats } from '../lib/accountData'
import AnimatedCounter from '../components/ui/AnimatedCounter'
import Sparkline from '../components/ui/Sparkline'
import MiniProgressRing from '../components/ui/MiniProgressRing'
import LinkPayrollModal from '../components/ui/LinkPayrollModal'

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

const SPARKLINE_ACCOUNTS = [3, 5, 7, 9, 12, 14, 16]
const SPARKLINE_PHONE = [2, 3, 5, 6, 8, 10, 12]
const SPARKLINE_EMPLOYEES = [120, 180, 250, 310, 390, 420, 480]

export default function PlanData() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [sortKey, setSortKey] = useState('updatedAt')
  const [sortDir, setSortDir] = useState('desc')
  const [pageSize, setPageSize] = useState(25)
  const [page, setPage] = useState(1)
  const [payrollModalOpen, setPayrollModalOpen] = useState(false)

  const stats = useMemo(() => getAccountStats(DUMMY_ACCOUNTS), [])

  const filtered = useMemo(() => {
    let data = DUMMY_ACCOUNTS
    if (filter === 'withPhone') data = data.filter((a) => a.phone && a.phone !== 'N/A')
    else if (filter === 'withRecordkeeper') data = data.filter((a) => a.recordkeeper)

    if (search) {
      const q = search.toLowerCase()
      data = data.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          (a.recordkeeper || '').toLowerCase().includes(q) ||
          (a.phone || '').includes(q) ||
          (a.billingAddress || '').toLowerCase().includes(q)
      )
    }

    data = [...data].sort((a, b) => {
      let aVal = a[sortKey], bVal = b[sortKey]
      if (typeof aVal === 'number') return sortDir === 'asc' ? aVal - bVal : bVal - aVal
      aVal = String(aVal || '').toLowerCase()
      bVal = String(bVal || '').toLowerCase()
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1
      return 0
    })
    return data
  }, [search, filter, sortKey, sortDir])

  const totalPages = Math.ceil(filtered.length / pageSize)
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize)

  function handleSort(key) {
    if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
    setPage(1)
  }

  function SortIcon({ colKey }) {
    if (sortKey !== colKey) return <ChevronsUpDown size={13} className="text-slate-300 dark:text-slate-600" />
    return sortDir === 'asc'
      ? <ChevronUp size={13} className="text-primary-500" />
      : <ChevronDown size={13} className="text-primary-500" />
  }

  const columns = [
    { key: 'name', label: 'Account' },
    { key: 'recordkeeper', label: 'Recordkeeper' },
    { key: 'phone', label: 'Phone' },
    { key: 'employees', label: 'Employees' },
    { key: 'billingAddress', label: 'Location' },
    { key: 'updatedAt', label: 'Updated' },
  ]

  const kpiCards = [
    { label: 'Total Accounts', value: stats.total, icon: Building2, color: 'primary', sparkData: SPARKLINE_ACCOUNTS },
    { label: 'With Phone', value: stats.withPhone, icon: Phone, color: 'blue', sparkData: SPARKLINE_PHONE },
    { label: 'With Recordkeeper', value: stats.withRecordkeeper, icon: Landmark, color: 'emerald', ring: stats.total > 0 ? Math.round((stats.withRecordkeeper / stats.total) * 100) : 0 },
    { label: 'Total Employees', value: DUMMY_ACCOUNTS.reduce((sum, a) => sum + (a.employees || 0), 0), icon: Users, color: 'purple', sparkData: SPARKLINE_EMPLOYEES },
  ]

  const kpiColors = {
    primary: { bg: 'bg-primary-50 dark:bg-primary-500/15', icon: 'text-primary-500', spark: '#635BFF' },
    blue: { bg: 'bg-blue-50 dark:bg-blue-500/15', icon: 'text-blue-500', spark: '#3B82F6' },
    emerald: { bg: 'bg-emerald-50 dark:bg-emerald-500/15', icon: 'text-emerald-500', spark: '#10B981' },
    purple: { bg: 'bg-purple-50 dark:bg-purple-500/15', icon: 'text-purple-500', spark: '#8B5CF6' },
  }

  return (
    <motion.div
      className="p-4 md:p-8 mx-auto space-y-4 md:space-y-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* ── Hero Header ──────────────────────────────────────────── */}
      <motion.div
        variants={fadeUp}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-50 via-white to-emerald-50/40 dark:from-primary-500/5 dark:via-slate-900 dark:to-emerald-500/5 border border-slate-200/60 dark:border-slate-800 px-4 sm:px-8 py-6 sm:py-8"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,91,255,0.06),transparent_50%)]" />
        <div className="relative flex flex-col sm:flex-row items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center">
                <Building2 size={20} className="text-primary-600 dark:text-primary-400" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Plan Accounts</h1>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg">
              Manage account records, link payroll providers, and track plan data across your book of business.
            </p>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-4">
              {[
                { label: 'Total', value: stats.total },
                { label: 'With Phone', value: stats.withPhone },
                { label: 'With Recordkeeper', value: stats.withRecordkeeper },
              ].map((b) => (
                <div key={b.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/60 dark:bg-slate-800/60 border border-slate-200/40 dark:border-slate-700/40">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200 tabular-nums">{b.value}</span>
                  <span className="text-[10px] text-slate-400">{b.label}</span>
                </div>
              ))}
            </div>
          </div>
          <button
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-500 dark:bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-600 active:bg-primary-700 transition-colors cursor-pointer shadow-sm"
          >
            <Plus size={16} />
            Create Account
          </button>
        </div>
      </motion.div>

      {/* ── KPI Cards ────────────────────────────────────────────── */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
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

      {/* ── Quick Actions ────────────────────────────────────────── */}
      <motion.div variants={fadeUp} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-5">
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Quick Actions</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Run common account workflows without leaving this page.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 dark:bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-colors cursor-pointer">
            <Plus size={16} />Create Account
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer">
            <Mail size={16} />Create Email
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer">
            <Upload size={16} />Upload Data
          </button>
          <button
            onClick={() => setPayrollModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <LinkIcon size={16} />Link Payroll
          </button>
        </div>
      </motion.div>

      {/* ── Search & Filter ──────────────────────────────────────── */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by account, recordkeeper, phone, or location..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-all"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => { setFilter(e.target.value); setPage(1) }}
          className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 cursor-pointer appearance-none pr-10 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_8px_center] bg-no-repeat"
        >
          <option value="all">All Accounts</option>
          <option value="withPhone">With Phone</option>
          <option value="withRecordkeeper">With Recordkeeper</option>
        </select>
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
                    <div className="flex items-center gap-1.5">{col.label}<SortIcon colKey={col.key} /></div>
                  </th>
                ))}
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="text-center py-16 text-sm text-slate-400 dark:text-slate-500">
                    <Building2 size={32} className="mx-auto mb-3 text-slate-200 dark:text-slate-700" />
                    No accounts found.
                  </td>
                </tr>
              ) : (
                paged.map((account) => (
                  <tr
                    key={account.id}
                    className="border-b border-slate-50 dark:border-slate-800 last:border-0 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                    onClick={() => navigate(`/plan-data/${account.slug}`)}
                  >
                    <td className="px-5 py-3">
                      <span className="text-sm font-medium text-primary-600 dark:text-primary-400 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">
                        {account.name}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-600 dark:text-slate-300">{account.recordkeeper || '\u2014'}</td>
                    <td className="px-5 py-3 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">{account.phone || '\u2014'}</td>
                    <td className="px-5 py-3 text-sm text-slate-600 dark:text-slate-300 tabular-nums">{account.employees || '\u2014'}</td>
                    <td className="px-5 py-3 text-sm text-slate-600 dark:text-slate-300">
                      {account.billingAddress ? account.billingAddress.split(',').slice(-2).join(',').trim() : '\u2014'}
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {new Date(account.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-3 py-3">
                      <ChevronRight size={14} className="text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="border-t border-slate-100 dark:border-slate-800 px-5 py-3 flex items-center justify-between">
          <p className="text-sm text-slate-400 dark:text-slate-500">
            Showing {Math.min((page - 1) * pageSize + 1, filtered.length)}&ndash;{Math.min(page * pageSize, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
              {[25, 50, 100, 250].map((size) => (
                <button
                  key={size}
                  onClick={() => { setPageSize(size); setPage(1) }}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                    pageSize === size
                      ? 'bg-primary-500 dark:bg-primary-600 text-white'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm text-slate-500 dark:text-slate-400 px-2 tabular-nums">
                Page {page} of {totalPages || 1}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages || totalPages === 0}
                className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <LinkPayrollModal open={payrollModalOpen} onClose={() => setPayrollModalOpen(false)} />
    </motion.div>
  )
}
