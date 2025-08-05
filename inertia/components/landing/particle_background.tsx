import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  opacity: number
  size: number
}

interface ParticleBackgroundProps {
  className?: string
  particleCount?: number
  showOnHover?: boolean
}

export function ParticleBackground({
  className = '',
  particleCount = 50,
  showOnHover = true,
}: ParticleBackgroundProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>()
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect()
        setDimensions({ width, height })
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  useEffect(() => {
    if (!svgRef.current || !dimensions.width || !dimensions.height) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    // Initialize particles
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * dimensions.width,
      y: Math.random() * dimensions.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.3 + 0.1,
      size: Math.random() * 2 + 1,
    }))

    const particles = svg
      .selectAll('circle')
      .data(particlesRef.current)
      .enter()
      .append('circle')
      .attr('r', (d) => d.size)
      .attr('fill', 'currentColor')
      .attr('opacity', (d) => (showOnHover ? 0 : d.opacity))
      .style('pointer-events', 'none')

    // Animation loop
    const animate = () => {
      particlesRef.current.forEach((particle) => {
        // Update position
        particle.x += particle.vx
        particle.y += particle.vy

        // Bounce off walls
        if (particle.x <= 0 || particle.x >= dimensions.width) particle.vx *= -1
        if (particle.y <= 0 || particle.y >= dimensions.height) particle.vy *= -1

        // Keep particles in bounds
        particle.x = Math.max(0, Math.min(dimensions.width, particle.x))
        particle.y = Math.max(0, Math.min(dimensions.height, particle.y))

        // Mouse interaction
        if (isHovered) {
          const dx = mouseRef.current.x - particle.x
          const dy = mouseRef.current.y - particle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            const force = (100 - distance) / 100
            particle.vx += (dx / distance) * force * 0.02
            particle.vy += (dy / distance) * force * 0.02
          }
        }

        // Apply friction
        particle.vx *= 0.99
        particle.vy *= 0.99
      })

      particles
        .attr('cx', (d) => d.x)
        .attr('cy', (d) => d.y)
        .attr('opacity', (d) => {
          if (showOnHover) {
            return isHovered ? d.opacity : 0
          }
          return d.opacity
        })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [dimensions, particleCount, isHovered, showOnHover])

  const handleMouseMove = (event: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      mouseRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      }
    }
  }

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      style={{ pointerEvents: showOnHover ? 'auto' : 'none' }}
    >
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="text-primary/20"
      />
    </div>
  )
}
