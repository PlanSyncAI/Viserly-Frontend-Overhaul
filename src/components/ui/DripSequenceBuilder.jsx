import { useState, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  GripVertical,
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
  ChevronRight,
  AtSign,
} from 'lucide-react'
import { DUMMY_TEMPLATES, MERGE_FIELDS, SAMPLE_MERGE_VALUES } from '../../lib/templateData'
import { DRIP_CONDITIONS } from '../../lib/campaignData'

/** Replace merge field placeholders with sample values */
function resolveMergeFields(text) {
  if (!text) return ''
  let resolved = text
  Object.entries(SAMPLE_MERGE_VALUES).forEach(([key, val]) => {
    resolved = resolved.replace(new RegExp(`\\*?\\[\\[${key}\\]\\]\\*?`, 'g'), val)
  })
  return resolved
}

/* ─── Template Selector ────────────────────────────────────────────────────── */
function TemplateSelect({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  const filtered = DUMMY_TEMPLATES.filter((t) =>
    query === '' || t.name.toLowerCase().includes(query.toLowerCase())
  )

  const selected = DUMMY_TEMPLATES.find((t) => t.id === value)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-3 py-2.5 bg-white dark:bg-slate-800 border rounded-xl text-sm cursor-pointer transition-all text-left ${
          open
            ? 'border-primary-300 dark:border-primary-500/40 ring-2 ring-primary-500/20'
            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
        }`}
      >
        <span className={selected ? 'text-slate-900 dark:text-white font-medium truncate' : 'text-slate-400 dark:text-slate-500'}>
          {selected ? selected.name : 'Select template...'}
        </span>
        <ChevronDown size={14} className={`text-slate-400 transition-transform flex-shrink-0 ml-2 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-30 top-full mt-1 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden">
          <div className="p-2 border-b border-slate-100 dark:border-slate-800">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-all"
                autoFocus
              />
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-4 py-4 text-center text-xs text-slate-400 dark:text-slate-500">No templates found</div>
            ) : (
              filtered.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => { onChange(t.id); setOpen(false); setQuery('') }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer border-b border-slate-50 dark:border-slate-800 last:border-0 ${
                    value === t.id
                      ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400 font-medium'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <span className="truncate block">{t.name}</span>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 truncate block">{t.subject}</span>
                    </div>
                    {value === t.id && <Check size={14} className="text-primary-500 flex-shrink-0 ml-2" />}
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

  const allFields = useMemo(() => {
    const fields = []
    Object.entries(MERGE_FIELDS).forEach(([category, items]) => {
      items.forEach((f) => fields.push({ ...f, category }))
    })
    return fields
  }, [])

  const filtered = search
    ? allFields.filter((f) => f.label.toLowerCase().includes(search.toLowerCase()) || f.key.toLowerCase().includes(search.toLowerCase()))
    : allFields

  const grouped = useMemo(() => {
    const groups = {}
    filtered.forEach((f) => {
      if (!groups[f.category]) groups[f.category] = []
      groups[f.category].push(f)
    })
    return groups
  }, [filtered])

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-500/10 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-500/20 transition-colors cursor-pointer"
      >
        <AtSign size={12} />
        Insert Field
      </button>

      {open && (
        <div className="absolute z-40 bottom-full mb-1 left-0 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden">
          <div className="p-2 border-b border-slate-100 dark:border-slate-800">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search fields..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-7 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary-500/20 transition-all"
                autoFocus
              />
            </div>
          </div>
          <div className="max-h-56 overflow-y-auto py-1">
            {Object.entries(grouped).map(([category, fields]) => (
              <div key={category}>
                <div className="px-3 pt-2.5 pb-1">
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{category}</span>
                </div>
                {fields.map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => { onInsert(`[[${f.key}]]`); setOpen(false); setSearch('') }}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <span className="font-medium">{f.label}</span>
                    <span className="text-slate-400 dark:text-slate-500 ml-1.5">[[{f.key}]]</span>
                  </button>
                ))}
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="px-4 py-3 text-center text-xs text-slate-400">No fields match</div>
            )}
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

  function insertAtCursor(ref, setter, currentVal, text) {
    const el = ref.current
    if (!el) { setter(currentVal + text); return }
    const start = el.selectionStart
    const end = el.selectionEnd
    const newVal = currentVal.slice(0, start) + text + currentVal.slice(end)
    setter(newVal)
    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(start + text.length, start + text.length)
    })
  }

  return (
    <div className="space-y-3">
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Subject Line</label>
          <MergeFieldInserter onInsert={(field) => insertAtCursor(subjectRef, onSubjectChange, subject, field)} />
        </div>
        <input
          ref={subjectRef}
          type="text"
          placeholder="e.g. Hi [[Contact-FirstName]], let's talk about your 401(k)"
          value={subject}
          onChange={(e) => onSubjectChange(e.target.value)}
          className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-all"
        />
      </div>
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Email Body</label>
          <MergeFieldInserter onInsert={(field) => insertAtCursor(bodyRef, onBodyChange, body, field)} />
        </div>
        <textarea
          ref={bodyRef}
          rows={6}
          placeholder={"Hi [[Contact-FirstName]],\n\nI wanted to reach out about your [[Account-PlanName]]...\n\n[[User-Signature]]"}
          value={body}
          onChange={(e) => onBodyChange(e.target.value)}
          className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-all resize-none font-mono text-[13px] leading-relaxed"
        />
      </div>
    </div>
  )
}

