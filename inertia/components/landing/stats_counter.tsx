import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { useInView } from 'react-intersection-observer'

interface StatsCounterProps {
  value: number
  suffix?: string
  prefix?: string
  duration?: number
  className?: string
  delay?: number
}

export function StatsCounter({
  value,
  suffix = '',
  prefix = '',
  duration = 2,
  className = '',
  delay = 0,
}: StatsCounterProps) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => Math.round(latest))
  const displayValue = useTransform(
    rounded,
    (latest) => `${prefix}${latest.toLocaleString()}${suffix}`
  )
  const hasAnimated = useRef(false)

  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  })

  useEffect(() => {
    if (inView && !hasAnimated.current) {
      hasAnimated.current = true

      const timer = setTimeout(() => {
        const controls = animate(count, value, {
          duration,
          ease: 'easeOut',
        })

        return () => controls.stop()
      }, delay * 1000)

      return () => clearTimeout(timer)
    }
  }, [inView, value, duration, delay, count])

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ scale: 0.8, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.6,
        delay: delay * 0.8,
        ease: [0.21, 1.11, 0.81, 0.99],
      }}
    >
      <motion.span className="text-3xl font-bold text-primary tabular-nums">
        {displayValue}
      </motion.span>
    </motion.div>
  )
}

interface StatsCardProps {
  title: string
  value: number
  suffix?: string
  prefix?: string
  description?: string
  className?: string
  delay?: number
}

export function StatsCard({
  title,
  value,
  suffix = '',
  prefix = '',
  description,
  className = '',
  delay = 0,
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.21, 1.11, 0.81, 0.99],
      }}
      whileHover={{
        y: -5,
        transition: { duration: 0.3 },
      }}
      className={`text-center p-6 bg-card rounded-xl border border-border hover:shadow-lg transition-shadow duration-300 ${className}`}
    >
      <StatsCounter value={value} prefix={prefix} suffix={suffix} delay={delay + 0.3} />

      <motion.div
        className="text-sm font-medium text-foreground mb-1 mt-2"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: delay + 0.6 }}
      >
        {title}
      </motion.div>

      {description && (
        <motion.div
          className="text-xs text-muted-foreground"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: delay + 0.8 }}
        >
          {description}
        </motion.div>
      )}
    </motion.div>
  )
}
