import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Upload,
  Database,
  FileSpreadsheet,
  Zap,
  Link2,
  Download,
  X,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react'
import contactTemplateCsv from '../templates/ContactTemplate.csv?url'
import accountTemplateCsv from '../templates/AccountTemplate.csv?url'

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

const MATCHING_RULES = [
  'Account Name + Employee ID',
  'Account Name + Email',
  'Account Name + Personal Email',
  'Account Name + Last Name + Date of Birth',
]

const INFO_CARDS = [
  {
    icon: Link2,
    title: 'Matching Logic',
    color: 'primary',
    content: (
      <div>
        <ul className="space-y-1 mb-3">
          {MATCHING_RULES.map((rule) => (
            <li key={rule} className="text-sm text-slate-600 dark:text-slate-300 font-medium">{rule}</li>
          ))}
        </ul>
        <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
          If any rule finds exactly one matching record, the contact is updated. If no match is found, a new contact is created. If more than one match is found, the contact is flagged as a duplicate.
        </p>
      </div>
    ),
  },
  {
    icon: FileSpreadsheet,
    title: 'CSV Templates',
    color: 'blue',
    content: (
      <div>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
          Download a pre-built template and fill in your data before uploading.
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">
          *These templates contain the exact headers the system reads to import the data.
        </p>
        <div className="space-y-2">
          <a href={contactTemplateCsv} download="ContactTemplate.csv" className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors cursor-pointer">
            <Download size={14} />
            Download Contact Template
          </a>
          <a href={accountTemplateCsv} download="AccountTemplate.csv" className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors cursor-pointer block">
            <Download size={14} />
            Download Account Template
          </a>
        </div>
      </div>
    ),
  },
  {
    icon: Zap,
    title: 'Triggered Communications',
    color: 'amber',
    content: (
      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        If your imported data meets any configured trigger criteria within the last 30 days, the system will flag those records. You can then review and schedule the resulting communications after the import completes. Optional salary and balance thresholds can be applied to further filter and target communications.
      </p>
    ),
  },
]

export default function ImportData() {
  const [importType, setImportType] = useState('contacts')
  const [file, setFile] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [importing, setImporting] = useState(false)
  const [importComplete, setImportComplete] = useState(false)
  const fileInputRef = useRef(null)

  function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped && dropped.name.endsWith('.csv')) {
      setFile(dropped)
    }
  }

  function handleFileSelect(e) {
    const selected = e.target.files[0]
    if (selected) setFile(selected)
  }

  function handleStartImport() {
    if (!file) return
    setImporting(true)
    setTimeout(() => {
      setImporting(false)
      setImportComplete(true)
    }, 2000)
  }

  function handleReset() {
    setFile(null)
    setImporting(false)
    setImportComplete(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const infoCardColors = {
    primary: {
      bg: 'bg-primary-50 dark:bg-primary-500/15',
      icon: 'text-primary-500',
      badge: 'bg-primary-100 dark:bg-primary-500/20 text-primary-700 dark:text-primary-300',
    },
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-500/15',
      icon: 'text-blue-500',
      badge: 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300',
    },
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-500/15',
      icon: 'text-amber-500',
      badge: 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300',
    },
  }

  return (
    <motion.div
      className="p-8 mx-auto space-y-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* ── Hero Header ──────────────────────────────────────────── */}
      <motion.div
        variants={fadeUp}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-50 via-white to-purple-50/40 dark:from-primary-500/5 dark:via-slate-900 dark:to-purple-500/5 border border-slate-200/60 dark:border-slate-800 px-8 py-8"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,91,255,0.06),transparent_50%)]" />
        <div className="relative text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-500/20 text-primary-700 dark:text-primary-300 text-xs font-semibold mb-4">
            <Zap size={12} />
            Smart Data Processing
          </div>
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center">
              <Database size={24} className="text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">Data Import Center</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Upload CSV files and trigger automated communications. Your data is matched and upserted using smart logic.
          </p>
        </div>
      </motion.div>

      {/* ── How Data Imports Work ─────────────────────────────────── */}
      <motion.div
        variants={fadeUp}
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-6"
      >
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">How Data Imports Work</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          Upload your CSV and Viserly will automatically upsert your data using smart matching logic.
        </p>

        <div className="grid grid-cols-3 gap-5">
          {INFO_CARDS.map((card) => {
            const colors = infoCardColors[card.color]
            const Icon = card.icon
            return (
              <div
                key={card.title}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 p-5 space-y-3"
              >
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider ${colors.badge}`}>
                  {card.title}
                </span>
                <div>{card.content}</div>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* ── Upload Section ────────────────────────────────────────── */}
      <motion.div
        variants={fadeUp}
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-6"
      >
        {/* Import type toggle + step header */}
        <div className="flex items-center gap-6 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Importing</span>
            <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
              <button
                onClick={() => setImportType('contacts')}
                className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                  importType === 'contacts'
                    ? 'bg-primary-500 dark:bg-primary-600 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                Contacts
              </button>
              <button
                onClick={() => setImportType('accounts')}
                className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                  importType === 'accounts'
                    ? 'bg-primary-500 dark:bg-primary-600 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                Accounts
              </button>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary-500 dark:bg-primary-600 text-white text-xs font-bold flex items-center justify-center">1</div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Upload your data</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500">Drop a CSV file or browse from your computer.</p>
              </div>
            </div>
          </div>

          <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            CSV only &middot; Max 10 MB
          </span>
        </div>

        {/* Import complete state */}
        {importComplete ? (
          <div className="text-center py-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              <CheckCircle2 size={48} className="mx-auto mb-4 text-emerald-500" />
            </motion.div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Import Complete!</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
              Your {importType} data has been processed. Records have been matched, created, or flagged based on the matching logic.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-500 dark:bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-colors cursor-pointer"
              >
                <Upload size={16} />
                Import More Data
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer ${
                dragOver
                  ? 'border-primary-400 dark:border-primary-500 bg-primary-50/50 dark:bg-primary-500/5'
                  : file
                    ? 'border-emerald-300 dark:border-emerald-500/40 bg-emerald-50/30 dark:bg-emerald-500/5'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 hover:border-primary-300 dark:hover:border-primary-500/40 hover:bg-primary-50/20 dark:hover:bg-primary-500/5'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
              />

              {file ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-500/15 flex items-center justify-center">
                    <FileText size={20} className="text-emerald-500" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{file.name}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      {(file.size / 1024).toFixed(1)} KB &middot; Ready to import
                    </p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleReset() }}
                    className="ml-2 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <Upload size={28} className="mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    Drag & drop your CSV here
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    or <span className="text-primary-500 hover:text-primary-600 font-medium">click to browse</span>
                  </p>
                </>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3 mt-5">
              <button
                onClick={handleStartImport}
                disabled={!file || importing}
                className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                  file && !importing
                    ? 'bg-primary-500 dark:bg-primary-600 text-white hover:bg-primary-600'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                }`}
              >
                {importing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload size={16} />
                    Start Import
                  </>
                )}
              </button>
              <button
                onClick={handleReset}
                disabled={!file}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Reset
              </button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  )
}
