import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail,
  Search,
  Clock,
  Check,
  Users,
  FileText,
  CalendarClock,
  SendHorizonal,
  Target,
  GitBranch,
  ArrowLeft,
  ArrowRight,
  Eye,
  Sparkles,
  AtSign,
  X,
  ChevronRight,
  DollarSign,
  MapPin,
} from 'lucide-react'
import { useContacts } from '../lib/useContacts'
import { DUMMY_SEGMENTATIONS } from '../lib/segmentationData'
import { DUMMY_TEMPLATES, SAMPLE_MERGE_VALUES, MERGE_FIELDS } from '../lib/templateData'
import DripSequenceBuilder from '../components/ui/DripSequenceBuilder'
import DatePicker from '../components/ui/DatePicker'
import TimePicker from '../components/ui/TimePicker'

const fadeIn = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.3 } } }

function resolveMerge(text) {
  if (!text) return ''
  let t = text
  Object.entries(SAMPLE_MERGE_VALUES).forEach(([k, v]) => {
    t = t.replace(new RegExp(`\\*?\\[\\[${k}\\]\\]\\*?`, 'g'), v)
  })
  return t
}

const DEFAULT_DRIP_STEPS = [
  { id: 'step-1', order: 0, mode: 'template', templateId: null, customSubject: '', customBody: '', delayAmount: 0, delayUnit: 'days', condition: null },
  { id: 'step-2', order: 1, mode: 'template', templateId: null, customSubject: '', customBody: '', delayAmount: 3, delayUnit: 'days', condition: null },
]

/* ─── Step 0: Campaign Type ───────────────────────────────────────────────── */
function StepType({ value, onChange }) {
  const types = [
    { key: 'single', label: 'Single Send', desc: 'One email, one audience, scheduled delivery.', icon: Mail, color: 'blue', tags: ['One-time', 'Scheduled', 'Full tracking'] },
    { key: 'drip', label: 'Drip Sequence', desc: 'Multi-step emails with delays and conditions.', icon: GitBranch, color: 'purple', tags: ['Multi-step', 'Automated', 'Conditional'] },
  ]
  const colors = {
    blue: { bg: 'bg-blue-50 dark:bg-blue-500/15', icon: 'text-blue-500', border: 'border-blue-400 dark:border-blue-500', ring: 'ring-blue-200 dark:ring-blue-500/20', dot: 'bg-blue-500', tagBg: 'bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400' },
    purple: { bg: 'bg-purple-50 dark:bg-purple-500/15', icon: 'text-purple-500', border: 'border-purple-400 dark:border-purple-500', ring: 'ring-purple-200 dark:ring-purple-500/20', dot: 'bg-purple-500', tagBg: 'bg-purple-50 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400' },
  }
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">How do you want to reach your audience?</h2>
        <p className="text-sm text-slate-400 dark:text-slate-500">Choose the campaign type that fits your goal.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {types.map((t) => {
          const Icon = t.icon; const c = colors[t.color]; const sel = value === t.key
          return (
            <motion.button key={t.key} whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }} onClick={() => onChange(t.key)}
              className={`relative text-left p-6 rounded-2xl border-2 transition-all cursor-pointer ${sel ? `${c.border} bg-white dark:bg-slate-900 ring-4 ${c.ring}` : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300 hover:shadow-md'}`}>
              {sel && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className={`absolute top-4 right-4 w-6 h-6 rounded-full ${c.dot} flex items-center justify-center`}><Check size={14} className="text-white" strokeWidth={3} /></motion.div>}
              <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center mb-4`}><Icon size={24} strokeWidth={1.75} className={c.icon} /></div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">{t.label}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">{t.desc}</p>
              <div className="flex flex-wrap gap-1.5">{t.tags.map((tag) => <span key={tag} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${c.tagBg}`}>{tag}</span>)}</div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

