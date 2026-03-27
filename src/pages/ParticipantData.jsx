import { useState, useMemo, useRef, useId } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Search,
  UserPlus,
  Mail,
  Upload,
  Download,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Users,
  UserCheck,
  MailCheck,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  X,
  DollarSign,
  Landmark,
  MapPin,
  ArrowUpRight,
  Plus,
} from 'lucide-react'
import { useContacts } from '../lib/useContacts'
import AnimatedCounter from '../components/ui/AnimatedCounter'
import Sparkline from '../components/ui/Sparkline'
import MiniProgressRing from '../components/ui/MiniProgressRing'
import { card, text, btn, input, table, iconBox, badge, cx } from '../lib/styles'

const PAGE_SIZE = 25

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

const SPARKLINE_CONTACTS = [680, 695, 700, 712, 720, 738, 751]
const SPARKLINE_SALARY = [92, 95, 97, 98, 101, 104, 106]
const SPARKLINE_BALANCE = [180, 195, 210, 220, 235, 248, 260]

/* ─── Horizontal Bar Chart ──────────────────────────────────────────────────── */
function HBarChart({ data, maxValue, color = '#635BFF' }) {
  return (
    <div className="space-y-2">
      {data.map((d) => {
        const pct = maxValue > 0 ? (d.value / maxValue) * 100 : 0
        return (
          <div key={d.label} className="flex items-center gap-3">
            <span className={cx(text.caption, 'w-20 text-right shrink-0 truncate')} title={d.label}>{d.label}</span>
            <div className="flex-1 h-6 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: color }}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              />
            </div>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 w-12 text-right tabular-nums">{d.value.toLocaleString()}</span>
          </div>
        )
      })}
    </div>
  )
}

