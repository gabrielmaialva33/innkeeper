import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'

interface Orb {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
  hue: number
}

interface GradientOrbsProps {
  className?: string
  orbCount?: number
  maxRadius?: number
}

export function GradientOrbs({
  className = '',
  orbCount = 6,
  maxRadius = 120,
}: GradientOrbsProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const orbsRef = useRef<Orb[]>([])
  const animationRef = useRef<number>()

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

    // Create gradient definitions
    const defs = svg.append('defs')
    
    // Initialize orbs
    orbsRef.current = Array.from({ length: orbCount }, (_, i) => ({
      x: Math.random() * dimensions.width,
      y: Math.random() * dimensions.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * maxRadius + 40,
      opacity: Math.random() * 0.15 + 0.05,
      hue: 120 + (Math.random() - 0.5) * 60, // Green variations
    }))

    orbsRef.current.forEach((orb, i) => {
      const gradient = defs
        .append('radialGradient')
        .attr('id', `orb-gradient-${i}`)
        .attr('cx', '50%')
        .attr('cy', '50%')
        .attr('r', '50%')

      gradient
        .append('stop')
        .attr('offset', '0%')
        .attr('stop-color', `hsl(${orb.hue}, 40%, 60%)`)
        .attr('stop-opacity', orb.opacity)

      gradient
        .append('stop')
        .attr('offset', '100%')
        .attr('stop-color', `hsl(${orb.hue}, 40%, 60%)`)
        .attr('stop-opacity', 0)
    })

    const orbsGroup = svg.append('g').attr('class', 'orbs-group')

    const animate = () => {
      orbsRef.current.forEach((orb) => {
        // Update position
        orb.x += orb.vx
        orb.y += orb.vy

        // Bounce off edges with margin
        const margin = orb.radius / 2
        if (orb.x <= margin || orb.x >= dimensions.width - margin) orb.vx *= -1
        if (orb.y <= margin || orb.y >= dimensions.height - margin) orb.vy *= -1

        // Keep orbs in bounds
        orb.x = Math.max(margin, Math.min(dimensions.width - margin, orb.x))
        orb.y = Math.max(margin, Math.min(dimensions.height - margin, orb.y))
      })

      const selection = orbsGroup
        .selectAll('circle')
        .data(orbsRef.current)

      selection
        .enter()
        .append('circle')
        .merge(selection as any)
        .attr('cx', (d) => d.x)
        .attr('cy', (d) => d.y)
        .attr('r', (d) => d.radius)
        .attr('fill', (_, i) => `url(#orb-gradient-${i})`)
        .style('pointer-events', 'none')
        .style('mix-blend-mode', 'multiply')

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [dimensions, orbCount, maxRadius])

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="opacity-60"
      />
    </div>
  )
}