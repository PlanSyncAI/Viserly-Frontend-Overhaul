import { useEffect, useRef } from 'react'
import { useSpring, useTransform, motion, useInView } from 'framer-motion'

export default function AnimatedCounter({
  value,
  duration = 1.2,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  const spring = useSpring(0, {
    duration: duration * 1000,
    bounce: 0,
  })

  const display = useTransform(spring, (current) => {
    const num = decimals > 0
      ? current.toFixed(decimals)
      : Math.round(current).toLocaleString()
    return `${prefix}${num}${suffix}`
  })

  useEffect(() => {
    if (isInView) {
      spring.set(value)
    }
  }, [isInView, value, spring])

  return (
    <motion.span ref={ref} className={className}>
      {display}
    </motion.span>
  )
}
