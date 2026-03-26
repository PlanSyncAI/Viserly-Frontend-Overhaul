import { useState } from 'react'
import {
  Mail,
  Clock,
  MessageSquare,
  Settings,
  CheckCircle2,
  Link as LinkIcon,
} from 'lucide-react'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const EMAIL_PROVIDERS = [
  'Google Workspace',
  'Microsoft 365',
  'SendGrid',
  'Amazon SES',
  'Custom SMTP',
]

const tabs = [
  { key: 'settings', label: 'User Settings' },
  { key: 'templates', label: 'Data Import Email Templates' },
]

function Toggle({ enabled, onChange }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
        enabled ? 'bg-emerald-500' : 'bg-slate-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )
}

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

  function toggleDay(day) {
    setDeliveryDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    )
  }

  return (
    <div className="p-8 max-w-[900px] mx-auto space-y-6">
      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-700">
        <div className="flex gap-0">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                activeTab === tab.key
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'settings' && (
        <div className="space-y-8">
          {/* Page header */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white dark:text-white tracking-tight">User Settings</h2>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
              Configure your email sending preferences and account details
            </p>
          </div>

          {/* ── Email Configuration ──────────────────────────────── */}
          <section className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center">
                <Mail size={16} className="text-primary-500" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">Email Configuration</h3>
                <p className="text-sm text-slate-400 dark:text-slate-500">Connect your email provider to send emails on your behalf</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 p-6 space-y-5">
              {/* Provider dropdown */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">Email Provider</label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 cursor-pointer appearance-none pr-10 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_12px_center] bg-no-repeat"
                >
                  {EMAIL_PROVIDERS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              {/* Auth status */}
              <div className="flex items-center gap-3">
                {authenticated ? (
                  <div className="flex items-center gap-2 text-emerald-600">
                    <CheckCircle2 size={18} strokeWidth={2} />
                    <span className="text-sm font-medium">Authenticated</span>
                  </div>
                ) : (
                  <span className="text-sm text-slate-400 dark:text-slate-500">Not authenticated</span>
                )}
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
          </section>

          {/* ── Delivery Limits ───────────────────────────────────── */}
          <section className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <Clock size={16} className="text-blue-500" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">Delivery Limits</h3>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 p-6">
              <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
                Delivery Days
              </label>
              <div className="flex items-center gap-2">
                {DAYS.map((day) => {
                  const active = deliveryDays.includes(day)
                  return (
                    <button
                      key={day}
                      onClick={() => toggleDay(day)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                        active
                          ? 'bg-primary-500 dark:bg-primary-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600'
                      }`}
                    >
                      {day}
                    </button>
                  )
                })}
              </div>
            </div>
          </section>

          {/* ── Email Personalization ─────────────────────────────── */}
          <section className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                <MessageSquare size={16} className="text-purple-500" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">Email Personalization</h3>
                <p className="text-sm text-slate-400 dark:text-slate-500">Customize your email presentation and contact options</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 p-6 space-y-5">
              {/* Signature */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">Email Signature</label>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  {/* Toolbar */}
                  <div className="flex items-center gap-0.5 px-3 py-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                    {['B', 'I', 'U', 'S'].map((btn) => (
                      <button
                        key={btn}
                        className="w-8 h-8 flex items-center justify-center rounded text-sm font-bold text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors cursor-pointer"
                      >
                        {btn}
                      </button>
                    ))}
                    <div className="w-px h-5 bg-slate-200 mx-1" />
                    <select className="text-xs text-slate-500 bg-transparent border-none focus:outline-none cursor-pointer px-2 py-1">
                      <option>8px</option>
                      <option>10px</option>
                      <option>12px</option>
                      <option>14px</option>
                      <option>16px</option>
                    </select>
                    <div className="w-px h-5 bg-slate-200 mx-1" />
                    <select className="text-xs text-slate-500 bg-transparent border-none focus:outline-none cursor-pointer px-2 py-1">
                      <option>Arial</option>
                      <option>Inter</option>
                      <option>Georgia</option>
                      <option>Verdana</option>
                    </select>
                  </div>
                  <textarea
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                    placeholder="Write Something..."
                    rows={5}
                    className="w-full px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* Calendar Booking Link */}
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
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1.5">
                  Enter the full booking URL (including "http://" or "https://") of your calendar page so it's ready to drop into your email templates.
                </p>
              </div>
            </div>
          </section>

          {/* ── Communication Preferences ─────────────────────────── */}
          <section className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                <Settings size={16} className="text-amber-500" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">Communication Preferences</h3>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 divide-y divide-slate-100">
              {/* Daily Trigger */}
              <div className="flex items-center justify-between p-5">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Daily Trigger Overview</h4>
                  <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">
                    Receive an overview of trigger based communication for review prior to communications being sent out - on the day of delivery.
                  </p>
                </div>
                <Toggle enabled={dailyTrigger} onChange={setDailyTrigger} />
              </div>

              {/* Promo Updates */}
              <div className="flex items-center justify-between p-5">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Promotions and Informational Updates</h4>
                  <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">
                    Receive general updates from Viserly about new products and enhancements to our functionalities.
                  </p>
                </div>
                <Toggle enabled={promoUpdates} onChange={setPromoUpdates} />
              </div>

              {/* Weekly Digest */}
              <div className="flex items-center justify-between p-5">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Weekly Data Digest</h4>
                  <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">
                    Receive weekly communications giving a detailed overview of important changes to your linked payroll data.
                  </p>
                </div>
                <Toggle enabled={weeklyDigest} onChange={setWeeklyDigest} />
              </div>
            </div>
          </section>

          {/* Save */}
          <div className="flex justify-end pt-2">
            <button className="px-6 py-2.5 bg-primary-500 dark:bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-colors cursor-pointer">
              Save Settings
            </button>
          </div>
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white dark:text-white tracking-tight">Data Import Email Templates</h2>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
              Configure email templates used when importing participant data.
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 p-12 text-center">
            <p className="text-sm text-slate-400 dark:text-slate-500">No import email templates configured yet.</p>
          </div>
        </div>
      )}
    </div>
  )
}
