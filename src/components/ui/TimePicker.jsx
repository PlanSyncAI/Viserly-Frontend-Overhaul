import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock } from 'lucide-react'

const HOURS_12 = Array.from({ length: 12 }, (_, i) => i + 1)
const MINUTES = ['00', '15', '30', '45']

function parse24(timeStr) {
  if (!timeStr) return { hour: 9, minute: 0, period: 'AM' }
  const [h, m] = timeStr.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h === 0 ? 12 : h > 12 ? h - 12 : h
  return { hour, minute: m, period }
}

function to24(hour, minute, period) {
  let h = hour
  if (period === 'AM' && h === 12) h = 0
  else if (period === 'PM' && h !== 12) h += 12
  return `${String(h).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

export default function TimePicker({ value, onChange, placeholder = 'Select time' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const { hour, minute, period } = parse24(value)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function selectTime(h, m, p) {
    onChange(to24(h, m, p))
  }

  const displayValue = value
    ? new Date(`2000-01-01T${value}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    : null

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
        <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-500/15 flex items-center justify-center shrink-0">
          <Clock size={16} className="text-purple-500" />
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
            {/* AM/PM toggle */}
            <div className="px-4 pt-4 pb-2">
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
                {['AM', 'PM'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => selectTime(hour, minute, p)}
                    className={`flex-1 px-4 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                      period === p
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Hour label */}
            <div className="px-4 pt-2 pb-1">
              <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Hour</p>
            </div>

            {/* Hour grid */}
            <div className="grid grid-cols-6 gap-1 px-4 pb-3">
              {HOURS_12.map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => selectTime(h, minute, period)}
                  className={`py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    hour === h
                      ? 'bg-primary-500 text-white shadow-sm shadow-primary-500/30'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>

            {/* Minute label */}
            <div className="px-4 pb-1">
              <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Minute</p>
            </div>

            {/* Minute grid */}
            <div className="grid grid-cols-4 gap-1 px-4 pb-3">
              {MINUTES.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => { selectTime(hour, parseInt(m), period); setOpen(false) }}
                  className={`py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    minute === parseInt(m)
                      ? 'bg-purple-500 text-white shadow-sm shadow-purple-500/30'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  :{m}
                </button>
              ))}
            </div>

            {/* Quick presets */}
            <div className="px-4 py-2.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <div className="flex items-center gap-1.5">
                {[
                  { label: '9:00 AM', val: '09:00' },
                  { label: '12:00 PM', val: '12:00' },
                  { label: '3:00 PM', val: '15:00' },
                  { label: '5:00 PM', val: '17:00' },
                ].map((preset) => (
                  <button
                    key={preset.val}
                    type="button"
                    onClick={() => { onChange(preset.val); setOpen(false) }}
                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
                      value === preset.val
                        ? 'bg-primary-50 dark:bg-primary-500/15 text-primary-600 dark:text-primary-400'
                        : 'text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
