import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'

interface GeometricShape {
  x: number
  y: number
  size: number
  rotation: number
  rotationSpeed: number
  opacity: number
  shape: 'triangle' | 'diamond' | 'hexagon'
}

interface GeometricBackgroundProps {
  className?: string
  shapeCount?: number
  maxSize?: number
}

export function GeometricBackground({
  className = '',
  shapeCount = 12,
  maxSize = 40,
}: GeometricBackgroundProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const shapesRef = useRef<GeometricShape[]>([])
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

  const createPath = (shape: GeometricShape) => {
    const { x, y, size, shape: type } = shape
    const halfSize = size / 2

    switch (type) {
      case 'triangle':
        return `M ${x} ${y - halfSize} L ${x - halfSize} ${y + halfSize} L ${x + halfSize} ${y + halfSize} Z`
      case 'diamond':
        return `M ${x} ${y - halfSize} L ${x + halfSize} ${y} L ${x} ${y + halfSize} L ${x - halfSize} ${y} Z`
      case 'hexagon':
        const points = Array.from({ length: 6 }, (_, i) => {
          const angle = (i * Math.PI) / 3
          return `${x + halfSize * Math.cos(angle)},${y + halfSize * Math.sin(angle)}`
        }).join(' ')
        return `M ${points.split(' ')[0]} L ${points.split(' ').slice(1).join(' ')} Z`
      default:
        return ''
    }
  }

  useEffect(() => {
    if (!svgRef.current || !dimensions.width || !dimensions.height) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    // Initialize geometric shapes
    const shapes = ['triangle', 'diamond', 'hexagon'] as const
    shapesRef.current = Array.from({ length: shapeCount }, () => ({
      x: Math.random() * dimensions.width,
      y: Math.random() * dimensions.height,
      size: Math.random() * maxSize + 10,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.08 + 0.02,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
    }))

    const geometryGroup = svg.append('g').attr('class', 'geometry-group')

    const animate = () => {
      shapesRef.current.forEach((shape) => {
        shape.rotation += shape.rotationSpeed
      })

      const selection = geometryGroup
        .selectAll('path')
        .data(shapesRef.current)

      selection
        .enter()
        .append('path')
        .merge(selection as any)
        .attr('d', createPath)
        .attr('fill', 'currentColor')
        .attr('opacity', (d) => d.opacity)
        .attr('transform', (d) => `rotate(${d.rotation}, ${d.x}, ${d.y})`)
        .style('pointer-events', 'none')

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [dimensions, shapeCount, maxSize])

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="text-primary/30"
      />
    </div>
  )
}