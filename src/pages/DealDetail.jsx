import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Target,
  User,
  Building2,
  CalendarClock,
  Clock,
  DollarSign,
  FileText,
  Mail,
  Phone,
  Landmark,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import {
  getDealById,
  DEAL_STAGES,
  STAGE_STYLES,
  STAGE_DOT_COLORS,
  PRIORITY_STYLES,
  FEE_RATE,
  getStageLabel,
} from '../lib/pipelineData'
import { useContacts } from '../lib/useContacts'
import { getCommsForContact, getCommStats } from '../lib/communicationData'
import CommHistoryTable from '../components/ui/CommHistoryTable'
import AnimatedCounter from '../components/ui/AnimatedCounter'
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

function Field({ label, value }) {
  return (
    <div className="py-3 px-4 border border-slate-100 dark:border-slate-800 rounded-lg">
      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-sm text-slate-900 dark:text-white font-medium">{value || 'N/A'}</p>
    </div>
  )
}

const MOCK_ACTIVITY = (deal) => [
  { id: 1, action: 'Deal created', detail: `Source: ${deal.source}`, date: deal.createdAt },
  ...(deal.stage !== 'lead' ? [{ id: 2, action: 'Moved to Contacted', detail: 'Initial outreach sent', date: new Date(new Date(deal.createdAt).getTime() + 3 * 86400000).toISOString() }] : []),
  ...((['meeting_scheduled', 'proposal_sent', 'negotiation', 'won', 'lost'].includes(deal.stage)) ? [{ id: 3, action: 'Moved to Meeting Scheduled', detail: 'Discovery meeting confirmed', date: new Date(new Date(deal.createdAt).getTime() + 7 * 86400000).toISOString() }] : []),
  ...((['proposal_sent', 'negotiation', 'won', 'lost'].includes(deal.stage)) ? [{ id: 4, action: 'Moved to Proposal Sent', detail: 'Wealth management proposal delivered', date: new Date(new Date(deal.createdAt).getTime() + 14 * 86400000).toISOString() }] : []),
  ...((['negotiation', 'won', 'lost'].includes(deal.stage)) ? [{ id: 5, action: 'Moved to Negotiation', detail: 'Discussing terms and fee structure', date: new Date(new Date(deal.createdAt).getTime() + 18 * 86400000).toISOString() }] : []),
  ...(deal.stage === 'won' ? [{ id: 6, action: 'Deal Won', detail: 'Client signed engagement letter', date: deal.closedAt }] : []),
  ...(deal.stage === 'lost' ? [{ id: 6, action: 'Deal Lost', detail: deal.notes, date: deal.closedAt }] : []),
]

const tabsList = [
  { key: 'overview', label: 'Overview' },
  { key: 'comms', label: 'Communication History' },
  { key: 'activity', label: 'Activity' },
  { key: 'participant', label: 'Participant Info' },
]

