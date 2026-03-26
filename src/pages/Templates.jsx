import { useState, useMemo, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  Filter,
  Plus,
  ChevronsUpDown,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { DUMMY_TEMPLATES } from '../lib/templateData'

export default function Templates() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [sourceFilter, setSourceFilter] = useState('all')
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [sortKey, setSortKey] = useState('name')
  const [sortDir, setSortDir] = useState('asc')
  const [page, setPage] = useState(1)
  const pageSize = 10
  const filterRef = useRef(null)

  // Close filter dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setShowFilterMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filtered = useMemo(() => {
    let data = DUMMY_TEMPLATES

    if (sourceFilter === 'viserly') data = data.filter((t) => t.source === 'Viserly')
    else if (sourceFilter === 'custom') data = data.filter((t) => t.source === '')

    if (search) {
      const q = search.toLowerCase()
      data = data.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.subject.toLowerCase().includes(q) ||
          t.createdBy.toLowerCase().includes(q)
      )
    }

    data = [...data].sort((a, b) => {
      let aVal = a[sortKey]
      let bVal = b[sortKey]
      aVal = String(aVal || '').toLowerCase()
      bVal = String(bVal || '').toLowerCase()
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1
      return 0
    })

    return data
  }, [search, sourceFilter, sortKey, sortDir])

  const totalPages = Math.ceil(filtered.length / pageSize)
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize)

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
    { key: 'name', label: 'Email Template Name' },
    { key: 'subject', label: 'Email Template Subject' },
    { key: 'source', label: 'Template Source' },
    { key: 'createdBy', label: 'Created By' },
  ]

  const filterLabel = sourceFilter === 'all' ? 'All' : sourceFilter === 'viserly' ? 'Viserly' : 'Custom'

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Tab */}
      <div className="border-b border-slate-200 dark:border-slate-700">
        <button className="px-4 py-2.5 text-sm font-medium text-primary-600 border-b-2 border-primary-500 -mb-px">
          All
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search this list..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-all"
          />
        </div>
        <div className="relative" ref={filterRef}>
          <button
            onClick={() => setShowFilterMenu(!showFilterMenu)}
            className={`p-2.5 rounded-lg border transition-colors cursor-pointer ${
              sourceFilter !== 'all'
                ? 'bg-primary-50 border-primary-200 text-primary-600'
                : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Filter size={16} strokeWidth={1.75} />
          </button>
          {showFilterMenu && (
            <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-slate-200 rounded-lg shadow-lg z-10 py-1">
              {[
                { value: 'all', label: 'All Templates' },
                { value: 'viserly', label: 'Viserly' },
                { value: 'custom', label: 'Custom' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { setSourceFilter(opt.value); setShowFilterMenu(false); setPage(1) }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer ${
                    sourceFilter === opt.value
                      ? 'bg-primary-50 text-primary-600 font-medium'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={() => navigate('/templates/new')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-500 dark:bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-colors cursor-pointer whitespace-nowrap"
        >
          <Plus size={16} />
          Create New Template
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
                    No templates found.
                  </td>
                </tr>
              ) : (
                paged.map((tpl) => (
                  <tr
                    key={tpl.id}
                    className="border-b border-slate-50 dark:border-slate-800 last:border-0 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/templates/${tpl.id}`)}
                  >
                    <td className="px-5 py-3">
                      <span className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">{tpl.name}</span>
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-600 dark:text-slate-300 max-w-md truncate">{tpl.subject}</td>
                    <td className="px-5 py-3 text-sm text-slate-600 dark:text-slate-300">{tpl.source || ''}</td>
                    <td className="px-5 py-3 text-sm text-slate-600 dark:text-slate-300">{tpl.createdBy}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="border-t border-slate-100 dark:border-slate-800 px-5 py-3 flex items-center justify-center gap-3">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="inline-flex items-center gap-1 px-4 py-1.5 border border-slate-200 rounded-md text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            Previous
          </button>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages || totalPages === 0}
            className="inline-flex items-center gap-1 px-4 py-1.5 border border-slate-200 rounded-md text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
