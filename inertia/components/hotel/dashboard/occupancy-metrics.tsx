import { Building2, TrendingDown, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Progress } from '~/components/ui/progress'
import { Skeleton } from '~/components/ui/skeleton'
import { cn } from '~/lib/utils'

interface Props {
  occupancyRate: number
  totalRooms: number
  isLoading?: boolean
}

export function OccupancyMetrics({ occupancyRate, totalRooms, isLoading }: Props) {
  const occupiedRooms = Math.round((occupancyRate / 100) * totalRooms)
  const availableRooms = totalRooms - occupiedRooms
  const yesterdayRate = occupancyRate - 5 // Mock data for comparison
  const trend = occupancyRate > yesterdayRate ? 'up' : 'down'
  const trendValue = Math.abs(occupancyRate - yesterdayRate)

  if (isLoading) {
    return (
      <Card className="hotel-card">
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-2 w-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="hotel-card relative overflow-hidden">
      <div className="absolute top-0 right-0 p-6">
        <div className="w-12 h-12 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
          <Building2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        </div>
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Occupancy Rate
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {occupancyRate}%
            </span>
            <Badge variant={trend === 'up' ? 'success' : 'destructive'} className="text-xs">
              {trend === 'up' ? (
                <TrendingUp className="w-3 h-3 mr-1" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-1" />
              )}
              {trendValue}%
            </Badge>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">vs. yesterday</p>
        </div>

        {/* Progress bar */}
        <div>
          <Progress
            value={occupancyRate}
            className="h-3"
            indicatorClassName={cn(
              occupancyRate > 80
                ? 'bg-green-500'
                : occupancyRate > 60
                  ? 'bg-blue-500'
                  : occupancyRate > 40
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
            )}
          />
        </div>

        {/* Room breakdown */}
        <div className="space-y-2 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Occupied Rooms</span>
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {occupiedRooms}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Available Rooms</span>
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {availableRooms}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Rooms</span>
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">{totalRooms}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
