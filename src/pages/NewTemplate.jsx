import { useState, useMemo, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Check,
  Upload,
  Eye,
  EyeOff,
  X,
  User,
  FileText,
  Search,
  ChevronRight,
} from 'lucide-react'
import { MERGE_FIELDS, SAMPLE_MERGE_VALUES } from '../lib/templateData'
import { useContacts } from '../lib/useContacts'

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

export default function NewTemplate() {
  const navigate = useNavigate()
  const { contacts } = useContacts()
  const bodyRef = useRef(null)

  const [name, setName] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [copiedField, setCopiedField] = useState(null)
  const [errors, setErrors] = useState({})
  const [showPreview, setShowPreview] = useState(true)
  const [previewContactIdx, setPreviewContactIdx] = useState(0)
  const [mergeSearch, setMergeSearch] = useState('')
  const [expandedSections, setExpandedSections] = useState({
    ACCOUNT: true,
    CONTACT: true,
    USER: true,
  })

  const previewContact = contacts[previewContactIdx] || null

  const contactMergeValues = useMemo(() => {
    if (!previewContact) return SAMPLE_MERGE_VALUES
    return {
      ...SAMPLE_MERGE_VALUES,
      'Contact-FirstName': previewContact.firstName,
      'Contact-LastName': previewContact.lastName,
      'Contact-PreferredName': previewContact.preferredName || previewContact.firstName,
      'Contact-Email': previewContact.email,
      'Contact-Phone': previewContact.phone,
      'Contact-Title': previewContact.title,
      'Contact-EligibilityStatus': previewContact.eligibilityStatus,
      'Contact-EmploymentStatus': previewContact.employmentActive ? 'Active' : 'Inactive',
      'Contact-EntryDate': previewContact.entryDate
        ? new Date(previewContact.entryDate + 'T00:00:00').toLocaleDateString('en-US')
        : '',
      'Contact-MaritalStatus': previewContact.maritalStatus,
      'Contact-PreTaxDeferralRatePercent': previewContact.preTaxContribRate
        ? (parseFloat(previewContact.preTaxContribRate) * 100).toFixed(1) + '%'
        : 'N/A',
      'Contact-PreTaxDeferralRateDollar': previewContact.preTaxContribDollar
        ? '$' + previewContact.preTaxContribDollar
        : 'N/A',
      'Contact-RothDeferralRatePercent': previewContact.rothContribRate
        ? (parseFloat(previewContact.rothContribRate) * 100).toFixed(1) + '%'
        : 'N/A',
      'Contact-RothDeferralRateDollar': previewContact.rothContribDollar
        ? '$' + previewContact.rothContribDollar
        : 'N/A',
    }
  }, [previewContact])

  const mergePlaceholder = useCallback(
    (text) => {
      if (!text) return ''
      return text.replace(/\*?\[\[([^\]]+)\]\]\*?/g, (match, key) => {
        return contactMergeValues[key] || match
      })
    },
    [contactMergeValues]
  )

  const previewSubject = useMemo(() => mergePlaceholder(subject), [subject, mergePlaceholder])
  const previewBody = useMemo(() => mergePlaceholder(body), [body, mergePlaceholder])

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

  async function handleCopyField(fieldKey) {
    const text = `*[[${fieldKey}]]*`
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // fallback
    }
    setCopiedField(fieldKey)
    setTimeout(() => setCopiedField(null), 1500)
  }

  function insertField(fieldKey) {
    const tag = `*[[${fieldKey}]]*`
    if (bodyRef.current) {
      const ta = bodyRef.current
      const start = ta.selectionStart
      const end = ta.selectionEnd
      const newBody = body.substring(0, start) + tag + body.substring(end)
      setBody(newBody)
      requestAnimationFrame(() => {
        ta.focus()
        ta.selectionStart = ta.selectionEnd = start + tag.length
      })
    } else {
      setBody(body + tag)
    }
  }

  function handleSave() {
    const newErrors = {}
    if (!name.trim()) newErrors.name = 'Template name is required.'
    if (!subject.trim()) newErrors.subject = 'Subject is required.'
    setErrors(newErrors)
    if (Object.keys(newErrors).length === 0) {
      navigate('/templates')
    }
  }

  function toggleSection(category) {
    setExpandedSections((prev) => ({ ...prev, [category]: !prev[category] }))
  }

  const sampleContacts = contacts.slice(0, 20)

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
        onClick={() => navigate('/templates')}
        className="inline-flex items-center gap-2 text-sm text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
      >
        <ArrowLeft size={16} />
        Back to Templates
      </motion.button>

      {/* Header */}
      <motion.div variants={fadeUp}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center">
            <FileText size={20} className="text-primary-600 dark:text-primary-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Create a New Email Template
          </h2>
        </div>
        <p className="text-sm text-slate-400 dark:text-slate-500 ml-[52px]">
          Fill in the template details and use the rich text editor to design your email content.
        </p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* ── Left: Editor ─────────────────────────────────────── */}
        <div className="flex-1 min-w-0 space-y-5">
          {/* Template Name */}
          <motion.div variants={fadeUp}>
            <label className={`block text-sm font-medium mb-1.5 ${errors.name ? 'text-red-500' : 'text-slate-700 dark:text-slate-200'}`}>
              Template Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setErrors({ ...errors, name: undefined }) }}
              placeholder="Insert email template name here"
              className={`w-full px-4 py-3 bg-white dark:bg-slate-900 border rounded-xl text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                errors.name
                  ? 'border-red-300 dark:border-red-500/50 focus:ring-red-500/20 focus:border-red-400'
                  : 'border-slate-200 dark:border-slate-700 focus:ring-primary-500/20 focus:border-primary-300'
              }`}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </motion.div>

          {/* Email Subject */}
          <motion.div variants={fadeUp}>
            <label className={`block text-sm font-medium mb-1.5 ${errors.subject ? 'text-red-500' : 'text-slate-700 dark:text-slate-200'}`}>
              Email Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => { setSubject(e.target.value); setErrors({ ...errors, subject: undefined }) }}
              placeholder="Insert email template subject here"
              className={`w-full px-4 py-3 bg-white dark:bg-slate-900 border rounded-xl text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                errors.subject
                  ? 'border-red-300 dark:border-red-500/50 focus:ring-red-500/20 focus:border-red-400'
                  : 'border-slate-200 dark:border-slate-700 focus:ring-primary-500/20 focus:border-primary-300'
              }`}
            />
            {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject}</p>}
          </motion.div>

          {/* Rich Text Editor */}
          <motion.div variants={fadeUp}>
            <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
              {/* Toolbar */}
              <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                {['B', 'I', 'U', 'S'].map((btn) => (
                  <button
                    key={btn}
                    type="button"
                    className="w-8 h-8 flex items-center justify-center rounded text-sm font-bold text-slate-400 dark:text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
                  >
                    {btn}
                  </button>
                ))}
                <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1" />
                <select className="text-xs text-slate-500 dark:text-slate-400 bg-transparent border-none focus:outline-none cursor-pointer px-1 py-1">
                  <option>8px</option><option>10px</option><option>12px</option><option>14px</option><option>16px</option>
                </select>
                <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1" />
                {['\u2261', '\u2630', '\u2637'].map((icon, i) => (
                  <button key={i} type="button" className="w-8 h-8 flex items-center justify-center rounded text-sm text-slate-400 dark:text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer">
                    {icon}
                  </button>
                ))}
                <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1" />
                <select className="text-xs text-slate-500 dark:text-slate-400 bg-transparent border-none focus:outline-none cursor-pointer px-1 py-1">
                  <option>Arial</option><option>Inter</option><option>Georgia</option><option>Verdana</option>
                </select>
              </div>
              <textarea
                ref={bodyRef}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write Something..."
                rows={14}
                className="w-full px-4 py-3 text-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none resize-none"
              />
            </div>
          </motion.div>

          {/* PDF Attachment */}
          <motion.div variants={fadeUp} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 p-4 md:p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">PDF Attachment</h3>
              <span className="text-xs text-slate-400 dark:text-slate-500">Optional &middot; PDF only</span>
            </div>
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-6 text-center hover:border-primary-300 dark:hover:border-primary-500/40 transition-colors">
              <div className="flex items-center justify-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  <Upload size={16} />
                  Upload Files
                </button>
                <span className="text-slate-400 dark:text-slate-500">Or drop files</span>
              </div>
            </div>
          </motion.div>

          {/* Save */}
          <motion.div variants={fadeUp} className="flex justify-end">
            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-primary-500 dark:bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-colors cursor-pointer"
            >
              Save Template
            </button>
          </motion.div>
        </div>

        {/* ── Right: Merge Fields Sidebar ──────────────────────── */}
        <motion.div variants={fadeUp} className="w-full md:w-[300px] flex-shrink-0 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 p-5 space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                Merge Fields
              </h4>
              <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
                Click a field to copy and insert it into your template body at the cursor position.
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
                              onClick={() => { handleCopyField(field.key); insertField(field.key) }}
                              className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs transition-colors cursor-pointer ${
                                copiedField === field.key
                                  ? 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-500/15 hover:text-primary-600 dark:hover:text-primary-400'
                              }`}
                            >
                              {copiedField === field.key ? (
                                <><Check size={11} className="mr-1" />Copied</>
                              ) : field.label}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>

      {/* ── Live Preview Panel ──────────────────────────────────── */}
      <motion.div variants={fadeUp} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 overflow-hidden">
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            {showPreview ? <Eye size={18} className="text-primary-500" /> : <EyeOff size={18} className="text-slate-400 dark:text-slate-500" />}
            <div className="text-left">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Live Email Preview</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                See how this email will look for a real participant with merge fields resolved
              </p>
            </div>
          </div>
          <span className="text-xs font-medium text-primary-500">
            {showPreview ? 'Hide' : 'Show'}
          </span>
        </button>

        <AnimatePresence>
          {showPreview && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="border-t border-slate-100 dark:border-slate-800">
                {/* Contact selector */}
                <div className="px-6 py-3 bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                  <User size={15} className="text-slate-400" />
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Preview as:</span>
                  <select
                    value={previewContactIdx}
                    onChange={(e) => setPreviewContactIdx(Number(e.target.value))}
                    className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 cursor-pointer appearance-none pr-8 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_8px_center] bg-no-repeat"
                  >
                    {sampleContacts.map((c, i) => (
                      <option key={i} value={i}>{c.fullName} \u2014 {c.email}</option>
                    ))}
                    {contacts.length === 0 && <option value={0}>Sample Contact (John Doe)</option>}
                  </select>
                </div>

                {/* Preview content */}
                <div className="px-6 py-5">
                  {(!subject && !body) ? (
                    <div className="text-center py-8">
                      <FileText size={32} className="mx-auto mb-3 text-slate-200 dark:text-slate-700" />
                      <p className="text-sm text-slate-400 dark:text-slate-500">
                        Start typing above to see a live preview of your email here.
                      </p>
                    </div>
                  ) : (
                    <div className="max-w-2xl mx-auto">
                      {/* Email chrome */}
                      <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                        <div className="bg-slate-50 dark:bg-slate-800 px-5 py-3 border-b border-slate-200 dark:border-slate-700 space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 w-14">From:</span>
                            <span className="text-xs text-slate-600 dark:text-slate-300">Your Name &lt;you@company.com&gt;</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 w-14">To:</span>
                            <span className="text-xs text-slate-600 dark:text-slate-300">
                              {previewContact
                                ? `${previewContact.fullName} <${previewContact.email}>`
                                : 'John Doe <john.doe@example.com>'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 w-14">Subject:</span>
                            <span className="text-xs text-slate-900 dark:text-white font-medium">
                              {previewSubject || <span className="text-slate-400 dark:text-slate-500 italic">No subject</span>}
                            </span>
                          </div>
                        </div>
                        <div className="px-5 py-5 bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap min-h-[120px]">
                          {previewBody || <span className="text-slate-400 dark:text-slate-500 italic">Email body will appear here...</span>}
                        </div>
                      </div>

                      {/* Participant info badge */}
                      {previewContact && (
                        <div className="mt-4 flex items-center gap-3 p-3 rounded-lg bg-primary-50/50 dark:bg-primary-500/10 border border-primary-100 dark:border-primary-500/20">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-[10px] font-bold">
                              {previewContact.firstName[0]}{previewContact.lastName[0]}
                            </span>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">{previewContact.fullName}</p>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500">
                              {previewContact.title} &middot; ${previewContact.salary.toLocaleString()} salary &middot; ${previewContact.planBalance.toLocaleString()} balance
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}
