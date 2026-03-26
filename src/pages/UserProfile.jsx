import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail,
  Clock,
  MessageSquare,
  Settings,
  CheckCircle2,
  Link as LinkIcon,
  X,
  Search,
  Shield,
  Save,
  Sparkles,
  FileText,
} from 'lucide-react'
import { DUMMY_TEMPLATES } from '../lib/templateData'

/* ─── Animation Variants ─────────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.075, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const EMAIL_PROVIDERS = [
  'Google Workspace',
  'Microsoft 365',
  'SendGrid',
  'Amazon SES',
  'Custom SMTP',
]

const TABS = [
  { key: 'settings', label: 'User Settings', icon: Settings },
  { key: 'templates', label: 'Data Import Email Templates', icon: FileText },
]

/* ─── Premium Toggle ─────────────────────────────────────────────────────── */
function Toggle({ enabled, onChange }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 cursor-pointer shrink-0 ${
        enabled
          ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-sm shadow-emerald-500/25'
          : 'bg-slate-200 dark:bg-slate-700'
      }`}
    >
      <motion.span
        className="inline-block h-5 w-5 rounded-full bg-white shadow-sm"
        animate={{ x: enabled ? 24 : 4 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </button>
  )
}

/* ─── Section Wrapper ────────────────────────────────────────────────────── */
function Section({ icon: Icon, gradient, hoverGradient, glowColor, title, description, children }) {
  return (
    <motion.section className="space-y-5" variants={fadeUp}>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-sm`}>
          <Icon size={18} strokeWidth={1.75} className="text-white" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">{title}</h3>
          {description && <p className="text-sm text-slate-400 dark:text-slate-500">{description}</p>}
        </div>
      </div>

      <div className={`group relative rounded-2xl p-[1px] bg-gradient-to-br from-slate-200/80 via-slate-100/50 to-slate-200/80 dark:from-slate-700/80 dark:via-slate-800/50 dark:to-slate-700/80 ${hoverGradient} transition-all duration-300`}>
        <div className="relative bg-white dark:bg-slate-900 rounded-[15px] p-6 overflow-hidden">
          <div className={`absolute top-0 right-0 w-32 h-32 ${glowColor} rounded-full blur-2xl -translate-y-1/2 translate-x-1/3`} />
          <div className="relative">
            {children}
          </div>
        </div>
      </div>
    </motion.section>
  )
}

/* ─── Trigger → Template Mappings ────────────────────────────────────────── */
const TRIGGER_TEMPLATE_MAPPINGS = [
  { key: 'newHire', label: 'New Hire Trigger', defaultTemplate: 'Default Trigger Email - Rehire' },
  { key: 'termination', label: 'Termination Trigger', defaultTemplate: '' },
  { key: 'rehire', label: 'Rehire Trigger', defaultTemplate: 'Default Trigger Email - Rehire' },
  { key: 'age50', label: 'Age 50 Trigger', defaultTemplate: 'Default Trigger Email - Age 50 Catch-Up' },
  { key: 'age55', label: 'Age 55 Trigger', defaultTemplate: 'Default Trigger Email - Ten Years Out from Retirement' },
  { key: 'age60', label: 'Age 60 Trigger', defaultTemplate: 'Default Trigger Email - Five Years Out from Retirement' },
  { key: 'age62', label: 'Age 62 Trigger', defaultTemplate: '' },
  { key: 'age64', label: 'Age 64 Trigger', defaultTemplate: 'Default Trigger Email - One Year Out from Retirement' },
  { key: 'age65', label: 'Age 65 Trigger', defaultTemplate: 'Default Trigger Email - Retirement Age (65)' },
]

