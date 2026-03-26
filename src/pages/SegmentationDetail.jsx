import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Download,
  Trash2,
  LayoutGrid,
  Eye,
  Search,
  Mail,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  ChevronUp,
  ChevronDown,
} from 'lucide-react'
import { DUMMY_SEGMENTATIONS, FILTER_FIELDS, OPERATORS } from '../lib/segmentationData'
import { useContacts } from '../lib/useContacts'
import FilterBuilder from '../components/ui/FilterBuilder'
import CommHistoryTable from '../components/ui/CommHistoryTable'
import { getCommsForSegment, getCommStats } from '../lib/communicationData'

const PAGE_SIZE = 25

const tabs = [
  { key: 'details', label: 'Segmentation Details' },
  { key: 'contacts', label: 'Segmented Customer List' },
  { key: 'comms', label: 'Communication Histories' },
]

function Field({ label, value }) {
  return (
    <div className="py-3 px-4 border border-slate-100 dark:border-slate-800 rounded-lg">
      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-sm text-slate-900 dark:text-white font-medium">{value || 'N/A'}</p>
    </div>
  )
}

function SegmentCommTab({ segmentId }) {
  const records = getCommsForSegment(segmentId)
  const stats = getCommStats(records)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: 'Total Sent', value: stats.sent },
          { label: 'Delivered', value: stats.delivered },
          { label: 'Opened', value: stats.opened },
          { label: 'Clicked', value: stats.clicked },
          { label: 'Open Rate', value: stats.openRate + '%' },
        ].map((s) => (
          <div key={s.label} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 p-4 text-center">
            <p className="text-2xl font-bold text-slate-900 dark:text-white dark:text-white tracking-tight">{s.value}</p>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mt-1">{s.label}</p>
          </div>
        ))}
      </div>
      <CommHistoryTable records={records} showSegment={false} />
    </div>
  )
}

