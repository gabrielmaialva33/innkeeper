import { Sparkles, Clock, AlertTriangle, CheckCircle, Home, MoreVertical } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Progress } from '~/components/ui/progress'
import { Skeleton } from '~/components/ui/skeleton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { cn } from '~/lib/utils'

interface HousekeepingTask {
  id: number
  roomNumber: string
  floor: number
  status: 'clean' | 'in-progress' | 'dirty' | 'inspected'
  assignedTo: string
  priority: 'high' | 'medium' | 'low'
  type: 'checkout' | 'stayover' | 'deep-clean'
  estimatedTime: number // in minutes
  startedAt?: string
}

interface Props {
  isLoading?: boolean
}

// Mock data
const housekeepingTasks: HousekeepingTask[] = [
  {
    id: 1,
    roomNumber: '201',
    floor: 2,
    status: 'in-progress',
    assignedTo: 'Maria S.',
    priority: 'high',
    type: 'checkout',
    estimatedTime: 45,
    startedAt: '10:30 AM',
  },
  {
    id: 2,
    roomNumber: '305',
    floor: 3,
    status: 'dirty',
    assignedTo: 'John D.',
    priority: 'high',
    type: 'checkout',
    estimatedTime: 45,
  },
  {
    id: 3,
    roomNumber: '412',
    floor: 4,
    status: 'clean',
    assignedTo: 'Sarah L.',
    priority: 'medium',
    type: 'stayover',
    estimatedTime: 20,
  },
  {
    id: 4,
    roomNumber: '108',
    floor: 1,
    status: 'inspected',
    assignedTo: 'Mike R.',
    priority: 'low',
    type: 'deep-clean',
    estimatedTime: 90,
  },
  {
    id: 5,
    roomNumber: '501',
    floor: 5,
    status: 'dirty',
    assignedTo: 'Emma W.',
    priority: 'medium',
    type: 'checkout',
    estimatedTime: 45,
  },
]

const statusConfig = {
  'clean': {
    label: 'Clean',
    icon: CheckCircle,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
  },
  'in-progress': {
    label: 'In Progress',
    icon: Clock,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
  },
  'dirty': {
    label: 'Dirty',
    icon: AlertTriangle,
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
  },
  'inspected': {
    label: 'Inspected',
    icon: Sparkles,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
  },
}

const priorityConfig = {
  high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  low: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
}

export function HousekeepingStatus({ isLoading }: Props) {
  const totalTasks = housekeepingTasks.length
  const completedTasks = housekeepingTasks.filter(
    (t) => t.status === 'clean' || t.status === 'inspected'
  ).length
  const progress = (completedTasks / totalTasks) * 100

  if (isLoading) {
    return (
      <Card className="hotel-card">
        <CardHeader>
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="hotel-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium text-gray-900 dark:text-white">
            Housekeeping Status
          </CardTitle>
          <Button size="sm" className="text-xs">
            Assign Tasks
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Progress Overview */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Daily Progress</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {completedTasks} of {totalTasks} rooms completed
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {progress.toFixed(0)}%
              </p>
            </div>
          </div>
          <Progress value={progress} className="h-2" />

          <div className="grid grid-cols-4 gap-2 pt-2">
            {Object.entries(statusConfig).map(([key, config]) => {
              const count = housekeepingTasks.filter((t) => t.status === key).length
              return (
                <div key={key} className="text-center">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-lg mx-auto mb-1 flex items-center justify-center',
                      config.bgColor
                    )}
                  >
                    <config.icon className={cn('w-5 h-5', config.color)} />
                  </div>
                  <p className="text-xs font-medium text-gray-900 dark:text-white">{count}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{config.label}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-900 dark:text-white">Active Tasks</p>
            <Badge variant="secondary" className="text-xs">
              Last updated: 2 min ago
            </Badge>
          </div>

          <div className="space-y-2">
            {housekeepingTasks.map((task) => {
              const status = statusConfig[task.status]

              return (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center',
                        status.bgColor
                      )}
                    >
                      <Home className={cn('w-5 h-5', status.color)} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Room {task.roomNumber}
                        </p>
                        <Badge className={cn('text-xs', priorityConfig[task.priority])}>
                          {task.priority}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {task.type.replace('-', ' ')}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {task.assignedTo}
                        </p>
                        <span className="text-xs text-gray-400">•</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Floor {task.floor}
                        </p>
                        {task.startedAt && (
                          <>
                            <span className="text-xs text-gray-400">•</span>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Started {task.startedAt}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-right mr-2">
                      <p className={cn('text-xs font-medium', status.color)}>{status.label}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        ~{task.estimatedTime} min
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Mark as Clean</DropdownMenuItem>
                        <DropdownMenuItem>Reassign</DropdownMenuItem>
                        <DropdownMenuItem>Add Note</DropdownMenuItem>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Staff Summary */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Staff Performance Today
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">8</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Active Staff</p>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">4.2</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Avg. Rooms/Hour</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
