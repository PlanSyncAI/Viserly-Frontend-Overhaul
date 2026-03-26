import { useId } from 'react'
import { motion } from 'framer-motion'

/**
 * Hand-crafted SVG sparkline with optional gradient fill.
 * Generates a smooth bezier curve from data points.
 */
export default function Sparkline({
  data = [],
  width = 120,
  height = 40,
  color = '#635BFF',
  fillOpacity = 0.15,
  filled = true,
  strokeWidth = 2,
  animate = true,
  className = '',
}) {
  const id = useId()

  if (!data.length) return null

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  // Map data to SVG coordinates with padding
  const padding = strokeWidth
  const chartW = width - padding * 2
  const chartH = height - padding * 2

  const points = data.map((val, i) => ({
    x: padding + (i / (data.length - 1)) * chartW,
    y: padding + chartH - ((val - min) / range) * chartH,
  }))

  // Generate smooth bezier curve path
  function smoothPath(pts) {
    if (pts.length < 2) return ''
    let d = `M ${pts[0].x},${pts[0].y}`
    for (let i = 0; i < pts.length - 1; i++) {
      const curr = pts[i]
      const next = pts[i + 1]
      const cpx = (curr.x + next.x) / 2
      d += ` C ${cpx},${curr.y} ${cpx},${next.y} ${next.x},${next.y}`
    }
    return d
  }

  const linePath = smoothPath(points)
  const areaPath = `${linePath} L ${points[points.length - 1].x},${height} L ${points[0].x},${height} Z`

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      className={className}
    >
      <defs>
        <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={fillOpacity} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>

      {/* Gradient fill area */}
      {filled && (
        <motion.path
          d={areaPath}
          fill={`url(#${id}-fill)`}
          initial={animate ? { opacity: 0 } : undefined}
          animate={animate ? { opacity: 1 } : undefined}
          transition={{ duration: 0.8, delay: 0.4 }}
        />
      )}

      {/* Line */}
      <motion.path
        d={linePath}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={animate ? { pathLength: 0 } : undefined}
        animate={animate ? { pathLength: 1 } : undefined}
        transition={{ duration: 1, ease: 'easeOut' }}
      />

      {/* End dot */}
      <motion.circle
        cx={points[points.length - 1].x}
        cy={points[points.length - 1].y}
        r={3}
        fill={color}
        initial={animate ? { opacity: 0, scale: 0 } : undefined}
        animate={animate ? { opacity: 1, scale: 1 } : undefined}
        transition={{ duration: 0.3, delay: 0.9 }}
      />
    </svg>
  )
}
