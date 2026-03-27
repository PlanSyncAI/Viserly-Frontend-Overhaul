import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Eye,
  Copy,
  Pencil,
  Trash2,
  X,
  Check,
  Search,
  ChevronRight,
  Shield,
  Calendar,
  Clock,
  BarChart3,
  Tag,
} from 'lucide-react'
import {
  DUMMY_TEMPLATES,
  MERGE_FIELDS,
  SAMPLE_MERGE_VALUES,
  TEMPLATE_STATUS_STYLES,
} from '../lib/templateData'

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

/* ─── Helpers ──────────────────────────────────────────────────────────────── */

function findFieldLabel(fieldKey) {
  for (const category of Object.values(MERGE_FIELDS)) {
    const found = category.find((f) => f.key === fieldKey)
    if (found) return found.label
  }
  return fieldKey
}

function renderTextWithMergeHighlights(text, mode = 'raw') {
  const parts = text.split(/(\*\[\[[^\]]+\]\]\*)/g)
  return parts.map((part, i) => {
    const match = part.match(/^\*\[\[([^\]]+)\]\]\*$/)
    if (match) {
      const fieldKey = match[1]
      if (mode === 'resolved') {
        const value = SAMPLE_MERGE_VALUES[fieldKey] || part
        return (
          <span
            key={i}
            className="bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 rounded px-1 py-0.5 text-xs font-medium"
          >
            {value}
          </span>
        )
      }
      const label = findFieldLabel(fieldKey)
      return (
        <span
          key={i}
          className="inline-flex items-center px-1.5 py-0.5 rounded bg-primary-50 dark:bg-primary-500/15 text-primary-600 dark:text-primary-400 text-xs font-medium border border-primary-100 dark:border-primary-500/20"
        >
          {label}
        </span>
      )
    }
    return <span key={i}>{part}</span>
  })
}

