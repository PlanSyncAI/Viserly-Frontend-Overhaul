import { useState, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Search,
  Target,
  X,
  DollarSign,
  User,
  Zap,
  FileText,
  CalendarClock,
} from 'lucide-react'
import { useContacts } from '../lib/useContacts'
import { DEAL_STAGES, FEE_RATE } from '../lib/pipelineData'
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

export default function NewDeal() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [searchParams] = useSearchParams()
  const preselectedId = searchParams.get('participantId')
  const { contacts, loading } = useContacts()

  const [participantSearch, setParticipantSearch] = useState('')
  const [selectedParticipant, setSelectedParticipant] = useState(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const [dealValue, setDealValue] = useState('')
  const [stage, setStage] = useState('lead')
  const [priority, setPriority] = useState('Warm')
  const [source, setSource] = useState('')
  const [nextAction, setNextAction] = useState('')
  const [nextActionDate, setNextActionDate] = useState('')
  const [notes, setNotes] = useState('')

  // Pre-select participant from URL param
  useState(() => {
    if (preselectedId && contacts.length > 0) {
      const match = contacts.find((c) => c.id === Number(preselectedId)) || contacts[Number(preselectedId)]
      if (match) {
        setSelectedParticipant(match)
        setDealValue(String(match.planBalance || ''))
      }
    }
  }, [preselectedId, contacts])

  const searchResults = useMemo(() => {
    if (!participantSearch.trim() || selectedParticipant) return []
    const q = participantSearch.toLowerCase()
    return contacts
      .filter((c) =>
        c.fullName.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q)
      )
      .slice(0, 8)
  }, [participantSearch, contacts, selectedParticipant])

  function handleSelectParticipant(contact) {
    setSelectedParticipant(contact)
    setParticipantSearch('')
    setShowDropdown(false)
    if (!dealValue) {
      setDealValue(String(contact.planBalance || ''))
    }
  }

  function handleClearParticipant() {
    setSelectedParticipant(null)
    setParticipantSearch('')
    setDealValue('')
  }

  const estimatedRevenue = dealValue ? (parseFloat(dealValue) * FEE_RATE) : 0

  function handleSubmit(e) {
    e.preventDefault()
    showToast('Deal created successfully!', 'success')
    setTimeout(() => navigate('/pipeline'), 800)
  }

  const inputClass = "w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 dark:focus:border-primary-500 transition-all"
  const selectClass = "w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 dark:focus:border-primary-500 cursor-pointer appearance-none transition-all"
  const labelClass = "block text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5"

  const initials = selectedParticipant
    ? `${(selectedParticipant.firstName || '')[0] || ''}${(selectedParticipant.lastName || '')[0] || ''}`.toUpperCase()
    : ''

  return (
    <motion.div
      className="p-8 mx-auto space-y-6"
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

      {/* Hero Header */}
      <motion.div
        variants={fadeUp}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-50 via-white to-emerald-50/40 dark:from-primary-500/5 dark:via-slate-900 dark:to-emerald-500/5 border border-slate-200/60 dark:border-slate-800 px-8 py-8"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,91,255,0.06),transparent_50%)]" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center">
              <Target size={20} className="text-primary-600 dark:text-primary-400" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">New Deal</h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg">
            Create a new deal to track a prospect through your wealth conversion pipeline.
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-3 gap-6">
        {/* ── Main Form (2 cols) ──────────────────────────────────── */}
        <motion.form
          variants={fadeUp}
          onSubmit={handleSubmit}
          className="col-span-2 space-y-6"
        >
          {/* Section: Participant */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 overflow-hidden">
            <div className="bg-slate-50/80 dark:bg-slate-800/50 px-6 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <User size={15} className="text-slate-400" />
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Participant</span>
            </div>
            <div className="p-6">
              {selectedParticipant ? (
                <div className="flex items-center gap-4 px-4 py-3.5 bg-primary-50/50 dark:bg-primary-500/5 border border-primary-200/60 dark:border-primary-500/20 rounded-xl">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0 shadow-sm shadow-primary-500/20">
                    <span className="text-white text-sm font-bold">{initials}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{selectedParticipant.fullName}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{selectedParticipant.email} · Plan Balance: ${(selectedParticipant.planBalance || 0).toLocaleString()}</p>
                  </div>
                  <button type="button" onClick={handleClearParticipant} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search participant by name or email..."
                    value={participantSearch}
                    onChange={(e) => { setParticipantSearch(e.target.value); setShowDropdown(true) }}
                    onFocus={() => setShowDropdown(true)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-all"
                  />
                  {showDropdown && searchResults.length > 0 && (
                    <div className="absolute left-0 top-full mt-1 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 max-h-[280px] overflow-y-auto py-1">
                      {searchResults.map((c) => {
                        const ci = `${(c.firstName || '')[0] || ''}${(c.lastName || '')[0] || ''}`.toUpperCase()
                        return (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => handleSelectParticipant(c)}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          >
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-xs font-bold">{ci}</span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{c.fullName}</p>
                              <p className="text-[11px] text-slate-400 truncate">{c.email} · ${(c.planBalance || 0).toLocaleString()}</p>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  )}
                  {loading && (
                    <p className="absolute left-0 top-full mt-1 w-full px-4 py-3 text-xs text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50">
                      Loading contacts...
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Section: Deal Details */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 overflow-hidden">
            <div className="bg-slate-50/80 dark:bg-slate-800/50 px-6 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <DollarSign size={15} className="text-slate-400" />
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Deal Details</span>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Deal Value ($)</label>
                  <input
                    type="number"
                    placeholder="e.g. 500000"
                    value={dealValue}
                    onChange={(e) => setDealValue(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Est. Revenue (1% fee)</label>
                  <div className="px-4 py-2.5 bg-emerald-50/50 dark:bg-emerald-500/5 border border-emerald-200/60 dark:border-emerald-500/20 rounded-xl text-sm font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    ${estimatedRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Stage</label>
                  <select value={stage} onChange={(e) => setStage(e.target.value)} className={selectClass}>
                    {DEAL_STAGES.filter((s) => s.key !== 'won' && s.key !== 'lost').map((s) => (
                      <option key={s.key} value={s.key}>{s.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Priority</label>
                  <select value={priority} onChange={(e) => setPriority(e.target.value)} className={selectClass}>
                    <option value="Hot">Hot</option>
                    <option value="Warm">Warm</option>
                    <option value="Cold">Cold</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={labelClass}>Source</label>
                <input
                  type="text"
                  placeholder='e.g. "Campaign: High Balance Q1 Check-In" or "Manual"'
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Section: Next Steps */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 overflow-hidden">
            <div className="bg-slate-50/80 dark:bg-slate-800/50 px-6 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <CalendarClock size={15} className="text-slate-400" />
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Next Steps</span>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Next Action</label>
                  <input
                    type="text"
                    placeholder="e.g. Send introductory email"
                    value={nextAction}
                    onChange={(e) => setNextAction(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Next Action Date</label>
                  <input
                    type="date"
                    value={nextActionDate}
                    onChange={(e) => setNextActionDate(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Notes</label>
                <textarea
                  rows={3}
                  placeholder="Additional notes about this prospect..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className={inputClass + ' resize-none'}
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/pipeline')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary-500 dark:bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-600 active:bg-primary-700 transition-colors cursor-pointer shadow-sm"
            >
              <Target size={16} />
              Create Deal
            </button>
          </div>
        </motion.form>

        {/* ── Sidebar Preview (1 col) ────────────────────────────── */}
        <motion.div variants={fadeUp} className="space-y-4">
          {/* Live preview card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 overflow-hidden sticky top-8">
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 px-6 py-4">
              <p className="text-white/70 text-[10px] font-semibold uppercase tracking-wider">Deal Preview</p>
              <p className="text-white text-lg font-bold mt-0.5 truncate">
                {selectedParticipant ? selectedParticipant.fullName : 'Select a participant'}
              </p>
            </div>
            <div className="p-5 space-y-4">
              {/* Value */}
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Deal Value</p>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight tabular-nums">
                  {dealValue ? `$${parseFloat(dealValue).toLocaleString()}` : '—'}
                </p>
              </div>

              <div className="h-px bg-slate-100 dark:bg-slate-800" />

              {/* Revenue */}
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Est. Annual Revenue</p>
                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {dealValue ? `$${estimatedRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '—'}
                </p>
              </div>

              <div className="h-px bg-slate-100 dark:bg-slate-800" />

              {/* Details grid */}
              <div className="space-y-3">
                {[
                  { label: 'Stage', value: DEAL_STAGES.find((s) => s.key === stage)?.label || '—' },
                  { label: 'Priority', value: priority },
                  { label: 'Source', value: source || '—' },
                  { label: 'Next Action', value: nextAction || '—' },
                  { label: 'Action Date', value: nextActionDate || '—' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">{item.label}</span>
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-200 truncate max-w-[140px] text-right">{item.value}</span>
                  </div>
                ))}
              </div>

              {/* Account info */}
              {selectedParticipant && (
                <>
                  <div className="h-px bg-slate-100 dark:bg-slate-800" />
                  <div className="space-y-2">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Participant Info</p>
                    {[
                      { label: 'Account', value: selectedParticipant.account },
                      { label: 'Salary', value: selectedParticipant.salary ? `$${selectedParticipant.salary.toLocaleString()}` : '—' },
                      { label: 'Status', value: selectedParticipant.status || '—' },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <span className="text-[11px] text-slate-400 dark:text-slate-500">{item.label}</span>
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-200 truncate max-w-[140px] text-right">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
