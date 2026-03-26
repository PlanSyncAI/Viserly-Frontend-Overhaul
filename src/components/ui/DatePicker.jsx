import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay()
}

export default function DatePicker({ value, onChange, placeholder = 'Select date' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const today = new Date()
  const selected = value ? new Date(value + 'T00:00:00') : null

  const [viewYear, setViewYear] = useState(selected?.getFullYear() || today.getFullYear())
  const [viewMonth, setViewMonth] = useState(selected?.getMonth() ?? today.getMonth())

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1) }
    else setViewMonth(viewMonth - 1)
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1) }
    else setViewMonth(viewMonth + 1)
  }

  function selectDay(day) {
    const m = String(viewMonth + 1).padStart(2, '0')
    const d = String(day).padStart(2, '0')
    onChange(`${viewYear}-${m}-${d}`)
    setOpen(false)
  }

  function goToday() {
    const m = String(today.getMonth() + 1).padStart(2, '0')
    const d = String(today.getDate()).padStart(2, '0')
    onChange(`${today.getFullYear()}-${m}-${d}`)
    setViewYear(today.getFullYear())
    setViewMonth(today.getMonth())
    setOpen(false)
  }

  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth)
  const prevDays = getDaysInMonth(viewYear, viewMonth === 0 ? 11 : viewMonth - 1)

  const displayValue = selected
    ? selected.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null

  const isToday = (day) =>
    day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear()

  const isSelected = (day) =>
    selected && day === selected.getDate() && viewMonth === selected.getMonth() && viewYear === selected.getFullYear()

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-800 border rounded-xl text-sm transition-all cursor-pointer text-left ${
          open
            ? 'border-primary-300 dark:border-primary-500 ring-2 ring-primary-500/20'
            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
        }`}
      >
        <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-500/15 flex items-center justify-center shrink-0">
          <CalendarDays size={16} className="text-primary-500" />
        </div>
        <span className={displayValue ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-400 dark:text-slate-500'}>
          {displayValue || placeholder}
        </span>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 top-full mt-2 left-0 w-[300px] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 overflow-hidden"
          >
            {/* Month/Year header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={prevMonth}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronLeft size={16} className="text-slate-400" />
              </button>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {MONTHS[viewMonth]} {viewYear}
              </p>
              <button
                type="button"
                onClick={nextMonth}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronRight size={16} className="text-slate-400" />
              </button>
            </div>

            {/* Day names */}
            <div className="grid grid-cols-7 px-3 pt-3">
              {DAYS.map((d) => (
                <div key={d} className="text-center text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Day grid */}
            <div className="grid grid-cols-7 px-3 pb-2">
              {/* Previous month trailing days */}
              {Array.from({ length: firstDay }, (_, i) => (
                <div key={`prev-${i}`} className="text-center py-1.5">
                  <span className="inline-flex items-center justify-center w-8 h-8 text-xs text-slate-300 dark:text-slate-600">
                    {prevDays - firstDay + i + 1}
                  </span>
                </div>
              ))}
              {/* Current month days */}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1
                const sel = isSelected(day)
                const tod = isToday(day)
                return (
                  <div key={day} className="text-center py-1">
                    <button
                      type="button"
                      onClick={() => selectDay(day)}
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        sel
                          ? 'bg-primary-500 text-white shadow-sm shadow-primary-500/30'
                          : tod
                            ? 'bg-primary-50 dark:bg-primary-500/15 text-primary-600 dark:text-primary-400 font-bold'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {day}
                    </button>
                  </div>
                )
              })}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <button
                type="button"
                onClick={() => { onChange(''); setOpen(false) }}
                className="text-xs font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={goToday}
                className="text-xs font-semibold text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-pointer"
              >
                Today
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
