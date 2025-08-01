import { Calendar, User, CreditCard, Clock, MoreVertical, Eye, Edit, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Skeleton } from '~/components/ui/skeleton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { cn } from '~/lib/utils'

interface Reservation {
  id: number
  guestName: string
  roomNumber: string
  checkIn: string
  checkOut: string
  status: 'confirmed' | 'pending' | 'checked-in' | 'checked-out' | 'cancelled'
  amount: number
  paymentStatus: 'paid' | 'partial' | 'pending'
  source: string
  nights: number
}

interface Props {
  reservations: Reservation[]
  isLoading?: boolean
}

const statusConfig = {
  'confirmed': {
    label: 'Confirmed',
    variant: 'default' as const,
    className:
      'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
  },
  'pending': {
    label: 'Pending',
    variant: 'secondary' as const,
    className:
      'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800',
  },
  'checked-in': {
    label: 'Checked In',
    variant: 'default' as const,
    className:
      'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
  },
  'checked-out': {
    label: 'Checked Out',
    variant: 'secondary' as const,
    className:
      'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700',
  },
  'cancelled': {
    label: 'Cancelled',
    variant: 'destructive' as const,
    className:
      'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
  },
}

const paymentStatusConfig = {
  paid: {
    label: 'Paid',
    className: 'text-green-600 dark:text-green-400',
  },
  partial: {
    label: 'Partial',
    className: 'text-yellow-600 dark:text-yellow-400',
  },
  pending: {
    label: 'Pending',
    className: 'text-red-600 dark:text-red-400',
  },
}

// Mock data for demonstration
const mockReservations: Reservation[] = [
  {
    id: 1,
    guestName: 'John Doe',
    roomNumber: '201',
    checkIn: '2024-01-20',
    checkOut: '2024-01-23',
    status: 'confirmed',
    amount: 450,
    paymentStatus: 'paid',
    source: 'Direct',
    nights: 3,
  },
  {
    id: 2,
    guestName: 'Jane Smith',
    roomNumber: '305',
    checkIn: '2024-01-21',
    checkOut: '2024-01-25',
    status: 'pending',
    amount: 800,
    paymentStatus: 'pending',
    source: 'Booking.com',
    nights: 4,
  },
  {
    id: 3,
    guestName: 'Robert Johnson',
    roomNumber: '412',
    checkIn: '2024-01-19',
    checkOut: '2024-01-22',
    status: 'checked-in',
    amount: 675,
    paymentStatus: 'partial',
    source: 'Expedia',
    nights: 3,
  },
  {
    id: 4,
    guestName: 'Maria Garcia',
    roomNumber: '108',
    checkIn: '2024-01-18',
    checkOut: '2024-01-20',
    status: 'checked-out',
    amount: 250,
    paymentStatus: 'paid',
    source: 'Walk-in',
    nights: 2,
  },
  {
    id: 5,
    guestName: 'David Brown',
    roomNumber: '501',
    checkIn: '2024-01-22',
    checkOut: '2024-01-26',
    status: 'confirmed',
    amount: 1200,
    paymentStatus: 'paid',
    source: 'Corporate',
    nights: 4,
  },
]

export function RecentReservations({ reservations = mockReservations, isLoading }: Props) {
  if (isLoading) {
    return (
      <Card className="hotel-card">
        <CardHeader>
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-8 w-20" />
              </div>
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
            Recent Reservations
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="text-xs">
              Export
            </Button>
            <Button size="sm" className="text-xs">
              View All
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 dark:border-gray-700">
              <tr className="text-xs text-gray-600 dark:text-gray-400">
                <th className="text-left font-medium px-6 py-3">Guest</th>
                <th className="text-left font-medium px-3 py-3">Room</th>
                <th className="text-left font-medium px-3 py-3">Check-in/out</th>
                <th className="text-left font-medium px-3 py-3">Status</th>
                <th className="text-left font-medium px-3 py-3">Amount</th>
                <th className="text-left font-medium px-3 py-3">Source</th>
                <th className="text-right font-medium px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {reservations.map((reservation) => {
                const status = statusConfig[reservation.status]
                const paymentStatus = paymentStatusConfig[reservation.paymentStatus]

                return (
                  <tr
                    key={reservation.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {reservation.guestName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            #{reservation.id.toString().padStart(5, '0')}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {reservation.roomNumber}
                      </p>
                    </td>
                    <td className="px-3 py-4">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-900 dark:text-white">
                          {new Date(reservation.checkIn).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          to {new Date(reservation.checkOut).toLocaleDateString()}
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          {reservation.nights} nights
                        </Badge>
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <Badge className={cn('text-xs border', status.className)}>
                        {status.label}
                      </Badge>
                    </td>
                    <td className="px-3 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          ${reservation.amount.toLocaleString()}
                        </p>
                        <p className={cn('text-xs', paymentStatus.className)}>
                          {paymentStatus.label}
                        </p>
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <Badge variant="outline" className="text-xs">
                        {reservation.source}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Reservation
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600 dark:text-red-400">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Cancel Reservation
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing 1-5 of 156 reservations
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
