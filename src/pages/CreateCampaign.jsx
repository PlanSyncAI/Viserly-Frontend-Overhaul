import { useState, useMemo, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Mail,
  Search,
  Calendar,
  Clock,
  ChevronDown,
  Check,
  Users,
  FileText,
  CalendarClock,
  ClipboardCheck,
  SendHorizonal,
  Target,
} from 'lucide-react'
import { DUMMY_SEGMENTATIONS } from '../lib/segmentationData'
import { DUMMY_TEMPLATES, SAMPLE_MERGE_VALUES } from '../lib/templateData'
import CampaignTypeSelector from '../components/ui/CampaignTypeSelector'
import DripSequenceBuilder from '../components/ui/DripSequenceBuilder'

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

const SINGLE_STEPS = [
  { num: 1, label: 'Choose a segmented audience', icon: Users },
  { num: 2, label: 'Choose an email template', icon: FileText },
  { num: 3, label: 'Schedule delivery', icon: CalendarClock },
  { num: 4, label: 'Review and verify merged content', icon: ClipboardCheck },
  { num: 5, label: 'Press send', icon: SendHorizonal },
]

const DRIP_STEPS = [
  { num: 1, label: 'Choose a segmented audience', icon: Users },
  { num: 2, label: 'Build your email sequence', icon: Target },
  { num: 3, label: 'Schedule first delivery', icon: CalendarClock },
  { num: 4, label: 'Review all steps', icon: ClipboardCheck },
  { num: 5, label: 'Activate sequence', icon: SendHorizonal },
]

const DEFAULT_DRIP_STEPS = [
  { id: 'step-1', order: 0, templateId: null, delayAmount: 0, delayUnit: 'days', condition: null },
  { id: 'step-2', order: 1, templateId: null, delayAmount: 3, delayUnit: 'days', condition: null },
]