/* ─── Apply segment filters to contacts ───────────────────────────────────── */
function applySegmentFilters(contacts, filters) {
  if (!filters || filters.length === 0) return contacts
  return contacts.filter((c) =>
    filters.every((f) => {
      const val = c[f.field]
      const target = f.value
      switch (f.operator) {
        case 'equals': return String(val).toLowerCase() === String(target).toLowerCase()
        case 'not_equals': return String(val).toLowerCase() !== String(target).toLowerCase()
        case 'contains': return String(val).toLowerCase().includes(String(target).toLowerCase())
        case 'greater_than': return Number(val) > Number(target)
        case 'less_than': return Number(val) < Number(target)
        case 'includes': return String(val).toLowerCase().includes(String(target).toLowerCase())
        default: return true
      }
    })
  )
}

/* ─── Audience Preview Drawer ─────────────────────────────────────────────── */
function AudienceDrawer({ segment, contacts, onClose }) {
  const [drawerSearch, setDrawerSearch] = useState('')
  const matched = useMemo(() => applySegmentFilters(contacts, segment?.filters), [contacts, segment])
  const filtered = useMemo(() => {
    if (!drawerSearch) return matched
    const q = drawerSearch.toLowerCase()
    return matched.filter((c) => c.fullName.toLowerCase().includes(q) || c.email.toLowerCase().includes(q))
  }, [matched, drawerSearch])

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 dark:bg-black/50 z-50"
        onClick={onClose}
      />
      {/* Drawer */}
      <motion.div
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed top-0 right-0 h-full w-[480px] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 z-50 flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary-50 dark:bg-primary-500/15 flex items-center justify-center">
                <Users size={16} className="text-primary-500" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{segment.name}</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500">{segment.description}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
              <X size={16} />
            </button>
          </div>

          {/* Filters summary */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {segment.filters.map((f, i) => (
              <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary-50 dark:bg-primary-500/10 text-[10px] font-semibold text-primary-600 dark:text-primary-400">
                {f.field} {f.operator.replace('_', ' ')} {f.value}
              </span>
            ))}
          </div>

          {/* Stats + search */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">
              <Users size={12} className="text-slate-400" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 tabular-nums">{matched.length}</span>
              <span className="text-[10px] text-slate-400">match</span>
            </div>
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text" placeholder="Search contacts..." value={drawerSearch} onChange={(e) => setDrawerSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary-500/20 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Contact list */}
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-sm text-slate-400">No contacts match this segment.</div>
          ) : (
            filtered.slice(0, 100).map((c) => {
              const initials = `${(c.firstName || '')[0] || ''}${(c.lastName || '')[0] || ''}`.toUpperCase()
              return (
                <div key={c.id} className="flex items-center gap-3 px-6 py-3 border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-[10px] font-bold">{initials}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{c.fullName}</p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">{c.email}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <p className="text-[11px] font-medium text-slate-700 dark:text-slate-200 tabular-nums">${(c.salary || 0).toLocaleString()}</p>
                      <p className="text-[10px] text-slate-400">salary</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] font-medium text-slate-700 dark:text-slate-200 tabular-nums">${(c.planBalance || 0).toLocaleString()}</p>
                      <p className="text-[10px] text-slate-400">balance</p>
                    </div>
                  </div>
                </div>
              )
            })
          )}
          {filtered.length > 100 && (
            <div className="text-center py-4 text-xs text-slate-400">Showing first 100 of {filtered.length} contacts</div>
          )}
        </div>
      </motion.div>
    </>
  )
}

