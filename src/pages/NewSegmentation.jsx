import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LayoutGrid, ArrowLeft, Eye } from 'lucide-react'
import FilterBuilder from '../components/ui/FilterBuilder'

export default function NewSegmentation() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [filters, setFilters] = useState([{ field: '', operator: '', value: '' }])
  const [errors, setErrors] = useState({})

  function handleCreate() {
    const newErrors = {}
    if (!name.trim()) newErrors.name = 'Complete this field.'
    if (!description.trim()) newErrors.description = 'Complete this field.'
    setErrors(newErrors)
    if (Object.keys(newErrors).length === 0) {
      // In a real app, this would save to the backend
      navigate('/segmentations')
    }
  }

  return (
    <div className="p-8 max-w-[900px] mx-auto space-y-6">
      {/* Back */}
      <button
        onClick={() => navigate('/segmentations')}
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
      >
        <ArrowLeft size={16} />
        Back to Segmentations
      </button>

      {/* Hero header */}
      <div className="text-center py-8 bg-gradient-to-b from-primary-50/60 to-transparent rounded-2xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-100/80 text-primary-600 text-xs font-semibold mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
          INTELLIGENT SEGMENTATION
        </div>
        <div className="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center mx-auto mb-4">
          <LayoutGrid size={28} strokeWidth={1.5} className="text-primary-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white dark:text-white tracking-tight">
          Segment Your Data With Precision
        </h2>
        <p className="text-sm text-slate-400 mt-2">
          Build dynamic audiences, filter with intent, and activate insights instantly.
        </p>
      </div>

      {/* Segment Details */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 p-6">
        <div className="mb-5">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">Segment Details</h3>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">Name your audience and describe its business purpose.</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${errors.name ? 'text-red-500' : 'text-slate-700'}`}>
              <span className="text-red-400">*</span> Segment Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setErrors({ ...errors, name: undefined }) }}
              className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${
                errors.name
                  ? 'border-red-300 focus:ring-red-500/20 focus:border-red-400'
                  : 'border-slate-200 focus:ring-primary-500/20 focus:border-primary-300'
              }`}
              placeholder="e.g. High Balance Participants"
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${errors.description ? 'text-red-500' : 'text-slate-700'}`}>
              <span className="text-red-400">*</span> Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => { setDescription(e.target.value); setErrors({ ...errors, description: undefined }) }}
              className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${
                errors.description
                  ? 'border-red-300 focus:ring-red-500/20 focus:border-red-400'
                  : 'border-slate-200 focus:ring-primary-500/20 focus:border-primary-300'
              }`}
              placeholder="Describe the segment purpose"
            />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
          </div>
        </div>
      </div>

      {/* Audience Filters */}
      <FilterBuilder filters={filters} onChange={setFilters} />

      {/* Actions */}
      <div className="flex items-center gap-4 pt-2">
        <button
          onClick={() => {}}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <Eye size={16} />
          Preview Data
        </button>
        <div className="flex-1" />
        <button
          onClick={handleCreate}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary-500 dark:bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-colors cursor-pointer"
        >
          Create Segment
        </button>
      </div>
    </div>
  )
}
