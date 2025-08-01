import { ArrowDown, ArrowUp, Calendar, LogIn, LogOut, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Skeleton } from '~/components/ui/skeleton'
import { cn } from '~/lib/utils'

interface Props {
  checkins: number
  checkouts: number
  isLoading?: boolean
}

export function TodayOverview({ checkins, checkouts, isLoading }: Props) {
  const totalMovements = checkins + checkouts
  const checkinsPercentage = totalMovements > 0 ? (checkins / totalMovements) * 100 : 0

  if (isLoading) {
    return (
      <Card className="hotel-card">
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-20" />
          <div className="space-y-3">
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
        <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
          <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Today's Activity
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">{totalMovements}</div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Total movements today</p>
        </div>

        <div className="space-y-3">
          {/* Check-ins */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center',
                  'bg-green-50 dark:bg-green-900/20'
                )}
              >
                <LogIn className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Check-ins</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Expected arrivals</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{checkins}</p>
              <Badge variant="secondary" className="text-xs">
                {checkinsPercentage.toFixed(0)}%
              </Badge>
            </div>
          </div>

          {/* Check-outs */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center',
                  'bg-orange-50 dark:bg-orange-900/20'
                )}
              >
                <LogOut className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Check-outs</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Expected departures</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{checkouts}</p>
              <Badge variant="secondary" className="text-xs">
                {(100 - checkinsPercentage).toFixed(0)}%
              </Badge>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
            <span>Activity Distribution</span>
            <span>{totalMovements} total</span>
          </div>
          <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="flex h-full">
              <div
                className="bg-green-500 transition-all duration-500"
                style={{ width: `${checkinsPercentage}%` }}
              />
              <div
                className="bg-orange-500 transition-all duration-500"
                style={{ width: `${100 - checkinsPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
