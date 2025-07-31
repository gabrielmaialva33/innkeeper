import * as React from 'react'
import { cn } from '~/utils/cn'

interface TimelineProps {
  children: React.ReactNode
  className?: string
}

export function Timeline({ children, className }: TimelineProps) {
  return <div className={cn('relative space-y-6', className)}>{children}</div>
}

interface TimelineItemProps {
  children: React.ReactNode
  className?: string
}

export function TimelineItem({ children, className }: TimelineItemProps) {
  return <div className={cn('relative flex gap-4', className)}>{children}</div>
}

interface TimelineDotProps {
  children?: React.ReactNode
  className?: string
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'destructive'
}

export function TimelineDot({ children, className, variant = 'default' }: TimelineDotProps) {
  const variantStyles = {
    default: 'bg-muted-foreground/20 border-muted-foreground/30',
    primary: 'bg-primary/20 border-primary',
    success: 'bg-green-500/20 border-green-500',
    warning: 'bg-yellow-500/20 border-yellow-500',
    destructive: 'bg-destructive/20 border-destructive',
  }

  return (
    <div className="relative flex flex-col items-center">
      <div
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-full border-2',
          variantStyles[variant],
          className
        )}
      >
        {children}
      </div>
      <div className="absolute top-10 h-full w-0.5 bg-border" />
    </div>
  )
}

interface TimelineContentProps {
  children: React.ReactNode
  className?: string
}

export function TimelineContent({ children, className }: TimelineContentProps) {
  return <div className={cn('flex-1 pb-8', className)}>{children}</div>
}

interface TimelineHeaderProps {
  children: React.ReactNode
  className?: string
}

export function TimelineHeader({ children, className }: TimelineHeaderProps) {
  return <div className={cn('mb-1 flex items-center gap-2', className)}>{children}</div>
}

interface TimelineTitleProps {
  children: React.ReactNode
  className?: string
}

export function TimelineTitle({ children, className }: TimelineTitleProps) {
  return <h3 className={cn('font-semibold leading-none tracking-tight', className)}>{children}</h3>
}

interface TimelineTimeProps {
  children: React.ReactNode
  className?: string
}

export function TimelineTime({ children, className }: TimelineTimeProps) {
  return <time className={cn('text-sm text-muted-foreground', className)}>{children}</time>
}

interface TimelineDescriptionProps {
  children: React.ReactNode
  className?: string
}

export function TimelineDescription({ children, className }: TimelineDescriptionProps) {
  return <p className={cn('text-sm text-muted-foreground', className)}>{children}</p>
}
