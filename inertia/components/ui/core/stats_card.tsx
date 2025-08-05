import * as React from 'react'
import { ArrowDown, ArrowUp, LucideIcon } from 'lucide-react'
import { cn } from '~/utils/cn'
import { Card, CardContent } from './card'
import { CountingNumber } from '~/components/ui/counting-number'

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon?: LucideIcon
  trend?: {
    value: number
    label?: string
    type?: 'up' | 'down'
  }
  className?: string
  animate?: boolean
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
  animate = true,
}: StatsCardProps) {
  const isPositiveTrend = trend && (trend.type === 'up' || trend.value > 0)

  return (
    <Card className={cn('relative overflow-hidden', className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-2xl font-bold tracking-tight">
                {animate && typeof value === 'number' ? (
                  <CountingNumber value={value} delay={0.2} duration={2} />
                ) : animate && typeof value === 'string' && value.match(/^\+?(\d+)%?$/) ? (
                  <>
                    {value.startsWith('+') ? '+' : ''}
                    <CountingNumber
                      value={parseInt(value.replace(/[+%]/g, ''))}
                      delay={0.2}
                      duration={1.5}
                    />
                    {value.endsWith('%') ? '%' : ''}
                  </>
                ) : (
                  value
                )}
              </h2>
              {trend && (
                <span
                  className={cn(
                    'flex items-center text-xs font-medium',
                    isPositiveTrend ? 'text-success' : 'text-destructive'
                  )}
                >
                  {isPositiveTrend ? (
                    <ArrowUp className="mr-0.5 h-3 w-3" />
                  ) : (
                    <ArrowDown className="mr-0.5 h-3 w-3" />
                  )}
                  {Math.abs(trend.value)}%
                  {trend.label && <span className="ml-1 text-muted-foreground">{trend.label}</span>}
                </span>
              )}
            </div>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>
          {Icon && (
            <div className="rounded-full bg-primary/10 p-3">
              <Icon className="h-6 w-6 text-primary" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface StatsGridProps {
  children: React.ReactNode
  className?: string
  columns?: 1 | 2 | 3 | 4
}

export function StatsGrid({ children, className, columns = 4 }: StatsGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }

  return <div className={cn('grid gap-4', gridCols[columns], className)}>{children}</div>
}
