import { Head } from '@inertiajs/react'
import { Calendar, TrendingUp } from 'lucide-react'

import { MainLayout } from '~/layouts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/core/card'
import { Button } from '~/components/ui/core/button'
import { useAuth } from '~/hooks/use_auth'
import { BarChart } from '~/components/charts/bar_chart'
import { QuickStats, OccupancyChart, BookingsList, HousekeepingStatus } from '~/components/hotel'

interface HotelStats {
  totalRooms: number
  occupiedRooms: number
  availableRooms: number
  occupancyRate: number
  averageRate: number
  totalRevenue: number
  todayCheckIns: number
  todayCheckOuts: number
}

interface Booking {
  id: number
  guestName: string
  roomNumber: string
  checkIn: string
  checkOut: string
  status: 'confirmed' | 'pending' | 'checked_in' | 'checked_out'
  amount: number
}

interface OccupancyTrend {
  date: string
  occupancy: number
}

interface RoomTypeOccupancy {
  type: string
  total: number
  occupied: number
  rate: number
}

interface HousekeepingStatus {
  clean: number
  dirty: number
  outOfOrder: number
  maintenance: number
}

interface Props {
  hotelStats: HotelStats
  recentBookings: Booking[]
  occupancyTrend: OccupancyTrend[]
  roomTypeOccupancy: RoomTypeOccupancy[]
  housekeepingStatus: HousekeepingStatus
}

export default function HotelDashboardPage({
  hotelStats,
  recentBookings,
  occupancyTrend,
  roomTypeOccupancy,
  housekeepingStatus,
}: Props) {
  const { user } = useAuth()

  const roomTypeChartData = roomTypeOccupancy.map((item) => ({
    name: item.type,
    occupied: item.occupied,
    available: item.total - item.occupied,
  }))

  return (
    <MainLayout>
      <Head title="Hotel Dashboard" />

      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Hotel Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {user?.full_name}. Here's your hotel performance overview.
            </p>
          </div>
          <div className="flex gap-2 mt-4 sm:mt-0">
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-1" />
              Night Audit
            </Button>
            <Button size="sm">
              <TrendingUp className="h-4 w-4 mr-1" />
              Full Report
            </Button>
          </div>
        </div>

        {/* Key Stats Grid */}
        <QuickStats stats={hotelStats} />

        {/* Charts Section */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <OccupancyChart
              data={occupancyTrend}
              title="Occupancy Trend (7 Days)"
              description="Daily occupancy percentage over the past week"
            />
          </div>
          <HousekeepingStatus status={housekeepingStatus} />
        </div>

        {/* Room Type Occupancy */}
        <Card>
          <CardHeader>
            <CardTitle>Room Type Occupancy</CardTitle>
            <CardDescription>Current occupancy by room category</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart data={roomTypeChartData} bars={[]} xAxisKey={''} />
          </CardContent>
        </Card>

        {/* Recent Bookings */}
        <BookingsList bookings={recentBookings} />
      </div>
    </MainLayout>
  )
}
