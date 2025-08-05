import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Button } from '~/components/ui/core/button'
import { ParticleBackground } from './particle_background'
import { Link } from '@inertiajs/react'
import { Sparkles, TrendingUp, Shield, Clock } from 'lucide-react'

interface HeroSectionProps {
  className?: string
}

export function HeroSection({ className = '' }: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <motion.div
      ref={containerRef}
      className={`relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden ${className}`}
      style={{ y, opacity }}
    >
      {/* Particle Background */}
      <ParticleBackground className="opacity-60" particleCount={80} showOnHover={true} />

      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />

      {/* Gradient Overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto">
        {/* Welcome Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.21, 1.11, 0.81, 0.99] }}
          className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 group hover:bg-primary/15 transition-colors duration-300"
          whileHover={{ scale: 1.05 }}
        >
          <Sparkles className="w-4 h-4 text-primary mr-2" />
          <span className="text-sm font-medium text-primary">
            Bem-vindo ao futuro da gestão hoteleira
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.21, 1.11, 0.81, 0.99] }}
          className="mb-6"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-foreground mb-4">
            <motion.span
              className="block"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              Innkeeper
            </motion.span>
            <motion.span
              className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              Sistema Hoteleiro
            </motion.span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg sm:text-xl lg:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"
        >
          Simplifique a gestão do seu hotel com nossa plataforma completa.{' '}
          <span className="text-foreground font-medium">
            Reservas, hóspedes, quartos e relatórios
          </span>{' '}
          em um só lugar.
        </motion.p>

        {/* Quick Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-6 sm:gap-8 mb-10 text-sm"
        >
          {[
            { icon: TrendingUp, text: 'Usado por 500+ hotéis', color: 'text-success' },
            { icon: Shield, text: '99.9% disponibilidade', color: 'text-primary' },
            { icon: Clock, text: 'Suporte 24/7', color: 'text-accent' },
          ].map((metric, index) => (
            <motion.div
              key={metric.text}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-300"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-2 h-2 bg-current rounded-full" />
              <metric.icon className={`w-4 h-4 ${metric.color}`} />
              <span>{metric.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <Button size="lg" className="w-full sm:w-auto min-w-[200px] text-lg px-8 py-4">
              Ver Demo Gratuita
            </Button>
          </motion.div>

          <Link href="/login">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto min-w-[160px] text-lg px-8 py-4"
              >
                Fazer Login
              </Button>
            </motion.div>
          </Link>

          <Link href="/register">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <Button
                variant="ghost"
                size="lg"
                className="w-full sm:w-auto min-w-[160px] text-lg px-8 py-4 text-primary hover:text-primary-foreground hover:bg-primary"
              >
                Criar Conta
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[
          { size: 'w-16 h-16', position: 'top-20 left-10', delay: 0 },
          { size: 'w-20 h-20', position: 'bottom-20 right-10', delay: 1 },
          { size: 'w-12 h-12', position: 'top-1/2 right-20', delay: 2 },
        ].map((element, index) => (
          <motion.div
            key={index}
            className={`absolute ${element.size} ${element.position} bg-primary/5 rounded-full blur-xl hidden lg:block`}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: element.delay,
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}
