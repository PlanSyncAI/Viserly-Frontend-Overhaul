import { useState } from 'react'
import { X, Search, Check, Link2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import payrollProviders from '../../lib/payrollProviders'

const accounts = [
  { id: 1, name: 'Acme Corp' },
  { id: 2, name: 'TechStart Inc' },
]

export default function LinkPayrollModal({ open, onClose }) {
  const [selectedAccount, setSelectedAccount] = useState('')
  const [selectedProvider, setSelectedProvider] = useState('')
  const [search, setSearch] = useState('')

  const filtered = payrollProviders.filter((p) =>
    p.toLowerCase().includes(search.toLowerCase())
  )

  function handleLink() {
    if (selectedAccount && selectedProvider) {
      onClose()
    }
  }

  function handleClose() {
    setSelectedAccount('')
    setSelectedProvider('')
    setSearch('')
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-lg mx-4 flex flex-col max-h-[90vh] sm:max-h-[80vh]"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 pt-5 sm:pt-6 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary-50 dark:bg-primary-500/15 flex items-center justify-center">
                  <Link2 size={18} className="text-primary-500" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Link Payroll Provider
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="px-4 sm:px-6 pb-2 space-y-5 overflow-y-auto flex-1 min-h-0">
              {/* Select Account */}
              <div>
                <label className="text-sm font-medium text-primary-600 dark:text-primary-400 mb-2 block">
                  Select Account
                </label>
                <select
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all appearance-none cursor-pointer pr-10 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_12px_center] bg-no-repeat"
                >
                  <option value="">Select an account</option>
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Payroll Provider */}
              <div className="flex flex-col min-h-0">
                <label className="text-sm font-medium text-primary-600 dark:text-primary-400 mb-2 block">
                  Select Payroll Provider
                </label>

                {/* Search */}
                <div className="relative mb-2">
                  <Search
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    placeholder="Search providers..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all"
                  />
                </div>

                {/* Provider List */}
                <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-y-auto max-h-52">
                  {filtered.length === 0 ? (
                    <div className="px-4 py-6 text-center text-sm text-slate-400 dark:text-slate-500">
                      No providers found
                    </div>
                  ) : (
                    filtered.map((provider) => (
                      <button
                        key={provider}
                        onClick={() => setSelectedProvider(provider)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors border-b border-slate-100 dark:border-slate-800 last:border-b-0 cursor-pointer ${
                          selectedProvider === provider
                            ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          selectedProvider === provider
                            ? 'bg-primary-100 dark:bg-primary-500/20'
                            : 'bg-slate-100 dark:bg-slate-800'
                        }`}>
                          <span className={`text-[10px] font-bold ${
                            selectedProvider === provider
                              ? 'text-primary-600 dark:text-primary-400'
                              : 'text-slate-400 dark:text-slate-500'
                          }`}>
                            {provider.charAt(0)}
                          </span>
                        </div>
                        <span className="flex-1 truncate">{provider}</span>
                        {selectedProvider === provider && (
                          <Check size={16} className="text-primary-600 dark:text-primary-400 flex-shrink-0" />
                        )}
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-4 sm:px-6 py-4 border-t border-slate-100 dark:border-slate-800 mt-2">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleLink}
                disabled={!selectedAccount || !selectedProvider}
                className="px-5 py-2 text-sm font-medium text-white bg-primary-500 dark:bg-primary-600 rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Link Provider
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
