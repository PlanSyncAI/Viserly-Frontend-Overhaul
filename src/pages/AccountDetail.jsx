import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Plus,
  Mail,
  Upload,
  Link as LinkIcon,
  Trash2,
  Search,
  Info,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  ChevronUp,
  ChevronDown,
  Building2,
  Globe,
  MapPin,
  Settings,
} from 'lucide-react'
import { DUMMY_ACCOUNTS, AUTO_TRIGGERS, DEFAULT_TRIGGER_SETTINGS } from '../lib/accountData'
import { DUMMY_TEMPLATES } from '../lib/templateData'
import { useContacts } from '../lib/useContacts'
import { getCommsForContact, getCommStats } from '../lib/communicationData'
import LinkPayrollModal from '../components/ui/LinkPayrollModal'
import { useToast } from '../components/ui/Toast'

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

const PAGE_SIZE = 25

/* ─── Field display component ───────────────────────────────────────────────── */
function Field({ label, value }) {
  return (
    <div className="py-3 px-4 border border-slate-100 dark:border-slate-800 rounded-lg bg-slate-50/50 dark:bg-slate-800/30">
      <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-sm text-slate-900 dark:text-white font-medium">{value || 'N/A'}</p>
    </div>
  )
}

/* ─── Section Header ─────────────────────────────────────────────────────────── */
function SectionHeader({ title, icon, color = 'primary' }) {
  const colors = {
    primary: 'bg-primary-500',
    blue: 'bg-blue-500',
    emerald: 'bg-emerald-500',
    dark: 'bg-slate-700 dark:bg-slate-600',
  }
  const Icon = icon
  return (
    <div className={`${colors[color]} text-white text-sm font-semibold px-5 py-2.5 rounded-t-xl flex items-center gap-2`}>
      {Icon && <Icon size={16} />}
      {title}
    </div>
  )
}

/* ─── Toggle component ──────────────────────────────────────────────────────── */
function Toggle({ enabled, onChange }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
        enabled ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'
      }`}
    >
      <span className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
        enabled ? 'translate-x-6' : 'translate-x-1'
      }`} />
    </button>
  )
}

/* ─── Tab definitions ───────────────────────────────────────────────────────── */
const TAB_KEYS = [
  { key: 'info', label: 'Account Information' },
  { key: 'triggers', label: 'Auto Triggers' },
  { key: 'contacts', label: 'Account Contacts' },
  { key: 'history', label: 'Historical Information' },
]

