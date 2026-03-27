import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Send,
  CheckCircle2,
  Eye,
  MousePointerClick,
  MessageSquareReply,
  AlertTriangle,
  Search,
  Mail,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  ChevronUp,
  ChevronDown,
  CalendarClock,
  Clock,
  User,
  FileText,
  Target,
  Megaphone,
  TrendingUp,
  BarChart3,
  Zap,
} from 'lucide-react'
import AnimatedCounter from '../components/ui/AnimatedCounter'
import MiniProgressRing from '../components/ui/MiniProgressRing'
import CommHistoryTable from '../components/ui/CommHistoryTable'
import { getCampaignById, STATUS_STYLES, formatTimeUntil, getDripProgress, getConditionLabel } from '../lib/campaignData'
import { getCommsForCampaign } from '../lib/communicationData'

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

/* ─── Funnel Bar ────────────────────────────────────────────────────────────── */
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

const singleTabs = [
  { key: 'overview', label: 'Overview' },
  { key: 'recipients', label: 'Recipients' },
  { key: 'comms', label: 'Communication History' },
]

const dripTabs = [
  { key: 'overview', label: 'Overview' },
  { key: 'sequence', label: 'Sequence' },
  { key: 'recipients', label: 'Recipients' },
  { key: 'comms', label: 'Communication History' },
]

const PAGE_SIZE = 15

