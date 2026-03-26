import { useState, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  X,
  Search,
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  MousePointerClick,
  GitBranch,
  FileText,
  Pencil,
  AtSign,
  Mail,
  Clock,
} from 'lucide-react'
import { DUMMY_TEMPLATES, MERGE_FIELDS, SAMPLE_MERGE_VALUES } from '../../lib/templateData'
import { DRIP_CONDITIONS } from '../../lib/campaignData'

function resolveMergeFields(text) {
  if (!text) return ''
  let resolved = text
  Object.entries(SAMPLE_MERGE_VALUES).forEach(([key, val]) => {
    resolved = resolved.replace(new RegExp(`\\*?\\[\\[${key}\\]\\]\\*?`, 'g'), val)
  })
  return resolved
}

/* ─── Click-outside hook ──────────────────────────────────────────────────── */
function useClickOutside(ref, handler) {
  useEffect(() => {
    function listener(e) { if (ref.current && !ref.current.contains(e.target)) handler() }
    document.addEventListener('mousedown', listener)
    return () => document.removeEventListener('mousedown', listener)
  }, [ref, handler])
}

/* ─── Template Selector ───────────────────────────────────────────────────── */
function TemplateSelect({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const ref = useRef(null)
  useClickOutside(ref, () => setOpen(false))

  const filtered = DUMMY_TEMPLATES.filter((t) =>
    query === '' || t.name.toLowerCase().includes(query.toLowerCase()) || t.subject.toLowerCase().includes(query.toLowerCase())
  )
  const selected = DUMMY_TEMPLATES.find((t) => t.id === value)

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => { setOpen(!open); setQuery('') }}
        className={`w-full flex items-center justify-between px-4 py-2.5 bg-white dark:bg-slate-800 border rounded-xl text-sm cursor-pointer transition-all text-left ${
          open ? 'border-primary-300 dark:border-primary-500/40 ring-2 ring-primary-500/20' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
        }`}>
        {selected ? (
          <div className="flex items-center gap-2 min-w-0">
            <Mail size={14} className="text-primary-500 shrink-0" />
            <span className="text-slate-900 dark:text-white font-medium truncate">{selected.name}</span>
          </div>
        ) : (
          <span className="text-slate-400">Select template...</span>
        )}
        <ChevronDown size={14} className={`text-slate-400 transition-transform shrink-0 ml-2 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-50 top-full mt-1.5 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl">
          <div className="p-2 border-b border-slate-100 dark:border-slate-800">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search templates..." value={query} onChange={(e) => setQuery(e.target.value)} autoFocus
                className="w-full pl-8 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary-500/20 transition-all" />
            </div>
          </div>
          <div className="max-h-52 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <div className="px-4 py-4 text-center text-xs text-slate-400">No templates found</div>
            ) : (
              filtered.map((t) => (
                <button key={t.id} type="button" onClick={() => { onChange(t.id); setOpen(false); setQuery('') }}
                  className={`w-full text-left px-4 py-2.5 transition-colors cursor-pointer ${value === t.id ? 'bg-primary-50 dark:bg-primary-500/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <p className={`text-sm font-medium truncate ${value === t.id ? 'text-primary-700 dark:text-primary-400' : 'text-slate-900 dark:text-white'}`}>{t.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{t.subject}</p>
                    </div>
                    {value === t.id && <Check size={14} className="text-primary-500 shrink-0 ml-2" />}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Merge Field Inserter ────────────────────────────────────────────────── */
function MergeFieldInserter({ onInsert }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef(null)
  useClickOutside(ref, () => setOpen(false))

  const allFields = useMemo(() => {
    const f = []
    Object.entries(MERGE_FIELDS).forEach(([cat, items]) => items.forEach((i) => f.push({ ...i, category: cat })))
    return f
  }, [])
  const filtered = search ? allFields.filter((f) => f.label.toLowerCase().includes(search.toLowerCase()) || f.key.toLowerCase().includes(search.toLowerCase())) : allFields
  const grouped = useMemo(() => {
    const g = {}
    filtered.forEach((f) => { if (!g[f.category]) g[f.category] = []; g[f.category].push(f) })
    return g
  }, [filtered])

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-500/10 rounded-md hover:bg-primary-100 dark:hover:bg-primary-500/20 transition-colors cursor-pointer">
        <AtSign size={10} /> Insert Field
      </button>
      {open && (
        <div className="absolute z-50 top-full mt-1 right-0 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl">
          <div className="p-2 border-b border-slate-100 dark:border-slate-800">
            <div className="relative">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search fields..." value={search} onChange={(e) => setSearch(e.target.value)} autoFocus
                className="w-full pl-7 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary-500/20 transition-all" />
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto py-1">
            {Object.entries(grouped).map(([cat, fields]) => (
              <div key={cat}>
                <div className="px-3 pt-2 pb-1"><span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{cat}</span></div>
                {fields.map((f) => (
                  <button key={f.key} type="button" onClick={() => { onInsert(`[[${f.key}]]`); setOpen(false); setSearch('') }}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer truncate">
                    {f.label} <span className="text-slate-400">[[{f.key}]]</span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Custom Email Editor ─────────────────────────────────────────────────── */
function CustomEmailEditor({ subject, body, onSubjectChange, onBodyChange }) {
  const bodyRef = useRef(null)
  const subjectRef = useRef(null)

  function insertAt(ref, setter, val, text) {
    const el = ref.current
    if (!el) { setter(val + text); return }
    const start = el.selectionStart; const end = el.selectionEnd
    setter(val.slice(0, start) + text + val.slice(end))
    requestAnimationFrame(() => { el.focus(); el.setSelectionRange(start + text.length, start + text.length) })
  }

  return (
    <div className="space-y-3">
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Subject Line</label>
          <MergeFieldInserter onInsert={(f) => insertAt(subjectRef, onSubjectChange, subject, f)} />
        </div>
        <input ref={subjectRef} type="text" placeholder="e.g. Hi [[Contact-FirstName]], let's talk about your 401(k)" value={subject} onChange={(e) => onSubjectChange(e.target.value)}
          className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-all" />
      </div>
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Email Body</label>
          <MergeFieldInserter onInsert={(f) => insertAt(bodyRef, onBodyChange, body, f)} />
        </div>
        <textarea ref={bodyRef} rows={5} placeholder={"Hi [[Contact-FirstName]],\n\nI wanted to reach out about your [[Account-PlanName]]...\n\n[[User-Signature]]"} value={body} onChange={(e) => onBodyChange(e.target.value)}
          className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-all resize-none font-mono text-[13px] leading-relaxed" />
      </div>
    </div>
  )
}

/* ─── Email Preview ───────────────────────────────────────────────────────── */
function EmailPreview({ subject, body }) {
  if (!subject && !body) return <div className="text-center py-6 text-xs text-slate-400">Select a template or write an email to preview.</div>
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
      <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 space-y-1">
        <div className="flex items-center gap-2"><span className="text-[10px] font-semibold text-slate-400 w-8">From</span><span className="text-[11px] text-slate-600 dark:text-slate-300">Jane Smith &lt;jane@viserly.com&gt;</span></div>
        <div className="flex items-center gap-2"><span className="text-[10px] font-semibold text-slate-400 w-8">To</span><span className="text-[11px] text-slate-600 dark:text-slate-300">John Doe &lt;john@example.com&gt;</span></div>
        <div className="flex items-center gap-2"><span className="text-[10px] font-semibold text-slate-400 w-8">Subj</span><span className="text-[11px] font-medium text-slate-900 dark:text-white">{resolveMergeFields(subject) || 'No subject'}</span></div>
      </div>
      <div className="px-4 py-3 max-h-48 overflow-y-auto">
        <div className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{resolveMergeFields(body) || 'No content'}</div>
      </div>
    </div>
  )
}

/* ─── Condition Picker ─────────────────────────────────────────────────────── */
function ConditionPicker({ value, onChange, disabled }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useClickOutside(ref, () => setOpen(false))
  const currentType = value?.type || 'none'
  const current = DRIP_CONDITIONS.find((c) => c.type === currentType) || DRIP_CONDITIONS[0]

  if (disabled) return <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg text-xs text-slate-400">All recipients (first step)</div>

  const icons = { none: GitBranch, opened_previous: Eye, not_opened_previous: EyeOff, clicked_previous: MousePointerClick, not_clicked_previous: X }

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen(!open)}
        className={`w-full flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border rounded-lg text-xs cursor-pointer transition-all text-left ${open ? 'border-primary-300 ring-2 ring-primary-500/20' : 'border-slate-200 dark:border-slate-700'}`}>
        {(() => { const I = icons[currentType] || GitBranch; return <I size={13} className="text-slate-400 shrink-0" /> })()}
        <span className="text-slate-700 dark:text-slate-200 truncate">{current.label}</span>
        <ChevronDown size={12} className="text-slate-400 ml-auto shrink-0" />
      </button>
      {open && (
        <div className="absolute z-50 top-full mt-1 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl">
          {DRIP_CONDITIONS.map((cond) => {
            const I = icons[cond.type] || GitBranch
            return (
              <button key={cond.type} type="button" onClick={() => { onChange(cond.type === 'none' ? null : { type: cond.type }); setOpen(false) }}
                className={`w-full text-left px-4 py-3 transition-colors cursor-pointer border-b border-slate-50 dark:border-slate-800 last:border-0 ${currentType === cond.type ? 'bg-primary-50 dark:bg-primary-500/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                <div className="flex items-center gap-2.5">
                  <I size={14} className={currentType === cond.type ? 'text-primary-500' : 'text-slate-400'} />
                  <div>
                    <p className={`text-sm font-medium ${currentType === cond.type ? 'text-primary-700 dark:text-primary-400' : 'text-slate-700 dark:text-slate-200'}`}>{cond.label}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{cond.description}</p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ─── Step Card ────────────────────────────────────────────────────────────── */
function StepCard({ step, index, totalSteps, onUpdate, onRemove }) {
  const isFirst = index === 0
  const [showPreview, setShowPreview] = useState(true)
  const mode = step.mode || 'template'
  const tpl = mode === 'template' && step.templateId ? DUMMY_TEMPLATES.find((t) => t.id === step.templateId) : null
  const previewSubject = mode === 'template' ? (tpl?.subject || '') : (step.customSubject || '')
  const previewBody = mode === 'template' ? (tpl?.body || '') : (step.customBody || '')
  const hasContent = !!(previewSubject || previewBody)

  const subtitle = mode === 'template' && tpl ? tpl.name : mode === 'custom' && step.customSubject ? step.customSubject : null

  return (
    <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.2 }} className="relative">
      {/* Connector */}
      {!isFirst && (
        <div className="flex items-center justify-center py-2.5">
          <div className="flex flex-col items-center gap-0.5">
            <div className="w-px h-3 border-l-2 border-dashed border-slate-200 dark:border-slate-700" />
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-500 dark:text-slate-400 tabular-nums">
                <Clock size={9} /> {step.delayAmount} {step.delayUnit}
              </span>
              {step.condition && (
                <span className="px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-500/10 text-[10px] font-semibold text-purple-600 dark:text-purple-400">
                  {DRIP_CONDITIONS.find((c) => c.type === step.condition?.type)?.label || 'Condition'}
                </span>
              )}
            </div>
            <div className="w-px h-3 border-l-2 border-dashed border-slate-200 dark:border-slate-700" />
          </div>
        </div>
      )}

      <div className="flex items-start gap-3">
        {/* Step number */}
        <div className="pt-4 shrink-0">
          <div className="w-8 h-8 rounded-full bg-primary-500 dark:bg-primary-600 text-white text-xs font-bold flex items-center justify-center">{index + 1}</div>
        </div>

        {/* Card */}
        <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 dark:border-slate-800">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
              Step {index + 1}
              {subtitle && <span className="text-slate-400 dark:text-slate-500 font-normal ml-1.5 text-xs">— {subtitle}</span>}
            </h4>
            <div className="flex items-center gap-1">
              {hasContent && (
                <button type="button" onClick={() => setShowPreview(!showPreview)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${showPreview ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                  <Eye size={12} /> Preview
                </button>
              )}
              {totalSteps > 2 && (
                <button type="button" onClick={onRemove} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"><X size={14} /></button>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="p-5 space-y-5">
            {/* Mode toggle */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 w-fit">
              <button type="button" onClick={() => onUpdate({ ...step, mode: 'template' })}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${mode === 'template' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}>
                <FileText size={12} /> Use Template
              </button>
              <button type="button" onClick={() => onUpdate({ ...step, mode: 'custom' })}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${mode === 'custom' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}>
                <Pencil size={12} /> Write Custom
              </button>
            </div>

            {/* Content */}
            {mode === 'template' ? (
              <TemplateSelect value={step.templateId} onChange={(id) => onUpdate({ ...step, templateId: id })} />
            ) : (
              <CustomEmailEditor
                subject={step.customSubject || ''} body={step.customBody || ''}
                onSubjectChange={(v) => onUpdate({ ...step, customSubject: v })}
                onBodyChange={(v) => onUpdate({ ...step, customBody: v })}
              />
            )}

            {/* Delay + Condition */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">{isFirst ? 'Timing' : 'Delay After Previous'}</label>
                {isFirst ? (
                  <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg text-xs text-slate-400">Sends immediately (first step)</div>
                ) : (
                  <div className="flex items-center gap-2">
                    <input type="number" min={1} max={90} value={step.delayAmount} onChange={(e) => onUpdate({ ...step, delayAmount: parseInt(e.target.value) || 1 })}
                      className="w-16 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-all" />
                    <select value={step.delayUnit} onChange={(e) => onUpdate({ ...step, delayUnit: e.target.value })}
                      className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm cursor-pointer appearance-none pr-7 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_6px_center] bg-no-repeat">
                      <option value="hours">hours</option>
                      <option value="days">days</option>
                    </select>
                    <span className="text-[11px] text-slate-400 whitespace-nowrap">after prev.</span>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Condition</label>
                <ConditionPicker value={step.condition} onChange={(c) => onUpdate({ ...step, condition: c })} disabled={isFirst} />
              </div>
            </div>

            {/* Preview */}
            <AnimatePresence>
              {showPreview && hasContent && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 mb-2.5">
                      <Eye size={12} className="text-slate-400" />
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Recipient Preview</span>
                      <span className="text-[10px] text-slate-300 dark:text-slate-600">(sample data)</span>
                    </div>
                    <EmailPreview subject={previewSubject} body={previewBody} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Main Builder ─────────────────────────────────────────────────────────── */
export default function DripSequenceBuilder({ steps, onChange }) {
  function addStep() {
    if (steps.length >= 10) return
    onChange([...steps, { id: `step-${Date.now()}`, order: steps.length, mode: 'template', templateId: null, customSubject: '', customBody: '', delayAmount: 3, delayUnit: 'days', condition: null }])
  }
  function updateStep(i, s) { const n = [...steps]; n[i] = s; onChange(n) }
  function removeStep(i) { if (steps.length <= 2) return; onChange(steps.filter((_, j) => j !== i)) }

  return (
    <div>
      <AnimatePresence mode="popLayout">
        {steps.map((step, i) => (
          <StepCard key={step.id} step={step} index={i} totalSteps={steps.length} onUpdate={(s) => updateStep(i, s)} onRemove={() => removeStep(i)} />
        ))}
      </AnimatePresence>

      {steps.length < 10 && (
        <motion.div layout className="flex justify-center pt-6">
          <button type="button" onClick={addStep}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-500/40 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50/30 dark:hover:bg-primary-500/5 transition-all cursor-pointer">
            <Plus size={16} /> Add Step
          </button>
        </motion.div>
      )}
    </div>
  )
}
