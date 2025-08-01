import { Bed, DollarSign, TrendingUp, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/core/card'

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

interface QuickStatsProps {
  stats: HotelStats
}

export function QuickStats({ stats }: QuickStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const statCards = [
    {
      title: 'Occupancy Rate',
      value: `${stats.occupancyRate}%`,
      description: `${stats.occupiedRooms} of ${stats.totalRooms} rooms occupied`,
      icon: Bed,
      color: 'text-blue-600',
    },
    {
      title: 'Average Rate',
      value: formatCurrency(stats.averageRate),
      description: 'Per room per night',
      icon: DollarSign,
      color: 'text-green-600',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      description: "Today's earnings",
      icon: TrendingUp,
      color: 'text-purple-600',
    },
    {
      title: 'Guest Activity',
      value: stats.todayCheckIns.toString(),
      description: `Check-ins today • ${stats.todayCheckOuts} check-outs`,
      icon: Users,
      color: 'text-orange-600',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
