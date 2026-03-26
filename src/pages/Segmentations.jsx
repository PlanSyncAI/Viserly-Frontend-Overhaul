import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  RefreshCw,
  Plus,
  Layers,
  Users,
  Zap,
  ChevronsUpDown,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { DUMMY_SEGMENTATIONS } from '../lib/segmentationData'

export default function Segmentations() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [sortKey, setSortKey] = useState('createdDate')
  const [sortDir, setSortDir] = useState('desc')
  const [pageSize, setPageSize] = useState(25)
  const [page, setPage] = useState(1)

  const segments = DUMMY_SEGMENTATIONS

  const filtered = useMemo(() => {
    let data = segments

    if (filter === 'active') data = data.filter((s) => s.status === 'Active')
    else if (filter === 'planned') data = data.filter((s) => s.status === 'Planned')

    if (search) {
      const q = search.toLowerCase()
      data = data.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.status.toLowerCase().includes(q) ||
          s.createdDate.includes(q)
      )
    }

    data = [...data].sort((a, b) => {
      let aVal = a[sortKey]
      let bVal = b[sortKey]
      if (typeof aVal === 'number') return sortDir === 'asc' ? aVal - bVal : bVal - aVal
      aVal = String(aVal || '').toLowerCase()
      bVal = String(bVal || '').toLowerCase()
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1
      return 0
    })

    return data
  }, [segments, search, filter, sortKey, sortDir])

  const totalPages = Math.ceil(filtered.length / pageSize)
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize)

  const stats = useMemo(() => ({
    total: segments.length,
    totalContacts: segments.reduce((sum, s) => sum + s.contactCount, 0),
    active: segments.filter((s) => s.status === 'Active').length,
  }), [segments])

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

  const columns = [
    { key: 'name', label: 'Segmentation' },
    { key: 'status', label: 'Status' },
    { key: 'contactCount', label: 'Contacts in Segment' },
    { key: 'createdDate', label: 'Created Date' },
    { key: 'startDate', label: 'Start Date' },
    { key: 'endDate', label: 'End Date' },
  ]

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white dark:text-white tracking-tight">All Segmentations</h2>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
            Manage saved segments, monitor audience sizes, and launch new segmentation definitions.
          </p>
        </div>
        <button className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer">
          <RefreshCw size={18} strokeWidth={1.75} />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center">
              <Layers size={20} strokeWidth={1.75} className="text-primary-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white dark:text-white tracking-tight">{stats.total}</p>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Segmentations</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Users size={20} strokeWidth={1.75} className="text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white dark:text-white tracking-tight">{stats.totalContacts.toLocaleString()}</p>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Contacts</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Zap size={20} strokeWidth={1.75} className="text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white dark:text-white tracking-tight">{stats.active}</p>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active Segments</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search, Filter, Create */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by segment name, status, or date"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-all"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => { setFilter(e.target.value); setPage(1) }}
          className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 cursor-pointer appearance-none pr-10 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_12px_center] bg-no-repeat"
        >
          <option value="all">All Segmentations</option>
          <option value="active">Active</option>
          <option value="planned">Planned</option>
        </select>
        <button
          onClick={() => navigate('/segmentations/new')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-500 dark:bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-colors cursor-pointer whitespace-nowrap"
        >
          <Plus size={16} />
          Create New Segmentation
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                {columns.map((col) => (
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
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-12 text-sm text-slate-400 dark:text-slate-500">
                    No segmentations found.
                  </td>
                </tr>
              ) : (
                paged.map((seg) => (
                  <tr
                    key={seg.id}
                    className="border-b border-slate-50 dark:border-slate-800 last:border-0 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/segmentations/${seg.id}`)}
                  >
                    <td className="px-5 py-3">
                      <span className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">{seg.name}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        seg.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {seg.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-600 dark:text-slate-300 tabular-nums">{seg.contactCount.toLocaleString()}</td>
                    <td className="px-5 py-3 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {new Date(seg.createdDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-400 dark:text-slate-500">
                      {seg.startDate
                        ? new Date(seg.startDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        : '—'}
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-400 dark:text-slate-500">
                      {seg.endDate
                        ? new Date(seg.endDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        : '—'}
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
            Showing {Math.min((page - 1) * pageSize + 1, filtered.length)}–{Math.min(page * pageSize, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
              {[25, 50, 100].map((size) => (
                <button
                  key={size}
                  onClick={() => { setPageSize(size); setPage(1) }}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                    pageSize === size
                      ? 'bg-primary-500 dark:bg-primary-600 text-white'
                      : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {size} / page
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm text-slate-500 dark:text-slate-400 px-2">
                Page {page} of {totalPages || 1}
              </span>
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
    </div>
  )
}
