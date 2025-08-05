import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'

interface FloatingDot {
  x: number
  y: number
  targetY: number
  size: number
  opacity: number
  speed: number
  phase: number
}

interface FloatingDotsProps {
  className?: string
  dotCount?: number
  columns?: number
}

export function FloatingDots({
  className = '',
  dotCount = 80,
  columns = 8,
}: FloatingDotsProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const dotsRef = useRef<FloatingDot[]>([])
  const animationRef = useRef<number>()
  const timeRef = useRef(0)

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

    // Create dots in a grid pattern
    const columnWidth = dimensions.width / columns
    const rows = Math.ceil(dotCount / columns)
    const rowHeight = dimensions.height / rows

    dotsRef.current = Array.from({ length: dotCount }, (_, i) => {
      const col = i % columns
      const row = Math.floor(i / columns)
      const baseX = col * columnWidth + columnWidth / 2
      const baseY = row * rowHeight + rowHeight / 2
      
      // Add some randomness to avoid perfect grid
      const x = baseX + (Math.random() - 0.5) * 40
      const y = baseY + (Math.random() - 0.5) * 40

      return {
        x,
        y: y + Math.random() * 20,
        targetY: y,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.4 + 0.1,
        speed: Math.random() * 0.02 + 0.01,
        phase: Math.random() * Math.PI * 2,
      }
    })

    const dotsGroup = svg.append('g').attr('class', 'floating-dots')

    const animate = () => {
      timeRef.current += 0.016 // ~60fps

      dotsRef.current.forEach((dot) => {
        // Gentle floating motion
        const wave = Math.sin(timeRef.current * dot.speed + dot.phase) * 15
        dot.y = dot.targetY + wave

        // Gentle opacity pulsing
        const opacityWave = Math.sin(timeRef.current * dot.speed * 0.5 + dot.phase) * 0.1
        dot.opacity = Math.max(0.05, Math.min(0.5, dot.opacity + opacityWave))
      })

      const selection = dotsGroup
        .selectAll('circle')
        .data(dotsRef.current)

      selection
        .enter()
        .append('circle')
        .merge(selection as any)
        .attr('cx', (d) => d.x)
        .attr('cy', (d) => d.y)
        .attr('r', (d) => d.size)
        .attr('fill', 'currentColor')
        .attr('opacity', (d) => d.opacity)
        .style('pointer-events', 'none')

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [dimensions, dotCount, columns])

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
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