import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Send,
  UserPlus,
  History,
  Phone,
  Mail,
  DollarSign,
  Landmark,
  Target,
  Briefcase,
  Calendar,
  MapPin,
  Heart,
  Shield,
  Clock,
  Eye,
  MousePointerClick,
  User,
} from 'lucide-react'
import { useContacts } from '../lib/useContacts'
import { getCommsForContact, getCommStats } from '../lib/communicationData'
import CommHistoryTable from '../components/ui/CommHistoryTable'
import AnimatedCounter from '../components/ui/AnimatedCounter'
import MiniProgressRing from '../components/ui/MiniProgressRing'

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

function Field({ label, value, icon }) {
  const Icon = icon
  return (
    <div className="py-3 px-4 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
      <div className="flex items-center gap-1.5 mb-0.5">
        {Icon && <Icon size={11} className="text-slate-300 dark:text-slate-600" />}
        <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{label}</p>
      </div>
      <p className="text-sm text-slate-900 dark:text-white font-medium">{value || 'N/A'}</p>
    </div>
  )
}

const tabs = [
  { key: 'contact', label: 'Contact Information' },
  { key: 'comms', label: 'Communication Histories' },
  { key: 'scheduled', label: 'Scheduled Communications' },
]

function CommHistoryTab({ contactId }) {
  const records = getCommsForContact(contactId)
  const stats = getCommStats(records)

  const statCards = [
    { label: 'Total Sent', value: stats.sent, icon: Send, color: 'blue', bg: 'bg-blue-50 dark:bg-blue-500/15', iconColor: 'text-blue-500' },
    { label: 'Delivered', value: stats.delivered, icon: Mail, color: 'emerald', bg: 'bg-emerald-50 dark:bg-emerald-500/15', iconColor: 'text-emerald-500' },
    { label: 'Opened', value: stats.opened, icon: Eye, color: 'purple', bg: 'bg-purple-50 dark:bg-purple-500/15', iconColor: 'text-purple-500' },
    { label: 'Clicked', value: stats.clicked, icon: MousePointerClick, color: 'indigo', bg: 'bg-indigo-50 dark:bg-indigo-500/15', iconColor: 'text-indigo-500' },
    { label: 'Open Rate', value: stats.openRate, suffix: '%', icon: Eye, color: 'amber', bg: 'bg-amber-50 dark:bg-amber-500/15', iconColor: 'text-amber-500' },
  ]

  return (
    <div className="space-y-4">
      <motion.div variants={fadeUp} className="grid grid-cols-5 gap-3">
        {statCards.map((s) => {
          const Icon = s.icon
          return (
            <motion.div
              key={s.label}
              whileHover={{ y: -2, boxShadow: '0 8px 25px -5px rgba(0,0,0,0.08)' }}
              className="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-5 text-left overflow-hidden"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                  <Icon size={18} className={s.iconColor} />
                </div>
                {s.label === 'Open Rate' && <MiniProgressRing value={parseFloat(s.value)} color="#F59E0B" size={36} />}
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight tabular-nums">
                <AnimatedCounter value={parseFloat(s.value)} />{s.suffix || ''}
              </p>
              <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-1">{s.label}</p>
            </motion.div>
          )
        })}
      </motion.div>
      <CommHistoryTable records={records} showContact={false} />
    </div>
  )
}