function formatDate(dateStr) {
  if (!dateStr) return '\u2014'
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

/* ─── Component ────────────────────────────────────────────────────────────── */

export default function TemplateDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const template = DUMMY_TEMPLATES.find((t) => t.id === Number(id))

  const [copiedField, setCopiedField] = useState(null)
  const [showPreview, setShowPreview] = useState(false)
  const [mergeSearch, setMergeSearch] = useState('')
  const [expandedSections, setExpandedSections] = useState({
    ACCOUNT: true,
    CONTACT: true,
    USER: true,
  })

  const filteredMergeFields = useMemo(() => {
    const result = {}
    for (const [category, fields] of Object.entries(MERGE_FIELDS)) {
      if (mergeSearch === '') {
        result[category] = fields
      } else {
        result[category] = fields.filter((f) =>
          f.label.toLowerCase().includes(mergeSearch.toLowerCase()) ||
          f.key.toLowerCase().includes(mergeSearch.toLowerCase())
        )
      }
    }
    return result
  }, [mergeSearch])

  if (!template) {
    return (
      <div className="p-8 mx-auto">
        <button
          onClick={() => navigate('/templates')}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer mb-6"
        >
          <ArrowLeft size={16} />
          Back to Templates
        </button>
        <p className="text-sm text-slate-400 dark:text-slate-500">Template not found.</p>
      </div>
    )
  }

  async function handleCopyField(fieldKey) {
    const text = `*[[${fieldKey}]]*`
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(fieldKey)
      setTimeout(() => setCopiedField(null), 1500)
    } catch {
      setCopiedField(fieldKey)
      setTimeout(() => setCopiedField(null), 1500)
    }
  }

  function toggleSection(category) {
    setExpandedSections((prev) => ({ ...prev, [category]: !prev[category] }))
  }

  const statusBadge = TEMPLATE_STATUS_STYLES[template.status] || TEMPLATE_STATUS_STYLES.Active

  return (
    <motion.div
      className="p-4 md:p-8 mx-auto space-y-4 md:space-y-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Back button */}
      <motion.button
        variants={fadeUp}
        onClick={() => navigate('/templates')}
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
      >
        <ArrowLeft size={16} />
        Back to Templates
      </motion.button>

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 items-start">
        {/* ── Left Column ──────────────────────────────────────────── */}
        <div className="flex-1 min-w-0 space-y-4 md:space-y-6">

          {/* Template Header Card */}
          <motion.div
            variants={fadeUp}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-4 md:p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex flex-wrap items-center gap-2.5 mb-2">
                  <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {template.name}
                  </h1>
                  {template.source === 'Viserly' ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-50 dark:bg-primary-500/15 text-primary-600 dark:text-primary-400">
                      Viserly
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                      Custom
                    </span>
                  )}
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusBadge}`}>
                    {template.status}
                  </span>
                </div>

                {/* Metadata row */}
                <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={13} />
                    <span>Created by {template.createdBy} on {formatDate(template.createdDate)}</span>
                  </div>
                  <span className="text-slate-200 dark:text-slate-700">|</span>
                  <div className="flex items-center gap-1.5">
                    <Clock size={13} />
                    <span>Modified {formatDate(template.lastModifiedDate)}</span>
                  </div>
                  <span className="text-slate-200 dark:text-slate-700">|</span>
                  <div className="flex items-center gap-1.5">
                    <BarChart3 size={13} />
                    <span>Used {template.usageCount} times</span>
                  </div>
                  {template.category && (
                    <>
                      <span className="text-slate-200 dark:text-slate-700">|</span>
                      <div className="flex items-center gap-1.5">
                        <Tag size={13} />
                        <span>{template.category}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Default Template Banner */}
          {template.isDefault && (
            <motion.div
              variants={fadeUp}
              className="flex items-center gap-4 p-4 rounded-xl bg-primary-50/70 dark:bg-primary-500/10 border border-primary-100 dark:border-primary-500/20"
            >
              <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                <Shield size={20} className="text-primary-600 dark:text-primary-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Default Template</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Default templates cannot be edited or deleted. Duplicate it to create your own customized version.
                </p>
              </div>
              <button
                onClick={() => navigate('/templates/new')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 dark:bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-colors cursor-pointer flex-shrink-0"
              >
                <Copy size={14} />
                Duplicate Template
              </button>
            </motion.div>
          )}

          {/* ── Email Preview (THE HERO) ───────────────────────────── */}
          <motion.div
            variants={fadeUp}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 overflow-hidden"
          >
            {/* Section header */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Email Preview</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">How this template appears in recipients' inboxes</p>
              </div>
              <button
                onClick={() => setShowPreview(true)}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-500 hover:text-primary-600 dark:hover:text-primary-300 cursor-pointer transition-colors"
              >
                <Eye size={14} />
                Preview with Sample Data
              </button>
            </div>

            {/* Email chrome frame */}
            <div className="p-4 md:p-6">
              <div className="max-w-2xl mx-auto">
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                  {/* Email header bar */}
                  <div className="bg-slate-50 dark:bg-slate-800 px-5 py-3 border-b border-slate-200 dark:border-slate-700 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 w-14">From:</span>
                      <span className="text-xs text-slate-600 dark:text-slate-300">Your Name &lt;you@company.com&gt;</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 w-14">To:</span>
                      <span className="text-xs text-slate-600 dark:text-slate-300">Recipient</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 w-14 mt-0.5">Subject:</span>
                      <span className="text-xs text-slate-900 dark:text-white font-medium leading-relaxed">
                        {renderTextWithMergeHighlights(template.subject, 'raw')}
                      </span>
                    </div>
                  </div>
                  {/* Email body */}
                  <div className="px-6 py-6 bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap min-h-[200px]">
                    {renderTextWithMergeHighlights(template.body, 'raw')}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Template Details Card ──────────────────────────────── */}
          <motion.div
            variants={fadeUp}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 p-4 md:p-6"
          >
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Template Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: 'Template Name', value: template.name },
                { label: 'Subject Line', value: template.subject },
                { label: 'Source', value: template.source || 'Custom' },
                { label: 'Status', value: template.status },
                { label: 'Category', value: template.category || '\u2014' },
                { label: 'Usage Count', value: template.usageCount },
                { label: 'Created', value: `${template.createdBy}, ${formatDate(template.createdDate)}, ${template.createdTime}` },
                { label: 'Last Modified', value: `${template.lastModifiedBy}, ${formatDate(template.lastModifiedDate)}, ${template.lastModifiedTime}` },
              ].map((field) => (
                <div key={field.label} className="py-3 px-4 border border-slate-100 dark:border-slate-800 rounded-lg bg-slate-50/50 dark:bg-slate-800/30">
                  <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">{field.label}</p>
                  <p className="text-sm text-slate-700 dark:text-slate-200 truncate">{field.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Right Sidebar ────────────────────────────────────────── */}
        <div className="w-full lg:w-72 lg:flex-shrink-0 space-y-4">

          {/* Action Buttons */}
          <motion.div variants={fadeUp} className="space-y-2">
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Actions</p>

            {/* Primary: Preview */}
            <button
              onClick={() => setShowPreview(true)}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-500 dark:bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-600 dark:hover:bg-primary-500 transition-colors cursor-pointer"
            >
              <Eye size={16} />
              Preview Email
            </button>

            {/* Secondary: Duplicate */}
            <button
              onClick={() => navigate('/templates/new')}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <Copy size={16} />
              Duplicate Template
            </button>

            {/* Secondary: Edit (hidden for defaults) */}
            {!template.isDefault && (
              <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                <Pencil size={16} />
                Edit Template
              </button>
            )}

            {/* Danger: Delete */}
            {template.isDefault ? (
              <div className="relative group">
                <button
                  disabled
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-50/50 dark:bg-red-500/5 text-red-300 dark:text-red-800 text-sm font-medium rounded-lg cursor-not-allowed opacity-50"
                >
                  <Trash2 size={16} />
                  Delete Template
                </button>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-900 dark:bg-slate-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  Default templates cannot be deleted
                </div>
              </div>
            ) : (
              <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm font-medium rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors cursor-pointer">
                <Trash2 size={16} />
                Delete Template
              </button>
            )}
          </motion.div>

          {/* ── Merge Fields Panel ──────────────────────────────────── */}
          <motion.div
            variants={fadeUp}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 p-4 md:p-5 space-y-4"
          >
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Merge Fields</h4>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Click to copy field syntax to clipboard
              </p>
            </div>

            {/* Search */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search fields..."
                value={mergeSearch}
                onChange={(e) => setMergeSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-all"
              />
            </div>

            {/* Collapsible sections */}
            {['ACCOUNT', 'CONTACT', 'USER'].map((category) => {
              const fields = filteredMergeFields[category] || []
              const isExpanded = expandedSections[category]

              return (
                <div key={category}>
                  <button
                    onClick={() => toggleSection(category)}
                    className="w-full flex items-center justify-between py-1.5 cursor-pointer group/section"
                  >
                    <div className="flex items-center gap-2">
                      <ChevronRight
                        size={14}
                        className={`text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                      />
                      <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider group-hover/section:text-slate-600 dark:group-hover/section:text-slate-300 transition-colors">
                        {category}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-full tabular-nums">
                      {fields.length}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isExpanded && fields.length > 0 && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-wrap gap-1.5 pt-2 pb-1">
                          {fields.map((field) => (
                            <button
                              key={field.key}
                              onClick={() => handleCopyField(field.key)}
                              className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs transition-colors cursor-pointer ${
                                copiedField === field.key
                                  ? 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-500/15 hover:text-primary-600 dark:hover:text-primary-400'
                              }`}
                            >
                              {copiedField === field.key ? (
                                <><Check size={11} className="mr-1" />Copied</>
                              ) : (
                                field.label
                              )}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </motion.div>
        </div>
      </div>

      {/* ── Preview Modal ──────────────────────────────────────────── */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40" onClick={() => setShowPreview(false)} />

            {/* Modal panel */}
            <motion.div
              className="relative bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-2xl mx-4 flex flex-col max-h-[85vh]"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Email Preview</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Merge fields replaced with sample data</p>
                </div>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Info bar */}
              <div className="px-6 py-2.5 bg-amber-50/60 dark:bg-amber-500/5 border-b border-amber-100 dark:border-amber-500/10">
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  Highlighted values below represent dynamic merge fields populated with sample data.
                </p>
              </div>

              {/* Email chrome */}
              <div className="px-6 py-4 overflow-y-auto flex-1">
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                  {/* Email header */}
                  <div className="bg-slate-50 dark:bg-slate-800 px-5 py-3 border-b border-slate-200 dark:border-slate-700 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 w-14">From:</span>
                      <span className="text-xs text-slate-600 dark:text-slate-300">Jane Smith &lt;jane.smith@viserly.com&gt;</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 w-14">To:</span>
                      <span className="text-xs text-slate-600 dark:text-slate-300">John Doe &lt;john.doe@example.com&gt;</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 w-14 mt-0.5">Subject:</span>
                      <span className="text-xs text-slate-900 dark:text-white font-medium leading-relaxed">
                        {renderTextWithMergeHighlights(template.subject, 'resolved')}
                      </span>
                    </div>
                  </div>
                  {/* Email body */}
                  <div className="px-6 py-6 bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {renderTextWithMergeHighlights(template.body, 'resolved')}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 bg-primary-500 dark:bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-colors cursor-pointer"
                >
                  Close Preview
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
