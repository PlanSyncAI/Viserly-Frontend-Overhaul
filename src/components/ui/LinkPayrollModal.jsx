import { useState } from 'react'
import { X, Search, Check } from 'lucide-react'
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
            className="relative bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-lg mx-4 flex flex-col max-h-[80vh]"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Link Payroll Provider
              </h2>
              <button
                onClick={handleClose}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 pb-2 space-y-5 overflow-y-auto flex-1 min-h-0">
              {/* Select Account */}
              <div>
                <label className="text-sm font-medium text-primary-600 mb-2 block">
                  Select Account
                </label>
                <select
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                  }}
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
                <label className="text-sm font-medium text-primary-600 mb-2 block">
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
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all"
                  />
                </div>

                {/* Provider List */}
                <div className="border border-slate-200 rounded-lg overflow-y-auto max-h-52">
                  {filtered.length === 0 ? (
                    <div className="px-4 py-6 text-center text-sm text-slate-400 dark:text-slate-500">
                      No providers found
                    </div>
                  ) : (
                    filtered.map((provider) => (
                      <button
                        key={provider}
                        onClick={() => setSelectedProvider(provider)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors border-b border-slate-100 last:border-b-0 ${
                          selectedProvider === provider
                            ? 'bg-primary-50 text-primary-700'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {/* Provider icon placeholder */}
                        <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-[10px] font-bold text-slate-400">
                            {provider.charAt(0)}
                          </span>
                        </div>
                        <span className="flex-1 truncate">{provider}</span>
                        {selectedProvider === provider && (
                          <Check size={16} className="text-primary-600 flex-shrink-0" />
                        )}
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 mt-2">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLink}
                disabled={!selectedAccount || !selectedProvider}
                className="px-5 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Link
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
