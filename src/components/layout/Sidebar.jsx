import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home,
  Users,
  Database,
  PieChart,
  FileText,
  Download,
  Megaphone,
  History,
  User,
  GraduationCap,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Bell,
  Moon,
  Sun,
} from 'lucide-react'
import { useTheme } from '../../lib/useTheme'
import GlobalSearch from './GlobalSearch'

const navSections = [
  {
    items: [
      { label: 'Home', icon: Home, path: '/' },
    ],
  },
  {
    title: 'Data Studio',
    items: [
      { label: 'Participant Data', icon: Users, path: '/participant-data' },
      { label: 'Plan Data', icon: Database, path: '/plan-data' },
      { label: 'Segmentations', icon: PieChart, path: '/segmentations' },
      { label: 'Templates', icon: FileText, path: '/templates' },
      { label: 'Import Data', icon: Download, path: '/import-data' },
    ],
  },
  {
    title: 'Campaigns',
    items: [
      { label: 'My Campaigns', icon: Megaphone, path: '/campaigns' },
      { label: 'Communication History', icon: History, path: '/communication-history' },
    ],
  },
  {
    title: 'Settings',
    items: [
      { label: 'User Profile', icon: User, path: '/user-profile' },
      { label: 'Learning Center', icon: GraduationCap, path: '/learning-center' },
    ],
  },
]

function SidebarLink({ icon: Icon, label, collapsed, isActive, ...props }) {
  return (
    <NavLink
      className={`
        group flex items-center gap-3 rounded-lg transition-all duration-150 relative
        ${collapsed ? 'justify-center px-0 py-2.5 mx-1' : 'px-3 py-2'}
        ${isActive
          ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400'
          : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
        }
      `}
      title={collapsed ? label : undefined}
      {...props}
    >
      <Icon
        size={20}
        strokeWidth={isActive ? 2 : 1.75}
        className={`flex-shrink-0 ${isActive ? 'text-primary-500 dark:text-primary-400' : ''}`}
      />
      <AnimatePresence>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.15 }}
            className={`text-[13.5px] whitespace-nowrap overflow-hidden ${isActive ? 'font-medium' : 'font-normal'}`}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </NavLink>
  )
}

function SidebarButton({ icon: Icon, label, collapsed, badge, onClick, ...rest }) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full relative flex items-center gap-3 rounded-lg transition-all duration-150
        text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer
        ${collapsed ? 'justify-center px-0 py-2.5 mx-1' : 'px-3 py-2'}
      `}
      title={collapsed ? label : undefined}
      {...rest}
    >
      <Icon size={20} strokeWidth={1.75} className="flex-shrink-0" />
      {badge && (
        <span
          className="absolute w-2 h-2 bg-primary-500 rounded-full"
          style={collapsed ? { top: 8, right: 14 } : { top: 8, left: 28 }}
        />
      )}
      <AnimatePresence>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.15 }}
            className="text-[13.5px] whitespace-nowrap overflow-hidden"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}

export default function Sidebar({ collapsed, onToggle }) {
  const location = useLocation()
  const { dark, toggle } = useTheme()

  return (
    <motion.aside
      className="h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col flex-shrink-0 sticky top-0 z-40"
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
    >
      {/* Logo */}
      <div className="h-14 flex items-center px-5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">V</span>
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.15 }}
                className="font-semibold text-slate-900 dark:text-white text-lg tracking-tight whitespace-nowrap overflow-hidden"
              >
                Viserly
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 pt-3 pb-1">
        <GlobalSearch collapsed={collapsed} />
      </div>

      {/* Scrollable navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-6">
        {navSections.map((section, sIdx) => (
          <div key={sIdx}>
            <AnimatePresence>
              {section.title && !collapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                  className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-2"
                >
                  {section.title}
                </motion.p>
              )}
            </AnimatePresence>
            {collapsed && section.title && (
              <div className="h-px bg-slate-100 dark:bg-slate-800 mx-2 mb-2" />
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <SidebarLink
                  key={item.path}
                  to={item.path}
                  icon={item.icon}
                  label={item.label}
                  collapsed={collapsed}
                  isActive={location.pathname === item.path}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Dark mode & Notifications — inside scrollable area */}
        <div>
          {!collapsed && (
            <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-2">
              Preferences
            </p>
          )}
          {collapsed && <div className="h-px bg-slate-100 dark:bg-slate-800 mx-2 mb-2" />}
          <div className="space-y-0.5">
            <SidebarButton
              icon={dark ? Sun : Moon}
              label={dark ? 'Light Mode' : 'Dark Mode'}
              collapsed={collapsed}
              onClick={toggle}
            />
            <SidebarButton
              icon={Bell}
              label="Notifications"
              collapsed={collapsed}
              badge
              onClick={() => {}}
            />
          </div>
        </div>
      </nav>

      {/* Bottom: collapse toggle + user (always visible, not scrollable) */}
      <div className="border-t border-slate-100 dark:border-slate-800 p-3 space-y-1">
        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          className={`
            w-full flex items-center gap-3 rounded-lg transition-all duration-150 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer
            ${collapsed ? 'justify-center px-0 py-2.5 mx-1' : 'px-3 py-2'}
          `}
        >
          {collapsed ? (
            <ChevronsRight size={20} strokeWidth={1.75} />
          ) : (
            <>
              <ChevronsLeft size={20} strokeWidth={1.75} />
              <span className="text-[13.5px]">Collapse</span>
            </>
          )}
        </button>

        {/* User profile */}
        <NavLink
          to="/user-profile"
          className={`flex items-center gap-3 rounded-lg transition-all duration-150 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer
            ${collapsed ? 'justify-center p-1.5' : 'px-3 py-2'}
          `}
          title={collapsed ? 'Cameron Abernethy' : undefined}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-semibold">CA</span>
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.15 }}
                className="overflow-hidden"
              >
                <p className="text-sm font-medium text-slate-900 dark:text-white whitespace-nowrap">Cameron</p>
                <p className="text-[11px] text-slate-400 whitespace-nowrap">cameron@viserly.com</p>
              </motion.div>
            )}
          </AnimatePresence>
        </NavLink>
      </div>
    </motion.aside>
  )
}
