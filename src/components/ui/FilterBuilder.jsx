import { Plus, X } from 'lucide-react'
import { FILTER_FIELDS, OPERATORS } from '../../lib/segmentationData'

export default function FilterBuilder({ filters, onChange }) {
  function updateFilter(index, key, value) {
    const updated = filters.map((f, i) => (i === index ? { ...f, [key]: value } : f))
    onChange(updated)
  }

  function addFilter() {
    onChange([...filters, { field: '', operator: '', value: '' }])
  }

  function removeFilter(index) {
    const updated = filters.filter((_, i) => i !== index)
    onChange(updated.length ? updated : [{ field: '', operator: '', value: '' }])
  }

  const activeCount = filters.filter((f) => f.field && f.operator).length

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 p-4 md:p-6">
      <div className="flex items-start justify-between mb-1">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">Audience Filters</h3>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">
            Combine conditions to define exactly who belongs in this segment.
          </p>
        </div>
        {activeCount > 0 && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 text-primary-600">
            {activeCount} active
          </span>
        )}
      </div>

      <div className="mt-5 space-y-3">
        {filters.map((filter, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 p-4 rounded-xl border-l-3 border-l-primary-400 bg-slate-50/50 border border-slate-100"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
              {/* Field */}
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Field</label>
                <select
                  value={filter.field}
                  onChange={(e) => updateFilter(idx, 'field', e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 cursor-pointer appearance-none"
                >
                  <option value="">Select Field</option>
                  {FILTER_FIELDS.map((f) => (
                    <option key={f.key} value={f.key}>{f.label}</option>
                  ))}
                </select>
              </div>

              {/* Operator */}
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Operator</label>
                <select
                  value={filter.operator}
                  onChange={(e) => updateFilter(idx, 'operator', e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 cursor-pointer appearance-none"
                >
                  <option value="">Select Operator</option>
                  {OPERATORS.map((op) => (
                    <option key={op.key} value={op.key}>{op.label}</option>
                  ))}
                </select>
              </div>

              {/* Value */}
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Value</label>
                <input
                  type="text"
                  value={filter.value}
                  onChange={(e) => updateFilter(idx, 'value', e.target.value)}
                  placeholder="Enter value"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300"
                />
              </div>
            </div>

            {/* Remove */}
            {filters.length > 1 && (
              <button
                onClick={() => removeFilter(idx)}
                className="mt-7 p-1.5 rounded-md text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="mt-3 flex justify-end">
        <button
          onClick={addFilter}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors cursor-pointer"
        >
          <Plus size={14} />
          Add Filter
        </button>
      </div>
    </div>
  )
}
