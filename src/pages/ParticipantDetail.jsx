import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Send,
  UserPlus,
  History,
  Phone,
  Mail,
  DollarSign,
  Landmark,
} from 'lucide-react'
import { useContacts } from '../lib/useContacts'
import { getCommsForContact, getCommStats } from '../lib/communicationData'
import CommHistoryTable from '../components/ui/CommHistoryTable'

function Field({ label, value }) {
  return (
    <div className="py-3 px-4 border border-slate-100 dark:border-slate-800 rounded-lg">
      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-sm text-slate-900 dark:text-white font-medium">{value || 'N/A'}</p>
    </div>
  )
}

function SectionHeader({ title, color = 'primary' }) {
  const colors = {
    primary: 'bg-primary-500',
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500',
    amber: 'bg-amber-500',
  }
  return (
    <div className={`${colors[color]} text-white text-sm font-semibold px-5 py-2.5 rounded-t-xl`}>
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

  return (
    <div className="space-y-4">
      {/* Stats bar */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: 'Total Sent', value: stats.sent, color: 'bg-blue-50 text-blue-700' },
          { label: 'Delivered', value: stats.delivered, color: 'bg-emerald-50 text-emerald-700' },
          { label: 'Opened', value: stats.opened, color: 'bg-purple-50 text-purple-700' },
          { label: 'Clicked', value: stats.clicked, color: 'bg-indigo-50 text-indigo-700' },
          { label: 'Open Rate', value: stats.openRate + '%', color: 'bg-amber-50 text-amber-700' },
        ].map((s) => (
          <div key={s.label} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 p-4 text-center">
            <p className="text-2xl font-bold text-slate-900 dark:text-white dark:text-white tracking-tight">{s.value}</p>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mt-1">{s.label}</p>
          </div>
        ))}
      </div>
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
        <p className="text-slate-500">Contact not found.</p>
        <button onClick={() => navigate('/participant-data')} className="mt-4 text-primary-500 text-sm hover:underline cursor-pointer">
          Back to Contacts
        </button>
      </div>
    )
  }

  const initials = `${contact.firstName[0] || ''}${contact.lastName[0] || ''}`.toUpperCase()

  return (
    <div className="p-8 max-w-[1200px] mx-auto space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate('/participant-data')}
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
      >
        <ArrowLeft size={16} />
        Back to Contacts
      </button>

      {/* Profile Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-5">
            {/* Avatar */}
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-lg font-bold">{initials}</span>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
                Participant Profile
              </p>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                {contact.fullName}
              </h2>
              {/* Quick info pills */}
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                  <Phone size={14} className="text-slate-400" />
                  {contact.phone || 'N/A'}
                </div>
                <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                  <Mail size={14} className="text-slate-400" />
                  {contact.email}
                </div>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                  <DollarSign size={14} className="text-slate-400" />
                  Salary: <span className="font-semibold text-slate-700">${contact.salary.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                  <Landmark size={14} className="text-slate-400" />
                  Plan Balance: <span className="font-semibold text-slate-700">${contact.planBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Actions */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Contact Actions</p>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 dark:bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-colors cursor-pointer">
              <Send size={14} />
              Send Email Now
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors cursor-pointer">
              <UserPlus size={14} />
              Add to Campaign
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors cursor-pointer">
              <History size={14} />
              View Comm History
            </button>
          </div>
        </div>
      </div>

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

      {/* Tab Content */}
      {activeTab === 'contact' && (
        <div className="space-y-6">
          {/* Contact Profile */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 overflow-hidden">
            <SectionHeader title="Contact Profile" color="primary" />
            <div className="p-5 grid grid-cols-2 gap-3">
              <Field label="Account" value={contact.account} />
              <Field label="User Status" value={contact.status} />
              <Field label="Contact Tags" value={contact.contactTags} />
              <Field label="Projected Annual Income" value={contact.salary ? contact.salary.toLocaleString() : 'N/A'} />
              <Field label="Preferred Name" value={contact.preferredName} />
              <Field label="Plan Balance" value={contact.planBalance ? contact.planBalance.toLocaleString() : 'N/A'} />
              <Field label="Full Name" value={contact.fullName} />
              <Field label="Gross Compensation" value={contact.grossCompensation ? contact.grossCompensation.toLocaleString() : 'N/A'} />
              <Field label="Title" value={contact.title} />
              <Field label="Compensation Cadence" value="N/A" />
              <Field label="Email" value={contact.email} />
              <Field label="Email Opt Out" value="false" />
              <Field label="Personal Email" value={contact.personalEmail} />
              <Field label="Do Not Call" value="false" />
              <Field label="Business Phone" value={contact.phone} />
              <Field label="Description" value={contact.description} />
              <Field label="Home Phone" value={contact.personalPhone} />
            </div>
          </div>

          {/* Payroll Insights */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 overflow-hidden">
            <SectionHeader title="Payroll Insights" color="emerald" />
            <div className="p-5 grid grid-cols-2 gap-3">
              <Field label="Employee ID" value={contact.employeeId} />
              <Field label="Date of Separation" value={contact.dateOfSeparation} />
              <Field label="Employment Status" value={contact.employmentActive ? 'true' : 'false'} />
              <Field label="Bonus" value="N/A" />
              <Field label="Participant Status" value={contact.status} />
              <Field label="Commissions" value="N/A" />
              <Field label="Employment Type" value="N/A" />
              <Field label="Overtime Compensation" value="N/A" />
              <Field label="Employment Sub Type" value="N/A" />
              <Field label="Hours Worked" value={contact.hoursWorked} />
              <Field label="Birthdate" value={contact.birthdate ? new Date(contact.birthdate + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'} />
              <Field label="Active Military" value="false" />
              <Field label="Marital Status" value={contact.maritalStatus} />
              <Field label="Union Employee" value="false" />
              <Field label="Original Hire Date" value={contact.originalHireDate ? new Date(contact.originalHireDate + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'} />
              <Field label="Spanish Speaker" value={contact.spanishSpeaker} />
              <Field label="Date of Rehire" value={contact.dateOfRehire} />
              <Field label="Last Data Sync" value="N/A" />
            </div>
          </div>

          {/* Plan Insights */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 overflow-hidden">
            <SectionHeader title="Plan Insights" color="blue" />
            <div className="p-5 grid grid-cols-2 gap-3">
              <Field label="Eligibility Status" value={contact.eligibilityStatus} />
              <Field label="Pre-Tax Contribution Rate $" value={contact.preTaxContribDollar} />
              <Field label="Entry Date" value={contact.entryDate ? new Date(contact.entryDate + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'} />
              <Field label="Roth Salary Deferral" value={contact.rothSalaryDeferral} />
              <Field label="Pre-Tax Salary Deferral" value={contact.preTaxSalaryDeferral} />
              <Field label="Roth Contribution Rate" value={contact.rothContribRate} />
              <Field label="Pre-Tax Contribution Rate" value={contact.preTaxContribRate} />
              <Field label="Roth Contribution Rate $" value={contact.rothContribDollar} />
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 overflow-hidden">
            <SectionHeader title="Address Information" color="amber" />
            <div className="p-5 grid grid-cols-2 gap-3">
              <Field
                label="Mailing Address"
                value={
                  contact.mailingStreet
                    ? `${contact.mailingStreet}, ${contact.mailingCity}, ${contact.mailingState} ${contact.mailingPostalCode}`
                    : 'N/A'
                }
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'comms' && (
        <CommHistoryTab contactId={Number(id)} />
      )}

      {activeTab === 'scheduled' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 p-12 text-center">
          <p className="text-sm text-slate-400 dark:text-slate-500">No scheduled communications.</p>
        </div>
      )}
    </div>
  )
}
