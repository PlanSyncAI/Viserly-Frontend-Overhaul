import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  UserPlus,
  Mail,
  Upload,
  Download,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Users,
  UserCheck,
  MailCheck,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  X,
} from 'lucide-react'
import { useContacts } from '../lib/useContacts'

const PAGE_SIZE = 25

const selectClass =
  "w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-all cursor-pointer appearance-none"

export default function ParticipantData() {
  const { contacts, loading } = useContacts()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [accountFilter, setAccountFilter] = useState('all')
  const [stateFilter, setStateFilter] = useState('all')
  const [salaryMin, setSalaryMin] = useState('')
  const [salaryMax, setSalaryMax] = useState('')
  const [balanceMin, setBalanceMin] = useState('')
  const [balanceMax, setBalanceMax] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [sortKey, setSortKey] = useState('lastName')
  const [sortDir, setSortDir] = useState('asc')
  const [page, setPage] = useState(1)

  // Derive unique accounts and states for filter dropdowns
  const { accounts, states } = useMemo(() => {
    const acctSet = new Set()
    const stateSet = new Set()
    contacts.forEach((c) => {
      if (c.account) acctSet.add(c.account)
      if (c.mailingState) stateSet.add(c.mailingState)
    })
    return {
      accounts: [...acctSet].sort(),
      states: [...stateSet].sort(),
    }
  }, [contacts])

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (statusFilter !== 'all') count++
    if (accountFilter !== 'all') count++
    if (stateFilter !== 'all') count++
    if (salaryMin) count++
    if (salaryMax) count++
    if (balanceMin) count++
    if (balanceMax) count++
    return count
  }, [statusFilter, accountFilter, stateFilter, salaryMin, salaryMax, balanceMin, balanceMax])

  function clearFilters() {
    setStatusFilter('all')
    setAccountFilter('all')
    setStateFilter('all')
    setSalaryMin('')
    setSalaryMax('')
    setBalanceMin('')
    setBalanceMax('')
    setPage(1)
  }

  const filtered = useMemo(() => {
    let data = contacts

    // Status filter
    if (statusFilter === 'active') data = data.filter((c) => c.employmentActive)
    else if (statusFilter === 'inactive') data = data.filter((c) => !c.employmentActive)

    // Account filter
    if (accountFilter !== 'all') data = data.filter((c) => c.account === accountFilter)

    // State filter
    if (stateFilter !== 'all') data = data.filter((c) => c.mailingState === stateFilter)

    // Salary range
    if (salaryMin) data = data.filter((c) => c.salary >= parseFloat(salaryMin))
    if (salaryMax) data = data.filter((c) => c.salary <= parseFloat(salaryMax))

    // Balance range
    if (balanceMin) data = data.filter((c) => c.planBalance >= parseFloat(balanceMin))
    if (balanceMax) data = data.filter((c) => c.planBalance <= parseFloat(balanceMax))

    // Search
    if (search) {
      const q = search.toLowerCase()
      data = data.filter(
        (c) =>
          (c.fullName || '').toLowerCase().includes(q) ||
          (c.email || '').toLowerCase().includes(q) ||
          (c.phone || '').includes(q) ||
          (c.account || '').toLowerCase().includes(q) ||
          (c.mailingCity || '').toLowerCase().includes(q) ||
          (c.mailingState || '').toLowerCase().includes(q)
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
  }, [contacts, search, statusFilter, accountFilter, stateFilter, salaryMin, salaryMax, balanceMin, balanceMax, sortKey, sortDir])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const stats = useMemo(() => {
    const total = contacts.length
    const active = contacts.filter((c) => c.employmentActive).length
    const hasEmail = contacts.filter((c) => c.email).length
    return { total, active, hasEmail }
  }, [contacts])

  function handleSort(key) {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
    setPage(1)
  }

  function SortIcon({ colKey }) {
    if (sortKey !== colKey) return <ChevronsUpDown size={14} className="text-slate-300" />
    return sortDir === 'asc' ? (
      <ChevronUp size={14} className="text-primary-500" />
    ) : (
      <ChevronDown size={14} className="text-primary-500" />
    )
  }

  const columns = [
    { key: 'fullName', label: 'Contact' },
    { key: 'account', label: 'Account' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'salary', label: 'Salary' },
    { key: 'planBalance', label: 'Plan Balance' },
    { key: 'status', label: 'Status' },
  ]

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-slate-400">
          <RefreshCw size={20} className="animate-spin" />
          <span className="text-sm">Loading contacts...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white dark:text-white tracking-tight">
            Participant Contacts
          </h2>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
            Manage participant records with a unified shell, modern list controls, and quick actions.
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
              <Users size={20} strokeWidth={1.75} className="text-primary-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white dark:text-white tracking-tight">{stats.total}</p>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Contacts</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
              <UserCheck size={20} strokeWidth={1.75} className="text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white dark:text-white tracking-tight">{stats.active}</p>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <MailCheck size={20} strokeWidth={1.75} className="text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white dark:text-white tracking-tight">{stats.hasEmail}</p>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Has Email</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Toggle */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by contact, account, phone, email, city, or state"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-all"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`inline-flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-medium transition-all cursor-pointer ${
            showFilters || activeFilterCount > 0
              ? 'bg-primary-50 border-primary-200 text-primary-700'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <SlidersHorizontal size={16} />
          Filters
          {activeFilterCount > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary-600 text-white text-xs font-semibold">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Filter Contacts</h3>
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-danger transition-colors cursor-pointer"
              >
                <X size={12} />
                Clear all filters
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Status */}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
                className={selectClass}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Account */}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Account</label>
              <select
                value={accountFilter}
                onChange={(e) => { setAccountFilter(e.target.value); setPage(1) }}
                className={selectClass}
              >
                <option value="all">All Accounts</option>
                {accounts.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            {/* State */}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">State</label>
              <select
                value={stateFilter}
                onChange={(e) => { setStateFilter(e.target.value); setPage(1) }}
                className={selectClass}
              >
                <option value="all">All States</option>
                {states.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Salary Range */}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Salary Range</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={salaryMin}
                  onChange={(e) => { setSalaryMin(e.target.value); setPage(1) }}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-all"
                />
                <span className="text-slate-300 text-xs">–</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={salaryMax}
                  onChange={(e) => { setSalaryMax(e.target.value); setPage(1) }}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-all"
                />
              </div>
            </div>

            {/* Plan Balance Range */}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Plan Balance Range</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={balanceMin}
                  onChange={(e) => { setBalanceMin(e.target.value); setPage(1) }}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-all"
                />
                <span className="text-slate-300 text-xs">–</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={balanceMax}
                  onChange={(e) => { setBalanceMax(e.target.value); setPage(1) }}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Active filter summary */}
          {activeFilterCount > 0 && (
            <div className="pt-3 border-t border-slate-100">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Showing <span className="font-semibold text-slate-700">{filtered.length}</span> of{' '}
                <span className="font-semibold text-slate-700">{contacts.length}</span> contacts
              </p>
            </div>
          )}
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 p-5">
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Quick Actions</h3>
          <p className="text-xs text-slate-400 mt-0.5">Run common participant workflows without leaving this page.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 dark:bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-colors cursor-pointer">
            <UserPlus size={16} />
            Create Contact
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors cursor-pointer">
            <Mail size={16} />
            Create Email
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors cursor-pointer">
            <Upload size={16} />
            Upload Data
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors cursor-pointer">
            <Download size={16} />
            Export Data
          </button>
        </div>
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
                  <td colSpan={columns.length} className="px-5 py-12 text-center text-sm text-slate-400 dark:text-slate-500">
                    No contacts match your search or filters.
                  </td>
                </tr>
              ) : (
                paged.map((contact) => (
                  <tr
                    key={contact.id}
                    className="border-b border-slate-50 dark:border-slate-800 last:border-0 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/participant-data/${contact.id}`)}
                  >
                    <td className="px-5 py-3">
                      <span className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
                        {contact.fullName}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-600 dark:text-slate-300">{contact.account}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5">
                        <Mail size={13} className="text-slate-300 flex-shrink-0" />
                        <span className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-[180px]">{contact.email}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">{contact.phone}</td>
                    <td className="px-5 py-3 text-sm text-slate-600 dark:text-slate-300 text-right tabular-nums">
                      ${contact.salary.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-600 dark:text-slate-300 text-right tabular-nums">
                      ${contact.planBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          contact.employmentActive
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {contact.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="border-t border-slate-100 dark:border-slate-800 px-5 py-3 flex items-center justify-between">
            <p className="text-sm text-slate-400 dark:text-slate-500">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of{' '}
              {filtered.length} contacts
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (page <= 3) {
                  pageNum = i + 1
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = page - 2 + i
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-8 h-8 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                      page === pageNum
                        ? 'bg-primary-500 dark:bg-primary-600 text-white'
                        : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
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
