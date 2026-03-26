import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Pencil,
  Send,
  Plus,
  X,
  Check,
} from 'lucide-react'
import { DUMMY_TEMPLATES, MERGE_FIELDS, SAMPLE_MERGE_VALUES } from '../lib/templateData'

export default function TemplateDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const template = DUMMY_TEMPLATES.find((t) => t.id === Number(id))

  const [copiedField, setCopiedField] = useState(null)
  const [showPreview, setShowPreview] = useState(false)

  if (!template) {
    return (
      <div className="p-8 max-w-[1400px] mx-auto">
        <button
          onClick={() => navigate('/templates')}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 transition-colors cursor-pointer mb-6"
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
      // Fallback for non-HTTPS
      setCopiedField(fieldKey)
      setTimeout(() => setCopiedField(null), 1500)
    }
  }

  function getPreviewBody() {
    let text = template.body
    // Replace all merge fields with sample values
    text = text.replace(/\*\[\[([^\]]+)\]\]\*/g, (match, fieldKey) => {
      return SAMPLE_MERGE_VALUES[fieldKey] || match
    })
    return text
  }

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate('/templates')}
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
      >
        <ArrowLeft size={16} />
        Back to Templates
      </button>

      <div className="flex gap-8 items-start">
        {/* Left column */}
        <div className="flex-1 space-y-6 min-w-0">
          {/* Default template banner */}
          {template.isDefault && (
            <div className="bg-primary-500 dark:bg-primary-600 text-white rounded-xl p-5">
              <h3 className="text-lg font-bold mb-1">Default Template!</h3>
              <p className="text-sm text-white/90">
                To make changes, please create a new email template. You can copy the content from this template and paste it into your new one to get started quickly.
              </p>
            </div>
          )}

          {/* Template fields */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 p-6 space-y-6">
            {/* Name + Subject row */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Email Template Name
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-700 dark:text-slate-200">{template.name}</span>
                  {!template.isDefault && (
                    <button className="p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                      <Pencil size={14} />
                    </button>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Email Template Subject
                </label>
                <span className="text-sm text-slate-700 dark:text-slate-200">{template.subject}</span>
              </div>
            </div>

            <div className="border-t border-slate-100" />

            {/* Body */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Email Template Body
              </label>
              <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed min-h-[200px]">
                {template.body}
              </div>
            </div>

            <div className="border-t border-slate-100" />

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Created By
                </label>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {template.createdBy}, {new Date(template.createdDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}, {template.createdTime}
                </p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Last Modified By
                </label>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {template.lastModifiedBy}, {new Date(template.lastModifiedDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}, {template.lastModifiedTime}
                </p>
              </div>
            </div>
          </div>

          {/* Delete warning for default templates */}
          {template.isDefault && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600 font-medium">
                You are not able to delete this Email Template. Please contact{' '}
                <a href="mailto:support@viserly.com" className="underline hover:text-red-700">support@viserly.com</a>{' '}
                for assistance.
              </p>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="w-72 flex-shrink-0 space-y-4">
          {/* Action buttons */}
          <button
            onClick={() => setShowPreview(true)}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-500 dark:bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-colors cursor-pointer"
          >
            <Send size={16} />
            Demo Email and Verify Merge Fields
          </button>

          <button
            onClick={() => navigate('/templates/new')}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-500 dark:bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-colors cursor-pointer"
          >
            <Plus size={16} />
            Create New Template
          </button>

          {/* Merge fields */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 p-5 space-y-5">
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-1">Enhance Your Email Template with...</h4>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Click on a tile below to copy the merge field into your clipboard. Then, paste it into your email template where you would like the customer's data to appear.
              </p>
            </div>

            {/* Account fields */}
            <div>
              <h5 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Account</h5>
              <div className="flex flex-wrap gap-1.5">
                {MERGE_FIELDS.ACCOUNT.map((field) => (
                  <button
                    key={field.key}
                    onClick={() => handleCopyField(field.key)}
                    className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs transition-colors cursor-pointer ${
                      copiedField === field.key
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-slate-100 text-slate-600 hover:bg-primary-50 hover:text-primary-600'
                    }`}
                  >
                    {copiedField === field.key ? (
                      <><Check size={12} className="mr-1" />Copied</>
                    ) : (
                      field.label
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact fields */}
            <div>
              <h5 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Contact</h5>
              <div className="flex flex-wrap gap-1.5">
                {MERGE_FIELDS.CONTACT.map((field) => (
                  <button
                    key={field.key}
                    onClick={() => handleCopyField(field.key)}
                    className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs transition-colors cursor-pointer ${
                      copiedField === field.key
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-slate-100 text-slate-600 hover:bg-primary-50 hover:text-primary-600'
                    }`}
                  >
                    {copiedField === field.key ? (
                      <><Check size={12} className="mr-1" />Copied</>
                    ) : (
                      field.label
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-8">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Email Preview</h3>
                <p className="text-xs text-slate-400 mt-0.5">Merge fields replaced with sample data</p>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            <div className="px-6 py-4 overflow-y-auto flex-1">
              <div className="mb-4">
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Subject</p>
                <p className="text-sm text-slate-700 font-medium">
                  {template.subject.replace(/\*\[\[([^\]]+)\]\]\*/g, (match, fieldKey) => SAMPLE_MERGE_VALUES[fieldKey] || match)}
                </p>
              </div>
              <div className="border-t border-slate-100 pt-4">
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Body</p>
                <div className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {getPreviewBody()}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 bg-primary-500 dark:bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-colors cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
