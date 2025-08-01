import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/core/card'
import { AreaChart } from '~/components/charts/area_chart'

interface OccupancyTrend {
  date: string
  occupancy: number
}

interface OccupancyChartProps {
  data: OccupancyTrend[]
  title?: string
  description?: string
}

export function OccupancyChart({
  data,
  title = 'Occupancy Trend',
  description = 'Daily occupancy percentage over time',
}: OccupancyChartProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  const chartData = data.map((item) => ({
    name: formatDate(item.date),
    value: item.occupancy,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <AreaChart data={chartData} />
      </CardContent>
    </Card>
  )
}