export default function CampaignDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const campaign = getCampaignById(id)
  const [activeTab, setActiveTab] = useState('overview')

  // Recipients tab state
  const [recipientSearch, setRecipientSearch] = useState('')
  const [rPage, setRPage] = useState(1)
  const [rSortKey, setRSortKey] = useState('contactName')
  const [rSortDir, setRSortDir] = useState('asc')

  const commRecords = useMemo(() => campaign ? getCommsForCampaign(campaign.name) : [], [campaign])

  // Build recipients from comm records
  const recipients = useMemo(() => {
    const map = new Map()
    commRecords.forEach((r) => {
      if (!map.has(r.contactId)) {
        map.set(r.contactId, {
          contactId: r.contactId,
          contactName: r.contactName,
          contactEmail: r.contactEmail,
          status: r.status,
          sentAt: r.sentAt,
          openedAt: r.openedAt,
          clickedAt: r.clickedAt,
        })
      }
    })
    return Array.from(map.values())
  }, [commRecords])

  const filteredRecipients = useMemo(() => {
    let data = recipients
    if (recipientSearch) {
      const q = recipientSearch.toLowerCase()
      data = data.filter((r) => r.contactName.toLowerCase().includes(q) || r.contactEmail.toLowerCase().includes(q))
    }
    data = [...data].sort((a, b) => {
      const aVal = String(a[rSortKey] || '').toLowerCase()
      const bVal = String(b[rSortKey] || '').toLowerCase()
      return rSortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    })
    return data
  }, [recipients, recipientSearch, rSortKey, rSortDir])

  const rTotalPages = Math.ceil(filteredRecipients.length / PAGE_SIZE)
  const pagedRecipients = filteredRecipients.slice((rPage - 1) * PAGE_SIZE, rPage * PAGE_SIZE)

  function handleRSort(key) {
    if (rSortKey === key) setRSortDir(rSortDir === 'asc' ? 'desc' : 'asc')
    else { setRSortKey(key); setRSortDir('asc') }
    setRPage(1)
  }

  function RSortIcon({ colKey }) {
    if (rSortKey !== colKey) return <ChevronsUpDown size={13} className="text-slate-300" />
    return rSortDir === 'asc' ? <ChevronUp size={13} className="text-primary-500" /> : <ChevronDown size={13} className="text-primary-500" />
  }

  if (!campaign) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500 dark:text-slate-400">Campaign not found.</p>
        <button onClick={() => navigate('/campaigns')} className="mt-4 text-primary-500 text-sm hover:underline cursor-pointer">Back to Campaigns</button>
      </div>
    )
  }

  const s = campaign.stats
  const formatDate = (iso) => {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })
  }

  const recipientStatusStyle = {
    Clicked: 'bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300',
    Opened: 'bg-purple-50 dark:bg-purple-500/15 text-purple-700 dark:text-purple-300',
    Delivered: 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
    Bounced: 'bg-red-50 dark:bg-red-500/15 text-red-700 dark:text-red-300',
    Enrolled: 'bg-primary-50 dark:bg-primary-500/15 text-primary-700 dark:text-primary-300',
    Unsubscribed: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
    Replied: 'bg-teal-50 dark:bg-teal-500/15 text-teal-700 dark:text-teal-300',
  }

  return (
    <motion.div
      className="p-4 md:p-8 max-w-[1400px] mx-auto space-y-4 md:space-y-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Back */}
      <motion.button
        variants={fadeUp}
        onClick={() => navigate('/campaigns')}
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
      >
        <ArrowLeft size={16} />
        Back to Campaigns
      </motion.button>

      {/* ═══ Hero Header ═══ */}
      <motion.div
        variants={fadeUp}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-50 via-white to-blue-50/40 dark:from-primary-500/5 dark:via-slate-900 dark:to-blue-500/5 border border-slate-200/60 dark:border-slate-800 px-4 py-6 md:px-8 md:py-8"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,91,255,0.06),transparent_50%)]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-400/10 dark:bg-primary-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />

        <div className="relative flex flex-col lg:flex-row items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center">
                <Megaphone size={20} className="text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{campaign.name}</h1>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[campaign.status]}`}>
                    {campaign.status === 'Scheduled' && <span className="w-1.5 h-1.5 rounded-full bg-current mr-1 animate-pulse" />}
                    {campaign.status}
                  </span>
                  {campaign.type === 'drip' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400">
                      <Zap size={10} />
                      Drip &middot; {campaign.totalSteps} steps
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 max-w-lg">{campaign.description}</p>
              </div>
            </div>

            {/* Context pills */}
            <div className="flex flex-wrap items-center gap-2 mt-5">
              {campaign.segmentId ? (
                <button
                  onClick={() => navigate(`/segmentations/${campaign.segmentId}`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/60 dark:bg-slate-800/60 border border-slate-200/40 dark:border-slate-700/40 text-xs font-medium text-primary-600 dark:text-primary-400 hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <Target size={12} />
                  {campaign.segmentName || 'All Contacts'}
                </button>
              ) : (
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/60 dark:bg-slate-800/60 border border-slate-200/40 dark:border-slate-700/40 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <Target size={12} />
                  All Contacts
                </span>
              )}
              {campaign.templateId ? (
                <button
                  onClick={() => navigate(`/templates/${campaign.templateId}`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/60 dark:bg-slate-800/60 border border-slate-200/40 dark:border-slate-700/40 text-xs font-medium text-primary-600 dark:text-primary-400 hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <FileText size={12} />
                  {campaign.templateName}
                </button>
              ) : (
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/60 dark:bg-slate-800/60 border border-slate-200/40 dark:border-slate-700/40 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <FileText size={12} />
                  {campaign.templateName || 'N/A'}
                </span>
              )}
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/60 dark:bg-slate-800/60 border border-slate-200/40 dark:border-slate-700/40 text-xs font-medium text-slate-500 dark:text-slate-400">
                <User size={12} />
                {campaign.sentBy}
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/60 dark:bg-slate-800/60 border border-slate-200/40 dark:border-slate-700/40 text-xs font-medium text-slate-500 dark:text-slate-400">
                <CalendarClock size={12} />
                {formatDate(campaign.createdAt)}
              </span>
            </div>
          </div>

          {campaign.status === 'Scheduled' && (
            <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-blue-50/80 dark:bg-blue-500/10 border border-blue-200/60 dark:border-blue-500/20 backdrop-blur-sm">
              <Clock size={18} className="text-blue-500" />
              <div>
                <p className="text-[10px] font-semibold text-blue-500 uppercase tracking-wider">Sends in</p>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400 tabular-nums">{formatTimeUntil(campaign.scheduledAt)}</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* ═══ Tabs ═══ */}
      <motion.div variants={fadeUp} className="border-b border-slate-200 dark:border-slate-800">
        <div className="flex gap-0">
          {(campaign?.type === 'drip' ? dripTabs : singleTabs).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                activeTab === tab.key
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ═══ Tab: Overview ═══ */}
      {activeTab === 'overview' && (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">

          {/* KPI Cards */}
          <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {[
              { label: 'Sent', value: s.sent, icon: Send, color: 'blue', bg: 'bg-blue-50 dark:bg-blue-500/15', iconColor: 'text-blue-500' },
              { label: 'Delivered', value: s.delivered, icon: CheckCircle2, color: 'emerald', bg: 'bg-emerald-50 dark:bg-emerald-500/15', iconColor: 'text-emerald-500' },
              { label: 'Opened', value: s.opened, icon: Eye, color: 'purple', bg: 'bg-purple-50 dark:bg-purple-500/15', iconColor: 'text-purple-500' },
              { label: 'Clicked', value: s.clicked, icon: MousePointerClick, color: 'indigo', bg: 'bg-indigo-50 dark:bg-indigo-500/15', iconColor: 'text-indigo-500' },
              { label: 'Replied', value: s.replied || 0, icon: MessageSquareReply, color: 'teal', bg: 'bg-teal-50 dark:bg-teal-500/15', iconColor: 'text-teal-500' },
              { label: 'Bounced', value: s.bounced, icon: AlertTriangle, color: 'red', bg: 'bg-red-50 dark:bg-red-500/15', iconColor: 'text-red-500' },
            ].map((kpi) => {
              const Icon = kpi.icon
              return (
                <motion.div
                  key={kpi.label}
                  whileHover={{ y: -2, boxShadow: '0 8px 25px -5px rgba(0,0,0,0.08)' }}
                  className="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-4 md:p-5 text-left overflow-hidden"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl ${kpi.bg} flex items-center justify-center`}>
                      <Icon size={18} className={kpi.iconColor} />
                    </div>
                    {kpi.label === 'Opened' && <MiniProgressRing value={parseFloat(s.openRate)} color="#8B5CF6" size={36} />}
                    {kpi.label === 'Clicked' && <MiniProgressRing value={parseFloat(s.clickRate)} color="#6366F1" size={36} />}
                    {kpi.label === 'Delivered' && <MiniProgressRing value={parseFloat(s.deliveryRate)} color="#10B981" size={36} />}
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight tabular-nums">
                    <AnimatedCounter value={kpi.value} />
                  </p>
                  <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-1">{kpi.label}</p>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Engagement Funnel + Performance Rates */}
          <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Engagement Funnel */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-4 md:p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-500/15 flex items-center justify-center">
                  <BarChart3 size={16} className="text-primary-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Engagement Funnel</h3>
              </div>
              <div className="space-y-2.5">
                <FunnelBar label="Sent" value={s.sent} maxValue={s.sent} color="#3B82F6" delay={0} />
                <FunnelBar label="Delivered" value={s.delivered} maxValue={s.sent} color="#10B981" delay={0.1} />
                <FunnelBar label="Opened" value={s.opened} maxValue={s.sent} color="#8B5CF6" delay={0.2} />
                <FunnelBar label="Clicked" value={s.clicked} maxValue={s.sent} color="#6366F1" delay={0.3} />
                <FunnelBar label="Replied" value={s.replied || 0} maxValue={s.sent} color="#14B8A6" delay={0.4} />
              </div>
            </div>

            {/* Performance Rates */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-4 md:p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/15 flex items-center justify-center">
                  <TrendingUp size={16} className="text-emerald-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Performance Rates</h3>
              </div>
              <div className="space-y-5">
                {[
                  { label: 'Open Rate', value: parseFloat(s.openRate), color: '#8B5CF6' },
                  { label: 'Click Rate', value: parseFloat(s.clickRate), color: '#6366F1' },
                  { label: 'Delivery Rate', value: parseFloat(s.deliveryRate), color: '#10B981' },
                ].map((rate) => (
                  <div key={rate.label} className="flex items-center gap-4">
                    <MiniProgressRing value={rate.value} color={rate.color} size={52} />
                    <div className="flex-1">
                      <p className="text-xl font-bold text-slate-900 dark:text-white tabular-nums tracking-tight">{rate.value}%</p>
                      <p className="text-xs font-medium text-slate-400 dark:text-slate-500">{rate.label}</p>
                    </div>
                    <div className="h-8 w-px bg-slate-100 dark:bg-slate-800" />
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 tabular-nums">
                        {rate.label === 'Open Rate' ? s.opened : rate.label === 'Click Rate' ? s.clicked : s.delivered}
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">
                        of {s.sent} sent
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Campaign Details */}
          <motion.div variants={fadeUp} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 overflow-hidden">
            <div className="bg-slate-50/80 dark:bg-slate-800/50 px-6 py-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Campaign Details</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-slate-800">
              {[
                { label: 'Created', value: formatDate(campaign.createdAt), icon: CalendarClock },
                { label: 'Scheduled', value: formatDate(campaign.scheduledAt), icon: Clock },
                { label: 'Completed', value: formatDate(campaign.completedAt), icon: CheckCircle2 },
              ].map((field) => {
                const Icon = field.icon
                return (
                  <div key={field.label} className="px-6 py-4">
                    <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">{field.label}</p>
                    <p className="text-sm text-slate-900 dark:text-white font-medium flex items-center gap-1.5">
                      <Icon size={13} className="text-slate-400 dark:text-slate-500" />
                      {field.value}
                    </p>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* ═══ Tab: Recipients ═══ */}
      {activeTab === 'recipients' && (
        <div className="space-y-4">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search recipients..."
              value={recipientSearch}
              onChange={(e) => { setRecipientSearch(e.target.value); setRPage(1) }}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-all"
            />
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                    {[
                      { key: 'contactName', label: 'Name' },
                      { key: 'contactEmail', label: 'Email' },
                      { key: 'status', label: 'Status' },
                      { key: 'sentAt', label: 'Sent At' },
                      { key: 'openedAt', label: 'Opened At' },
                    ].map((col) => (
                      <th
                        key={col.key}
                        className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-5 py-3 cursor-pointer hover:text-slate-700 dark:hover:text-slate-300 select-none"
                        onClick={() => handleRSort(col.key)}
                      >
                        <div className="flex items-center gap-1">
                          {col.label}
                          <RSortIcon colKey={col.key} />
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pagedRecipients.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-12 text-sm text-slate-400 dark:text-slate-500">No recipients found.</td></tr>
                  ) : (
                    pagedRecipients.map((r) => (
                      <tr
                        key={r.contactId}
                        onClick={() => navigate(`/participant-data/${r.contactId}`)}
                        className="border-b border-slate-50 dark:border-slate-800 last:border-0 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                      >
                        <td className="px-5 py-3.5">
                          <span className="text-sm font-medium text-primary-600 dark:text-primary-400 group-hover:text-primary-700 dark:group-hover:text-primary-300">{r.contactName}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <Mail size={13} className="text-slate-300 dark:text-slate-600" />
                            <span className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-[200px]">{r.contactEmail}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${recipientStatusStyle[r.status] || 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">{formatDate(r.sentAt)}</td>
                        <td className="px-5 py-3.5 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">{r.openedAt ? formatDate(r.openedAt) : '—'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {filteredRecipients.length > PAGE_SIZE && (
              <div className="border-t border-slate-100 dark:border-slate-800 px-5 py-3 flex items-center justify-between">
                <p className="text-sm text-slate-400 dark:text-slate-500">
                  Showing {(rPage - 1) * PAGE_SIZE + 1}–{Math.min(rPage * PAGE_SIZE, filteredRecipients.length)} of {filteredRecipients.length}
                </p>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => setRPage(Math.max(1, rPage - 1))} disabled={rPage === 1} className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer">
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-sm text-slate-500 dark:text-slate-400 px-2">Page {rPage} of {rTotalPages}</span>
                  <button onClick={() => setRPage(Math.min(rTotalPages, rPage + 1))} disabled={rPage === rTotalPages} className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer">
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══ Tab: Sequence (Drip Only) ═══ */}
      {activeTab === 'sequence' && campaign.type === 'drip' && (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
          {/* Drip progress header */}
          {(() => {
            const progress = getDripProgress(campaign)
            return progress && (
              <motion.div
                variants={fadeUp}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-50 via-white to-emerald-50/40 dark:from-primary-500/5 dark:via-slate-900 dark:to-emerald-500/5 border border-slate-200/60 dark:border-slate-800 p-4 md:p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-500/15 flex items-center justify-center">
                      <Zap size={16} className="text-primary-500" />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Sequence Progress</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-primary-50 dark:bg-primary-500/15 text-primary-600 dark:text-primary-400 tabular-nums">
                      {progress.completedSteps} of {progress.totalSteps} steps sent
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {campaign.steps.map((step, i) => {
                    const isCompleted = step.stats.sent > 0
                    const isActive = i === campaign.currentStep
                    return (
                      <div key={step.id} className="flex items-center gap-2">
                        <div className={`w-3.5 h-3.5 rounded-full flex-shrink-0 transition-all ${
                          isCompleted ? 'bg-emerald-500 shadow-sm shadow-emerald-500/30' : isActive ? 'bg-primary-500 animate-pulse shadow-sm shadow-primary-500/30' : 'bg-slate-200 dark:bg-slate-700'
                        }`} />
                        {i < campaign.steps.length - 1 && (
                          <div className={`w-10 h-0.5 rounded-full ${isCompleted ? 'bg-emerald-300 dark:bg-emerald-500/40' : 'bg-slate-200 dark:bg-slate-700'}`} />
                        )}
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )
          })()}

          {/* Step cards */}
          {campaign.steps.map((step, i) => {
            const isCompleted = step.stats.sent > 0
            const isActive = i === campaign.currentStep && !isCompleted

            return (
              <motion.div key={step.id} variants={fadeUp}>
                {/* Connector */}
                {i > 0 && (
                  <div className="flex items-center justify-center py-2">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-px h-3 border-l-2 border-dashed border-slate-200 dark:border-slate-700" />
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-500 dark:text-slate-400 tabular-nums">
                          {step.delayAmount} {step.delayUnit}
                        </span>
                        {step.condition && (
                          <span className="px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-500/10 text-[10px] font-semibold text-purple-600 dark:text-purple-400">
                            {getConditionLabel(step.condition)}
                          </span>
                        )}
                      </div>
                      <div className="w-px h-3 border-l-2 border-dashed border-slate-200 dark:border-slate-700" />
                    </div>
                  </div>
                )}

                {/* Step card */}
                <div className={`bg-white dark:bg-slate-900 rounded-2xl border p-4 md:p-5 transition-all ${
                  isActive ? 'border-primary-300 dark:border-primary-500/40 ring-1 ring-primary-200 dark:ring-primary-500/20 shadow-sm shadow-primary-100 dark:shadow-none' :
                  isCompleted ? 'border-emerald-200 dark:border-emerald-500/30' :
                  'border-slate-200/60 dark:border-slate-800 opacity-60'
                }`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 ${
                      isCompleted ? 'bg-emerald-500 text-white' :
                      isActive ? 'bg-primary-500 text-white' :
                      'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                    }`}>
                      {isCompleted ? <CheckCircle2 size={14} /> : i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">{step.templateName}</h4>
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        {isCompleted ? 'Completed' : isActive ? 'Active' : 'Pending'}
                        {i === 0 ? ' \u00B7 Sent immediately' : ` \u00B7 ${step.delayAmount} ${step.delayUnit} delay`}
                      </p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      isCompleted ? 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400' :
                      isActive ? 'bg-primary-50 dark:bg-primary-500/15 text-primary-700 dark:text-primary-400' :
                      'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}>
                      {isCompleted ? 'Sent' : isActive ? 'In Progress' : 'Queued'}
                    </span>
                  </div>

                  {/* Stats */}
                  {step.stats.sent > 0 && (
                    <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                      {[
                        { label: 'Sent', value: step.stats.sent, color: 'text-blue-600 dark:text-blue-400' },
                        { label: 'Opened', value: step.stats.opened, color: 'text-purple-600 dark:text-purple-400' },
                        { label: 'Clicked', value: step.stats.clicked, color: 'text-indigo-600 dark:text-indigo-400' },
                        { label: 'Open Rate', value: step.stats.openRate + '%', color: 'text-emerald-600 dark:text-emerald-400' },
                      ].map((stat, si) => (
                        <div key={stat.label} className="flex items-center gap-4 flex-1">
                          {si > 0 && <div className="w-px h-8 bg-slate-100 dark:bg-slate-800" />}
                          <div className="text-center flex-1">
                            <p className={`text-lg font-bold tabular-nums ${stat.color}`}>{stat.value}</p>
                            <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">{stat.label}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      )}

      {/* ═══ Tab: Communication History ═══ */}
      {activeTab === 'comms' && (
        <CommHistoryTable records={commRecords} showCampaign={false} />
      )}
    </motion.div>
  )
}
