/**
 * Viserly Design System — Shared Style Tokens
 *
 * Import these constants anywhere to get consistent light + dark mode styling.
 * Usage:  import { card, text, btn, input } from '../lib/styles'
 *         <div className={card.base}>...</div>
 */

// ─── Surface / Card ────────────────────────────────────────────────────────────
export const card = {
  /** Standard card: white bg, border, rounded-xl */
  base: 'bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800',
  /** Card with larger radius (2xl) */
  lg: 'bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800',
  /** Card with shadow */
  elevated: 'bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm',
  /** Interactive card — hover lift + shadow */
  interactive: 'bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-300 cursor-pointer',
  /** Glass-morphic card */
  glass: 'bg-white/70 dark:bg-slate-800 backdrop-blur-sm rounded-2xl border border-slate-200/60 dark:border-slate-700',
  /** Inner section / grouped content area */
  inset: 'bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl',
}

// ─── Text ──────────────────────────────────────────────────────────────────────
export const text = {
  /** Page title — large bold */
  title: 'text-2xl font-bold text-slate-900 dark:text-white tracking-tight',
  /** Section heading */
  heading: 'text-base font-bold text-slate-900 dark:text-white',
  /** Card or item heading — smaller, semibold */
  label: 'text-sm font-semibold text-slate-900 dark:text-white',
  /** Standard body text */
  body: 'text-sm text-slate-600 dark:text-slate-300',
  /** Secondary / muted text */
  muted: 'text-sm text-slate-400 dark:text-slate-500',
  /** Extra small muted text (descriptions, timestamps) */
  caption: 'text-xs text-slate-400 dark:text-slate-500',
  /** Section label — uppercase tracking */
  section: 'text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider',
  /** Clickable link text */
  link: 'text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300',
  /** Large stat number */
  stat: 'text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight tabular-nums',
  /** Medium stat number */
  statMd: 'text-2xl font-bold text-slate-900 dark:text-white tracking-tight tabular-nums',
  /** Small stat number */
  statSm: 'text-lg font-bold text-slate-900 dark:text-white tabular-nums',
}

// ─── Buttons ───────────────────────────────────────────────────────────────────
export const btn = {
  /** Primary action button */
  primary: 'inline-flex items-center gap-2 px-5 py-2.5 bg-primary-500 dark:bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-colors cursor-pointer',
  /** Secondary / outline button */
  secondary: 'inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer',
  /** Danger / destructive button */
  danger: 'inline-flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm font-medium rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors cursor-pointer',
  /** Ghost button (no background) */
  ghost: 'inline-flex items-center gap-1 text-xs font-medium text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-pointer',
  /** Icon-only button */
  icon: 'p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer',
}

// ─── Inputs ────────────────────────────────────────────────────────────────────
export const input = {
  /** Standard text input */
  base: 'w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 dark:focus:border-primary-500 transition-all',
  /** Search input (needs pl-10 for icon) */
  search: 'w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 dark:focus:border-primary-500 transition-all',
  /** Native select dropdown */
  select: "w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 dark:focus:border-primary-500 cursor-pointer appearance-none transition-all",
}

// ─── Table ─────────────────────────────────────────────────────────────────────
export const table = {
  /** Table wrapper */
  wrapper: 'bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 overflow-hidden',
  /** Table header row */
  thead: 'border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50',
  /** Table header cell */
  th: 'text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-5 py-3 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 select-none',
  /** Table body row */
  tr: 'border-b border-slate-50 dark:border-slate-800 last:border-0 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors',
  /** Table cell — standard */
  td: 'px-5 py-3 text-sm text-slate-600 dark:text-slate-300',
  /** Table cell — muted */
  tdMuted: 'px-5 py-3 text-sm text-slate-400 dark:text-slate-500',
  /** Pagination footer */
  pagination: 'border-t border-slate-100 dark:border-slate-800 px-5 py-3 flex items-center justify-between',
  /** Pagination text */
  paginationText: 'text-sm text-slate-400 dark:text-slate-500',
  /** Empty state row */
  empty: 'text-center py-12 text-sm text-slate-400 dark:text-slate-500',
}

// ─── Badges / Pills ────────────────────────────────────────────────────────────
export const badge = {
  /** Status badge — active/success */
  success: 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
  /** Status badge — warning/planned */
  warning: 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400',
  /** Status badge — neutral/inactive */
  neutral: 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400',
  /** Status badge — primary */
  primary: 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-500/15 text-primary-600 dark:text-primary-400',
  /** Trend badge — positive */
  trendUp: 'flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold',
}

// ─── Icon Containers ───────────────────────────────────────────────────────────
export const iconBox = {
  primary: 'bg-primary-50 dark:bg-primary-500/15',
  blue: 'bg-blue-50 dark:bg-blue-500/15',
  emerald: 'bg-emerald-50 dark:bg-emerald-500/15',
  purple: 'bg-purple-50 dark:bg-purple-500/15',
  amber: 'bg-amber-50 dark:bg-amber-500/15',
  red: 'bg-red-50 dark:bg-red-500/15',
  slate: 'bg-slate-50 dark:bg-slate-800',
}

// ─── Tabs ──────────────────────────────────────────────────────────────────────
export const tabs = {
  /** Tab bar container */
  bar: 'border-b border-slate-200 dark:border-slate-700',
  /** Active tab */
  active: 'px-5 py-3 text-sm font-medium border-b-2 border-primary-500 text-primary-600 dark:text-primary-400 cursor-pointer transition-colors',
  /** Inactive tab */
  inactive: 'px-5 py-3 text-sm font-medium border-b-2 border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer transition-colors',
}

// ─── Dividers ──────────────────────────────────────────────────────────────────
export const divider = {
  /** Horizontal rule */
  hr: 'border-t border-slate-100 dark:border-slate-800',
  /** Vertical divider */
  vertical: 'w-px bg-slate-100 dark:bg-slate-800',
}

// ─── Section Headers (colored banner style) ────────────────────────────────────
export const sectionHeader = {
  primary: 'bg-primary-500 dark:bg-primary-600 text-white text-sm font-semibold px-5 py-2.5 rounded-t-xl',
  emerald: 'bg-emerald-500 dark:bg-emerald-600 text-white text-sm font-semibold px-5 py-2.5 rounded-t-xl',
  blue: 'bg-blue-500 dark:bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-t-xl',
  amber: 'bg-amber-500 dark:bg-amber-600 text-white text-sm font-semibold px-5 py-2.5 rounded-t-xl',
  dark: 'bg-slate-800 dark:bg-slate-700 text-white text-sm font-semibold px-5 py-2.5 rounded-t-xl',
}

// ─── Utility: merge classes ────────────────────────────────────────────────────
/** Combine multiple class strings, filtering out falsy values */
export function cx(...classes) {
  return classes.filter(Boolean).join(' ')
}
