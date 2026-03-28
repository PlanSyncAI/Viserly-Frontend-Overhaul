import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  Users,
  PieChart,
  FileText,
  Home,
  Database,
  Download,
  Megaphone,
  History,
  User,
  GraduationCap,
  CornerDownLeft,
  Target,
} from 'lucide-react'
import { useContacts } from '../../lib/useContacts'
import { DUMMY_SEGMENTATIONS } from '../../lib/segmentationData'
import { DUMMY_TEMPLATES } from '../../lib/templateData'
import { DUMMY_CAMPAIGNS } from '../../lib/campaignData'
import { DUMMY_DEALS } from '../../lib/pipelineData'
import { DUMMY_ACCOUNTS } from '../../lib/accountData'

const PAGES = [
  { label: 'Home', path: '/', icon: Home },
  { label: 'Participant Data', path: '/participant-data', icon: Users },
  { label: 'Plan Data', path: '/plan-data', icon: Database },
  { label: 'Segmentations', path: '/segmentations', icon: PieChart },
  { label: 'Templates', path: '/templates', icon: FileText },
  { label: 'Import Data', path: '/import-data', icon: Download },
  { label: 'Campaigns', path: '/campaigns', icon: Megaphone },
  { label: 'Communication History', path: '/communication-history', icon: History },
  { label: 'User Profile', path: '/user-profile', icon: User },
  { label: 'Learning Center', path: '/learning-center', icon: GraduationCap },
  { label: 'Deal Pipeline', path: '/pipeline', icon: Target },
]

const MAX_PER_SECTION = 5

