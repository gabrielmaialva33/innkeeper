import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, ReactNode } from 'react'

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  y?: number
  scale?: number
  opacity?: number
}

export function ScrollReveal({
  children,
  className = '',
  delay = 0,
  duration = 0.8,
  y = 60,
  scale = 0.95,
  opacity = 0,
}: ScrollRevealProps) {
  return (
    <motion.div
      className={className}
      initial={{
        y,
        scale,
        opacity,
      }}
      whileInView={{
        y: 0,
        scale: 1,
        opacity: 1,
      }}
      viewport={{
        once: true,
        margin: '-100px',
      }}
      transition={{
        duration,
        delay,
        ease: [0.21, 1.11, 0.81, 0.99],
      }}
    >
      {children}
    </motion.div>
  )
}

interface ParallaxContainerProps {
  children: ReactNode
  className?: string
  speed?: number
}

export function ParallaxContainer({
  children,
  className = '',
  speed = 0.5,
}: ParallaxContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', `${speed * 100}%`])

  return (
    <div ref={containerRef} className={className}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  )
}

interface StaggerContainerProps {
  children: ReactNode
  className?: string
  staggerDelay?: number
}

export function StaggerContainer({
  children,
  className = '',
  staggerDelay = 0.1,
}: StaggerContainerProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: {
          y: 60,
          opacity: 0,
          scale: 0.95,
        },
        visible: {
          y: 0,
          opacity: 1,
          scale: 1,
          transition: {
            duration: 0.8,
            ease: [0.21, 1.11, 0.81, 0.99],
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}