export default function ParticipantDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { contacts, loading } = useContacts()
  const [activeTab, setActiveTab] = useState('contact')

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-64">
        <span className="text-sm text-slate-400 dark:text-slate-500">Loading...</span>
      </div>
    )
  }

  const contact = contacts.find((c) => c.id === Number(id))
  if (!contact) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500 dark:text-slate-400">Contact not found.</p>
        <button onClick={() => navigate('/participant-data')} className="mt-4 text-primary-500 text-sm hover:underline cursor-pointer">
          Back to Contacts
        </button>
      </div>
    )
  }

  const initials = `${contact.firstName[0] || ''}${contact.lastName[0] || ''}`.toUpperCase()

  return (
    <motion.div
      className="p-8 max-w-[1400px] mx-auto space-y-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Back button */}
      <motion.button
        variants={fadeUp}
        onClick={() => navigate('/participant-data')}
        className="inline-flex items-center gap-2 text-sm text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
      >
        <ArrowLeft size={16} />
        Back to Contacts
      </motion.button>

      {/* ═══ Hero Profile Header ═══ */}
      <motion.div
        variants={fadeUp}
        className="relative overflow-hidden rounded-2xl border border-transparent dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-blue-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-400/10 dark:bg-primary-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-400/10 dark:bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-purple-400/10 dark:bg-purple-500/8 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

        <div className="relative px-8 py-8">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-5">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary-500/20">
                <span className="text-white text-xl font-bold">{initials}</span>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">
                  Participant Profile
                </p>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {contact.fullName}
                </h2>
                {/* Quick info pills */}
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                    <Phone size={14} className="text-slate-400 dark:text-slate-500" />
                    {contact.phone || 'N/A'}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                    <Mail size={14} className="text-slate-400 dark:text-slate-500" />
                    {contact.email}
                  </div>
                </div>
                {/* Stat pills */}
                <div className="flex items-center gap-2 mt-4">
                  <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/80 dark:border-slate-700/80 shadow-sm">
                    <div className="w-6 h-6 rounded-md bg-emerald-50 dark:bg-emerald-500/15 flex items-center justify-center">
                      <DollarSign size={12} className="text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">${contact.salary.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                      <p className="text-[10px] text-slate-400">salary</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/80 dark:border-slate-700/80 shadow-sm">
                    <div className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-500/15 flex items-center justify-center">
                      <Landmark size={12} className="text-blue-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-blue-700 dark:text-blue-400 tabular-nums">${contact.planBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                      <p className="text-[10px] text-slate-400">plan balance</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/80 dark:border-slate-700/80 shadow-sm">
                    <div className="w-6 h-6 rounded-md bg-primary-50 dark:bg-primary-500/15 flex items-center justify-center">
                      <Briefcase size={12} className="text-primary-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{contact.account || 'N/A'}</p>
                      <p className="text-[10px] text-slate-400">account</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/80 dark:border-slate-700/80 shadow-sm">
                    <div className={`w-6 h-6 rounded-md ${contact.employmentActive ? 'bg-emerald-50 dark:bg-emerald-500/15' : 'bg-slate-100 dark:bg-slate-800'} flex items-center justify-center`}>
                      <User size={12} className={contact.employmentActive ? 'text-emerald-500' : 'text-slate-400'} />
                    </div>
                    <div>
                      <p className={`text-xs font-bold ${contact.employmentActive ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
                        {contact.employmentActive ? 'Active' : 'Inactive'}
                      </p>
                      <p className="text-[10px] text-slate-400">status</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Quick Actions</p>
              <motion.button
                onClick={() => navigate('/templates/new')}
                className="group relative flex items-center gap-3 px-4 py-2.5 bg-white/70 dark:bg-slate-800 backdrop-blur-sm rounded-xl border border-slate-200/60 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600 hover:shadow-lg hover:shadow-slate-200/40 dark:hover:shadow-slate-900/40 transition-all duration-300 text-left cursor-pointer"
                whileHover={{ y: -1, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-400 flex items-center justify-center shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
                  <Send size={14} strokeWidth={1.75} className="text-white" />
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Send Email Now</span>
              </motion.button>
              <motion.button
                onClick={() => navigate('/campaigns/new')}
                className="group relative flex items-center gap-3 px-4 py-2.5 bg-white/70 dark:bg-slate-800 backdrop-blur-sm rounded-xl border border-slate-200/60 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600 hover:shadow-lg hover:shadow-slate-200/40 dark:hover:shadow-slate-900/40 transition-all duration-300 text-left cursor-pointer"
                whileHover={{ y: -1, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
                  <UserPlus size={14} strokeWidth={1.75} className="text-white" />
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Add to Campaign</span>
              </motion.button>
              <motion.button
                onClick={() => setActiveTab('comms')}
                className="group relative flex items-center gap-3 px-4 py-2.5 bg-white/70 dark:bg-slate-800 backdrop-blur-sm rounded-xl border border-slate-200/60 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600 hover:shadow-lg hover:shadow-slate-200/40 dark:hover:shadow-slate-900/40 transition-all duration-300 text-left cursor-pointer"
                whileHover={{ y: -1, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-400 flex items-center justify-center shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
                  <History size={14} strokeWidth={1.75} className="text-white" />
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">View Comm History</span>
              </motion.button>
              <motion.button
                onClick={() => navigate(`/pipeline/new?participantId=${contact.id}`)}
                className="group relative flex items-center gap-3 px-4 py-2.5 bg-white/70 dark:bg-slate-800 backdrop-blur-sm rounded-xl border border-slate-200/60 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600 hover:shadow-lg hover:shadow-slate-200/40 dark:hover:shadow-slate-900/40 transition-all duration-300 text-left cursor-pointer"
                whileHover={{ y: -1, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-400 flex items-center justify-center shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
                  <Target size={14} strokeWidth={1.75} className="text-white" />
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Add to Pipeline</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ═══ Tabs ═══ */}
      <motion.div variants={fadeUp} className="border-b border-slate-200 dark:border-slate-800">
        <div className="flex gap-0">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                activeTab === tab.key
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ═══ Tab: Contact Information ═══ */}
      {activeTab === 'contact' && (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
          {/* Contact Profile */}
          <motion.div variants={fadeUp} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 overflow-hidden">
            <div className="bg-slate-50/80 dark:bg-slate-800/50 px-6 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary-50 dark:bg-primary-500/15 flex items-center justify-center">
                <Briefcase size={14} className="text-primary-500" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Contact Profile</h3>
            </div>
            <div className="p-5 grid grid-cols-2 gap-3">
              <Field label="Account" value={contact.account} />
              <Field label="User Status" value={contact.status} />
              <Field label="Contact Tags" value={contact.contactTags} />
              <Field label="Projected Annual Income" value={contact.salary ? '$' + contact.salary.toLocaleString() : 'N/A'} />
              <Field label="Preferred Name" value={contact.preferredName} />
              <Field label="Plan Balance" value={contact.planBalance ? '$' + contact.planBalance.toLocaleString() : 'N/A'} />
              <Field label="Full Name" value={contact.fullName} />
              <Field label="Gross Compensation" value={contact.grossCompensation ? '$' + contact.grossCompensation.toLocaleString() : 'N/A'} />
              <Field label="Title" value={contact.title} />
              <Field label="Compensation Cadence" value="N/A" />
              <Field label="Email" value={contact.email} icon={Mail} />
              <Field label="Email Opt Out" value="false" />
              <Field label="Personal Email" value={contact.personalEmail} icon={Mail} />
              <Field label="Do Not Call" value="false" />
              <Field label="Business Phone" value={contact.phone} icon={Phone} />
              <Field label="Description" value={contact.description} />
              <Field label="Home Phone" value={contact.personalPhone} icon={Phone} />
            </div>
          </motion.div>

          {/* Payroll Insights */}
          <motion.div variants={fadeUp} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 overflow-hidden">
            <div className="bg-slate-50/80 dark:bg-slate-800/50 px-6 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-500/15 flex items-center justify-center">
                <DollarSign size={14} className="text-emerald-500" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Payroll Insights</h3>
            </div>
            <div className="p-5 grid grid-cols-2 gap-3">
              <Field label="Employee ID" value={contact.employeeId} />
              <Field label="Date of Separation" value={contact.dateOfSeparation} />
              <Field label="Employment Status" value={contact.employmentActive ? 'Active' : 'Inactive'} />
              <Field label="Bonus" value="N/A" />
              <Field label="Participant Status" value={contact.status} />
              <Field label="Commissions" value="N/A" />
              <Field label="Employment Type" value="N/A" />
              <Field label="Overtime Compensation" value="N/A" />
              <Field label="Employment Sub Type" value="N/A" />
              <Field label="Hours Worked" value={contact.hoursWorked} />
              <Field label="Birthdate" value={contact.birthdate ? new Date(contact.birthdate + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'} icon={Calendar} />
              <Field label="Active Military" value="false" />
              <Field label="Marital Status" value={contact.maritalStatus} icon={Heart} />
              <Field label="Union Employee" value="false" />
              <Field label="Original Hire Date" value={contact.originalHireDate ? new Date(contact.originalHireDate + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'} icon={Calendar} />
              <Field label="Spanish Speaker" value={contact.spanishSpeaker} />
              <Field label="Date of Rehire" value={contact.dateOfRehire} icon={Calendar} />
              <Field label="Last Data Sync" value="N/A" icon={Clock} />
            </div>
          </motion.div>

          {/* Plan Insights */}
          <motion.div variants={fadeUp} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 overflow-hidden">
            <div className="bg-slate-50/80 dark:bg-slate-800/50 px-6 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-500/15 flex items-center justify-center">
                <Landmark size={14} className="text-blue-500" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Plan Insights</h3>
            </div>
            <div className="p-5 grid grid-cols-2 gap-3">
              <Field label="Eligibility Status" value={contact.eligibilityStatus} icon={Shield} />
              <Field label="Pre-Tax Contribution Rate $" value={contact.preTaxContribDollar} />
              <Field label="Entry Date" value={contact.entryDate ? new Date(contact.entryDate + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'} icon={Calendar} />
              <Field label="Roth Salary Deferral" value={contact.rothSalaryDeferral} />
              <Field label="Pre-Tax Salary Deferral" value={contact.preTaxSalaryDeferral} />
              <Field label="Roth Contribution Rate" value={contact.rothContribRate} />
              <Field label="Pre-Tax Contribution Rate" value={contact.preTaxContribRate} />
              <Field label="Roth Contribution Rate $" value={contact.rothContribDollar} />
            </div>
          </motion.div>

          {/* Address Information */}
          <motion.div variants={fadeUp} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 overflow-hidden">
            <div className="bg-slate-50/80 dark:bg-slate-800/50 px-6 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-500/15 flex items-center justify-center">
                <MapPin size={14} className="text-amber-500" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Address Information</h3>
            </div>
            <div className="p-5 grid grid-cols-2 gap-3">
              <Field
                label="Mailing Address"
                value={
                  contact.mailingStreet
                    ? `${contact.mailingStreet}, ${contact.mailingCity}, ${contact.mailingState} ${contact.mailingPostalCode}`
                    : 'N/A'
                }
                icon={MapPin}
              />
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* ═══ Tab: Communication Histories ═══ */}
      {activeTab === 'comms' && (
        <CommHistoryTab contactId={Number(id)} />
      )}

      {/* ═══ Tab: Scheduled Communications ═══ */}
      {activeTab === 'scheduled' && (
        <motion.div variants={fadeUp} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-12 text-center">
          <Calendar size={32} className="mx-auto mb-3 text-slate-200 dark:text-slate-700" />
          <p className="text-sm text-slate-400 dark:text-slate-500">No scheduled communications.</p>
        </motion.div>
      )}
    </motion.div>
  )
}