export default function GlobalSearch({ collapsed }) {
  const navigate = useNavigate()
  const { contacts } = useContacts()
  const campaigns = DUMMY_CAMPAIGNS
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIdx, setActiveIdx] = useState(0)
  const inputRef = useRef(null)
  const dropdownRef = useRef(null)

  // Keyboard shortcut: / to focus
  useEffect(() => {
    function handleKey(e) {
      if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
        e.preventDefault()
        inputRef.current?.focus()
      }
      if (e.key === 'Escape') {
        setOpen(false)
        inputRef.current?.blur()
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const results = useMemo(() => {
    if (!query.trim()) return null
    const q = query.toLowerCase()

    const matchedContacts = contacts
      .filter((c) =>
        c.fullName.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q)
      )
      .slice(0, MAX_PER_SECTION)
      .map((c) => ({
        type: 'contact',
        id: c.id,
        label: c.fullName,
        sub: c.email,
        path: `/participant-data/${c.id}`,
        icon: Users,
      }))

    const matchedSegments = DUMMY_SEGMENTATIONS
      .filter((s) =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
      )
      .slice(0, MAX_PER_SECTION)
      .map((s) => ({
        type: 'segmentation',
        id: s.id,
        label: s.name,
        sub: `${s.contactCount} contacts · ${s.status}`,
        path: `/segmentations/${s.id}`,
        icon: PieChart,
      }))

    const matchedTemplates = DUMMY_TEMPLATES
      .filter((t) =>
        t.name.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q)
      )
      .slice(0, MAX_PER_SECTION)
      .map((t) => ({
        type: 'template',
        id: t.id,
        label: t.name,
        sub: t.subject.slice(0, 50) + (t.subject.length > 50 ? '...' : ''),
        path: `/templates/${t.id}`,
        icon: FileText,
      }))

    const matchedCampaigns = campaigns
      .filter((c) =>
        c.name.toLowerCase().includes(q) ||
        (c.templateName || '').toLowerCase().includes(q) ||
        (c.segmentName || '').toLowerCase().includes(q)
      )
      .slice(0, MAX_PER_SECTION)
      .map((c) => ({
        type: 'campaign',
        id: c.id,
        label: c.name,
        sub: `${c.recipients} recipients · ${c.status}`,
        path: `/campaigns/${c.id}`,
        icon: Megaphone,
      }))

    const matchedPlans = DUMMY_ACCOUNTS
      .filter((a) =>
        a.name.toLowerCase().includes(q) ||
        (a.planName || '').toLowerCase().includes(q) ||
        (a.planNumber || '').toLowerCase().includes(q) ||
        (a.recordkeeper || '').toLowerCase().includes(q)
      )
      .slice(0, MAX_PER_SECTION)
      .map((a) => ({
        type: 'plan',
        id: a.id,
        label: a.planName || a.name,
        sub: [a.recordkeeper, a.planNumber].filter(Boolean).join(' · ') || a.name,
        path: `/plan-data/${a.slug}`,
        icon: Database,
      }))

    const matchedDeals = DUMMY_DEALS
      .filter((d) =>
        d.participantName.toLowerCase().includes(q) ||
        d.accountName.toLowerCase().includes(q) ||
        d.source.toLowerCase().includes(q)
      )
      .slice(0, MAX_PER_SECTION)
      .map((d) => ({
        type: 'deal',
        id: d.id,
        label: d.participantName,
        sub: `$${d.dealValue.toLocaleString()} · ${d.stage.replace('_', ' ')}`,
        path: `/pipeline/${d.id}`,
        icon: Target,
      }))

    const matchedPages = PAGES
      .filter((p) => p.label.toLowerCase().includes(q))
      .map((p) => ({
        type: 'page',
        id: p.path,
        label: p.label,
        sub: p.path,
        path: p.path,
        icon: p.icon,
      }))

    return { matchedContacts, matchedSegments, matchedTemplates, matchedCampaigns, matchedDeals, matchedPages, matchedPlans }
  }, [query, contacts, campaigns])

  const flatResults = useMemo(() => {
    if (!results) return []
    return [
      ...results.matchedPages,
      ...results.matchedContacts,
      ...results.matchedPlans,
      ...results.matchedSegments,
      ...results.matchedTemplates,
      ...results.matchedCampaigns,
      ...results.matchedDeals,
    ]
  }, [results])

  const totalCount = flatResults.length

  // Reset active index when results change
  useEffect(() => { setActiveIdx(0) }, [query])

  const handleSelect = useCallback((item) => {
    navigate(item.path)
    setQuery('')
    setOpen(false)
    inputRef.current?.blur()
  }, [navigate])

  // Keyboard navigation
  function handleKeyDown(e) {
    if (!open || totalCount === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx((i) => (i + 1) % totalCount)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx((i) => (i - 1 + totalCount) % totalCount)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      handleSelect(flatResults[activeIdx])
    }
  }

  const sectionLabels = {
    page: 'Pages',
    contact: 'Contacts',
    plan: 'Plans',
    segmentation: 'Segmentations',
    template: 'Templates',
    campaign: 'Campaigns',
    deal: 'Deals',
  }
  const sectionColors = {
    page: 'text-slate-500 bg-slate-100 dark:bg-slate-800',
    contact: 'text-blue-600 bg-blue-50',
    plan: 'text-teal-600 bg-teal-50 dark:bg-teal-500/15',
    segmentation: 'text-purple-600 bg-purple-50',
    template: 'text-amber-600 bg-amber-50',
    campaign: 'text-emerald-600 bg-emerald-50',
    deal: 'text-primary-600 bg-primary-50',
  }

  // For collapsed sidebar, clicking the icon opens expanded search
  if (collapsed) {
    return (
      <button
        onClick={() => {
          // Could open a modal search, for now just navigate focus
        }}
        className="w-full flex items-center justify-center py-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        title="Search (press /)"
      >
        <Search size={20} strokeWidth={1.75} />
      </button>
    )
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Input */}
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => { if (query.trim()) setOpen(true) }}
          onKeyDown={handleKeyDown}
          placeholder="Search..."
          className="w-full pl-9 pr-8 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 dark:focus:border-primary-500 transition-all"
        />
        <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-medium text-slate-400 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded px-1.5 py-0.5">
          /
        </kbd>
      </div>

      {/* Dropdown */}
      {open && query.trim() && (
        <div className="absolute left-0 top-full mt-1.5 w-[calc(100vw-2rem)] sm:w-[360px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden">
          {totalCount === 0 ? (
            <div className="px-4 py-8 text-center">
              <Search size={20} className="mx-auto mb-2 text-slate-300" />
              <p className="text-sm text-slate-400">No results for "{query}"</p>
              <p className="text-xs text-slate-300 mt-1">Try searching for a contact, segment, or page</p>
            </div>
          ) : (
            <div className="max-h-[70vh] sm:max-h-[420px] overflow-y-auto py-1">
              {/* Render grouped by type */}
              {['page', 'contact', 'plan', 'segmentation', 'template', 'campaign', 'deal'].map((type) => {
                const items = flatResults.filter((r) => r.type === type)
                if (items.length === 0) return null
                return (
                  <div key={type}>
                    {/* Section header */}
                    <div className="px-3 pt-3 pb-1.5 flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        {sectionLabels[type]}
                      </span>
                      <span className="text-[10px] text-slate-300 dark:text-slate-600">
                        {items.length} result{items.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    {/* Items */}
                    {items.map((item) => {
                      const globalIdx = flatResults.indexOf(item)
                      const isActive = globalIdx === activeIdx
                      const Icon = item.icon
                      return (
                        <button
                          key={`${type}-${item.id}`}
                          onClick={() => handleSelect(item)}
                          onMouseEnter={() => setActiveIdx(globalIdx)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors cursor-pointer ${
                            isActive
                              ? 'bg-primary-50 dark:bg-primary-500/10'
                              : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${sectionColors[type]}`}>
                            <Icon size={15} strokeWidth={1.75} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className={`text-sm truncate ${isActive ? 'text-primary-700 dark:text-primary-300 font-medium' : 'text-slate-700 dark:text-slate-200'}`}>
                              {item.label}
                            </p>
                            <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">{item.sub}</p>
                          </div>
                          {isActive && (
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <CornerDownLeft size={12} className="text-slate-300" />
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          )}

          {/* Footer hint */}
          {totalCount > 0 && (
            <div className="border-t border-slate-100 dark:border-slate-800 px-3 py-2 flex items-center gap-4 text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[9px] font-mono">↑↓</kbd>
                navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[9px] font-mono">↵</kbd>
                select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[9px] font-mono">esc</kbd>
                close
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
