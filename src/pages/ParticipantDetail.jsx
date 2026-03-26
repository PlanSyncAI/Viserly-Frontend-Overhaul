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
} from 'lucide-react'
import { useContacts } from '../lib/useContacts'
import { getCommsForContact, getCommStats } from '../lib/communicationData'
import CommHistoryTable from '../components/ui/CommHistoryTable'
import AnimatedCounter from '../components/ui/AnimatedCounter'

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
    <div className="py-3 px-4 border border-slate-100 dark:border-slate-800 rounded-lg bg-slate-50/50 dark:bg-slate-800/30">
      <div className="flex items-center gap-1.5 mb-0.5">
        {Icon && <Icon size={11} className="text-slate-300 dark:text-slate-600" />}
        <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{label}</p>
      </div>
      <p className="text-sm text-slate-900 dark:text-white font-medium">{value || 'N/A'}</p>
    </div>
  )
}

function SectionHeader({ title, color = 'primary', icon }) {
  const colors = {
    primary: 'bg-primary-500',
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500',
    amber: 'bg-amber-500',
  }
  const Icon = icon
  return (
    <div className={`${colors[color]} text-white text-sm font-semibold px-5 py-2.5 rounded-t-xl flex items-center gap-2`}>
      {Icon && <Icon size={16} />}
      {title}
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
    { label: 'Total Sent', value: stats.sent, color: 'blue' },
    { label: 'Delivered', value: stats.delivered, color: 'emerald' },
    { label: 'Opened', value: stats.opened, color: 'purple' },
    { label: 'Clicked', value: stats.clicked, color: 'indigo' },
    { label: 'Open Rate', value: stats.openRate, suffix: '%', color: 'amber' },
  ]

  const colorMap = {
    blue: { bg: 'bg-blue-50 dark:bg-blue-500/15', text: 'text-blue-500' },
    emerald: { bg: 'bg-emerald-50 dark:bg-emerald-500/15', text: 'text-emerald-500' },
    purple: { bg: 'bg-purple-50 dark:bg-purple-500/15', text: 'text-purple-500' },
    indigo: { bg: 'bg-indigo-50 dark:bg-indigo-500/15', text: 'text-indigo-500' },
    amber: { bg: 'bg-amber-50 dark:bg-amber-500/15', text: 'text-amber-500' },
  }

  return (
    <div className="space-y-4">
      <motion.div variants={fadeUp} className="grid grid-cols-5 gap-3">
        {statCards.map((s) => {
          const c = colorMap[s.color]
          return (
            <motion.div
              key={s.label}
              whileHover={{ y: -2, boxShadow: '0 8px 25px -5px rgba(0,0,0,0.08)' }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-4 text-center"
            >
              <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight tabular-nums">
                <AnimatedCounter value={parseFloat(s.value)} />{s.suffix || ''}
              </p>
              <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-1">{s.label}</p>
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
      className="p-8 mx-auto space-y-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Back button */}
      <motion.button
        variants={fadeUp}
        onClick={() => navigate('/participant-data')}
        className="inline-flex items-center gap-2 text-sm text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
      >
        <ArrowLeft size={16} />
        Back to Contacts
      </motion.button>

      {/* Profile Header Card */}
      <motion.div
        variants={fadeUp}
        className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-6"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/40 via-transparent to-blue-50/20 dark:from-primary-500/5 dark:via-transparent dark:to-blue-500/5" />
        <div className="relative flex items-start justify-between">
          <div className="flex items-start gap-5">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary-500/20">
              <span className="text-white text-xl font-bold">{initials}</span>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">
                Participant Profile
              </p>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                {contact.fullName}
              </h2>
              {/* Quick info pills */}
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                  <Phone size={14} className="text-slate-400 dark:text-slate-500" />
                  {contact.phone || 'N/A'}
                </div>
                <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                  <Mail size={14} className="text-slate-400 dark:text-slate-500" />
                  {contact.email}
                </div>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50/80 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20">
                  <DollarSign size={14} className="text-emerald-500" />
                  <span className="text-xs text-slate-500 dark:text-slate-400">Salary:</span>
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">${contact.salary.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50/80 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20">
                  <Landmark size={14} className="text-blue-500" />
                  <span className="text-xs text-slate-500 dark:text-slate-400">Plan Balance:</span>
                  <span className="text-xs font-bold text-blue-700 dark:text-blue-400 tabular-nums">${contact.planBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Actions */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Actions</p>
            <button
              onClick={() => navigate('/templates/new')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 dark:bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-colors cursor-pointer"
            >
              <Send size={14} />
              Send Email Now
            </button>
            <button
              onClick={() => navigate('/campaigns/new')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <UserPlus size={14} />
              Add to Campaign
            </button>
            <button
              onClick={() => setActiveTab('comms')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <History size={14} />
              View Comm History
            </button>
            <button
              onClick={() => navigate(`/pipeline/new?participantId=${contact.id}`)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <Target size={14} />
              Add to Pipeline
            </button>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={fadeUp} className="border-b border-slate-200 dark:border-slate-700">
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

      {/* Tab Content */}
      {activeTab === 'contact' && (
        <div className="space-y-6">
          {/* Contact Profile */}
          <motion.div variants={fadeUp} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 overflow-hidden">
            <SectionHeader title="Contact Profile" color="primary" icon={Briefcase} />
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
            <SectionHeader title="Payroll Insights" color="emerald" icon={DollarSign} />
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
            <SectionHeader title="Plan Insights" color="blue" icon={Landmark} />
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
            <SectionHeader title="Address Information" color="amber" icon={MapPin} />
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
        </div>
      )}

      {activeTab === 'comms' && (
        <CommHistoryTab contactId={Number(id)} />
      )}

      {activeTab === 'scheduled' && (
        <motion.div variants={fadeUp} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-12 text-center">
          <Calendar size={32} className="mx-auto mb-3 text-slate-200 dark:text-slate-700" />
          <p className="text-sm text-slate-400 dark:text-slate-500">No scheduled communications.</p>
        </motion.div>
      )}
    </motion.div>
  )
}