export default function SegmentationDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('details')

  const segment = DUMMY_SEGMENTATIONS.find((s) => s.id === Number(id))
  const [filters, setFilters] = useState(segment?.filters || [{ field: '', operator: '', value: '' }])
  const [name, setName] = useState(segment?.name || '')
  const [description, setDescription] = useState(segment?.description || '')

  // Contacts tab state
  const { contacts, loading: contactsLoading } = useContacts()
  const [contactSearch, setContactSearch] = useState('')
  const [page, setPage] = useState(1)
  const [sortKey, setSortKey] = useState('fullName')
  const [sortDir, setSortDir] = useState('asc')

  // Apply filters to contacts for the segmented list
  const segmentedContacts = useMemo(() => {
    let data = contacts

    // Apply each active filter
    filters.forEach((f) => {
      if (!f.field || !f.operator || f.value === '') return
      data = data.filter((contact) => {
        const val = contact[f.field]
        const filterVal = f.value
        switch (f.operator) {
          case 'equals':
            return String(val).toLowerCase() === filterVal.toLowerCase()
          case 'not_equals':
            return String(val).toLowerCase() !== filterVal.toLowerCase()
          case 'contains':
            return String(val).toLowerCase().includes(filterVal.toLowerCase())
          case 'greater_than':
            return Number(val) > Number(filterVal)
          case 'less_than':
            return Number(val) < Number(filterVal)
          case 'includes':
            return String(val).toLowerCase().includes(filterVal.toLowerCase())
          default:
            return true
        }
      })
    })

    if (contactSearch) {
      const q = contactSearch.toLowerCase()
      data = data.filter(
        (c) => c.fullName.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
      )
    }

    data = [...data].sort((a, b) => {
      let aVal = a[sortKey]
      let bVal = b[sortKey]
      if (typeof aVal === 'number') return sortDir === 'asc' ? aVal - bVal : bVal - aVal
      aVal = String(aVal).toLowerCase()
      bVal = String(bVal).toLowerCase()
      return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    })

    return data
  }, [contacts, filters, contactSearch, sortKey, sortDir])

  const totalPages = Math.ceil(segmentedContacts.length / PAGE_SIZE)
  const pagedContacts = segmentedContacts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function handleSort(key) {
    if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
    setPage(1)
  }

  function SortIcon({ colKey }) {
    if (sortKey !== colKey) return <ChevronsUpDown size={14} className="text-slate-300" />
    return sortDir === 'asc'
      ? <ChevronUp size={14} className="text-primary-500" />
      : <ChevronDown size={14} className="text-primary-500" />
  }

  if (!segment) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500">Segmentation not found.</p>
        <button onClick={() => navigate('/segmentations')} className="mt-4 text-primary-500 text-sm hover:underline cursor-pointer">
          Back to Segmentations
        </button>
      </div>
    )
  }

  const contactColumns = [
    { key: 'fullName', label: 'Participant Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'account', label: 'Plan Name' },
    { key: 'salary', label: 'Salary' },
    { key: 'planBalance', label: 'Plan Balance' },
  ]

  const filterSummary = filters
    .filter((f) => f.field && f.operator)
    .map((f) => {
      const fieldLabel = FILTER_FIELDS.find((ff) => ff.key === f.field)?.label || f.field
      const opLabel = OPERATORS.find((o) => o.key === f.operator)?.label || f.operator
      return `${fieldLabel} ${opLabel} ${f.value}`
    })
    .join(', ')

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Back + Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/segmentations')}
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          Back to Segmentations
        </button>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 dark:bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-colors cursor-pointer">
            <Download size={14} />
            Download CSV
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors cursor-pointer">
            <Trash2 size={14} />
            Delete Segment
          </button>
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

      {/* Tab: Details */}
      {activeTab === 'details' && (
        <div className="space-y-6">
          {/* Campaign Info */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 overflow-hidden">
            <div className="bg-slate-800 text-white text-sm font-semibold px-5 py-2.5 rounded-t-xl">
              Campaign Info
            </div>
            <div className="p-5 grid grid-cols-2 gap-3">
              <Field label="Name" value={segment.name} />
              <Field label="Owner" value={segment.owner} />
            </div>
          </div>

          {/* Description Info */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 overflow-hidden">
            <div className="bg-slate-600 text-white text-sm font-semibold px-5 py-2.5 rounded-t-xl">
              Description Info
            </div>
            <div className="p-5 grid grid-cols-2 gap-3">
              <Field label="Description" value={segment.description} />
              <Field label="Number of Contacts in Campaign" value={segmentedContacts.length.toString()} />
            </div>
          </div>

          {/* Segmentation Builder */}
          <div className="text-center py-6 bg-gradient-to-b from-primary-50/60 to-transparent rounded-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-100/80 text-primary-600 text-xs font-semibold mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
              INTELLIGENT SEGMENTATION
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center mx-auto mb-3">
              <LayoutGrid size={24} strokeWidth={1.5} className="text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Segment Your Data With Precision</h3>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Build dynamic audiences, filter with intent, and activate insights instantly.</p>
          </div>

          {/* Segment Name/Description (editable) */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 p-6">
            <div className="mb-5">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">Segment Details</h3>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">Name your audience and describe its business purpose.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">
                  <span className="text-red-400">*</span> Segment Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">
                  <span className="text-red-400">*</span> Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300"
                />
              </div>
            </div>
          </div>

          {/* Filter Builder */}
          <FilterBuilder filters={filters} onChange={setFilters} />

          {/* Actions */}
          <div className="flex items-center gap-4 pt-2">
            <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors cursor-pointer">
              <Eye size={16} />
              Preview Data
            </button>
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-primary-50 text-primary-600">
              {segmentedContacts.length} contact(s) match this segment
            </span>
            <div className="flex-1" />
            <button className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary-500 dark:bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-colors cursor-pointer">
              Update Segment
            </button>
          </div>
        </div>
      )}

      {/* Tab: Segmented Customer List */}
      {activeTab === 'contacts' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 p-5">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Related Segmented Contacts</h3>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5 mb-4">
              Search and sort related records without leaving the detail page.
            </p>
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search related records"
                value={contactSearch}
                onChange={(e) => { setContactSearch(e.target.value); setPage(1) }}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300"
              />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                    {contactColumns.map((col) => (
                      <th
                        key={col.key}
                        className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-5 py-3 cursor-pointer hover:text-slate-700 select-none"
                        onClick={() => handleSort(col.key)}
                      >
                        <div className="flex items-center gap-1.5">
                          {col.label}
                          <SortIcon colKey={col.key} />
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {contactsLoading ? (
                    <tr><td colSpan={6} className="text-center py-12 text-sm text-slate-400 dark:text-slate-500">Loading...</td></tr>
                  ) : pagedContacts.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-12 text-sm text-slate-400 dark:text-slate-500">No matching contacts.</td></tr>
                  ) : (
                    pagedContacts.map((c) => (
                      <tr
                        key={c.id}
                        className="border-b border-slate-50 dark:border-slate-800 last:border-0 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                        onClick={() => navigate(`/participant-data/${c.id}`)}
                      >
                        <td className="px-5 py-3">
                          <span className="text-sm font-medium text-primary-600">{c.fullName}</span>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-1.5">
                            <Mail size={13} className="text-slate-300 flex-shrink-0" />
                            <span className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-[180px]">{c.email}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">{c.phone}</td>
                        <td className="px-5 py-3 text-sm text-slate-600 dark:text-slate-300">{c.account}</td>
                        <td className="px-5 py-3 text-sm text-slate-600 dark:text-slate-300 text-right tabular-nums">
                          ${c.salary.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-5 py-3 text-sm text-slate-600 dark:text-slate-300 text-right tabular-nums">
                          ${c.planBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="border-t border-slate-100 dark:border-slate-800 px-5 py-3 flex items-center justify-between">
              <p className="text-sm text-slate-400 dark:text-slate-500">
                Showing {Math.min((page - 1) * PAGE_SIZE + 1, segmentedContacts.length)}–{Math.min(page * PAGE_SIZE, segmentedContacts.length)} of {segmentedContacts.length}
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-sm text-slate-500 dark:text-slate-400 px-2">Page {page} of {totalPages || 1}</span>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages || totalPages === 0}
                  className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Communication Histories */}
      {activeTab === 'comms' && (
        <SegmentCommTab segmentId={segment.id} />
      )}
    </div>
  )
}