export default function DealDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const deal = getDealById(id)
  const [activeTab, setActiveTab] = useState('overview')
  const { contacts, loading } = useContacts()

  if (!deal) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500 dark:text-slate-400">Deal not found.</p>
        <button onClick={() => navigate('/pipeline')} className="mt-4 text-primary-500 text-sm hover:underline cursor-pointer">Back to Pipeline</button>
      </div>
    )
  }

  const formatDate = (iso) => {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const formatDateTime = (iso) => {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })
  }

  const participant = contacts.find((c) => c.id === deal.participantId) || contacts[deal.participantId]
  const activity = MOCK_ACTIVITY(deal)

  const currentStageIdx = DEAL_STAGES.findIndex((s) => s.key === deal.stage)

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
        onClick={() => navigate('/pipeline')}
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
      >
        <ArrowLeft size={16} />
        Back to Pipeline
      </motion.button>

      {/* Deal header */}
      <motion.div
        variants={fadeUp}
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-4 md:p-6"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{deal.participantName}</h1>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STAGE_STYLES[deal.stage]}`}>
                {getStageLabel(deal.stage)}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${PRIORITY_STYLES[deal.priority]}`}>
                {deal.priority}
              </span>
            </div>
            <p className="text-sm text-slate-400">{deal.accountName} · ${deal.dealValue.toLocaleString()} deal value</p>
          </div>
          <div className="flex items-center gap-2">
            {deal.stage !== 'won' && deal.stage !== 'lost' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { showToast(`"${deal.participantName}" marked as Won!`, 'success'); setTimeout(() => navigate('/pipeline'), 800) }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition-colors cursor-pointer"
                >
                  <CheckCircle2 size={14} />
                  Won
                </button>
                <button
                  onClick={() => { showToast(`"${deal.participantName}" marked as Lost`, 'info'); setTimeout(() => navigate('/pipeline'), 800) }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
                >
                  <XCircle size={14} />
                  Lost
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={fadeUp} className="border-b border-slate-200 dark:border-slate-800">
        <div className="flex gap-0">
          {tabsList.map((tab) => (
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
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4 md:space-y-6">
          {/* Info grid */}
          <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <InfoField label="Participant" value={deal.participantName} icon={User} link={`/participant-data/${deal.participantId}`} navigate={navigate} />
            <InfoField label="Account" value={deal.accountName} icon={Building2} />
            <InfoField label="Assigned To" value={deal.assignedTo} icon={User} />
            <InfoField label="Source" value={deal.source} icon={Target} />
            <InfoField label="Created" value={formatDateTime(deal.createdAt)} icon={CalendarClock} />
            <InfoField label="Last Updated" value={formatDateTime(deal.updatedAt)} icon={Clock} />
            <InfoField label="Next Action" value={deal.nextAction} icon={FileText} />
            <InfoField label="Next Action Date" value={formatDate(deal.nextActionDate)} icon={CalendarClock} />
            <InfoField label="Closed Date" value={formatDateTime(deal.closedAt)} icon={CheckCircle2} />
          </motion.div>

          {/* Deal value + stage progression */}
          <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Deal value */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 p-4 md:p-6">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Deal Value</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Estimated AUM</p>
                  <p className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight tabular-nums">
                    ${deal.dealValue.toLocaleString()}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Fee Rate</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">{(FEE_RATE * 100).toFixed(0)}%</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Est. Revenue</p>
                    <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">${deal.estimatedRevenue.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stage progression */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 p-4 md:p-6">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-6">Stage Progression</h3>
              <div className="space-y-3">
                {DEAL_STAGES.map((stage, idx) => {
                  const isCurrent = stage.key === deal.stage
                  const isPast = idx < currentStageIdx
                  const isFuture = idx > currentStageIdx
                  return (
                    <div key={stage.key} className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                        isCurrent
                          ? `${STAGE_DOT_COLORS[stage.key]} ring-4 ring-${stage.color}-100 dark:ring-${stage.color}-500/20`
                          : isPast
                            ? 'bg-emerald-500'
                            : 'bg-slate-200 dark:bg-slate-700'
                      }`}>
                        {isPast && <CheckCircle2 size={14} className="text-white" />}
                        {isCurrent && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <span className={`text-sm ${
                        isCurrent ? 'font-semibold text-slate-900 dark:text-white' : isPast ? 'text-slate-500' : 'text-slate-300 dark:text-slate-600'
                      }`}>
                        {stage.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>

          {/* Notes */}
          {deal.notes && (
            <motion.div variants={fadeUp} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 p-4 md:p-6">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Notes</h3>
              <div className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl p-4">
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{deal.notes}</p>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* ── Tab: Communication History ────────────────────────── */}
      {activeTab === 'comms' && (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
          {(() => {
            const records = getCommsForContact(deal.participantId)
            const commStats = getCommStats(records)
            const colorMap = {
              blue: 'bg-blue-50 dark:bg-blue-500/15',
              emerald: 'bg-emerald-50 dark:bg-emerald-500/15',
              purple: 'bg-purple-50 dark:bg-purple-500/15',
              indigo: 'bg-indigo-50 dark:bg-indigo-500/15',
              amber: 'bg-amber-50 dark:bg-amber-500/15',
            }
            return (
              <>
                <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {[
                    { label: 'Total Sent', value: commStats.sent, color: 'blue' },
                    { label: 'Delivered', value: commStats.delivered, color: 'emerald' },
                    { label: 'Opened', value: commStats.opened, color: 'purple' },
                    { label: 'Clicked', value: commStats.clicked, color: 'indigo' },
                    { label: 'Open Rate', value: commStats.openRate, suffix: '%', color: 'amber' },
                  ].map((s) => (
                    <motion.div
                      key={s.label}
                      whileHover={{ y: -2, boxShadow: '0 8px 25px -5px rgba(0,0,0,0.08)' }}
                      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-4 text-center"
                    >
                      <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight tabular-nums">
                        <AnimatedCounter value={parseFloat(s.value)} />{s.suffix || ''}
                      </p>
                      <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-1">{s.label}</p>
                    </motion.div>
                  ))}
                </motion.div>
                {records.length > 0 ? (
                  <motion.div variants={fadeUp}>
                    <CommHistoryTable records={records} showContact={false} />
                  </motion.div>
                ) : (
                  <motion.div variants={fadeUp} className="text-center py-12 text-sm text-slate-400 dark:text-slate-500">
                    No communication history found for this participant.
                  </motion.div>
                )}
              </>
            )
          })()}
        </motion.div>
      )}

      {/* ── Tab: Activity ──────────────────────────────────────── */}
      {activeTab === 'activity' && (
        <motion.div
          variants={fadeUp}
          className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-4 md:p-6"
        >
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-6">Deal Activity</h3>
          <div className="relative">
            <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gradient-to-b from-slate-200 dark:from-slate-700 via-slate-200 dark:via-slate-700 to-transparent" />
            <div className="space-y-1">
              {activity.map((event, idx) => (
                <div
                  key={event.id}
                  className="relative flex items-start gap-4 pl-8 py-3 rounded-xl hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className={`absolute left-1 top-4.5 w-[10px] h-[10px] rounded-full border-2 border-white dark:border-slate-900 shadow-sm ${
                    event.action === 'Deal Won' ? 'bg-emerald-500' : event.action === 'Deal Lost' ? 'bg-red-500' : 'bg-primary-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{event.action}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{event.detail}</p>
                  </div>
                  <span className="text-[11px] text-slate-400 whitespace-nowrap shrink-0 tabular-nums">
                    {formatDate(event.date)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Tab: Participant Info ──────────────────────────────── */}
      {activeTab === 'participant' && (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
          {loading ? (
            <div className="text-center py-12 text-sm text-slate-400">Loading participant data...</div>
          ) : participant ? (
            <>
              <motion.div variants={fadeUp} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-4 md:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Participant Profile</h3>
                  <button
                    onClick={() => navigate(`/participant-data/${deal.participantId}`)}
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary-500 hover:text-primary-600 transition-colors cursor-pointer"
                  >
                    View Full Profile <ArrowLeft size={12} className="rotate-180" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Field label="Full Name" value={participant.fullName} />
                  <Field label="Email" value={participant.email} />
                  <Field label="Phone" value={participant.phone} />
                  <Field label="Title" value={participant.title} />
                  <Field label="Salary" value={participant.salary ? `$${participant.salary.toLocaleString()}` : null} />
                  <Field label="Plan Balance" value={participant.planBalance ? `$${participant.planBalance.toLocaleString()}` : null} />
                  <Field label="Employment Status" value={participant.employmentStatus} />
                  <Field label="Eligibility" value={participant.eligibilityStatus} />
                  <Field label="Entry Date" value={participant.entryDate} />
                  <Field label="Pre-Tax Contribution" value={participant.preTaxContribRate ? `${participant.preTaxContribRate}%` : null} />
                  <Field label="Roth Contribution" value={participant.rothContribRate ? `${participant.rothContribRate}%` : null} />
                  <Field label="Location" value={[participant.mailingCity, participant.mailingState].filter(Boolean).join(', ') || null} />
                </div>
              </motion.div>
            </>
          ) : (
            <div className="text-center py-12 text-sm text-slate-400">
              Participant data not available.
              <button onClick={() => navigate(`/participant-data/${deal.participantId}`)} className="block mt-2 text-primary-500 hover:underline cursor-pointer mx-auto">
                Try viewing participant directly
              </button>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}
