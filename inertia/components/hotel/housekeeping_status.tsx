import { CheckCircle, Clock, AlertTriangle, Wrench } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/core/card'
import { PieChart } from '~/components/charts/pie_chart'

interface HousekeepingStatus {
  clean: number
  dirty: number
  outOfOrder: number
  maintenance: number
}

interface HousekeepingStatusProps {
  status: HousekeepingStatus
  title?: string
  description?: string
}

export function HousekeepingStatus({
  status,
  title = 'Room Status',
  description = 'Current housekeeping status',
}: HousekeepingStatusProps) {
  const chartData = [
    { name: 'Clean', value: status.clean, color: '#22c55e' },
    { name: 'Dirty', value: status.dirty, color: '#f59e0b' },
    { name: 'Out of Order', value: status.outOfOrder, color: '#ef4444' },
    { name: 'Maintenance', value: status.maintenance, color: '#8b5cf6' },
  ]

  const statusItems = [
    {
      label: 'Clean',
      value: status.clean,
      icon: CheckCircle,
      color: 'text-green-500',
    },
    {
      label: 'Dirty',
      value: status.dirty,
      icon: Clock,
      color: 'text-yellow-500',
    },
    {
      label: 'Out of Order',
      value: status.outOfOrder,
      icon: AlertTriangle,
      color: 'text-red-500',
    },
    {
      label: 'Maintenance',
      value: status.maintenance,
      icon: Wrench,
      color: 'text-purple-500',
    },
  ]

  const total = status.clean + status.dirty + status.outOfOrder + status.maintenance

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <PieChart data={chartData} />
          <div className="grid grid-cols-2 gap-3">
            {statusItems.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <item.icon className={`h-3 w-3 ${item.color}`} />
                <span className="text-sm">
                  {item.label}: {item.value}
                </span>
              </div>
            ))}
          </div>
          <div className="pt-2 border-t text-sm text-muted-foreground">Total rooms: {total}</div>
        </div>
      </CardContent>
    </Card>
  )
}
