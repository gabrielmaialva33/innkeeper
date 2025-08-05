import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'

interface TimelineItem {
  id: string
  title: string
  subtitle: string
  description: string
  icon: LucideIcon
  color: string
}

interface InteractiveTimelineProps {
  items: TimelineItem[]
  className?: string
}

export function InteractiveTimeline({ items, className = '' }: InteractiveTimelineProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Animated line */}
      <motion.div
        className="absolute left-8 top-0 w-0.5 bg-gradient-to-b from-primary/20 via-primary/40 to-primary/20"
        initial={{ height: 0 }}
        whileInView={{ height: '100%' }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      />

      <div className="space-y-12">
        {items.map((item, index) => (
          <TimelineItemComponent
            key={item.id}
            item={item}
            index={index}
            isLast={index === items.length - 1}
          />
        ))}
      </div>
    </div>
  )
}

interface TimelineItemComponentProps {
  item: TimelineItem
  index: number
  isLast: boolean
}

function TimelineItemComponent({ item, index, isLast }: TimelineItemComponentProps) {
  const { title, subtitle, description, icon: Icon, color } = item

  return (
    <motion.div
      className="relative flex items-start gap-6"
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{
        duration: 0.8,
        delay: index * 0.2,
        ease: [0.21, 1.11, 0.81, 0.99],
      }}
    >
      {/* Timeline dot */}
      <motion.div
        className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-2xl border-4 border-background shadow-lg`}
        style={{ backgroundColor: color }}
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.6,
          delay: index * 0.2 + 0.3,
          type: 'spring',
          stiffness: 400,
          damping: 10,
        }}
        whileHover={{
          scale: 1.1,
          rotate: 5,
          transition: { duration: 0.3 },
        }}
      >
        <Icon className="w-7 h-7 text-white" />

        {/* Pulse animation */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{ backgroundColor: color }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.8, 0.3, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>

      {/* Content */}
      <motion.div
        className="flex-1 min-w-0"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.6,
          delay: index * 0.2 + 0.5,
        }}
      >
        {/* Time badge */}
        <motion.div
          className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-3"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <span className="text-sm font-medium text-primary">{subtitle}</span>
        </motion.div>

        {/* Title */}
        <motion.h3
          className="text-xl font-semibold text-foreground mb-3"
          whileHover={{ x: 5 }}
          transition={{ duration: 0.2 }}
        >
          {title}
        </motion.h3>

        {/* Description */}
        <motion.p
          className="text-muted-foreground leading-relaxed"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: index * 0.2 + 0.7 }}
        >
          {description}
        </motion.p>

        {/* Decorative line */}
        {!isLast && (
          <motion.div
            className="mt-8 h-px bg-gradient-to-r from-border to-transparent"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.8,
              delay: index * 0.2 + 0.9,
            }}
            style={{ originX: 0 }}
          />
        )}
      </motion.div>

      {/* Background card */}
      <motion.div
        className="absolute inset-0 -inset-x-4 bg-card/50 rounded-xl border border-border/50 -z-10"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.6,
          delay: index * 0.2 + 0.1,
        }}
        whileHover={{
          scale: 1.02,
          transition: { duration: 0.3 },
        }}
      />
    </motion.div>
  )
}

// Legacy timeline components for backward compatibility
export function Timeline({ children }: { children: ReactNode }) {
  return <div className="space-y-8">{children}</div>
}

export function TimelineContent({ children }: { children: ReactNode }) {
  return <div className="flex gap-4">{children}</div>
}

export function TimelineDot({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`flex items-center justify-center w-12 h-12 rounded-full ${className}`}>
      {children}
    </div>
  )
}

export function TimelineHeader({ children }: { children: ReactNode }) {
  return <div className="flex-1">{children}</div>
}

export function TimelineTime({ children }: { children: ReactNode }) {
  return <div className="text-sm font-medium text-muted-foreground mb-1">{children}</div>
}

export function TimelineTitle({ children }: { children: ReactNode }) {
  return <h3 className="font-semibold text-foreground mb-2">{children}</h3>
}

export function TimelineDescription({ children }: { children: ReactNode }) {
  return <p className="text-muted-foreground leading-relaxed">{children}</p>
}
