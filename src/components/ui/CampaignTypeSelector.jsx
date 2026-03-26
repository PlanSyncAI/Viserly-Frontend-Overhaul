import { motion } from 'framer-motion'
import { Mail, GitBranch, ChevronRight } from 'lucide-react'

const types = [
  {
    key: 'single',
    label: 'Single Send',
    description: 'Send one email to your segmented audience at a scheduled time.',
    icon: Mail,
    color: 'blue',
    features: ['One email template', 'Scheduled delivery', 'Full engagement tracking'],
  },
  {
    key: 'drip',
    label: 'Drip Sequence',
    description: 'Build a multi-step email sequence with delays and conditions between steps.',
    icon: GitBranch,
    color: 'purple',
    features: ['Multiple email steps', 'Configurable delays', 'Conditional branching'],
  },
]

const colorMap = {
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-500/15',
    icon: 'text-blue-500',
    selectedBorder: 'border-blue-400 dark:border-blue-500/60',
    selectedBg: 'bg-blue-50/30 dark:bg-blue-500/5',
    selectedRing: 'ring-blue-500/20',
    dot: 'bg-blue-500',
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-500/15',
    icon: 'text-purple-500',
    selectedBorder: 'border-purple-400 dark:border-purple-500/60',
    selectedBg: 'bg-purple-50/30 dark:bg-purple-500/5',
    selectedRing: 'ring-purple-500/20',
    dot: 'bg-purple-500',
  },
}

export default function CampaignTypeSelector({ value, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-5 max-w-2xl mx-auto">
      {types.map((type) => {
        const Icon = type.icon
        const colors = colorMap[type.color]
        const selected = value === type.key

        return (
          <motion.button
            key={type.key}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange(type.key)}
            className={`relative text-left p-6 rounded-2xl border-2 transition-all cursor-pointer ${
              selected
                ? `${colors.selectedBorder} ${colors.selectedBg} ring-2 ${colors.selectedRing}`
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md'
            }`}
          >
            {/* Selected indicator */}
            {selected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`absolute top-4 right-4 w-5 h-5 rounded-full ${colors.dot} flex items-center justify-center`}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.div>
            )}

            {/* Icon */}
            <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center mb-4`}>
              <Icon size={24} strokeWidth={1.75} className={colors.icon} />
            </div>

            {/* Text */}
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{type.label}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">{type.description}</p>

            {/* Features */}
            <ul className="space-y-1.5">
              {type.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <ChevronRight size={12} className={selected ? colors.icon : 'text-slate-300 dark:text-slate-600'} />
                  {feature}
                </li>
              ))}
            </ul>
          </motion.button>
        )
      })}
    </div>
  )
}
