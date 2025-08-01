import { Bed, Home, Wrench, Lock, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Progress } from '~/components/ui/progress'
import { Skeleton } from '~/components/ui/skeleton'
import { cn } from '~/lib/utils'

interface RoomStatus {
  occupied: number
  vacant: number
  maintenance: number
  blocked: number
  dirty: number
}

interface Props {
  statusData: RoomStatus
  isLoading?: boolean
}

export function RoomStatusSummary({ statusData, isLoading }: Props) {
  const totalRooms = Object.values(statusData || {}).reduce((sum, count) => sum + count, 0)

  const statusConfig = [
    {
      label: 'Occupied',
      value: statusData?.occupied || 0,
      icon: Bed,
      color: 'bg-red-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      iconColor: 'text-red-600 dark:text-red-400',
    },
    {
      label: 'Vacant Clean',
      value: statusData?.vacant || 0,
      icon: Home,
      color: 'bg-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      iconColor: 'text-green-600 dark:text-green-400',
    },
    {
      label: 'Maintenance',
      value: statusData?.maintenance || 0,
      icon: Wrench,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      iconColor: 'text-yellow-600 dark:text-yellow-400',
    },
    {
      label: 'Blocked',
      value: statusData?.blocked || 0,
      icon: Lock,
      color: 'bg-gray-500',
      bgColor: 'bg-gray-50 dark:bg-gray-800',
      iconColor: 'text-gray-600 dark:text-gray-400',
    },
    {
      label: 'Dirty',
      value: statusData?.dirty || 0,
      icon: AlertCircle,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      iconColor: 'text-orange-600 dark:text-orange-400',
    },
  ]

  if (isLoading) {
    return (
      <Card className="hotel-card">
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-32 w-full" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-6 w-12" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="hotel-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Room Status Overview
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {totalRooms} rooms
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Visual Room Grid */}
        <div className="grid grid-cols-10 gap-1 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          {[...Array(totalRooms)].map((_, index) => {
            let colorClass = 'bg-gray-300'
            if (index < statusData.occupied) {
              colorClass = 'bg-red-500'
            } else if (index < statusData.occupied + statusData.vacant) {
              colorClass = 'bg-green-500'
            } else if (index < statusData.occupied + statusData.vacant + statusData.maintenance) {
              colorClass = 'bg-yellow-500'
            } else if (
              index <
              statusData.occupied + statusData.vacant + statusData.maintenance + statusData.blocked
            ) {
              colorClass = 'bg-gray-500'
            } else {
              colorClass = 'bg-orange-500'
            }

            return <div key={index} className={cn('w-full aspect-square rounded-sm', colorClass)} />
          })}
        </div>

        {/* Status Breakdown */}
        <div className="space-y-3">
          {statusConfig.map((status) => {
            const percentage = totalRooms > 0 ? (status.value / totalRooms) * 100 : 0

            return (
              <div key={status.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center',
                        status.bgColor
                      )}
                    >
                      <status.icon className={cn('w-4 h-4', status.iconColor)} />
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {status.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {status.value}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {percentage.toFixed(0)}%
                    </Badge>
                  </div>
                </div>
                <Progress value={percentage} className="h-1.5" indicatorClassName={status.color} />
              </div>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Quick Actions</p>
          <div className="grid grid-cols-2 gap-2">
            <button className="px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              View Floor Plan
            </button>
            <button className="px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              Room Report
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
