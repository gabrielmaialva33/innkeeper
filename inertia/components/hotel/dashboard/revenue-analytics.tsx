import { TrendingUp, DollarSign, BarChart3, TrendingDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Skeleton } from '~/components/ui/skeleton'
import { cn } from '~/lib/utils'
import { ApexOptions } from 'apexcharts'
import { lazy, Suspense } from 'react'

const Chart = lazy(() => import('react-apexcharts'))

interface Props {
  revenue: number
  adr: number // Average Daily Rate
  revpar: number // Revenue Per Available Room
  trend: Array<{
    date: string
    revenue: number
    occupancy: number
  }>
  isLoading?: boolean
}

export function RevenueAnalytics({ revenue, adr, revpar, trend, isLoading }: Props) {
  const yesterdayRevenue = revenue * 0.92 // Mock comparison
  const revenueChange = ((revenue - yesterdayRevenue) / yesterdayRevenue) * 100
  const isPositive = revenueChange > 0

  // Chart configuration matching Metronic style
  const chartOptions: ApexOptions = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: {
        show: false,
      },
      sparkline: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      categories: trend.map((t) => t.date),
      labels: {
        style: {
          colors: '#6B7280',
          fontSize: '11px',
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#6B7280',
          fontSize: '11px',
        },
        formatter: (value) => `$${value.toLocaleString()}`,
      },
    },
    grid: {
      borderColor: '#E5E7EB',
      strokeDashArray: 5,
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    tooltip: {
      theme: 'light',
      x: {
        show: true,
      },
      y: {
        formatter: (value) => `$${value.toLocaleString()}`,
      },
    },
    colors: ['#3B82F6', '#10B981'],
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'right',
      fontSize: '12px',
      markers: {
        width: 10,
        height: 10,
        radius: 10,
      },
      itemMargin: {
        horizontal: 10,
      },
    },
  }

  const series = [
    {
      name: 'Revenue',
      data: trend.map((t) => t.revenue),
    },
    {
      name: 'Occupancy %',
      data: trend.map((t) => t.occupancy),
    },
  ]

  if (isLoading) {
    return (
      <Card className="hotel-card">
        <CardHeader>
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-24" />
              </div>
            ))}
          </div>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="hotel-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium text-gray-900 dark:text-white">
            Revenue Analytics
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">Last 7 days</span>
            <Badge variant={isPositive ? 'success' : 'destructive'} className="text-xs">
              {isPositive ? (
                <TrendingUp className="w-3 h-3 mr-1" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-1" />
              )}
              {Math.abs(revenueChange).toFixed(1)}%
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-4">
          {/* Total Revenue */}
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Total Revenue</span>
            </div>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              ${revenue.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">+12.5% from last week</p>
          </div>

          {/* ADR */}
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400">ADR</span>
            </div>
            <p className="text-xl font-bold text-gray-900 dark:text-white">${adr.toFixed(2)}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Average daily rate</p>
          </div>

          {/* RevPAR */}
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400">RevPAR</span>
            </div>
            <p className="text-xl font-bold text-gray-900 dark:text-white">${revpar.toFixed(2)}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Per available room</p>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="pt-4">
          <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
            <Chart options={chartOptions} series={series} type="area" height={300} />
          </Suspense>
        </div>

        {/* Revenue Breakdown */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Revenue by Source
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Room Revenue</span>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                ${(revenue * 0.75).toLocaleString()} (75%)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">F&B Revenue</span>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                ${(revenue * 0.15).toLocaleString()} (15%)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Other Services</span>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                ${(revenue * 0.1).toLocaleString()} (10%)
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