/* ─── Auto Triggers Tab ─────────────────────────────────────────────────────── */
function TriggersTab({ account }) {
  const { showToast } = useToast()
  const [triggerStates, setTriggerStates] = useState(() => {
    const states = {}
    AUTO_TRIGGERS.forEach((t) => {
      const defaults = DEFAULT_TRIGGER_SETTINGS[t.key]
      states[t.key] = {
        enabled: defaults?.enabled || false,
        expanded: false,
        salaryThreshold: defaults?.salaryThreshold || 100000,
        deliveryTime: defaults?.deliveryTime || '11:00 AM',
        deliveryDelay: defaults?.deliveryDelay || 0,
        templateSearch: '',
      }
    })
    return states
  })

  function toggleTrigger(key) {
    setTriggerStates((prev) => ({
      ...prev,
      [key]: { ...prev[key], enabled: !prev[key].enabled, expanded: !prev[key].enabled ? true : prev[key].expanded },
    }))
  }

  function toggleExpand(key) {
    setTriggerStates((prev) => ({
      ...prev,
      [key]: { ...prev[key], expanded: !prev[key].expanded },
    }))
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600 dark:text-slate-300">Select which Auto Triggers to enable for this Account</p>

      <div className="space-y-2">
        {AUTO_TRIGGERS.map((trigger) => {
          const state = triggerStates[trigger.key]
          return (
            <div key={trigger.key} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 overflow-hidden">
              <div
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() => state.enabled ? toggleExpand(trigger.key) : null}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{trigger.label}</span>
                  <button className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 cursor-pointer" title={trigger.description}>
                    <Info size={14} />
                  </button>
                </div>
                <Toggle enabled={state.enabled} onChange={() => toggleTrigger(trigger.key)} />
              </div>

              {state.enabled && state.expanded && (
                <div className="px-4 pb-4 space-y-5 border-t border-slate-100 dark:border-slate-800">
                  <div className="mt-4">
                    <label className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5 block">Email Template</label>
                    <div className="relative">
                      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search Email Templates..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">Thresholds</h4>
                    <div className="max-w-sm">
                      <label className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5 block">
                        <span className="text-slate-500 dark:text-slate-400">$</span> Salary Threshold
                      </label>
                      <input
                        type="text"
                        value={state.salaryThreshold.toLocaleString()}
                        readOnly
                        className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-all"
                      />
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Only trigger for employees with salary above this amount.</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">Deliverability Settings</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5 block">Scheduled Delivery Time</label>
                        <input type="text" value={state.deliveryTime} readOnly className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200" />
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">The time of day this Autotrigger should deliver emails (US Eastern Time)</p>
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5 block">Delivery Delay (in Days)</label>
                        <input type="text" value={state.deliveryDelay} readOnly className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200" />
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">The number of days to delay communication from the triggering event.</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 px-4 py-3 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20">
                    <Info size={16} className="text-blue-500 mt-0.5 shrink-0" />
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Select this option to automatically send communication to participants when they are hired above your salary threshold
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => { toggleTrigger(trigger.key); showToast('Trigger deactivated', 'info') }}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    >
                      Deactivate
                    </button>
                    <button
                      onClick={() => showToast('Trigger settings saved', 'success')}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 dark:bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-colors cursor-pointer"
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ─── Contacts Tab ──────────────────────────────────────────────────────────── */
function ContactsTab({ account }) {
  const navigate = useNavigate()
  const { contacts, loading } = useContacts()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [sortKey, setSortKey] = useState('fullName')
  const [sortDir, setSortDir] = useState('asc')

  const accountContacts = useMemo(() => {
    let data = contacts.filter((c) => c.account === account.name)
    if (search) {
      const q = search.toLowerCase()
      data = data.filter((c) => c.fullName.toLowerCase().includes(q) || c.email.toLowerCase().includes(q))
    }
    data = [...data].sort((a, b) => {
      let aVal = a[sortKey], bVal = b[sortKey]
      if (typeof aVal === 'number') return sortDir === 'asc' ? aVal - bVal : bVal - aVal
      aVal = String(aVal).toLowerCase()
      bVal = String(bVal).toLowerCase()
      return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    })
    return data
  }, [contacts, account.name, search, sortKey, sortDir])

  const totalPages = Math.ceil(accountContacts.length / PAGE_SIZE)
  const paged = accountContacts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function handleSort(key) {
    if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
    setPage(1)
  }

  function SortIcon({ colKey }) {
    if (sortKey !== colKey) return <ChevronsUpDown size={13} className="text-slate-300 dark:text-slate-600" />
    return sortDir === 'asc' ? <ChevronUp size={13} className="text-primary-500" /> : <ChevronDown size={13} className="text-primary-500" />
  }

  const columns = [
    { key: 'fullName', label: 'Full Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'salary', label: 'Salary' },
    { key: 'status', label: 'Employment Status' },
    { key: 'planBalance', label: 'Plan Balance' },
  ]

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 p-5">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Related Account Contacts</h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 mb-4">Search and sort related records without leaving the detail page.</p>
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search related records"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-all"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                {columns.map((col) => (
                  <th key={col.key} className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-5 py-3 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 select-none transition-colors" onClick={() => handleSort(col.key)}>
                    <div className="flex items-center gap-1.5">{col.label}<SortIcon colKey={col.key} /></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-12 text-sm text-slate-400 dark:text-slate-500">Loading...</td></tr>
              ) : paged.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-sm text-slate-400 dark:text-slate-500">No matching contacts.</td></tr>
              ) : (
                paged.map((c) => (
                  <tr key={c.id} className="border-b border-slate-50 dark:border-slate-800 last:border-0 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group" onClick={() => navigate(`/participant-data/${c.id}`)}>
                    <td className="px-5 py-3"><span className="text-sm font-medium text-primary-600 dark:text-primary-400 group-hover:text-primary-700 transition-colors">{c.fullName}</span></td>
                    <td className="px-5 py-3 text-sm text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Mail size={13} className="text-slate-300 dark:text-slate-600 shrink-0" />
                        <span className="truncate max-w-[180px]">{c.email}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">{c.phone}</td>
                    <td className="px-5 py-3 text-sm text-slate-600 dark:text-slate-300 text-right tabular-nums">${c.salary.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-5 py-3">
                      <span className={c.employmentActive
                        ? 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                        : 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                      }>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-600 dark:text-slate-300 text-right tabular-nums">${c.planBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {accountContacts.length > PAGE_SIZE && (
          <div className="border-t border-slate-100 dark:border-slate-800 px-5 py-3 flex items-center justify-between">
            <p className="text-sm text-slate-400 dark:text-slate-500">Showing {(page - 1) * PAGE_SIZE + 1}&ndash;{Math.min(page * PAGE_SIZE, accountContacts.length)} of {accountContacts.length}</p>
            <div className="flex items-center gap-1.5">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"><ChevronLeft size={16} /></button>
              <span className="text-sm text-slate-500 dark:text-slate-400 px-2 tabular-nums">Page {page} of {totalPages}</span>
              <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"><ChevronRight size={16} /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── History Tab ───────────────────────────────────────────────────────────── */
function HistoryTab({ account }) {
  const navigate = useNavigate()
  const { contacts } = useContacts()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const history = useMemo(() => {
    const accountContacts = contacts.filter((c) => c.account === account.name)
    let records = []
    accountContacts.forEach((c) => {
      const comms = getCommsForContact(c.id)
      records = records.concat(comms)
    })
    records.sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt))
    if (search) {
      const q = search.toLowerCase()
      records = records.filter(
        (r) => (r.contactName || '').toLowerCase().includes(q) || (r.templateName || '').toLowerCase().includes(q)
      )
    }
    return records
  }, [contacts, account.name, search])

  const totalPages = Math.ceil(history.length / PAGE_SIZE)
  const paged = history.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 p-5">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Related Communication History</h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 mb-4">Search and sort related records without leaving the detail page.</p>
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search related records"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-all"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-5 py-3">Related Contact</th>
                <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-5 py-3">Sent Date</th>
                <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-5 py-3">Email Template</th>
                <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-5 py-3">Delivery Status</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-12 text-sm text-slate-400 dark:text-slate-500">No communication records found.</td></tr>
              ) : (
                paged.map((rec) => (
                  <tr key={rec.id} className="border-b border-slate-50 dark:border-slate-800 last:border-0 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-5 py-3 text-sm text-slate-600 dark:text-slate-300">{rec.contactName}</td>
                    <td className="px-5 py-3 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">{rec.sentAt ? rec.sentAt.slice(0, 10) : '\u2014'}</td>
                    <td className="px-5 py-3">
                      <span className="text-sm font-medium text-primary-600 dark:text-primary-400">{rec.templateName || '\u2014'}</span>
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-600 dark:text-slate-300">{rec.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {history.length > PAGE_SIZE && (
          <div className="border-t border-slate-100 dark:border-slate-800 px-5 py-3 flex items-center justify-between">
            <p className="text-sm text-slate-400 dark:text-slate-500">Showing {(page - 1) * PAGE_SIZE + 1}&ndash;{Math.min(page * PAGE_SIZE, history.length)} of {history.length}</p>
            <div className="flex items-center gap-1.5">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"><ChevronLeft size={16} /></button>
              <span className="text-sm text-slate-500 dark:text-slate-400 px-2 tabular-nums">Page {page} of {totalPages}</span>
              <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"><ChevronRight size={16} /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
   Main Account Detail Page
   ═══════════════════════════════════════════════════════════════════════════════ */
export default function AccountDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState('info')
  const [payrollModalOpen, setPayrollModalOpen] = useState(false)

  const account = DUMMY_ACCOUNTS.find((a) => a.slug === slug)

  if (!account) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500 dark:text-slate-400">Account not found.</p>
        <button onClick={() => navigate('/plan-data')} className="mt-4 text-primary-500 text-sm hover:underline cursor-pointer">Back to Plan Data</button>
      </div>
    )
  }

  const initials = account.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <motion.div
      className="p-4 md:p-8 mx-auto space-y-4 md:space-y-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Back */}
      <motion.button
        variants={fadeUp}
        onClick={() => navigate('/plan-data')}
        className="inline-flex items-center gap-2 text-sm text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
      >
        <ArrowLeft size={16} />
        Back to Plan Data
      </motion.button>

      {/* Profile Header */}
      <motion.div
        variants={fadeUp}
        className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-4 md:p-6"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/40 via-transparent to-emerald-50/20 dark:from-primary-500/5 dark:via-transparent dark:to-emerald-500/5" />
        <div className="relative flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shrink-0 shadow-lg shadow-primary-500/20">
            <span className="text-white text-lg font-bold">{initials}</span>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Account Profile</p>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{account.name}</h2>
            <div className="flex items-center gap-3 mt-1.5">
              {account.recordkeeper && (
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <Landmark size={12} className="text-slate-400 dark:text-slate-500" />
                  {account.recordkeeper}
                </div>
              )}
              {account.employees && (
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <Building2 size={12} className="text-slate-400 dark:text-slate-500" />
                  {account.employees} employees
                </div>
              )}
              {account.phone && account.phone !== 'N/A' && (
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <Mail size={12} className="text-slate-400 dark:text-slate-500" />
                  {account.phone}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={fadeUp} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-4 md:p-5">
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Quick Actions</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Run common account workflows without leaving this page.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => navigate('/plan-data')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 dark:bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-colors cursor-pointer"
          >
            <Plus size={16} />Create Account
          </button>
          <button
            onClick={() => navigate('/templates/new')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <Mail size={16} />Create Email
          </button>
          <button
            onClick={() => navigate('/import-data')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <Upload size={16} />Upload Data
          </button>
          <button
            onClick={() => setPayrollModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <LinkIcon size={16} />Link Payroll
          </button>
          <div className="flex-1" />
          <button
            onClick={() => {
              if (window.confirm(`Are you sure you want to delete "${account.name}"? This action cannot be undone.`)) {
                showToast('Account deleted', 'success')
                setTimeout(() => navigate('/plan-data'), 800)
              }
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm font-medium rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors cursor-pointer"
          >
            <Trash2 size={14} />Delete Account
          </button>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={fadeUp} className="border-b border-slate-200 dark:border-slate-700">
        <div className="flex gap-0">
          {TAB_KEYS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                activeTab === tab.key
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Tab Content */}
      {activeTab === 'info' && (
        <div className="space-y-6">
          <motion.div variants={fadeUp} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 overflow-hidden">
            <SectionHeader title="Account Information" color="primary" icon={Building2} />
            <div className="p-4 md:p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Account Name" value={account.name} />
              <Field label="Owner" value={account.owner} />
              <Field label="Number of Employees" value={account.employees?.toString()} />
              <Field label="Parent Account" value={account.parentAccount} />
              <Field label="Phone" value={account.phone} />
              <Field label="Data Last Updated" value={account.dataLastUpdated} />
              <Field label="Advisor Service Contact" value={
                account.serviceContactFirstName
                  ? `${account.serviceContactFirstName} ${account.serviceContactLastName}`
                  : undefined
              } />
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 overflow-hidden">
            <SectionHeader title="Account Details" color="blue" icon={Globe} />
            <div className="p-4 md:p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Recordkeeper" value={account.recordkeeper} />
              <Field label="Recordkeeper Website" value={account.recordkeeperWebsite} />
              <Field label="Plan Name" value={account.planName} />
              <Field label="Education Website" value={account.educationWebsite} />
              <Field label="Plan Number" value={account.planNumber} />
              <Field label="Financial Wellness Website" value={account.financialWellnessWebsite} />
              <Field label="Maximum Plan Match" value={account.maxPlanMatch} />
              <Field label="Estate Planning Website" value={account.estatePlanningWebsite} />
              <Field label="Match Description" value={account.matchDescription} />
              <Field label="Video Link" value={account.videoLink} />
              <Field label="Deferral Eligibility Requirements" value={account.deferralEligibilityReqs} />
              <Field label="Description" value={account.description} />
              <Field label="Deferral Entry Dates" value={account.deferralEntryDates} />
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 overflow-hidden">
            <SectionHeader title="Address Information" color="emerald" icon={MapPin} />
            <div className="p-4 md:p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Billing Address" value={account.billingAddress} />
              <Field label="Shipping Address" value={account.shippingAddress} />
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 overflow-hidden">
            <SectionHeader title="System Information" color="dark" icon={Settings} />
            <div className="p-4 md:p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Created By" value={account.createdBy} />
              <Field label="Last Modified By" value={account.lastModifiedBy} />
            </div>
          </motion.div>
        </div>
      )}

      {activeTab === 'triggers' && <TriggersTab account={account} />}
      {activeTab === 'contacts' && <ContactsTab account={account} />}
      {activeTab === 'history' && <HistoryTab account={account} />}

      <LinkPayrollModal open={payrollModalOpen} onClose={() => setPayrollModalOpen(false)} />
    </motion.div>
  )
}