/* ─── Email Preview ───────────────────────────────────────────────────────── */
function EmailPreview({ subject, body }) {
  if (!subject && !body) {
    return (
      <div className="text-center py-8 text-xs text-slate-400 dark:text-slate-500">
        Select a template or write a custom email to see a preview.
      </div>
    )
  }

  const resolvedSubject = resolveMergeFields(subject)
  const resolvedBody = resolveMergeFields(body)

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
      {/* Email header */}
      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider w-10">From</span>
          <span className="text-xs text-slate-700 dark:text-slate-200">Jane Smith &lt;jane.smith@viserly.com&gt;</span>
        </div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider w-10">To</span>
          <span className="text-xs text-slate-700 dark:text-slate-200">John Doe &lt;john.doe@example.com&gt;</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider w-10">Subj</span>
          <span className="text-xs font-medium text-slate-900 dark:text-white">{resolvedSubject || 'No subject'}</span>
        </div>
      </div>
      {/* Email body */}
      <div className="px-4 py-4">
        <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
          {resolvedBody || 'No content'}
        </div>
      </div>
    </div>
  )
}

/* ─── Condition Picker ─────────────────────────────────────────────────────── */
function ConditionPicker({ value, onChange, disabled }) {
  const [open, setOpen] = useState(false)
  const currentType = value?.type || 'none'
  const current = DRIP_CONDITIONS.find((c) => c.type === currentType) || DRIP_CONDITIONS[0]

  if (disabled) {
    return (
      <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg text-xs text-slate-400 dark:text-slate-500">
        All recipients (first step)
      </div>
    )
  }

  const conditionIcons = {
    none: GitBranch,
    opened_previous: Eye,
    not_opened_previous: EyeOff,
    clicked_previous: MousePointerClick,
    not_clicked_previous: X,
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border rounded-lg text-xs cursor-pointer transition-all text-left ${
          open
            ? 'border-primary-300 dark:border-primary-500/40 ring-2 ring-primary-500/20'
            : 'border-slate-200 dark:border-slate-700'
        }`}
      >
        {(() => { const Icon = conditionIcons[currentType] || GitBranch; return <Icon size={13} className="text-slate-400 flex-shrink-0" /> })()}
        <span className="text-slate-700 dark:text-slate-200 truncate">{current.label}</span>
        <ChevronDown size={12} className="text-slate-400 ml-auto flex-shrink-0" />
      </button>

      {open && (
        <div className="absolute z-30 top-full mt-1 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden">
          {DRIP_CONDITIONS.map((cond) => {
            const Icon = conditionIcons[cond.type] || GitBranch
            return (
              <button
                key={cond.type}
                type="button"
                onClick={() => { onChange(cond.type === 'none' ? null : { type: cond.type }); setOpen(false) }}
                className={`w-full text-left px-4 py-3 transition-colors cursor-pointer border-b border-slate-50 dark:border-slate-800 last:border-0 ${
                  currentType === cond.type
                    ? 'bg-primary-50 dark:bg-primary-500/10'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={14} className={currentType === cond.type ? 'text-primary-500' : 'text-slate-400'} />
                  <div>
                    <p className={`text-sm font-medium ${currentType === cond.type ? 'text-primary-700 dark:text-primary-400' : 'text-slate-700 dark:text-slate-200'}`}>{cond.label}</p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{cond.description}</p>
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
  const [showPreview, setShowPreview] = useState(false)

  const mode = step.mode || 'template'
  const tpl = mode === 'template' && step.templateId ? DUMMY_TEMPLATES.find((t) => t.id === step.templateId) : null

  // Get subject/body for preview regardless of mode
  const previewSubject = mode === 'template' ? (tpl?.subject || '') : (step.customSubject || '')
  const previewBody = mode === 'template' ? (tpl?.body || '') : (step.customBody || '')
  const hasContent = !!(previewSubject || previewBody)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, height: 0 }}
      transition={{ duration: 0.2 }}
      className="relative"
    >
      {/* Connector line from previous step */}
      {!isFirst && (
        <div className="flex items-center justify-center py-3">
          <div className="flex flex-col items-center gap-1">
            <div className="w-px h-4 border-l-2 border-dashed border-slate-200 dark:border-slate-700" />
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-500 dark:text-slate-400 tabular-nums">
                {step.delayAmount} {step.delayUnit}
              </span>
              {step.condition && (
                <span className="px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-500/10 text-[10px] font-semibold text-purple-600 dark:text-purple-400">
                  {DRIP_CONDITIONS.find((c) => c.type === step.condition?.type)?.label || 'Condition'}
                </span>
              )}
            </div>
            <div className="w-px h-4 border-l-2 border-dashed border-slate-200 dark:border-slate-700" />
          </div>
        </div>
      )}

      {/* Card */}
      <div className="flex items-start gap-3">
        {/* Step number */}
        <div className="flex flex-col items-center pt-5">
          <div className="w-8 h-8 rounded-full bg-primary-500 dark:bg-primary-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
            {index + 1}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
            <div className="flex items-center gap-2">
              <GripVertical size={16} className="text-slate-300 dark:text-slate-600 cursor-grab" />
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                Step {index + 1}
                {mode === 'template' && tpl && (
                  <span className="text-slate-400 dark:text-slate-500 font-normal ml-1.5">— {tpl.name}</span>
                )}
                {mode === 'custom' && step.customSubject && (
                  <span className="text-slate-400 dark:text-slate-500 font-normal ml-1.5">— {step.customSubject}</span>
                )}
              </h4>
            </div>
            <div className="flex items-center gap-1.5">
              {hasContent && (
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                    showPreview
                      ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Eye size={12} />
                  Preview
                </button>
              )}
              {totalSteps > 2 && (
                <button
                  type="button"
                  onClick={onRemove}
                  className="p-1 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          <div className="p-5 space-y-4">
            {/* Mode toggle */}
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                Email Content
              </label>
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 w-fit">
                <button
                  type="button"
                  onClick={() => onUpdate({ ...step, mode: 'template' })}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                    mode === 'template'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                  }`}
                >
                  <FileText size={13} />
                  Use Template
                </button>
                <button
                  type="button"
                  onClick={() => onUpdate({ ...step, mode: 'custom' })}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                    mode === 'custom'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                  }`}
                >
                  <Pencil size={13} />
                  Write Custom
                </button>
              </div>
            </div>

            {/* Template or Custom editor */}
            {mode === 'template' ? (
              <TemplateSelect
                value={step.templateId}
                onChange={(templateId) => onUpdate({ ...step, templateId })}
              />
            ) : (
              <CustomEmailEditor
                subject={step.customSubject || ''}
                body={step.customBody || ''}
                onSubjectChange={(customSubject) => onUpdate({ ...step, customSubject })}
                onBodyChange={(customBody) => onUpdate({ ...step, customBody })}
              />
            )}

            {/* Delay + Condition row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                  {isFirst ? 'Timing' : 'Delay After Previous Step'}
                </label>
                {isFirst ? (
                  <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg text-xs text-slate-400 dark:text-slate-500">
                    Sends immediately (first step)
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={90}
                      value={step.delayAmount}
                      onChange={(e) => onUpdate({ ...step, delayAmount: parseInt(e.target.value) || 1 })}
                      className="w-20 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-all tabular-nums"
                    />
                    <select
                      value={step.delayUnit}
                      onChange={(e) => onUpdate({ ...step, delayUnit: e.target.value })}
                      className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 cursor-pointer appearance-none pr-8 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_6px_center] bg-no-repeat"
                    >
                      <option value="hours">hours</option>
                      <option value="days">days</option>
                    </select>
                    <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">after prev.</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                  Condition
                </label>
                <ConditionPicker
                  value={step.condition}
                  onChange={(condition) => onUpdate({ ...step, condition })}
                  disabled={isFirst}
                />
              </div>
            </div>

            {/* Inline preview */}
            <AnimatePresence>
              {showPreview && hasContent && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 mb-3">
                      <Eye size={13} className="text-slate-400" />
                      <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Recipient Preview</span>
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

/* ─── Main Sequence Builder ────────────────────────────────────────────────── */
export default function DripSequenceBuilder({ steps, onChange }) {
  function addStep() {
    if (steps.length >= 10) return
    const newStep = {
      id: `step-${Date.now()}`,
      order: steps.length,
      mode: 'template',
      templateId: null,
      customSubject: '',
      customBody: '',
      delayAmount: 3,
      delayUnit: 'days',
      condition: null,
    }
    onChange([...steps, newStep])
  }

  function updateStep(index, updatedStep) {
    const next = [...steps]
    next[index] = updatedStep
    onChange(next)
  }

  function removeStep(index) {
    if (steps.length <= 2) return
    onChange(steps.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">Email Sequence</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            Add steps, set delays, and configure conditions. {steps.length}/10 steps.
          </p>
        </div>
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-primary-50 dark:bg-primary-500/15 text-primary-600 dark:text-primary-400 tabular-nums">
          {steps.length} step{steps.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Steps */}
      <AnimatePresence mode="popLayout">
        {steps.map((step, index) => (
          <StepCard
            key={step.id}
            step={step}
            index={index}
            totalSteps={steps.length}
            onUpdate={(updated) => updateStep(index, updated)}
            onRemove={() => removeStep(index)}
          />
        ))}
      </AnimatePresence>

      {/* Add Step */}
      {steps.length < 10 && (
        <motion.div layout className="flex justify-center pt-4">
          <button
            type="button"
            onClick={addStep}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-500/40 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50/30 dark:hover:bg-primary-500/5 transition-all cursor-pointer"
          >
            <Plus size={16} />
            Add Step
          </button>
        </motion.div>
      )}
    </div>
  )
}
