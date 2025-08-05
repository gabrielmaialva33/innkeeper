import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Button } from '~/components/ui/core/button'
import { Link } from '@inertiajs/react'
import { TrendingUp, Shield, Clock } from 'lucide-react'
import { TextReveal } from '~/components/ui/text-reveal'
import { TypingText } from '~/components/ui/typing-text'
import { GridBackground } from '~/components/ui/grid-background'

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
      {/* Multi-layer Background */}
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/20 to-background" />

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-secondary/5" />

      {/* GridBackground with Innkeeper colors */}
      <GridBackground
        gridSize="16:10"
        colors={{
          background: 'bg-transparent',
          borderColor: 'border-muted/15',
          borderSize: '1px',
          borderStyle: 'solid',
        }}
        beams={{
          count: 6,
          colors: [
            'bg-primary/25', // sage green
            'bg-secondary/20', // blue grey
            'bg-accent/20', // terracotta
            'bg-primary/15', // sage green lighter
            'bg-secondary/15', // blue grey lighter
            'bg-accent/15', // terracotta lighter
          ],
          speed: 12,
        }}
        className="absolute inset-0"
      />

      {/* Decorative shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Top right circle */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
        {/* Bottom left circle */}
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-secondary/10 to-transparent rounded-full blur-3xl" />
        {/* Center accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-accent/5 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Subtle noise texture */}
      <div className="absolute inset-0 bg-noise opacity-[0.02]" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto">
        {/* Main Heading */}
        <div className="mb-6">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-foreground mb-4">
            <div className="block">
              <TextReveal
                variant="slideUp"
                delay={0.2}
                staggerDelay={0.05}
                className="hover:scale-105 transition-transform duration-300"
              >
                Innkeeper
              </TextReveal>
            </div>
            <div className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              <TextReveal
                variant="slideUp"
                delay={0.6}
                staggerDelay={0.05}
                className="hover:scale-105 transition-transform duration-300"
              >
                Sistema Hoteleiro
              </TextReveal>
            </div>
          </h1>
        </div>

        {/* Subtitle */}
        <div className="text-lg sm:text-xl lg:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed text-center">
          <div className="mb-2">
            <TextReveal
              variant="fade"
              delay={1.0}
              duration={0.8}
              staggerDelay={0.02}
              className="inline"
            >
              Simplifique a gestão do seu hotel com nossa plataforma completa.
            </TextReveal>
          </div>
          <div className="text-foreground font-medium min-h-[2.5rem] flex items-center justify-center">
            <TypingText
              texts={[
                'Reservas, hóspedes, quartos e relatórios',
                'Check-in/out automatizado e dashboards',
                'Gestão financeira e analytics avançados',
                'CRM completo e housekeeping inteligente',
              ]}
              loop={true}
              speed={80}
              delay={2000}
              pauseDuration={3000}
              showCursor={true}
              cursor="|"
              cursorClassName="text-primary"
            />
          </div>
          <div>
            <TextReveal variant="fade" delay={2.2} duration={0.6} className="inline">
              em um só lugar.
            </TextReveal>
          </div>
        </div>

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
    </motion.div>
  )
}
