import * as React from 'react'
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion'
import { cn } from '~/utils/cn'

interface CountingNumberProps {
  value: number
  className?: string
  duration?: number
  delay?: number
  format?: (value: number) => string
  suffix?: string
  prefix?: string
  once?: boolean
}

export function CountingNumber({
  value,
  className,
  duration = 2,
  delay = 0,
  format,
  suffix = '',
  prefix = '',
  once = true,
}: CountingNumberProps) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, {
    duration: duration * 1000,
    bounce: 0,
  })
  const isInView = useInView(ref, { once, margin: '-50px' })
  const [displayValue, setDisplayValue] = React.useState(0)

  React.useEffect(() => {
    springValue.on('change', (latest) => {
      setDisplayValue(Math.round(latest))
    })
  }, [springValue])

  React.useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        motionValue.set(value)
      }, delay * 1000)

      return () => clearTimeout(timer)
    }
  }, [motionValue, isInView, value, delay])

  const formattedValue = React.useMemo(() => {
    const formatted = format ? format(displayValue) : displayValue.toString()
    return `${prefix}${formatted}${suffix}`
  }, [displayValue, format, prefix, suffix])

  return (
    <motion.span
      ref={ref}
      className={cn('tabular-nums', className)}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{
        duration: 0.5,
        delay: delay,
        ease: 'easeOut',
      }}
    >
      {formattedValue}
    </motion.span>
  )
}
