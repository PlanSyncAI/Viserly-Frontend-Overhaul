import { useState, useMemo, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Check,
  Upload,
  Eye,
  EyeOff,
  X,
  User,
} from 'lucide-react'
import { MERGE_FIELDS, SAMPLE_MERGE_VALUES } from '../lib/templateData'
import { useContacts } from '../lib/useContacts'

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

  // Build merge values from a real contact for the live preview
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
      // restore cursor after the inserted tag
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

  // Random contact picker
  const sampleContacts = contacts.slice(0, 20)

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Back */}
      <button
        onClick={() => navigate('/templates')}
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
      >
        <ArrowLeft size={16} />
        Back to Templates
      </button>

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white dark:text-white tracking-tight">
          Create a New Email Template
        </h2>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
          Fill in the template details and use the rich text editor to design your email content.
        </p>
      </div>

      <div className="flex gap-6 items-start">
        {/* ── Left: Editor ─────────────────────────────────────── */}
        <div className="flex-1 min-w-0 space-y-5">
          {/* Template Name */}
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${errors.name ? 'text-red-500' : 'text-slate-700'}`}>
              Template Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setErrors({ ...errors, name: undefined }) }}
              placeholder="Insert email template name here"
              className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${
                errors.name
                  ? 'border-red-300 focus:ring-red-500/20 focus:border-red-400'
                  : 'border-slate-200 focus:ring-primary-500/20 focus:border-primary-300'
              }`}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          {/* Email Subject */}
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${errors.subject ? 'text-red-500' : 'text-slate-700'}`}>
              Email Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => { setSubject(e.target.value); setErrors({ ...errors, subject: undefined }) }}
              placeholder="Insert email template subject here"
              className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${
                errors.subject
                  ? 'border-red-300 focus:ring-red-500/20 focus:border-red-400'
                  : 'border-slate-200 focus:ring-primary-500/20 focus:border-primary-300'
              }`}
            />
            {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject}</p>}
          </div>

          {/* Rich Text Editor */}
          <div>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              {/* Toolbar */}
              <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                {['B', 'I', 'U', 'S'].map((btn) => (
                  <button
                    key={btn}
                    type="button"
                    className="w-8 h-8 flex items-center justify-center rounded text-sm font-bold text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    {btn}
                  </button>
                ))}
                <div className="w-px h-5 bg-slate-200 mx-1" />
                <select className="text-xs text-slate-500 bg-transparent border-none focus:outline-none cursor-pointer px-1 py-1">
                  <option>8px</option><option>10px</option><option>12px</option><option>14px</option><option>16px</option>
                </select>
                <div className="w-px h-5 bg-slate-200 mx-1" />
                {['≡', '☰', '☷'].map((icon, i) => (
                  <button key={i} type="button" className="w-8 h-8 flex items-center justify-center rounded text-sm text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors cursor-pointer">
                    {icon}
                  </button>
                ))}
                <div className="w-px h-5 bg-slate-200 mx-1" />
                <select className="text-xs text-slate-500 bg-transparent border-none focus:outline-none cursor-pointer px-1 py-1">
                  <option>Arial</option><option>Inter</option><option>Georgia</option><option>Verdana</option>
                </select>
              </div>
              <textarea
                ref={bodyRef}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write Something..."
                rows={14}
                className="w-full px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* PDF Attachment */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">PDF Attachment</h3>
              <span className="text-xs text-slate-400 dark:text-slate-500">Optional · PDF only</span>
            </div>
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-primary-300 transition-colors">
              <div className="flex items-center justify-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <Upload size={16} />
                  Upload Files
                </button>
                <span className="text-slate-400">Or drop files</span>
              </div>
            </div>
          </div>

          {/* Save */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-primary-500 dark:bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-colors cursor-pointer"
            >
              Save Template
            </button>
          </div>
        </div>

        {/* ── Right: Merge Fields Sidebar ──────────────────────── */}
        <div className="w-[300px] flex-shrink-0 space-y-4">
          {/* Merge fields card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 p-5 space-y-5">
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                Enhance Your Email Template with Customer Data!
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Click on a tile below to copy the merge field into your clipboard. Then, paste it into your email template where you would like the customer's data to appear.
              </p>
            </div>

            {/* Account */}
            <div>
              <h5 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Account</h5>
              <div className="flex flex-wrap gap-1.5">
                {MERGE_FIELDS.ACCOUNT.map((field) => (
                  <button
                    key={field.key}
                    onClick={() => { handleCopyField(field.key); insertField(field.key) }}
                    className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs transition-colors cursor-pointer ${
                      copiedField === field.key
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-slate-100 text-slate-600 hover:bg-primary-50 hover:text-primary-600'
                    }`}
                  >
                    {copiedField === field.key ? (
                      <><Check size={11} className="mr-1" />Copied</>
                    ) : field.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <h5 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Contact</h5>
              <div className="flex flex-wrap gap-1.5">
                {MERGE_FIELDS.CONTACT.map((field) => (
                  <button
                    key={field.key}
                    onClick={() => { handleCopyField(field.key); insertField(field.key) }}
                    className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs transition-colors cursor-pointer ${
                      copiedField === field.key
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-slate-100 text-slate-600 hover:bg-primary-50 hover:text-primary-600'
                    }`}
                  >
                    {copiedField === field.key ? (
                      <><Check size={11} className="mr-1" />Copied</>
                    ) : field.label}
                  </button>
                ))}
              </div>
            </div>

            {/* User */}
            <div>
              <h5 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">User</h5>
              <div className="flex flex-wrap gap-1.5">
                {MERGE_FIELDS.USER.map((field) => (
                  <button
                    key={field.key}
                    onClick={() => { handleCopyField(field.key); insertField(field.key) }}
                    className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs transition-colors cursor-pointer ${
                      copiedField === field.key
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-slate-100 text-slate-600 hover:bg-primary-50 hover:text-primary-600'
                    }`}
                  >
                    {copiedField === field.key ? (
                      <><Check size={11} className="mr-1" />Copied</>
                    ) : field.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Live Preview Panel (below editor) ──────────────────── */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 overflow-hidden">
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            {showPreview ? <Eye size={18} className="text-primary-500" /> : <EyeOff size={18} className="text-slate-400" />}
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

        {showPreview && (
          <div className="border-t border-slate-100">
            {/* Contact selector */}
            <div className="px-6 py-3 bg-slate-50/50 border-b border-slate-100 flex items-center gap-3">
              <User size={15} className="text-slate-400" />
              <span className="text-xs font-medium text-slate-500">Preview as:</span>
              <select
                value={previewContactIdx}
                onChange={(e) => setPreviewContactIdx(Number(e.target.value))}
                className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 cursor-pointer appearance-none pr-8 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_8px_center] bg-no-repeat"
              >
                {sampleContacts.map((c, i) => (
                  <option key={i} value={i}>{c.fullName} — {c.email}</option>
                ))}
                {contacts.length === 0 && <option value={0}>Sample Contact (John Doe)</option>}
              </select>
            </div>

            {/* Preview content */}
            <div className="px-6 py-5">
              {(!subject && !body) ? (
                <p className="text-sm text-slate-400 text-center py-8">
                  Start typing above to see a live preview of your email here.
                </p>
              ) : (
                <div className="max-w-2xl mx-auto">
                  {/* Email chrome */}
                  <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                    {/* Email header */}
                    <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 dark:border-slate-700 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-400 w-12">From:</span>
                        <span className="text-xs text-slate-600">Cameron Abernethy &lt;cameron@viserly.com&gt;</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-400 w-12">To:</span>
                        <span className="text-xs text-slate-600">
                          {previewContact
                            ? `${previewContact.fullName} <${previewContact.email}>`
                            : 'John Doe <john.doe@example.com>'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-400 w-12">Subject:</span>
                        <span className="text-xs text-slate-900 font-medium">
                          {previewSubject || <span className="text-slate-400 italic">No subject</span>}
                        </span>
                      </div>
                    </div>
                    {/* Email body */}
                    <div className="px-5 py-5 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap min-h-[120px]">
                      {previewBody || <span className="text-slate-400 italic">Email body will appear here...</span>}
                    </div>
                  </div>

                  {/* Participant info badge */}
                  {previewContact && (
                    <div className="mt-4 flex items-center gap-3 p-3 rounded-lg bg-primary-50/50 border border-primary-100">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-[10px] font-bold">
                          {previewContact.firstName[0]}{previewContact.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-700">{previewContact.fullName}</p>
                        <p className="text-[10px] text-slate-400">
                          {previewContact.title} · ${previewContact.salary.toLocaleString()} salary · ${previewContact.planBalance.toLocaleString()} balance
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
