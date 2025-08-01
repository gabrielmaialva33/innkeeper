import { Bed, Users, Calendar, MapPin } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/core/card'
import { Badge } from '~/components/ui/core/badge'
import { Button } from '~/components/ui/core/button'

interface Room {
  id: number
  number: string
  type: string
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning'
  guest?: string
  checkOut?: string
  price: number
}

interface RoomStatusCardProps {
  room: Room
  onActionClick?: (action: string, room: Room) => void
}

export function RoomStatusCard({ room, onActionClick }: RoomStatusCardProps) {
  const getStatusBadge = (status: Room['status']) => {
    const variants = {
      available: 'success',
      occupied: 'info',
      maintenance: 'destructive',
      cleaning: 'warning',
    } as const

    const labels = {
      available: 'Available',
      occupied: 'Occupied',
      maintenance: 'Maintenance',
      cleaning: 'Cleaning',
    }

    return <Badge variant={variants[status]}>{labels[status]}</Badge>
  }

  const getStatusIcon = (status: Room['status']) => {
    switch (status) {
      case 'available':
        return <Bed className="h-4 w-4 text-green-600" />
      case 'occupied':
        return <Users className="h-4 w-4 text-blue-600" />
      case 'maintenance':
        return <MapPin className="h-4 w-4 text-red-600" />
      case 'cleaning':
        return <Calendar className="h-4 w-4 text-yellow-600" />
      default:
        return <Bed className="h-4 w-4" />
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon(room.status)}
            <CardTitle className="text-lg">Room {room.number}</CardTitle>
          </div>
          {getStatusBadge(room.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Type</span>
          <span className="font-medium">{room.type}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Rate</span>
          <span className="font-medium">{formatCurrency(room.price)}</span>
        </div>

        {room.guest && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Guest</span>
            <span className="font-medium">{room.guest}</span>
          </div>
        )}

        {room.checkOut && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Check-out</span>
            <span className="font-medium">{formatDate(room.checkOut)}</span>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          {room.status === 'available' && (
            <Button size="sm" className="flex-1" onClick={() => onActionClick?.('book', room)}>
              Book Room
            </Button>
          )}

          {room.status === 'occupied' && (
            <>
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => onActionClick?.('view', room)}
              >
                View Guest
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onActionClick?.('checkout', room)}
              >
                Check Out
              </Button>
            </>
          )}

          {room.status === 'cleaning' && (
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={() => onActionClick?.('complete', room)}
            >
              Mark Clean
            </Button>
          )}

          {room.status === 'maintenance' && (
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={() => onActionClick?.('repair', room)}
            >
              Complete Repair
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