function TemplateSearchSelect({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  const filtered = DUMMY_TEMPLATES.filter((t) =>
    query === '' || t.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="relative flex-1">
      <div
        onClick={() => setOpen(!open)}
        className={`flex items-center justify-between w-full px-4 py-2.5 bg-white dark:bg-slate-900 border rounded-xl text-sm cursor-pointer transition-all ${
          open
            ? 'border-primary-300 dark:border-primary-500/40 ring-2 ring-primary-500/20'
            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
        }`}
      >
        <span className={value ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-400 dark:text-slate-500'}>
          {value || 'Select a template...'}
        </span>
        {value && (
          <button
            onClick={(e) => { e.stopPropagation(); onChange(''); setOpen(false) }}
            className="p-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {open && (
        <div className="absolute z-20 top-full mt-1 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden">
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
                  onClick={() => { onChange(t.name); setOpen(false); setQuery('') }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer border-b border-slate-50 dark:border-slate-800 last:border-0 ${
                    value === t.name
                      ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400 font-medium'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {t.name}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Templates Tab ──────────────────────────────────────────────────────── */
function TemplatesTab() {
  const [mappings, setMappings] = useState(() => {
    const initial = {}
    TRIGGER_TEMPLATE_MAPPINGS.forEach((m) => {
      initial[m.key] = m.defaultTemplate
    })
    return initial
  })
  const [saved, setSaved] = useState(false)

  function updateMapping(key, value) {
    setMappings((prev) => ({ ...prev, [key]: value }))
  }

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <motion.div variants={fadeUp}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center shadow-sm">
            <Mail size={20} strokeWidth={1.75} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Data Import Email Templates</h2>
        </div>
        <p className="text-sm text-slate-400 dark:text-slate-500 ml-[52px]">
          Map each trigger type to an email template. When imported data matches a trigger, the assigned template will be used.
        </p>
      </motion.div>

      <motion.div
        className="group relative rounded-2xl p-[1px] bg-gradient-to-br from-slate-200/80 via-slate-100/50 to-slate-200/80 dark:from-slate-700/80 dark:via-slate-800/50 dark:to-slate-700/80 hover:from-blue-300/60 hover:via-blue-200/30 hover:to-blue-300/60 transition-all duration-300"
        variants={fadeUp}
      >
        <div className="relative bg-white dark:bg-slate-900 rounded-[15px] p-6 space-y-5 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/40 dark:bg-blue-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3" />
          <div className="relative space-y-5">
            {TRIGGER_TEMPLATE_MAPPINGS.map((trigger, idx) => (
              <motion.div
                key={trigger.key}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.15 + idx * 0.04 }}
              >
                <label className="block text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                  {trigger.label}
                </label>
                <TemplateSearchSelect
                  value={mappings[trigger.key]}
                  onChange={(val) => updateMapping(trigger.key, val)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="flex justify-end pt-2">
        <motion.button
          onClick={handleSave}
          className={`inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 cursor-pointer ${
            saved
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
              : 'bg-gradient-to-r from-primary-500 to-primary-400 text-white shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30'
          }`}
          whileHover={{ y: -1, transition: { duration: 0.15 } }}
          whileTap={{ scale: 0.97 }}
        >
          <AnimatePresence mode="wait">
            {saved ? (
              <motion.span key="saved" className="inline-flex items-center gap-2" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                <CheckCircle2 size={16} /> Saved!
              </motion.span>
            ) : (
              <motion.span key="save" className="inline-flex items-center gap-2" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                <Save size={16} /> Save Templates
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   Main UserProfile Page
   ═══════════════════════════════════════════════════════════════════════════ */
export default function UserProfile() {
  const [activeTab, setActiveTab] = useState('settings')
  const [provider, setProvider] = useState('Google Workspace')
  const [authenticated, setAuthenticated] = useState(true)
  const [deliveryDays, setDeliveryDays] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])
  const [signature, setSignature] = useState('')
  const [calendarLink, setCalendarLink] = useState('')
  const [dailyTrigger, setDailyTrigger] = useState(true)
  const [promoUpdates, setPromoUpdates] = useState(false)
  const [weeklyDigest, setWeeklyDigest] = useState(true)
  const [saved, setSaved] = useState(false)

  function toggleDay(day) {
    setDeliveryDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    )
  }

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="p-8 mx-auto space-y-8">

      {/* ═══ Hero Header ═══ */}
      <motion.div
        className="relative overflow-hidden rounded-2xl p-8 border border-transparent dark:border-slate-800 dark:bg-slate-900"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-purple-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary-400/10 dark:bg-primary-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-400/10 dark:bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

        <div className="relative flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-400 flex items-center justify-center shadow-lg shadow-primary-500/20">
            <span className="text-xl font-bold text-white">CA</span>
          </div>
          <div>
            <motion.h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white" variants={fadeUp} custom={0}>
              <span className="bg-gradient-to-r from-primary-600 to-primary-400 dark:from-primary-400 dark:to-primary-300 bg-clip-text text-transparent">Cameron Abernethy</span>
            </motion.h2>
            <motion.p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5" variants={fadeUp} custom={1}>
              Manage your account settings, email configuration, and preferences
            </motion.p>
          </div>

          <motion.div className="ml-auto flex items-center gap-2" variants={fadeUp} custom={2}>
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/80 dark:border-slate-700/80 shadow-sm">
              <div className="w-6 h-6 rounded-md bg-emerald-50 dark:bg-emerald-500/15 flex items-center justify-center">
                <Shield size={12} className="text-emerald-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Connected</p>
                <p className="text-[10px] text-slate-400">email auth</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/80 dark:border-slate-700/80 shadow-sm">
              <div className="w-6 h-6 rounded-md bg-primary-50 dark:bg-primary-500/15 flex items-center justify-center">
                <Clock size={12} className="text-primary-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{deliveryDays.length} days</p>
                <p className="text-[10px] text-slate-400">delivery</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ═══ Tabs ═══ */}
      <div className="border-b border-slate-200 dark:border-slate-700">
        <div className="flex gap-0">
          {TABS.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative inline-flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                  activeTab === tab.key
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                <Icon size={15} />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* ═══ Tab Content ═══ */}
      <AnimatePresence mode="wait">
        {activeTab === 'settings' && (
          <motion.div
            key="settings"
            className="space-y-8"
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
            variants={staggerContainer}
          >
            {/* ── Email Configuration ──────────────────────────────── */}
            <Section
              icon={Mail}
              gradient="from-primary-500 to-primary-400"
              hoverGradient="hover:from-primary-300/60 hover:via-primary-200/30 hover:to-primary-300/60"
              glowColor="bg-primary-50/40 dark:bg-primary-500/5"
              title="Email Configuration"
              description="Connect your email provider to send emails on your behalf"
            >
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">Email Provider</label>
                  <select
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 cursor-pointer appearance-none pr-10 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_12px_center] bg-no-repeat"
                  >
                    {EMAIL_PROVIDERS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <AnimatePresence mode="wait">
                    {authenticated ? (
                      <motion.div
                        key="auth"
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/15"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                      >
                        <CheckCircle2 size={16} strokeWidth={2} className="text-emerald-500" />
                        <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Authenticated</span>
                      </motion.div>
                    ) : (
                      <motion.span
                        key="unauth"
                        className="text-sm text-slate-400 dark:text-slate-500"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        Not authenticated
                      </motion.span>
                    )}
                  </AnimatePresence>
                  <button
                    onClick={() => setAuthenticated(!authenticated)}
                    className="px-4 py-1.5 bg-primary-500 dark:bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-colors cursor-pointer"
                  >
                    {authenticated ? 'Re-authenticate' : 'Authenticate'}
                  </button>
                </div>

                <p className="text-xs text-slate-400 dark:text-slate-500">
                  When authenticated, Viserly will send emails directly through your email provider on your behalf, maintaining your sender identity.
                </p>
              </div>
            </Section>

            {/* ── Delivery Limits ───────────────────────────────────── */}
            <Section
              icon={Clock}
              gradient="from-blue-500 to-blue-400"
              hoverGradient="hover:from-blue-300/60 hover:via-blue-200/30 hover:to-blue-300/60"
              glowColor="bg-blue-50/40 dark:bg-blue-500/5"
              title="Delivery Limits"
              description="Control when your automated emails are sent"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
                  Delivery Days
                </label>
                <div className="flex items-center gap-2">
                  {DAYS.map((day) => {
                    const active = deliveryDays.includes(day)
                    return (
                      <motion.button
                        key={day}
                        onClick={() => toggleDay(day)}
                        className={`relative px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                          active
                            ? 'bg-gradient-to-br from-primary-500 to-primary-400 dark:from-primary-600 dark:to-primary-500 text-white shadow-md shadow-primary-500/20'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-300'
                        }`}
                        whileHover={{ y: -1, transition: { duration: 0.15 } }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {day}
                      </motion.button>
                    )
                  })}
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-3">
                  {deliveryDays.length} of 7 days selected
                </p>
              </div>
            </Section>

            {/* ── Email Personalization ─────────────────────────────── */}
            <Section
              icon={MessageSquare}
              gradient="from-purple-500 to-purple-400"
              hoverGradient="hover:from-purple-300/60 hover:via-purple-200/30 hover:to-purple-300/60"
              glowColor="bg-purple-50/40 dark:bg-purple-500/5"
              title="Email Personalization"
              description="Customize your email presentation and contact options"
            >
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">Email Signature</label>
                  <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden transition-all focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-300">
                    <div className="flex items-center gap-0.5 px-3 py-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                      {['B', 'I', 'U', 'S'].map((label) => (
                        <button
                          key={label}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold text-slate-400 dark:text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
                        >
                          {label}
                        </button>
                      ))}
                      <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1" />
                      <select className="text-xs text-slate-500 dark:text-slate-400 bg-transparent border-none focus:outline-none cursor-pointer px-2 py-1">
                        <option>8px</option><option>10px</option><option>12px</option><option>14px</option><option>16px</option>
                      </select>
                      <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1" />
                      <select className="text-xs text-slate-500 dark:text-slate-400 bg-transparent border-none focus:outline-none cursor-pointer px-2 py-1">
                        <option>Arial</option><option>Inter</option><option>Georgia</option><option>Verdana</option>
                      </select>
                    </div>
                    <textarea
                      value={signature}
                      onChange={(e) => setSignature(e.target.value)}
                      placeholder="Write Something..."
                      rows={5}
                      className="w-full px-4 py-3 text-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none resize-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">
                    Calendar Booking Link
                  </label>
                  <div className="relative">
                    <LinkIcon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="url"
                      value={calendarLink}
                      onChange={(e) => setCalendarLink(e.target.value)}
                      placeholder="https://calendly.com/your-link"
                      className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 dark:focus:border-primary-500 transition-all"
                    />
                  </div>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">
                    Enter the full booking URL (including "http://" or "https://") of your calendar page so it's ready to drop into your email templates.
                  </p>
                </div>
              </div>
            </Section>

            {/* ── Communication Preferences ─────────────────────────── */}
            <Section
              icon={Sparkles}
              gradient="from-amber-500 to-amber-400"
              hoverGradient="hover:from-amber-300/60 hover:via-amber-200/30 hover:to-amber-300/60"
              glowColor="bg-amber-50/40 dark:bg-amber-500/5"
              title="Communication Preferences"
              description="Control what notifications you receive from Viserly"
            >
              <div className="divide-y divide-slate-100 dark:divide-slate-800 -mx-6 -mb-6">
                {[
                  {
                    title: 'Daily Trigger Overview',
                    desc: 'Receive an overview of trigger based communication for review prior to communications being sent out - on the day of delivery.',
                    enabled: dailyTrigger,
                    onChange: setDailyTrigger,
                  },
                  {
                    title: 'Promotions and Informational Updates',
                    desc: 'Receive general updates from Viserly about new products and enhancements to our functionalities.',
                    enabled: promoUpdates,
                    onChange: setPromoUpdates,
                  },
                  {
                    title: 'Weekly Data Digest',
                    desc: 'Receive weekly communications giving a detailed overview of important changes to your linked payroll data.',
                    enabled: weeklyDigest,
                    onChange: setWeeklyDigest,
                  },
                ].map((pref, idx) => (
                  <motion.div
                    key={pref.title}
                    className="flex items-center justify-between px-6 py-5 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: 0.4 + idx * 0.08 }}
                  >
                    <div className="pr-6">
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{pref.title}</h4>
                      <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">{pref.desc}</p>
                    </div>
                    <Toggle enabled={pref.enabled} onChange={pref.onChange} />
                  </motion.div>
                ))}
              </div>
            </Section>

            {/* ── Save Button ─────────────────────────────────────── */}
            <motion.div className="flex justify-end pt-2" variants={fadeUp}>
              <motion.button
                onClick={handleSave}
                className={`inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 cursor-pointer ${
                  saved
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                    : 'bg-gradient-to-r from-primary-500 to-primary-400 text-white shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30'
                }`}
                whileHover={{ y: -1, transition: { duration: 0.15 } }}
                whileTap={{ scale: 0.97 }}
              >
                <AnimatePresence mode="wait">
                  {saved ? (
                    <motion.span key="saved" className="inline-flex items-center gap-2" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                      <CheckCircle2 size={16} /> Saved!
                    </motion.span>
                  ) : (
                    <motion.span key="save" className="inline-flex items-center gap-2" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                      <Save size={16} /> Save Settings
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {activeTab === 'templates' && (
          <TemplatesTab />
        )}
      </AnimatePresence>
    </div>
  )
}
