import { MapPin } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/core/card'
import { Badge } from '~/components/ui/core/badge'
import { Button } from '~/components/ui/core/button'

interface Booking {
  id: number
  guestName: string
  roomNumber: string
  checkIn: string
  checkOut: string
  status: 'confirmed' | 'pending' | 'checked_in' | 'checked_out'
  amount: number
}

interface BookingsListProps {
  bookings: Booking[]
  title?: string
  description?: string
  showViewAll?: boolean
}

export function BookingsList({
  bookings,
  title = 'Recent Bookings',
  description = 'Latest reservation activity',
  showViewAll = true,
}: BookingsListProps) {
  const getStatusBadge = (status: Booking['status']) => {
    const variants = {
      confirmed: 'success',
      pending: 'warning',
      checked_in: 'info',
      checked_out: 'secondary',
    } as const

    const labels = {
      confirmed: 'Confirmed',
      pending: 'Pending',
      checked_in: 'Checked In',
      checked_out: 'Checked Out',
    }

    return <Badge variant={variants[status]}>{labels[status]}</Badge>
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          {showViewAll && (
            <Button variant="outline" size="sm">
              View All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="font-medium">{booking.guestName}</div>
                  <div className="text-sm text-muted-foreground">
                    Room {booking.roomNumber} • {formatDate(booking.checkIn)} -{' '}
                    {formatDate(booking.checkOut)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="font-medium">{formatCurrency(booking.amount)}</div>
                  <div className="text-sm text-muted-foreground">Total</div>
                </div>
                {getStatusBadge(booking.status)}
              </div>
            </div>
          ))}
          {bookings.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No bookings found</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
