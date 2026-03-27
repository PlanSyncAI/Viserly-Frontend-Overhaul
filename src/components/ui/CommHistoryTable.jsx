import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  ChevronUp,
  ChevronDown,
  ExternalLink,
} from 'lucide-react'
import { COMM_STATUS_STYLES } from '../../lib/communicationData'

const PAGE_SIZE = 15

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default function CommHistoryTable({
  records,
  showContact = true,
  showSegment = true,
  showCampaign = true,
}) {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState('sentAt')
  const [sortDir, setSortDir] = useState('desc')
  const [page, setPage] = useState(1)
  const [typeFilter, setTypeFilter] = useState('all')

  const filtered = useMemo(() => {
    let data = records

    if (typeFilter !== 'all') {
      data = data.filter((r) => r.status === typeFilter)
    }

    if (search) {
      const q = search.toLowerCase()
      data = data.filter(
        (r) =>
          (r.contactName || '').toLowerCase().includes(q) ||
          (r.contactEmail || '').toLowerCase().includes(q) ||
          (r.templateName || '').toLowerCase().includes(q) ||
          (r.subject || '').toLowerCase().includes(q) ||
          (r.campaignName || '').toLowerCase().includes(q) ||
          (r.segmentName || '').toLowerCase().includes(q)
      )
    }

    data = [...data].sort((a, b) => {
      let aVal = a[sortKey]
      let bVal = b[sortKey]
      if (sortKey === 'sentAt') {
        return sortDir === 'asc'
          ? new Date(aVal || 0) - new Date(bVal || 0)
          : new Date(bVal || 0) - new Date(aVal || 0)
      }
      aVal = String(aVal || '').toLowerCase()
      bVal = String(bVal || '').toLowerCase()
      return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    })

    return data
  }, [records, search, sortKey, sortDir, typeFilter])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const uniqueStatuses = [...new Set(records.map((r) => r.status))].sort()

  function handleSort(key) {
    if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
    setPage(1)
  }

  function SortIcon({ colKey }) {
    if (sortKey !== colKey) return <ChevronsUpDown size={13} className="text-slate-300" />
    return sortDir === 'asc'
      ? <ChevronUp size={13} className="text-primary-500" />
      : <ChevronDown size={13} className="text-primary-500" />
  }

  return (
    <div className="space-y-4">
      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, template, or campaign..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-all"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setPage(1) }}
          className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 cursor-pointer appearance-none pr-8 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_8px_center] bg-no-repeat"
        >
          <option value="all">All Statuses</option>
          {uniqueStatuses.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                <th
                  className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-3 md:px-4 py-3 cursor-pointer hover:text-slate-700 select-none"
                  onClick={() => handleSort('sentAt')}
                >
                  <div className="flex items-center gap-1">Date <SortIcon colKey="sentAt" /></div>
                </th>
                <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-3 md:px-4 py-3">
                  Status
                </th>
                <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-3 md:px-4 py-3">
                  Type
                </th>
                {showContact && (
                  <th
                    className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-3 md:px-4 py-3 cursor-pointer hover:text-slate-700 select-none"
                    onClick={() => handleSort('contactName')}
                  >
                    <div className="flex items-center gap-1">Contact <SortIcon colKey="contactName" /></div>
                  </th>
                )}
                <th
                  className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-3 md:px-4 py-3 cursor-pointer hover:text-slate-700 select-none"
                  onClick={() => handleSort('templateName')}
                >
                  <div className="flex items-center gap-1">Template <SortIcon colKey="templateName" /></div>
                </th>
                <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-3 md:px-4 py-3">
                  Subject
                </th>
                {showCampaign && (
                  <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-3 md:px-4 py-3">
                    Campaign
                  </th>
                )}
                {showSegment && (
                  <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-3 md:px-4 py-3">
                    Segment
                  </th>
                )}
                <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-3 md:px-4 py-3">
                  Sent By
                </th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={99} className="text-center py-12 text-sm text-slate-400 dark:text-slate-500">
                    No communication records found.
                  </td>
                </tr>
              ) : (
                paged.map((rec) => (
                  <tr
                    key={rec.id}
                    className="border-b border-slate-50 dark:border-slate-800 last:border-0 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-3 md:px-4 py-3 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {formatDate(rec.sentAt)}
                    </td>
                    <td className="px-3 md:px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${COMM_STATUS_STYLES[rec.type] || 'bg-slate-100 text-slate-600'}`}>
                        {rec.status}
                      </span>
                    </td>
                    <td className="px-3 md:px-4 py-3 text-xs text-slate-400 whitespace-nowrap">
                      {rec.type}
                    </td>
                    {showContact && (
                      <td className="px-3 md:px-4 py-3">
                        <button
                          onClick={() => navigate(`/participant-data/${rec.contactId}`)}
                          className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 hover:underline cursor-pointer flex items-center gap-1"
                        >
                          {rec.contactName}
                          <ExternalLink size={11} className="opacity-0 group-hover:opacity-100" />
                        </button>
                        <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[200px]">{rec.contactEmail}</p>
                      </td>
                    )}
                    <td className="px-3 md:px-4 py-3 text-sm text-slate-600 dark:text-slate-300 max-w-[200px] truncate">
                      {rec.templateName || '—'}
                    </td>
                    <td className="px-3 md:px-4 py-3 text-sm text-slate-500 dark:text-slate-400 max-w-[220px] truncate">
                      {rec.subject || '—'}
                    </td>
                    {showCampaign && (
                      <td className="px-3 md:px-4 py-3 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {rec.campaignName || '—'}
                      </td>
                    )}
                    {showSegment && (
                      <td className="px-3 md:px-4 py-3">
                        {rec.segmentId ? (
                          <button
                            onClick={() => navigate(`/segmentations/${rec.segmentId}`)}
                            className="text-sm text-primary-600 hover:text-primary-700 hover:underline cursor-pointer"
                          >
                            {rec.segmentName}
                          </button>
                        ) : (
                          <span className="text-sm text-slate-400 dark:text-slate-500">—</span>
                        )}
                      </td>
                    )}
                    <td className="px-3 md:px-4 py-3 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {rec.sentBy}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filtered.length > PAGE_SIZE && (
          <div className="border-t border-slate-100 px-4 py-3 flex flex-col sm:flex-row items-center gap-2 sm:justify-between">
            <p className="text-sm text-slate-400 dark:text-slate-500">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm text-slate-500 dark:text-slate-400 px-2">Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
