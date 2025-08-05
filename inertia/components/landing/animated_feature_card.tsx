import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { ReactNode } from 'react'
import { TextReveal } from '~/components/ui/text-reveal'

interface AnimatedFeatureCardProps {
  title: string
  description: string
  icon: LucideIcon
  className?: string
  delay?: number
  children?: ReactNode
}

export function AnimatedFeatureCard({
  title,
  description,
  icon: Icon,
  className = '',
  delay = 0,
  children,
}: AnimatedFeatureCardProps) {
  return (
    <motion.div
      initial={{ y: 60, opacity: 0, scale: 0.95 }}
      whileInView={{ y: 0, opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.21, 1.11, 0.81, 0.99],
      }}
      whileHover={{
        y: -12,
        scale: 1.02,
        transition: {
          duration: 0.3,
          ease: 'easeOut',
        },
      }}
      className={`group relative bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 ${className}`}
    >
      {/* Hover gradient overlay */}
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background:
            'linear-gradient(135deg, rgba(var(--primary), 0.05) 0%, rgba(var(--secondary), 0.05) 100%)',
        }}
      />

      <div className="relative z-10">
        {/* Icon container */}
        <motion.div
          className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300"
          whileHover={{
            scale: 1.1,
            rotate: 5,
          }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 10,
          }}
        >
          <Icon className="w-7 h-7 text-primary" />
        </motion.div>

        {/* Content */}
        <motion.h3
          className="font-semibold text-foreground mb-3 text-lg group-hover:text-primary transition-colors duration-300"
          layout
        >
          <TextReveal variant="slideUp" delay={delay + 0.2} staggerDelay={0.03}>
            {title}
          </TextReveal>
        </motion.h3>

        <motion.p className="text-muted-foreground leading-relaxed" layout>
          <TextReveal variant="fade" delay={delay + 0.4} staggerDelay={0.01}>
            {description}
          </TextReveal>
        </motion.p>

        {children && (
          <motion.div className="mt-4" layout>
            {children}
          </motion.div>
        )}
      </div>

      {/* Decorative elements */}
      <motion.div
        className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0, 0.3, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Hover border effect */}
      <motion.div
        className="absolute inset-0 rounded-xl border-2 border-primary/0 group-hover:border-primary/20 transition-colors duration-300"
        whileHover={{
          boxShadow: 'inset 0 0 20px rgba(132, 167, 122, 0.1)',
        }}
      />
    </motion.div>
  )
}