/* ─── Distribution Histogram ────────────────────────────────────────────────── */
function DistributionChart({ buckets, color = '#635BFF' }) {
  const id = useId()
  const rawMax = Math.max(...buckets.map((b) => b.count), 1)
  const step = rawMax <= 20 ? 5 : rawMax <= 50 ? 10 : rawMax <= 200 ? 25 : 50
  const max = Math.ceil(rawMax / step) * step
  const width = 600
  const height = 240
  const pad = { top: 16, right: 16, bottom: 40, left: 44 }
  const chartW = width - pad.left - pad.right
  const chartH = height - pad.top - pad.bottom
  const barW = chartW / buckets.length
  const gap = barW * 0.2

  const tickCount = 4
  const yTicks = Array.from({ length: tickCount + 1 }, (_, i) => Math.round((max / tickCount) * i))

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id={`${id}-grad`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.85} />
          <stop offset="100%" stopColor={color} stopOpacity={0.45} />
        </linearGradient>
      </defs>

      {yTicks.map((tick) => {
        const y = pad.top + chartH - (tick / max) * chartH
        return (
          <g key={tick}>
            <line x1={pad.left} y1={y} x2={pad.left + chartW} y2={y} stroke="currentColor" className="text-slate-200 dark:text-slate-700" strokeWidth={1} strokeDasharray={tick === 0 ? '0' : '4 4'} />
            <text x={pad.left - 8} y={y + 4} textAnchor="end" className="text-[10px] fill-slate-400 dark:fill-slate-500">{tick}</text>
          </g>
        )
      })}

      <defs>
        <clipPath id={`${id}-clip`}>
          <rect x={pad.left} y={pad.top} width={chartW} height={chartH} />
        </clipPath>
      </defs>

      <line x1={pad.left} y1={pad.top + chartH} x2={pad.left + chartW} y2={pad.top + chartH} stroke="currentColor" className="text-slate-300 dark:text-slate-600" strokeWidth={1} />

      <g clipPath={`url(#${id}-clip)`}>
        {buckets.map((b, i) => {
          const barH = max > 0 ? (b.count / max) * chartH : 0
          const x = pad.left + i * barW + gap / 2
          const w = barW - gap
          const y = pad.top + chartH - barH
          return (
            <motion.rect
              key={b.label}
              x={x} y={y} width={w} rx={4}
              fill={`url(#${id}-grad)`}
              initial={{ height: 0, y: pad.top + chartH }}
              animate={{ height: barH, y }}
              transition={{ duration: 0.5, delay: i * 0.04, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
          )
        })}
      </g>

      {buckets.map((b, i) => {
        const barH = max > 0 ? (b.count / max) * chartH : 0
        const x = pad.left + i * barW + gap / 2
        const w = barW - gap
        const y = pad.top + chartH - barH
        return (
          <g key={b.label}>
            {b.count > 0 && (
              <text
                x={x + w / 2}
                y={barH > 28 ? y + 16 : y - 6}
                textAnchor="middle"
                className={barH > 28
                  ? 'text-[10px] font-bold fill-white'
                  : 'text-[10px] font-semibold fill-slate-500 dark:fill-slate-400'
                }
              >
                {b.count}
              </text>
            )}
            <text x={x + w / 2} y={pad.top + chartH + 18} textAnchor="middle" className="text-[10px] fill-slate-400 dark:fill-slate-500">{b.label}</text>
          </g>
        )
      })}
    </svg>
  )
}

/* ─── Stat Breakdown Card ───────────────────────────────────────────────────── */
function StatBreakdown({ id, title, description, children }) {
  return (
    <motion.div
      id={id}
      className={cx(card.elevated, 'p-6')}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.4 }}
    >
      <h3 className={text.heading}>{title}</h3>
      <p className={cx(text.caption, 'mt-0.5 mb-5')}>{description}</p>
      {children}
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════ */
export default function ParticipantData() {
  const { contacts, loading } = useContacts()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [accountFilter, setAccountFilter] = useState('all')
  const [stateFilter, setStateFilter] = useState('all')
  const [salaryMin, setSalaryMin] = useState('')
  const [salaryMax, setSalaryMax] = useState('')
  const [balanceMin, setBalanceMin] = useState('')
  const [balanceMax, setBalanceMax] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [showBreakdowns, setShowBreakdowns] = useState(false)
  const [sortKey, setSortKey] = useState('lastName')
  const [sortDir, setSortDir] = useState('asc')
  const [page, setPage] = useState(1)

  const { accounts, states } = useMemo(() => {
    const acctSet = new Set()
    const stateSet = new Set()
    contacts.forEach((c) => {
      if (c.account) acctSet.add(c.account)
      if (c.mailingState) stateSet.add(c.mailingState)
    })
    return { accounts: [...acctSet].sort(), states: [...stateSet].sort() }
  }, [contacts])

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (statusFilter !== 'all') count++
    if (accountFilter !== 'all') count++
    if (stateFilter !== 'all') count++
    if (salaryMin) count++
    if (salaryMax) count++
    if (balanceMin) count++
    if (balanceMax) count++
    return count
  }, [statusFilter, accountFilter, stateFilter, salaryMin, salaryMax, balanceMin, balanceMax])

  function clearFilters() {
    setStatusFilter('all'); setAccountFilter('all'); setStateFilter('all')
    setSalaryMin(''); setSalaryMax(''); setBalanceMin(''); setBalanceMax('')
    setPage(1)
  }

  const filtered = useMemo(() => {
    let data = contacts
    if (statusFilter === 'active') data = data.filter((c) => c.employmentActive)
    else if (statusFilter === 'inactive') data = data.filter((c) => !c.employmentActive)
    if (accountFilter !== 'all') data = data.filter((c) => c.account === accountFilter)
    if (stateFilter !== 'all') data = data.filter((c) => c.mailingState === stateFilter)
    if (salaryMin) data = data.filter((c) => c.salary >= parseFloat(salaryMin))
    if (salaryMax) data = data.filter((c) => c.salary <= parseFloat(salaryMax))
    if (balanceMin) data = data.filter((c) => c.planBalance >= parseFloat(balanceMin))
    if (balanceMax) data = data.filter((c) => c.planBalance <= parseFloat(balanceMax))
    if (search) {
      const q = search.toLowerCase()
      data = data.filter((c) =>
        (c.fullName || '').toLowerCase().includes(q) || (c.email || '').toLowerCase().includes(q) ||
        (c.phone || '').includes(q) || (c.account || '').toLowerCase().includes(q) ||
        (c.mailingCity || '').toLowerCase().includes(q) || (c.mailingState || '').toLowerCase().includes(q)
      )
    }
    data = [...data].sort((a, b) => {
      let aVal = a[sortKey], bVal = b[sortKey]
      if (typeof aVal === 'number') return sortDir === 'asc' ? aVal - bVal : bVal - aVal
      aVal = String(aVal || '').toLowerCase(); bVal = String(bVal || '').toLowerCase()
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1
      return 0
    })
    return data
  }, [contacts, search, statusFilter, accountFilter, stateFilter, salaryMin, salaryMax, balanceMin, balanceMax, sortKey, sortDir])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // ─── Enhanced stats ────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const total = contacts.length
    const active = contacts.filter((c) => c.employmentActive).length
    const inactive = total - active
    const hasEmail = contacts.filter((c) => c.email).length
    const salaries = contacts.map((c) => c.salary).filter((s) => s > 0)
    const balances = contacts.map((c) => c.planBalance).filter((b) => b > 0)
    const avgSalary = salaries.length ? salaries.reduce((a, b) => a + b, 0) / salaries.length : 0
    const medianSalary = salaries.length ? [...salaries].sort((a, b) => a - b)[Math.floor(salaries.length / 2)] : 0
    const avgBalance = balances.length ? balances.reduce((a, b) => a + b, 0) / balances.length : 0
    const medianBalance = balances.length ? [...balances].sort((a, b) => a - b)[Math.floor(balances.length / 2)] : 0
    const totalBalance = balances.reduce((a, b) => a + b, 0)

    const stateMap = {}
    contacts.forEach((c) => { if (c.mailingState) stateMap[c.mailingState] = (stateMap[c.mailingState] || 0) + 1 })
    const topStates = Object.entries(stateMap).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([label, value]) => ({ label, value }))

    const salaryBuckets = [
      { label: '$0-25K', min: 0, max: 25000, count: 0 },
      { label: '$25-50K', min: 25000, max: 50000, count: 0 },
      { label: '$50-75K', min: 50000, max: 75000, count: 0 },
      { label: '$75-100K', min: 75000, max: 100000, count: 0 },
      { label: '$100-150K', min: 100000, max: 150000, count: 0 },
      { label: '$150-200K', min: 150000, max: 200000, count: 0 },
      { label: '$200-300K', min: 200000, max: 300000, count: 0 },
      { label: '$300K+', min: 300000, max: Infinity, count: 0 },
    ]
    contacts.forEach((c) => {
      const b = salaryBuckets.find((b) => c.salary >= b.min && c.salary < b.max)
      if (b) b.count++
    })

    const balanceBuckets = [
      { label: '$0-10K', min: 0, max: 10000, count: 0 },
      { label: '$10-50K', min: 10000, max: 50000, count: 0 },
      { label: '$50-100K', min: 50000, max: 100000, count: 0 },
      { label: '$100-200K', min: 100000, max: 200000, count: 0 },
      { label: '$200-400K', min: 200000, max: 400000, count: 0 },
      { label: '$400-600K', min: 400000, max: 600000, count: 0 },
      { label: '$600K-1M', min: 600000, max: 1000000, count: 0 },
      { label: '$1M+', min: 1000000, max: Infinity, count: 0 },
    ]
    contacts.forEach((c) => {
      const b = balanceBuckets.find((b) => c.planBalance >= b.min && c.planBalance < b.max)
      if (b) b.count++
    })

    const acctMap = {}
    contacts.forEach((c) => { if (c.account) acctMap[c.account] = (acctMap[c.account] || 0) + 1 })
    const accountBreakdown = Object.entries(acctMap).sort((a, b) => b[1] - a[1]).map(([label, value]) => ({ label, value }))

    return {
      total, active, inactive, hasEmail, avgSalary, medianSalary,
      avgBalance, medianBalance, totalBalance,
      topStates, salaryBuckets, balanceBuckets, accountBreakdown,
    }
  }, [contacts])

  function handleSort(key) {
    if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
    setPage(1)
  }

  function SortIcon({ colKey }) {
    if (sortKey !== colKey) return <ChevronsUpDown size={14} className="text-slate-300 dark:text-slate-600" />
    return sortDir === 'asc' ? <ChevronUp size={14} className="text-primary-500" /> : <ChevronDown size={14} className="text-primary-500" />
  }

  function scrollTo(id) {
    setShowBreakdowns(true)
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  const columns = [
    { key: 'fullName', label: 'Contact' },
    { key: 'account', label: 'Account' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'salary', label: 'Salary' },
    { key: 'planBalance', label: 'Plan Balance' },
    { key: 'status', label: 'Status' },
  ]

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-slate-400">
          <RefreshCw size={20} className="animate-spin" />
          <span className="text-sm">Loading contacts...</span>
        </div>
      </div>
    )
  }

  const activeRate = stats.total > 0 ? ((stats.active / stats.total) * 100).toFixed(1) : '0.0'
  const emailRate = stats.total > 0 ? ((stats.hasEmail / stats.total) * 100).toFixed(1) : '0.0'

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
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-white to-primary-50/40 dark:from-blue-500/5 dark:via-slate-900 dark:to-primary-500/5 border border-slate-200/60 dark:border-slate-800 px-4 sm:px-8 py-6 sm:py-8"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.06),transparent_50%)]" />
        <div className="relative flex flex-col sm:flex-row items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
                <Users size={20} className="text-blue-600 dark:text-blue-400" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Participant Data</h1>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg">
              Manage participant records, analyze demographics, and identify wealth management opportunities.
            </p>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-4">
              {[
                { label: 'Total', value: stats.total },
                { label: 'Active', value: stats.active },
                { label: 'Email Coverage', value: emailRate + '%' },
                { label: 'Total AUM', value: '$' + (stats.totalBalance / 1e6).toFixed(1) + 'M' },
              ].map((b) => (
                <div key={b.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/60 dark:bg-slate-800/60 border border-slate-200/40 dark:border-slate-700/40">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200 tabular-nums">{b.value}</span>
                  <span className="text-[10px] text-slate-400">{b.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={() => navigate('/import-data')} className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer">
              <Upload size={16} />
              Import
            </button>
            <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-500 dark:bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-600 active:bg-primary-700 transition-colors cursor-pointer shadow-sm">
              <Plus size={16} />
              Add Contact
            </button>
          </div>
        </div>
      </motion.div>

      {/* ── KPI Cards ────────────────────────────────────────────── */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {[
          {
            label: 'Total Contacts',
            value: stats.total,
            icon: Users,
            color: 'primary',
            sparkData: SPARKLINE_CONTACTS,
            onClick: () => scrollTo('bd-contacts'),
          },
          {
            label: 'Active Rate',
            value: activeRate,
            suffix: '%',
            icon: UserCheck,
            color: 'emerald',
            ring: parseFloat(activeRate),
            onClick: () => scrollTo('bd-status'),
          },
          {
            label: 'Avg Salary',
            value: Math.round(stats.avgSalary),
            prefix: '$',
            icon: DollarSign,
            color: 'purple',
            sparkData: SPARKLINE_SALARY,
            onClick: () => scrollTo('bd-salary'),
          },
          {
            label: 'Avg Plan Balance',
            value: Math.round(stats.avgBalance),
            prefix: '$',
            icon: Landmark,
            color: 'blue',
            sparkData: SPARKLINE_BALANCE,
            onClick: () => scrollTo('bd-balance'),
          },
        ].map((kpiCard) => {
          const colors = {
            primary: { bg: 'bg-primary-50 dark:bg-primary-500/15', icon: 'text-primary-500' },
            blue: { bg: 'bg-blue-50 dark:bg-blue-500/15', icon: 'text-blue-500' },
            purple: { bg: 'bg-purple-50 dark:bg-purple-500/15', icon: 'text-purple-500' },
            emerald: { bg: 'bg-emerald-50 dark:bg-emerald-500/15', icon: 'text-emerald-500' },
          }[kpiCard.color]
          const Icon = kpiCard.icon
          return (
            <motion.button
              key={kpiCard.label}
              whileHover={{ y: -2, boxShadow: '0 8px 25px -5px rgba(0,0,0,0.08)' }}
              whileTap={{ scale: 0.98 }}
              onClick={kpiCard.onClick}
              className="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-5 text-left cursor-pointer overflow-hidden group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center`}>
                  <Icon size={20} strokeWidth={1.75} className={colors.icon} />
                </div>
                {kpiCard.sparkData && <Sparkline data={kpiCard.sparkData} color={kpiCard.color === 'primary' ? '#635BFF' : kpiCard.color === 'blue' ? '#3B82F6' : '#8B5CF6'} />}
                {kpiCard.ring !== undefined && <MiniProgressRing value={kpiCard.ring} color="#10B981" />}
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight tabular-nums">
                {kpiCard.prefix || ''}<AnimatedCounter value={parseFloat(kpiCard.value)} />{kpiCard.suffix || ''}
              </p>
              <p className="text-xs font-medium text-slate-400 mt-1">{kpiCard.label}</p>
            </motion.button>
          )
        })}
      </motion.div>

      {/* ── Toggle breakdowns ──────────────────────────────────── */}
      <motion.div variants={fadeUp}>
        <button
          onClick={() => setShowBreakdowns(!showBreakdowns)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-pointer"
        >
          {showBreakdowns ? 'Hide' : 'Show'} detailed breakdowns
          <ChevronDown size={14} className={cx('transition-transform', showBreakdowns && 'rotate-180')} />
        </button>
      </motion.div>

      {/* ═══ Stat Breakdowns ═══ */}
      {showBreakdowns && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          <StatBreakdown id="bd-contacts" title="Contacts by Account" description="Distribution of participants across plan accounts">
            <HBarChart data={stats.accountBreakdown} maxValue={Math.max(...stats.accountBreakdown.map((d) => d.value))} color="#635BFF" />
          </StatBreakdown>

          <StatBreakdown id="bd-status" title="Employment Status" description="Active vs inactive participant breakdown">
            <div className="flex items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className={text.body}>Active</span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">{stats.active}</span>
                </div>
                <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <motion.div className="h-full rounded-full bg-emerald-500" initial={{ width: 0 }} animate={{ width: `${(stats.active / stats.total) * 100}%` }} transition={{ duration: 0.6 }} />
                </div>
                <div className="flex items-center justify-between mt-3 mb-2">
                  <span className={text.body}>Inactive</span>
                  <span className="text-sm font-bold text-slate-500 dark:text-slate-400 tabular-nums">{stats.inactive}</span>
                </div>
                <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <motion.div className="h-full rounded-full bg-slate-400" initial={{ width: 0 }} animate={{ width: `${(stats.inactive / stats.total) * 100}%` }} transition={{ duration: 0.6, delay: 0.1 }} />
                </div>
              </div>
              <div className="text-center px-4">
                <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">{activeRate}%</p>
                <p className={text.caption}>active rate</p>
              </div>
            </div>
          </StatBreakdown>

          <StatBreakdown id="bd-email" title="Email Coverage" description="How many participants have email addresses on file">
            <div className="flex items-center gap-6">
              <div className="flex-1">
                <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <motion.div className="h-full rounded-full bg-blue-500" initial={{ width: 0 }} animate={{ width: `${(stats.hasEmail / stats.total) * 100}%` }} transition={{ duration: 0.6 }} />
                </div>
                <div className="flex justify-between mt-2">
                  <span className={text.caption}>{stats.hasEmail} with email</span>
                  <span className={text.caption}>{stats.total - stats.hasEmail} missing</span>
                </div>
              </div>
              <div className="text-center px-4">
                <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 tabular-nums">{emailRate}%</p>
                <p className={text.caption}>coverage</p>
              </div>
            </div>
          </StatBreakdown>

          <StatBreakdown id="bd-salary" title="Salary Distribution" description="Participant salary ranges across your book of business">
            <div className="flex items-center gap-4 mb-4">
              {[
                { label: 'Average', value: `$${Math.round(stats.avgSalary).toLocaleString()}` },
                { label: 'Median', value: `$${Math.round(stats.medianSalary).toLocaleString()}` },
              ].map((s) => (
                <div key={s.label} className={cx(card.inset, 'px-4 py-2 flex-1 text-center')}>
                  <p className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">{s.value}</p>
                  <p className={text.caption}>{s.label}</p>
                </div>
              ))}
            </div>
            <DistributionChart buckets={stats.salaryBuckets} color="#8B5CF6" />
          </StatBreakdown>

          <StatBreakdown id="bd-balance" title="Plan Balance Distribution" description="How participant balances are distributed">
            <div className="flex items-center gap-4 mb-4">
              {[
                { label: 'Average', value: `$${Math.round(stats.avgBalance).toLocaleString()}` },
                { label: 'Median', value: `$${Math.round(stats.medianBalance).toLocaleString()}` },
                { label: 'Total AUM', value: `$${(stats.totalBalance / 1e6).toFixed(1)}M` },
              ].map((s) => (
                <div key={s.label} className={cx(card.inset, 'px-4 py-2 flex-1 text-center')}>
                  <p className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">{s.value}</p>
                  <p className={text.caption}>{s.label}</p>
                </div>
              ))}
            </div>
            <DistributionChart buckets={stats.balanceBuckets} color="#F59E0B" />
          </StatBreakdown>

          <StatBreakdown id="bd-states" title="Geographic Distribution" description="Top states by participant count">
            <HBarChart data={stats.topStates} maxValue={Math.max(...stats.topStates.map((d) => d.value))} color="#10B981" />
          </StatBreakdown>
        </div>
      )}

      {/* ── Search & Filter ──────────────────────────────────────── */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by contact, account, phone, email, city, or state..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-all"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cx(
            'inline-flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-medium transition-all cursor-pointer',
            showFilters || activeFilterCount > 0
              ? 'bg-primary-50 dark:bg-primary-500/10 border-primary-200 dark:border-primary-500/30 text-primary-700 dark:text-primary-400'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
          )}
        >
          <SlidersHorizontal size={16} />
          Filters
          {activeFilterCount > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary-600 text-white text-xs font-semibold">{activeFilterCount}</span>
          )}
        </button>
      </motion.div>

      {/* Filter Panel */}
      {showFilters && (
        <motion.div variants={fadeUp} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className={text.label}>Filter Contacts</h3>
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-red-500 transition-colors cursor-pointer">
                <X size={12} /> Clear all filters
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className={cx(text.caption, 'mb-1.5 block')}>Status</label>
              <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }} className={input.select}><option value="all">All Statuses</option><option value="active">Active</option><option value="inactive">Inactive</option></select>
            </div>
            <div>
              <label className={cx(text.caption, 'mb-1.5 block')}>Account</label>
              <select value={accountFilter} onChange={(e) => { setAccountFilter(e.target.value); setPage(1) }} className={input.select}><option value="all">All Accounts</option>{accounts.map((a) => <option key={a} value={a}>{a}</option>)}</select>
            </div>
            <div>
              <label className={cx(text.caption, 'mb-1.5 block')}>State</label>
              <select value={stateFilter} onChange={(e) => { setStateFilter(e.target.value); setPage(1) }} className={input.select}><option value="all">All States</option>{states.map((s) => <option key={s} value={s}>{s}</option>)}</select>
            </div>
            <div>
              <label className={cx(text.caption, 'mb-1.5 block')}>Salary Range</label>
              <div className="flex items-center gap-2">
                <input type="number" placeholder="Min" value={salaryMin} onChange={(e) => { setSalaryMin(e.target.value); setPage(1) }} className={input.base} />
                <span className="text-slate-300 text-xs">–</span>
                <input type="number" placeholder="Max" value={salaryMax} onChange={(e) => { setSalaryMax(e.target.value); setPage(1) }} className={input.base} />
              </div>
            </div>
            <div>
              <label className={cx(text.caption, 'mb-1.5 block')}>Balance Range</label>
              <div className="flex items-center gap-2">
                <input type="number" placeholder="Min" value={balanceMin} onChange={(e) => { setBalanceMin(e.target.value); setPage(1) }} className={input.base} />
                <span className="text-slate-300 text-xs">–</span>
                <input type="number" placeholder="Max" value={balanceMax} onChange={(e) => { setBalanceMax(e.target.value); setPage(1) }} className={input.base} />
              </div>
            </div>
          </div>
          {activeFilterCount > 0 && (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <p className={text.caption}>Showing <span className="font-semibold text-slate-700 dark:text-slate-200">{filtered.length}</span> of <span className="font-semibold text-slate-700 dark:text-slate-200">{contacts.length}</span> contacts</p>
            </div>
          )}
        </motion.div>
      )}

      {/* ── Data Table ───────────────────────────────────────────── */}
      <motion.div variants={fadeUp} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                {columns.map((col) => (
                  <th key={col.key} className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-5 py-3 cursor-pointer hover:text-slate-700 select-none" onClick={() => handleSort(col.key)}>
                    <div className="flex items-center gap-1.5">{col.label}<SortIcon colKey={col.key} /></div>
                  </th>
                ))}
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr><td colSpan={columns.length + 1} className="text-center py-12 text-sm text-slate-400 dark:text-slate-500">No contacts match your search or filters.</td></tr>
              ) : (
                paged.map((contact) => (
                  <tr key={contact.id} onClick={() => navigate(`/participant-data/${contact.id}`)} className="border-b border-slate-50 dark:border-slate-800 last:border-0 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                    <td className="px-5 py-3.5">
                      <span className="text-sm font-medium text-primary-600 dark:text-primary-400 group-hover:text-primary-700">{contact.fullName}</span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-600 dark:text-slate-300">{contact.account}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <Mail size={13} className="text-slate-300 dark:text-slate-600 shrink-0" />
                        <span className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-[180px]">{contact.email}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">{contact.phone}</td>
                    <td className="px-5 py-3.5 text-sm font-medium text-slate-700 dark:text-slate-200 text-right tabular-nums">${contact.salary.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-5 py-3.5 text-sm font-medium text-slate-700 dark:text-slate-200 text-right tabular-nums">${contact.planBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-5 py-3.5">
                      <span className={contact.employmentActive ? badge.success : badge.neutral}>{contact.status}</span>
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

        {filtered.length > 0 && (
          <div className="border-t border-slate-100 dark:border-slate-800 px-5 py-3 flex items-center justify-between">
            <p className="text-sm text-slate-400">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} contacts
            </p>
            <div className="flex items-center gap-1.5">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"><ChevronLeft size={16} /></button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum
                if (totalPages <= 5) pageNum = i + 1
                else if (page <= 3) pageNum = i + 1
                else if (page >= totalPages - 2) pageNum = totalPages - 4 + i
                else pageNum = page - 2 + i
                return (
                  <button key={pageNum} onClick={() => setPage(pageNum)} className={cx('w-8 h-8 rounded-md text-sm font-medium transition-colors cursor-pointer', page === pageNum ? 'bg-primary-500 dark:bg-primary-600 text-white' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800')}>
                    {pageNum}
                  </button>
                )
              })}
              <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"><ChevronRight size={16} /></button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
