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
} from 'lucide-react'
import AnimatedCounter from '../components/ui/AnimatedCounter'
import MiniProgressRing from '../components/ui/MiniProgressRing'
import CommHistoryTable from '../components/ui/CommHistoryTable'
import { getCampaignById, STATUS_STYLES, formatTimeUntil } from '../lib/campaignData'
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
      <span className="text-[11px] text-slate-400 w-20 text-right shrink-0">{label}</span>
      <div className="flex-1 h-6 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      </div>
      <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 w-10 tabular-nums">{value}</span>
    </div>
  )
}

function InfoField({ label, value, icon: Icon, link, navigate: nav }) {
  return (
    <div className="py-3 px-4 border border-slate-100 dark:border-slate-800 rounded-lg bg-slate-50/50 dark:bg-slate-800/30">
      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
      {link ? (
        <button onClick={() => nav(link)} className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline cursor-pointer flex items-center gap-1.5">
          {Icon && <Icon size={13} />}
          {value}
        </button>
      ) : (
        <p className="text-sm text-slate-900 dark:text-white font-medium flex items-center gap-1.5">
          {Icon && <Icon size={13} className="text-slate-400" />}
          {value || 'N/A'}
        </p>
      )}
    </div>
  )
}

const tabs = [
  { key: 'overview', label: 'Overview' },
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
    Clicked: 'bg-indigo-50 text-indigo-700',
    Opened: 'bg-purple-50 text-purple-700',
    Delivered: 'bg-emerald-50 text-emerald-700',
    Bounced: 'bg-red-50 text-red-700',
    Enrolled: 'bg-primary-50 text-primary-700',
    Unsubscribed: 'bg-slate-100 text-slate-600',
    Replied: 'bg-teal-50 text-teal-700',
  }

  return (
    <motion.div
      className="p-8 max-w-[1200px] mx-auto space-y-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Back */}
      <motion.button
        variants={fadeUp}
        onClick={() => navigate('/campaigns')}
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
      >
        <ArrowLeft size={16} />
        Back to Campaigns
      </motion.button>

      {/* Campaign header */}
      <motion.div
        variants={fadeUp}
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-6"
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{campaign.name}</h1>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[campaign.status]}`}>
                {campaign.status === 'Scheduled' && <span className="w-1.5 h-1.5 rounded-full bg-current mr-1 animate-pulse" />}
                {campaign.status}
              </span>
            </div>
            <p className="text-sm text-slate-400">{campaign.description}</p>
          </div>
          {campaign.status === 'Scheduled' && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20">
              <Clock size={16} className="text-blue-500" />
              <div>
                <p className="text-xs text-blue-500">Sends in</p>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400 tabular-nums">{formatTimeUntil(campaign.scheduledAt)}</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={fadeUp} className="border-b border-slate-200 dark:border-slate-800">
        <div className="flex gap-0">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                activeTab === tab.key
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── Tab: Overview ──────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
          {/* Info grid */}
          <motion.div variants={fadeUp} className="grid grid-cols-3 gap-3">
            <InfoField label="Segment" value={campaign.segmentName || 'All Contacts'} icon={Target} link={campaign.segmentId ? `/segmentations/${campaign.segmentId}` : null} navigate={navigate} />
            <InfoField label="Template" value={campaign.templateName} icon={FileText} link={campaign.templateId ? `/templates/${campaign.templateId}` : null} navigate={navigate} />
            <InfoField label="Sent By" value={campaign.sentBy} icon={User} />
            <InfoField label="Created" value={formatDate(campaign.createdAt)} icon={CalendarClock} />
            <InfoField label="Scheduled" value={formatDate(campaign.scheduledAt)} icon={Clock} />
            <InfoField label="Completed" value={formatDate(campaign.completedAt)} icon={CheckCircle2} />
          </motion.div>

          {/* KPI row */}
          <motion.div variants={fadeUp} className="grid grid-cols-6 gap-3">
            {[
              { label: 'Sent', value: s.sent, icon: Send, color: 'text-blue-500 bg-blue-50 dark:bg-blue-500/15' },
              { label: 'Delivered', value: s.delivered, icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/15' },
              { label: 'Opened', value: s.opened, icon: Eye, color: 'text-purple-500 bg-purple-50 dark:bg-purple-500/15' },
              { label: 'Clicked', value: s.clicked, icon: MousePointerClick, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-500/15' },
              { label: 'Replied', value: s.replied || 0, icon: MessageSquareReply, color: 'text-teal-500 bg-teal-50 dark:bg-teal-500/15' },
              { label: 'Bounced', value: s.bounced, icon: AlertTriangle, color: 'text-red-500 bg-red-50 dark:bg-red-500/15' },
            ].map((kpi) => {
              const Icon = kpi.icon
              return (
                <div key={kpi.label} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 p-4 text-center">
                  <div className={`w-8 h-8 rounded-lg ${kpi.color} flex items-center justify-center mx-auto mb-2`}>
                    <Icon size={16} />
                  </div>
                  <p className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">
                    <AnimatedCounter value={kpi.value} />
                  </p>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">{kpi.label}</p>
                </div>
              )
            })}
          </motion.div>

          {/* Engagement funnel + rates */}
          <motion.div variants={fadeUp} className="grid grid-cols-2 gap-6">
            {/* Funnel */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 p-6">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Engagement Funnel</h3>
              <div className="space-y-2.5">
                <FunnelBar label="Sent" value={s.sent} maxValue={s.sent} color="#635BFF" delay={0} />
                <FunnelBar label="Delivered" value={s.delivered} maxValue={s.sent} color="#3B82F6" delay={0.1} />
                <FunnelBar label="Opened" value={s.opened} maxValue={s.sent} color="#8B5CF6" delay={0.2} />
                <FunnelBar label="Clicked" value={s.clicked} maxValue={s.sent} color="#10B981" delay={0.3} />
                <FunnelBar label="Replied" value={s.replied || 0} maxValue={s.sent} color="#14B8A6" delay={0.4} />
              </div>
            </div>

            {/* Rates */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 p-6">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Performance Rates</h3>
              <div className="space-y-6">
                {[
                  { label: 'Open Rate', value: parseFloat(s.openRate), color: '#8B5CF6' },
                  { label: 'Click Rate', value: parseFloat(s.clickRate), color: '#10B981' },
                  { label: 'Delivery Rate', value: parseFloat(s.deliveryRate), color: '#3B82F6' },
                ].map((rate) => (
                  <div key={rate.label} className="flex items-center gap-4">
                    <MiniProgressRing value={rate.value} color={rate.color} size={48} />
                    <div>
                      <p className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">{rate.value}%</p>
                      <p className="text-xs text-slate-400">{rate.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* ── Tab: Recipients ────────────────────────────────────── */}
      {activeTab === 'recipients' && (
        <div className="space-y-4">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search recipients..."
              value={recipientSearch}
              onChange={(e) => { setRecipientSearch(e.target.value); setRPage(1) }}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-all"
            />
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 overflow-hidden">
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
                        className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-5 py-3 cursor-pointer hover:text-slate-700 select-none"
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
                    <tr><td colSpan={5} className="text-center py-12 text-sm text-slate-400">No recipients found.</td></tr>
                  ) : (
                    pagedRecipients.map((r) => (
                      <tr
                        key={r.contactId}
                        onClick={() => navigate(`/participant-data/${r.contactId}`)}
                        className="border-b border-slate-50 dark:border-slate-800 last:border-0 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                      >
                        <td className="px-5 py-3">
                          <span className="text-sm font-medium text-primary-600 dark:text-primary-400">{r.contactName}</span>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-1.5">
                            <Mail size={13} className="text-slate-300" />
                            <span className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-[200px]">{r.contactEmail}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${recipientStatusStyle[r.status] || 'bg-slate-100 text-slate-600'}`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">{formatDate(r.sentAt)}</td>
                        <td className="px-5 py-3 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">{r.openedAt ? formatDate(r.openedAt) : '—'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {filteredRecipients.length > PAGE_SIZE && (
              <div className="border-t border-slate-100 dark:border-slate-800 px-5 py-3 flex items-center justify-between">
                <p className="text-sm text-slate-400">
                  Showing {(rPage - 1) * PAGE_SIZE + 1}–{Math.min(rPage * PAGE_SIZE, filteredRecipients.length)} of {filteredRecipients.length}
                </p>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => setRPage(Math.max(1, rPage - 1))} disabled={rPage === 1} className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer">
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-sm text-slate-500 px-2">Page {rPage} of {rTotalPages}</span>
                  <button onClick={() => setRPage(Math.min(rTotalPages, rPage + 1))} disabled={rPage === rTotalPages} className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer">
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Tab: Communication History ─────────────────────────── */}
      {activeTab === 'comms' && (
        <CommHistoryTable records={commRecords} showCampaign={false} />
      )}
    </motion.div>
  )
}