/* ─── Step 1: Audience ────────────────────────────────────────────────────── */
function StepAudience({ segmentId, setSegmentId }) {
  const [search, setSearch] = useState('')
  const [previewSeg, setPreviewSeg] = useState(null)
  const { contacts } = useContacts()
  const filtered = useMemo(() => {
    if (!search) return DUMMY_SEGMENTATIONS
    const q = search.toLowerCase()
    return DUMMY_SEGMENTATIONS.filter((s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q))
  }, [search])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Who should receive this?</h2>
        <p className="text-sm text-slate-400 dark:text-slate-500">Select a saved audience segment for your campaign.</p>
      </div>
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input type="text" placeholder="Search segments..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-all" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map((seg) => {
          const sel = segmentId === seg.id
          return (
            <motion.div key={seg.id} whileHover={{ y: -2 }}
              className={`relative text-left rounded-xl border-2 transition-all overflow-hidden ${sel ? 'border-primary-400 dark:border-primary-500 bg-primary-50/50 dark:bg-primary-500/5 ring-2 ring-primary-200 dark:ring-primary-500/20' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300 hover:shadow-sm'}`}>
              {sel && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center z-10"><Check size={12} className="text-white" strokeWidth={3} /></motion.div>}

              {/* Clickable card body */}
              <button onClick={() => setSegmentId(seg.id)} className="w-full text-left p-5 cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-500/15 flex items-center justify-center shrink-0"><Users size={18} className="text-primary-500" /></div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{seg.name}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{seg.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">
                    <Users size={12} className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200 tabular-nums">{seg.contactCount}</span>
                    <span className="text-[10px] text-slate-400">recipients</span>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${seg.status === 'Active' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'}`}>{seg.status}</span>
                </div>
              </button>

              {/* Preview button */}
              <div className="px-5 pb-4 pt-0">
                <button
                  onClick={(e) => { e.stopPropagation(); setPreviewSeg(seg) }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-500/10 hover:bg-primary-100 dark:hover:bg-primary-500/20 transition-colors cursor-pointer"
                >
                  <Eye size={12} />
                  Preview Recipients
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Drawer */}
      <AnimatePresence>
        {previewSeg && (
          <AudienceDrawer segment={previewSeg} contacts={contacts} onClose={() => setPreviewSeg(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Merge Button ────────────────────────────────────────────────────────── */
function MergeButton({ onInsert }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen(!open)} className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-500/10 rounded-md hover:bg-primary-100 dark:hover:bg-primary-500/20 transition-colors cursor-pointer">
        <AtSign size={10} /> Insert Field
      </button>
      {open && (
        <div className="absolute z-40 bottom-full mb-1 right-0 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl max-h-52 overflow-y-auto py-1">
          {Object.entries(MERGE_FIELDS).map(([cat, items]) => (
            <div key={cat}>
              <div className="px-3 pt-2 pb-1"><span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{cat}</span></div>
              {items.map((f) => <button key={f.key} type="button" onClick={() => { onInsert(`[[${f.key}]]`); setOpen(false) }} className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">{f.label}</button>)}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── Step 2: Content (Single) ────────────────────────────────────────────── */
function StepContentSingle({ templateId, setTemplateId, mode, setMode, customSubject, setCustomSubject, customBody, setCustomBody }) {
  const [search, setSearch] = useState('')
  const filtered = useMemo(() => {
    if (!search) return DUMMY_TEMPLATES
    const q = search.toLowerCase()
    return DUMMY_TEMPLATES.filter((t) => t.name.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q))
  }, [search])

  const tpl = DUMMY_TEMPLATES.find((t) => t.id === templateId)
  const previewSubject = mode === 'template' ? (tpl?.subject || '') : customSubject
  const previewBody = mode === 'template' ? (tpl?.body || '') : customBody

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">What do you want to say?</h2>
        <p className="text-sm text-slate-400 dark:text-slate-500">Pick a template or write a custom email. Preview exactly what recipients will see.</p>
      </div>
      <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 w-fit">
        <button onClick={() => setMode('template')} className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${mode === 'template' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}><FileText size={15} /> Use Template</button>
        <button onClick={() => setMode('custom')} className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${mode === 'custom' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}><Sparkles size={15} /> Write Custom</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {mode === 'template' ? (
            <>
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="Search templates..." value={search} onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-all" />
              </div>
              <div className="space-y-2 overflow-y-auto pr-1">
                {filtered.map((t) => {
                  const sel = templateId === t.id
                  return (
                    <button key={t.id} onClick={() => setTemplateId(t.id)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all cursor-pointer ${sel ? 'border-primary-400 dark:border-primary-500 bg-primary-50/50 dark:bg-primary-500/5 ring-1 ring-primary-200 dark:ring-primary-500/20' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${sel ? 'bg-primary-100 dark:bg-primary-500/20' : 'bg-slate-100 dark:bg-slate-800'}`}><Mail size={16} className={sel ? 'text-primary-500' : 'text-slate-400'} /></div>
                        <div className="min-w-0 flex-1">
                          <p className={`text-sm font-medium truncate ${sel ? 'text-primary-700 dark:text-primary-400' : 'text-slate-900 dark:text-white'}`}>{t.name}</p>
                          <p className="text-xs text-slate-400 truncate">{t.subject}</p>
                        </div>
                        {sel && <Check size={16} className="text-primary-500 shrink-0" />}
                      </div>
                    </button>
                  )
                })}
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Subject Line</label>
                  <MergeButton onInsert={(f) => setCustomSubject(customSubject + f)} />
                </div>
                <input type="text" placeholder="e.g. Hi [[Contact-FirstName]], let's talk about your 401(k)" value={customSubject} onChange={(e) => setCustomSubject(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-all" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Email Body</label>
                  <MergeButton onInsert={(f) => setCustomBody(customBody + f)} />
                </div>
                <textarea rows={14} placeholder={"Hi [[Contact-FirstName]],\n\nI wanted to reach out regarding your [[Account-PlanName]]...\n\nBest,\n[[User-Signature]]"} value={customBody} onChange={(e) => setCustomBody(e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-all resize-none font-mono text-[13px] leading-relaxed" />
              </div>
            </div>
          )}
        </div>
        <div className="sticky top-8">
          <div className="flex items-center gap-2 mb-3">
            <Eye size={14} className="text-slate-400" />
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Recipient Preview</span>
            <span className="text-[10px] text-slate-300 dark:text-slate-600">(sample data)</span>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm">
            {(previewSubject || previewBody) ? (
              <>
                <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 space-y-1.5">
                  <div className="flex items-center gap-2"><span className="text-[10px] font-semibold text-slate-400 w-10">From</span><span className="text-xs text-slate-700 dark:text-slate-200">Jane Smith &lt;jane.smith@viserly.com&gt;</span></div>
                  <div className="flex items-center gap-2"><span className="text-[10px] font-semibold text-slate-400 w-10">To</span><span className="text-xs text-slate-700 dark:text-slate-200">John Doe &lt;john.doe@example.com&gt;</span></div>
                  <div className="flex items-center gap-2"><span className="text-[10px] font-semibold text-slate-400 w-10">Subj</span><span className="text-xs font-medium text-slate-900 dark:text-white">{resolveMerge(previewSubject) || 'No subject'}</span></div>
                </div>
                <div className="px-5 py-4 max-h-[380px] overflow-y-auto"><div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{resolveMerge(previewBody) || 'No content'}</div></div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-3"><Mail size={20} className="text-slate-400" /></div>
                <p className="text-sm text-slate-400">Select a template or start writing</p>
                <p className="text-xs text-slate-300 dark:text-slate-600 mt-1">Your email preview will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Step 3: Schedule ────────────────────────────────────────────────────── */
function StepSchedule({ date, setDate, time, setTime }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">When should it send?</h2>
        <p className="text-sm text-slate-400 dark:text-slate-500">Set the date and time for delivery.</p>
      </div>
      <div className="max-w-lg">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Date</label>
              <DatePicker value={date} onChange={setDate} placeholder="Pick a date" />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Time</label>
              <TimePicker value={time} onChange={setTime} placeholder="Pick a time" />
            </div>
          </div>
          {date && (
            <div className="p-4 rounded-xl bg-primary-50/50 dark:bg-primary-500/5 border border-primary-100 dark:border-primary-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center"><CalendarClock size={18} className="text-primary-600 dark:text-primary-400" /></div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{new Date(date + 'T' + (time || '09:00')).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{time ? new Date(date + 'T' + time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : 'Time not set'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── Step 4: Review & Send ───────────────────────────────────────────────── */
function StepReviewSend({ campaignType, segmentId, templateId, mode, customSubject, customBody, dripSteps, date, time, onSend, sending }) {
  const seg = DUMMY_SEGMENTATIONS.find((s) => s.id === segmentId)
  const tpl = DUMMY_TEMPLATES.find((t) => t.id === templateId)
  const previewSubject = mode === 'template' ? (tpl?.subject || '') : customSubject
  const previewBody = mode === 'template' ? (tpl?.body || '') : customBody

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Review & Launch</h2>
        <p className="text-sm text-slate-400 dark:text-slate-500">Everything looks good? Hit send to launch your campaign.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: Users, color: 'primary', label: 'Audience', value: seg?.name || '—', sub: `${seg?.contactCount || 0} recipients` },
          { icon: Mail, color: 'blue', label: 'Content', value: campaignType === 'drip' ? `${dripSteps.length}-step sequence` : (mode === 'template' ? (tpl?.name || '—') : 'Custom Email'), sub: campaignType === 'drip' ? 'Drip sequence' : 'Single send' },
          { icon: CalendarClock, color: 'amber', label: 'Schedule', value: date ? new Date(date + 'T' + (time || '09:00')).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Not set', sub: time ? new Date(date + 'T' + time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '' },
        ].map((c) => {
          const Icon = c.icon
          const bgMap = { primary: 'bg-primary-50 dark:bg-primary-500/15', blue: 'bg-blue-50 dark:bg-blue-500/15', amber: 'bg-amber-50 dark:bg-amber-500/15' }
          const iconMap = { primary: 'text-primary-500', blue: 'text-blue-500', amber: 'text-amber-500' }
          return (
            <div key={c.label} className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-8 h-8 rounded-lg ${bgMap[c.color]} flex items-center justify-center`}><Icon size={15} className={iconMap[c.color]} /></div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{c.label}</span>
              </div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{c.value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{c.sub}</p>
            </div>
          )
        })}
      </div>
      {campaignType === 'single' && (previewSubject || previewBody) && (
        <div>
          <div className="flex items-center gap-2 mb-3"><Eye size={14} className="text-slate-400" /><span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Email Preview</span></div>
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80"><p className="text-xs font-medium text-slate-900 dark:text-white">Subject: {resolveMerge(previewSubject)}</p></div>
            <div className="px-5 py-4 max-h-48 overflow-y-auto"><div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{resolveMerge(previewBody)}</div></div>
          </div>
        </div>
      )}
      {campaignType === 'drip' && (
        <div className="space-y-2">
          {dripSteps.map((s, i) => {
            const t = DUMMY_TEMPLATES.find((t) => t.id === s.templateId)
            return (
              <div key={s.id} className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
                <div className="w-8 h-8 rounded-full bg-primary-500 text-white text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{s.mode === 'custom' ? (s.customSubject || 'Custom email') : (t?.name || 'No template')}</p>
                  <p className="text-xs text-slate-400">{i === 0 ? 'Sends immediately' : `${s.delayAmount} ${s.delayUnit} after previous`}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
      <div className="flex justify-center pt-4">
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onSend} disabled={sending}
          className="inline-flex items-center gap-2.5 px-10 py-3.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold text-sm shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all disabled:opacity-50 cursor-pointer">
          <SendHorizonal size={18} />
          {sending ? 'Launching...' : 'Launch Campaign'}
        </motion.button>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════ */
const STEP_LABELS = ['Type', 'Audience', 'Content', 'Schedule', 'Review']

export default function CreateCampaign() {
  const navigate = useNavigate()
  const [campaignType, setCampaignType] = useState(null)
  const [step, setStep] = useState(0)
  const [segmentId, setSegmentId] = useState(null)
  const [templateId, setTemplateId] = useState(null)
  const [contentMode, setContentMode] = useState('template')
  const [customSubject, setCustomSubject] = useState('')
  const [customBody, setCustomBody] = useState('')
  const [dripSteps, setDripSteps] = useState(DEFAULT_DRIP_STEPS)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const canAdvance = () => {
    if (step === 0) return campaignType !== null
    if (step === 1) return segmentId !== null
    if (step === 2) {
      if (campaignType === 'drip') return dripSteps.length >= 2
      return contentMode === 'custom' ? !!(customSubject && customBody) : templateId !== null
    }
    if (step === 3) return date !== ''
    return true
  }

  const handleSend = () => { setSending(true); setTimeout(() => { setSending(false); setSent(true) }, 1500) }

  if (sent) {
    return (
      <div className="p-4 md:p-8 mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}>
          <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-500/15 flex items-center justify-center mx-auto mb-6"><Check size={36} className="text-emerald-500" /></div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Campaign Launched!</h2>
          <p className="text-sm text-slate-400 max-w-md mb-8">Your campaign has been queued and will be sent at the scheduled time.</p>
          <div className="flex items-center gap-3 justify-center">
            <button onClick={() => navigate('/campaigns')} className="px-6 py-2.5 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-colors cursor-pointer">View Campaigns</button>
            <button onClick={() => { setCampaignType(null); setStep(0); setSegmentId(null); setTemplateId(null); setContentMode('template'); setCustomSubject(''); setCustomBody(''); setDripSteps(DEFAULT_DRIP_STEPS); setDate(''); setTime(''); setSent(false) }}
              className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">Create Another</button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <motion.div className="p-4 md:p-8 mx-auto space-y-6 md:space-y-8" initial="hidden" animate="visible" variants={fadeIn}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <button onClick={() => step === 0 ? navigate('/campaigns') : setStep(step - 1)} className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
          <ArrowLeft size={16} />{step === 0 ? 'Campaigns' : 'Back'}
        </button>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Create Campaign</h1>
        <div className="w-20 hidden sm:block" />
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-1 overflow-x-auto whitespace-nowrap">
        {STEP_LABELS.map((label, i) => {
          const isActive = i === step; const isComplete = i < step
          return (
            <div key={label} className="flex-1 flex flex-col items-center gap-1.5">
              <div className="w-full h-1.5 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                <motion.div className={isComplete ? 'h-full bg-emerald-500 rounded-full' : isActive ? 'h-full bg-primary-500 rounded-full' : 'h-full'}
                  initial={{ width: 0 }} animate={{ width: isComplete ? '100%' : isActive ? '50%' : '0%' }} transition={{ duration: 0.4 }} />
              </div>
              <span className={`text-[10px] font-semibold uppercase tracking-wider ${isActive ? 'text-primary-600 dark:text-primary-400' : isComplete ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-300 dark:text-slate-600'}`}>{label}</span>
            </div>
          )
        })}
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
          {step === 0 && <StepType value={campaignType} onChange={setCampaignType} />}
          {step === 1 && <StepAudience segmentId={segmentId} setSegmentId={setSegmentId} />}
          {step === 2 && campaignType === 'single' && <StepContentSingle templateId={templateId} setTemplateId={setTemplateId} mode={contentMode} setMode={setContentMode} customSubject={customSubject} setCustomSubject={setCustomSubject} customBody={customBody} setCustomBody={setCustomBody} />}
          {step === 2 && campaignType === 'drip' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Build your email sequence</h2>
                <p className="text-sm text-slate-400 dark:text-slate-500">Add steps, set delays between emails, and configure conditions. {dripSteps.length}/10 steps.</p>
              </div>
              <DripSequenceBuilder steps={dripSteps} onChange={setDripSteps} />
            </div>
          )}
          {step === 3 && <StepSchedule date={date} setDate={setDate} time={time} setTime={setTime} />}
          {step === 4 && <StepReviewSend campaignType={campaignType} segmentId={segmentId} templateId={templateId} mode={contentMode} customSubject={customSubject} customBody={customBody} dripSteps={dripSteps} date={date} time={time} onSend={handleSend} sending={sending} />}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      {step < 4 && (
        <div className="flex items-center justify-end gap-3 pt-2">
          <button onClick={() => setStep(step + 1)} disabled={!canAdvance()}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary-500 dark:bg-primary-600 text-white text-sm font-semibold hover:bg-primary-600 active:bg-primary-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
            Continue <ArrowRight size={16} />
          </button>
        </div>
      )}
    </motion.div>
  )
}