/* ─── Searchable Dropdown ───────────────────────────────────────────────────── */
function SearchableSelect({ label, required, placeholder, items, value, onChange, renderItem, renderSelected, searchKeys }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const ref = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const filtered = useMemo(() => {
    if (!query) return items
    const q = query.toLowerCase()
    return items.filter((item) =>
      searchKeys.some((key) => (item[key] || '').toLowerCase().includes(q))
    )
  }, [items, query, searchKeys])

  const selected = items.find((i) => i.id === value)

  return (
    <div ref={ref} className="relative">
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">
          {required && <span className="text-primary-500 mr-0.5">*</span>}
          {label}
        </label>
      )}
      {/* Trigger */}
      <button
        type="button"
        onClick={() => { setOpen(!open); setQuery('') }}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all duration-200 ${
          open
            ? 'border-primary-400 ring-2 ring-primary-100 bg-white'
            : 'border-slate-200 bg-white hover:border-slate-300'
        }`}
      >
        {selected ? (
          <span className="text-sm text-slate-900 dark:text-white">{renderSelected(selected)}</span>
        ) : (
          <span className="text-sm text-slate-400 dark:text-slate-500">{placeholder}</span>
        )}
        <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1.5 w-full bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
          {/* Search input */}
          <div className="p-2 border-b border-slate-100 dark:border-slate-800">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
              />
            </div>
          </div>
          {/* Options */}
          <div className="max-h-60 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-slate-400 dark:text-slate-500">No results found</div>
            ) : (
              filtered.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => { onChange(item.id); setOpen(false); setQuery('') }}
                  className={`w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-primary-50 transition-colors ${
                    item.id === value ? 'bg-primary-50' : ''
                  }`}
                >
                  {renderItem(item)}
                  {item.id === value && (
                    <Check size={16} className="ml-auto text-primary-500 shrink-0" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Step Content Components ───────────────────────────────────────────────── */

function StepSegmentation({ segmentId, setSegmentId }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-8">
      <h3 className="text-lg font-bold text-slate-900 mb-1">Select Your Segmentation</h3>
      <p className="text-sm text-slate-400 mb-6">
        Pick the saved segment that should receive this campaign.
      </p>
      <SearchableSelect
        label="Segmentation"
        required
        placeholder="Search segmentations..."
        items={DUMMY_SEGMENTATIONS}
        value={segmentId}
        onChange={setSegmentId}
        searchKeys={['name', 'description']}
        renderSelected={(s) => s.name}
        renderItem={(s) => (
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center shrink-0">
              <Target size={16} className="text-primary-500" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{s.name}</p>
              <p className="text-xs text-slate-400 truncate">{s.contactCount} contacts · {s.status}</p>
            </div>
          </div>
        )}
      />
      {segmentId && (
        <div className="mt-4 p-4 rounded-xl bg-primary-50/50 border border-primary-100">
          {(() => {
            const seg = DUMMY_SEGMENTATIONS.find((s) => s.id === segmentId)
            return (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                  <Users size={18} className="text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{seg.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{seg.contactCount} recipients · {seg.description}</p>
                </div>
              </div>
            )
          })()}
        </div>
      )}
    </div>
  )
}

function StepTemplate({ templateId, setTemplateId }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-8">
      <h3 className="text-lg font-bold text-slate-900 mb-1">Select Email Template</h3>
      <p className="text-sm text-slate-400 mb-6">
        Choose the template content that will be merged for each recipient.
      </p>
      <SearchableSelect
        label="Email Template"
        required
        placeholder="Search templates..."
        items={DUMMY_TEMPLATES}
        value={templateId}
        onChange={setTemplateId}
        searchKeys={['name', 'subject']}
        renderSelected={(t) => t.name}
        renderItem={(t) => (
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
              <Mail size={16} className="text-blue-500" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{t.name}</p>
              <p className="text-xs text-slate-400 truncate">Email Template</p>
            </div>
          </div>
        )}
      />
      {templateId && (
        <div className="mt-4 p-4 rounded-xl bg-blue-50/50 border border-blue-100">
          {(() => {
            const tpl = DUMMY_TEMPLATES.find((t) => t.id === templateId)
            return (
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                    <FileText size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{tpl.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Subject: {tpl.subject.replace(/\*?\[\[.*?\]\]\*?/g, '{{merge}}')}</p>
                  </div>
                </div>
              </div>
            )
          })()}
        </div>
      )}
    </div>
  )
}

function StepSchedule({ date, setDate, time, setTime, delayCalc, setDelayCalc }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-8">
      <h3 className="text-lg font-bold text-slate-900 mb-1">Schedule Delivery</h3>
      <p className="text-sm text-slate-400 mb-6">
        Set the send time and optionally defer audience expansion until 24 hours before send.
      </p>

      <div className="mb-6">
        <p className="text-sm font-semibold text-slate-700 mb-3">Scheduled Delivery Time</p>
        <div className="grid grid-cols-2 gap-4 max-w-md">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Date</label>
            <div className="relative">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 pr-10 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
              />
              <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Time</label>
            <div className="relative">
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-3 pr-10 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
              />
              <Clock size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Delay segmentation toggle */}
      <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => setDelayCalc(!delayCalc)}
            className={`mt-0.5 w-10 h-6 rounded-full transition-colors duration-200 flex items-center shrink-0 ${
              delayCalc ? 'bg-primary-500' : 'bg-slate-300'
            }`}
          >
            <span
              className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                delayCalc ? 'translate-x-5' : 'translate-x-1'
              }`}
            />
          </button>
          <div>
            <p className="text-sm font-semibold text-slate-700">Delay segmentation calculation</p>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              When enabled, campaign members are calculated 24 hours before send instead of immediately.
              Use this for future sends (for example, holiday campaigns) when the segment should keep growing over time.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function StepReview({ segmentId, templateId, date, time, delayCalc }) {
  const seg = DUMMY_SEGMENTATIONS.find((s) => s.id === segmentId)
  const tpl = DUMMY_TEMPLATES.find((t) => t.id === templateId)

  // Merge template body with sample values for preview
  const mergedBody = useMemo(() => {
    if (!tpl) return ''
    let text = tpl.body
    Object.entries(SAMPLE_MERGE_VALUES).forEach(([key, val]) => {
      text = text.replace(new RegExp(`\\*?\\[\\[${key}\\]\\]\\*?`, 'g'), val)
    })
    return text
  }, [tpl])

  const mergedSubject = useMemo(() => {
    if (!tpl) return ''
    let text = tpl.subject
    Object.entries(SAMPLE_MERGE_VALUES).forEach(([key, val]) => {
      text = text.replace(new RegExp(`\\*?\\[\\[${key}\\]\\]\\*?`, 'g'), val)
    })
    return text
  }, [tpl])

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-8">
      <h3 className="text-lg font-bold text-slate-900 mb-1">Review Campaign</h3>
      <p className="text-sm text-slate-400 mb-6">
        Verify that everything looks correct before sending.
      </p>

      {/* Summary grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Audience</p>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">{seg?.name || '—'}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{seg ? `${seg.contactCount} recipients` : ''}</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Template</p>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">{tpl?.name || '—'}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Email Template</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Scheduled</p>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            {date ? new Date(date + 'T' + (time || '00:00')).toLocaleString('en-US', {
              weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
              hour: 'numeric', minute: '2-digit',
            }) : 'Not set'}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Delay Calculation</p>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">{delayCalc ? 'Enabled' : 'Disabled'}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{delayCalc ? 'Calculated 24h before send' : 'Calculated immediately'}</p>
        </div>
      </div>

      {/* Email preview */}
      {tpl && (
        <div>
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Email Preview (Sample Merge)</p>
          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 dark:border-slate-700">
              <p className="text-xs text-slate-400 dark:text-slate-500">Subject</p>
              <p className="text-sm font-medium text-slate-900">{mergedSubject}</p>
            </div>
            <div className="p-5 text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {mergedBody}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function StepSend({ onSend, sending }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-5">
        <SendHorizonal size={28} className="text-emerald-500" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">Ready to Send</h3>
      <p className="text-sm text-slate-400 dark:text-slate-500 max-w-md mx-auto mb-8">
        Your campaign is configured and ready. Once you press send, the emails will be queued
        for delivery at the scheduled time.
      </p>
      <button
        type="button"
        onClick={onSend}
        disabled={sending}
        className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-primary-500 dark:bg-primary-600 text-white font-semibold text-sm hover:bg-primary-600 active:bg-primary-700 transition-colors disabled:opacity-50"
      >
        <SendHorizonal size={16} />
        {sending ? 'Sending...' : 'Send Campaign'}
      </button>
    </div>
  )
}

/* ─── Main Page ─────────────────────────────────────────────────────────────── */

export default function CreateCampaign() {
  const navigate = useNavigate()
  const [campaignType, setCampaignType] = useState(null) // null | 'single' | 'drip'
  const [step, setStep] = useState(1)
  const [segmentId, setSegmentId] = useState(null)
  const [templateId, setTemplateId] = useState(null)
  const [dripSteps, setDripSteps] = useState(DEFAULT_DRIP_STEPS)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [delayCalc, setDelayCalc] = useState(false)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const STEPS = campaignType === 'drip' ? DRIP_STEPS : SINGLE_STEPS

  const canAdvance = () => {
    if (step === 1) return segmentId !== null
    if (step === 2) {
      if (campaignType === 'drip') return dripSteps.length >= 2 && dripSteps.every((s) => s.templateId !== null)
      return templateId !== null
    }
    if (step === 3) return date !== ''
    return true
  }

  const handleSend = () => {
    setSending(true)
    setTimeout(() => {
      setSending(false)
      setSent(true)
    }, 1500)
  }

  if (sent) {
    return (
      <div className="p-8 max-w-[1000px] mx-auto">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-5">
            <Check size={32} className="text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Campaign Scheduled!</h2>
          <p className="text-sm text-slate-400 dark:text-slate-500 max-w-md mb-8">
            Your campaign has been queued and will be sent at the scheduled time.
            You can track its progress in Campaigns.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/campaigns')}
              className="px-5 py-2.5 rounded-xl bg-primary-500 dark:bg-primary-600 text-white text-sm font-semibold hover:bg-primary-600 transition-colors"
            >
              View Campaigns
            </button>
            <button
              onClick={() => {
                setCampaignType(null)
                setStep(1)
                setSegmentId(null)
                setTemplateId(null)
                setDripSteps(DEFAULT_DRIP_STEPS)
                setDate('')
                setTime('')
                setDelayCalc(false)
                setSent(false)
              }}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Create Another
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div className="p-8 max-w-[1000px] mx-auto space-y-6" variants={staggerContainer} initial="hidden" animate="visible">
      {/* Hero header */}
      <motion.div variants={fadeUp} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-100 via-primary-50 to-white dark:from-primary-500/10 dark:via-primary-500/5 dark:to-slate-900 border border-primary-100/60 dark:border-slate-800 px-8 py-10 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,91,255,0.08),transparent_50%)]" />
        <div className="relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 border border-primary-200/40 text-[11px] font-semibold text-primary-600 uppercase tracking-wider mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-400" />
            Campaign Orchestration
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white/80 border border-slate-200/60 shadow-sm flex items-center justify-center mx-auto mb-4">
            <Mail size={28} strokeWidth={1.5} className="text-slate-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
            {campaignType ? (campaignType === 'drip' ? 'Build a Drip Sequence' : 'Schedule a Campaign in 5 Easy Steps') : 'Create a Campaign'}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            {campaignType ? 'Build the audience, pick templates, schedule delivery, and launch with confidence.' : 'Choose how you want to reach your audience.'}
          </p>
        </div>
      </motion.div>

      {/* Type Selector (before wizard) */}
      {!campaignType && (
        <div className="space-y-6">
          <CampaignTypeSelector value={campaignType} onChange={setCampaignType} />
          <div className="flex justify-center">
            <button
              disabled={!campaignType}
              onClick={() => setStep(1)}
              className="px-6 py-2.5 rounded-xl bg-primary-500 dark:bg-primary-600 text-white text-sm font-semibold hover:bg-primary-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* How It Works + Step content (shown after type selection) */}
      {campaignType && <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-8">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-bold text-slate-900">How It Works</h3>
          <span className="text-xs font-semibold text-primary-500 bg-primary-50 px-2.5 py-1 rounded-full">
            5 steps
          </span>
        </div>
        <p className="text-sm text-slate-400 mb-5">Follow this flow to prepare and send your communication.</p>

        <div className="space-y-2">
          {STEPS.map((s) => {
            const isActive = s.num === step
            const isComplete = s.num < step
            const Icon = s.icon
            return (
              <button
                key={s.num}
                type="button"
                onClick={() => {
                  // Only allow navigating to completed steps or current step
                  if (s.num <= step) setStep(s.num)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left transition-all duration-200 ${
                  isActive
                    ? 'border-primary-300 bg-primary-50/50 shadow-sm'
                    : isComplete
                    ? 'border-slate-200/60 bg-white hover:bg-slate-50 cursor-pointer'
                    : 'border-slate-100 bg-slate-50/50 opacity-60 cursor-default'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                    isActive
                      ? 'bg-primary-500 dark:bg-primary-600 text-white'
                      : isComplete
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {isComplete ? <Check size={14} /> : s.num}
                </div>
                <span className={`text-sm font-medium ${isActive ? 'text-slate-900' : isComplete ? 'text-slate-700' : 'text-slate-400'}`}>
                  {s.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>}

      {/* Active step content */}
      {campaignType && step === 1 && <StepSegmentation segmentId={segmentId} setSegmentId={setSegmentId} />}
      {campaignType && step === 2 && campaignType === 'single' && <StepTemplate templateId={templateId} setTemplateId={setTemplateId} />}
      {campaignType && step === 2 && campaignType === 'drip' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-6">
          <DripSequenceBuilder steps={dripSteps} onChange={setDripSteps} />
        </div>
      )}
      {campaignType && step === 3 && <StepSchedule date={date} setDate={setDate} time={time} setTime={setTime} delayCalc={delayCalc} setDelayCalc={setDelayCalc} />}
      {campaignType && step === 4 && campaignType === 'single' && <StepReview segmentId={segmentId} templateId={templateId} date={date} time={time} delayCalc={delayCalc} />}
      {campaignType && step === 4 && campaignType === 'drip' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Sequence Summary</h3>
          <p className="text-sm text-slate-400 dark:text-slate-500">Review your {dripSteps.length}-step drip sequence before activating.</p>
          {dripSteps.map((s, i) => {
            const tpl = DUMMY_TEMPLATES.find((t) => t.id === s.templateId)
            return (
              <div key={s.id} className="flex items-center gap-4 py-3 px-4 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-800/30">
                <div className="w-8 h-8 rounded-full bg-primary-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{tpl?.name || 'No template selected'}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    {i === 0 ? 'Sends immediately' : `${s.delayAmount} ${s.delayUnit} after previous`}
                    {s.condition ? ` · ${s.condition.type.replace(/_/g, ' ')}` : ''}
                  </p>
                </div>
              </div>
            )
          })}
          {date && <p className="text-sm text-slate-500 dark:text-slate-400">First step scheduled: {date}{time ? ` at ${time}` : ''}</p>}
        </div>
      )}
      {campaignType && step === 5 && <StepSend onSend={handleSend} sending={sending} />}

      {/* Navigation buttons */}
      {campaignType && (
        <div className="flex items-center justify-end gap-3">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Back
            </button>
          )}
          {step < 5 && (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              disabled={!canAdvance()}
              className="px-5 py-2.5 rounded-xl bg-primary-500 dark:bg-primary-600 text-white text-sm font-semibold hover:bg-primary-600 active:bg-primary-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {step === 4 ? (campaignType === 'drip' ? 'Activate' : 'Finish') : 'Next'}
            </button>
          )}
        </div>
      )}
    </motion.div>
  )
}
