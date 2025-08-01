import { Head } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import { TodayOverview } from '~/components/hotel/dashboard/today-overview'
import { OccupancyMetrics } from '~/components/hotel/dashboard/occupancy-metrics'
import { RevenueAnalytics } from '~/components/hotel/dashboard/revenue-analytics'
import { RecentReservations } from '~/components/hotel/dashboard/recent-reservations'
import { RoomStatusSummary } from '~/components/hotel/dashboard/room-status-summary'
import { HousekeepingStatus } from '~/components/hotel/dashboard/housekeeping-status'
import { TopPerformingRooms } from '~/components/hotel/dashboard/top-performing-rooms'

interface Props {
  user: {
    id: number
    name: string
    email: string
  }
  stats: {
    todayCheckins: number
    todayCheckouts: number
    occupancyRate: number
    totalRevenue: number
    adr: number
    revpar: number
  }
  recentBookings: any[]
  roomStatus: any
  occupancyTrend: any[]
}

export default function DashboardMetronic({
  user,
  stats,
  recentBookings,
  roomStatus,
  occupancyTrend,
}: Props) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading state
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <Head title="Hotel Dashboard" />

      <div className="flex flex-col gap-5 lg:gap-7.5">
        {/* Welcome Section */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Welcome back, {user.name}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Here's what's happening at your property today
          </p>
        </div>

        {/* Today's Overview - 3 columns like Store Admin */}
        <div className="grid lg:grid-cols-3 gap-5 lg:gap-7.5">
          <TodayOverview
            checkins={stats.todayCheckins}
            checkouts={stats.todayCheckouts}
            isLoading={isLoading}
          />
          <OccupancyMetrics
            occupancyRate={stats.occupancyRate}
            totalRooms={150}
            isLoading={isLoading}
          />
          <TopPerformingRooms isLoading={isLoading} />
        </div>

        {/* Revenue Analytics and Room Status - 2/3 + 1/3 split */}
        <div className="grid lg:grid-cols-3 gap-5 lg:gap-7.5">
          <div className="lg:col-span-2">
            <RevenueAnalytics
              revenue={stats.totalRevenue}
              adr={stats.adr}
              revpar={stats.revpar}
              trend={occupancyTrend}
              isLoading={isLoading}
            />
          </div>

          <div className="lg:col-span-1">
            <RoomStatusSummary statusData={roomStatus} isLoading={isLoading} />
          </div>
        </div>

        {/* Recent Reservations - Full width like Recent Orders */}
        <div className="grid lg:grid-cols-1">
          <div className="lg:col-span-1">
            <RecentReservations reservations={recentBookings} isLoading={isLoading} />
          </div>
        </div>

        {/* Housekeeping Status - Additional hotel-specific section */}
        <div className="grid lg:grid-cols-1">
          <div className="lg:col-span-1">
            <HousekeepingStatus isLoading={isLoading} />
          </div>
        </div>
      </div>
    </>
  )
}
