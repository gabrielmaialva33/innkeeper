import { Star, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Skeleton } from '~/components/ui/skeleton'
import { cn } from '~/lib/utils'

interface RoomPerformance {
  id: number
  number: string
  type: string
  revenue: number
  bookings: number
  rating: number
}

interface Props {
  isLoading?: boolean
}

// Mock data for now
const topRooms: RoomPerformance[] = [
  { id: 1, number: '501', type: 'Presidential Suite', revenue: 12500, bookings: 8, rating: 4.9 },
  { id: 2, number: '401', type: 'Honeymoon Suite', revenue: 8900, bookings: 12, rating: 4.8 },
  { id: 3, number: '305', type: 'Ocean View Deluxe', revenue: 6700, bookings: 15, rating: 4.7 },
  { id: 4, number: '202', type: 'Business Suite', revenue: 5400, bookings: 18, rating: 4.6 },
  { id: 5, number: '103', type: 'Standard Double', revenue: 4200, bookings: 22, rating: 4.5 },
]

export function TopPerformingRooms({ isLoading }: Props) {
  if (isLoading) {
    return (
      <Card className="hotel-card">
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-6 w-20" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="hotel-card relative overflow-hidden">
      <div className="absolute top-0 right-0 p-6">
        <div className="w-12 h-12 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
        </div>
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Top Performing Rooms
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {topRooms.map((room, index) => (
            <div
              key={room.id}
              className={cn(
                'flex items-center justify-between p-3 rounded-lg',
                'hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors',
                index === 0 && 'bg-green-50/50 dark:bg-green-900/10'
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold',
                    index === 0
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : index === 1
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                        : index === 2
                          ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
                  )}
                >
                  #{index + 1}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Room {room.number}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{room.type}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  ${room.revenue.toLocaleString()}
                </p>
                <div className="flex items-center gap-2 justify-end mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {room.bookings} bookings
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">{room.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Based on last 30 days performance
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
