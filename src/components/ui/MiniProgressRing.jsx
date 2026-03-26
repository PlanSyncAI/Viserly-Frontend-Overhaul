import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

/**
 * SVG circular progress ring with animated fill.
 */
export default function MiniProgressRing({
  value = 0,
  size = 44,
  strokeWidth = 4,
  color = '#635BFF',
  className = '',
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-20px' })

  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  return (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
    >
      {/* Background track — uses currentColor for dark mode support */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-slate-200 dark:text-slate-700"
      />

      {/* Progress arc */}
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={isInView ? { strokeDashoffset: offset } : { strokeDashoffset: circumference }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  )
}
