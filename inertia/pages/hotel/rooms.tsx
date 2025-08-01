import { useState } from 'react'
import { Head } from '@inertiajs/react'
import { Search, Filter, Plus, Grid, List } from 'lucide-react'

import { MainLayout } from '~/layouts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/core/card'
import { Button } from '~/components/ui/core/button'
import { Input } from '~/components/ui/core/input'
import { Select } from '~/components/ui/core/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/core/tabs'
import { RoomStatusCard } from '~/components/hotel'

interface Room {
  id: number
  number: string
  type: string
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning'
  guest?: string
  checkOut?: string
  price: number
  floor: number
  features: string[]
}

// Mock data - in a real app this would come from props/API
const mockRooms: Room[] = [
  {
    id: 1,
    number: '101',
    type: 'Standard',
    status: 'available',
    price: 120,
    floor: 1,
    features: ['Wi-Fi', 'TV', 'AC'],
  },
  {
    id: 2,
    number: '102',
    type: 'Standard',
    status: 'occupied',
    guest: 'John Smith',
    checkOut: '2025-02-03',
    price: 120,
    floor: 1,
    features: ['Wi-Fi', 'TV', 'AC'],
  },
  {
    id: 3,
    number: '201',
    type: 'Deluxe',
    status: 'cleaning',
    price: 180,
    floor: 2,
    features: ['Wi-Fi', 'TV', 'AC', 'Balcony'],
  },
  {
    id: 4,
    number: '301',
    type: 'Suite',
    status: 'maintenance',
    price: 350,
    floor: 3,
    features: ['Wi-Fi', 'TV', 'AC', 'Balcony', 'Kitchenette', 'Living Room'],
  },
  {
    id: 5,
    number: '302',
    type: 'Suite',
    status: 'available',
    price: 350,
    floor: 3,
    features: ['Wi-Fi', 'TV', 'AC', 'Balcony', 'Kitchenette', 'Living Room'],
  },
  {
    id: 6,
    number: '401',
    type: 'Presidential',
    status: 'occupied',
    guest: 'VIP Guest',
    checkOut: '2025-02-05',
    price: 750,
    floor: 4,
    features: [
      'Wi-Fi',
      'TV',
      'AC',
      'Balcony',
      'Full Kitchen',
      'Living Room',
      'Dining Room',
      'Premium Bath',
    ],
  },
]

export default function RoomsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filteredRooms = mockRooms.filter((room) => {
    const matchesSearch =
      room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.guest?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.type.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || room.status === statusFilter
    const matchesType = typeFilter === 'all' || room.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const handleRoomAction = (action: string, room: Room) => {
    // In a real app, this would call API endpoints
    console.log(`Action: ${action} on room ${room.number}`)

    switch (action) {
      case 'book':
        // Handle room booking
        break
      case 'checkout':
        // Handle guest checkout
        break
      case 'complete':
        // Mark cleaning complete
        break
      case 'repair':
        // Complete maintenance
        break
      case 'view':
        // View guest details
        break
    }
  }

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'available', label: 'Available' },
    { value: 'occupied', label: 'Occupied' },
    { value: 'cleaning', label: 'Cleaning' },
    { value: 'maintenance', label: 'Maintenance' },
  ]

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'Standard', label: 'Standard' },
    { value: 'Deluxe', label: 'Deluxe' },
    { value: 'Suite', label: 'Suite' },
    { value: 'Presidential', label: 'Presidential' },
  ]

  const roomStats = {
    total: mockRooms.length,
    available: mockRooms.filter((r) => r.status === 'available').length,
    occupied: mockRooms.filter((r) => r.status === 'occupied').length,
    maintenance: mockRooms.filter((r) => r.status === 'maintenance').length,
    cleaning: mockRooms.filter((r) => r.status === 'cleaning').length,
  }

  return (
    <MainLayout>
      <Head title="Room Management" />

      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Room Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage room status, bookings, and maintenance across your property.
            </p>
          </div>
          <div className="flex gap-2 mt-4 sm:mt-0">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-1" />
              Bulk Actions
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Room
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{roomStats.total}</div>
              <p className="text-sm text-muted-foreground">Total Rooms</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{roomStats.available}</div>
              <p className="text-sm text-muted-foreground">Available</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{roomStats.occupied}</div>
              <p className="text-sm text-muted-foreground">Occupied</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">{roomStats.cleaning}</div>
              <p className="text-sm text-muted-foreground">Cleaning</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">{roomStats.maintenance}</div>
              <p className="text-sm text-muted-foreground">Maintenance</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Room Filters</CardTitle>
            <CardDescription>Search and filter rooms by status, type, or guest</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by room number, guest name, or type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Type</label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  {typeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rooms Grid/List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Rooms ({filteredRooms.length})</h2>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredRooms.map((room) => (
                <RoomStatusCard key={room.id} room={room} onActionClick={handleRoomAction} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="space-y-0">
                  {filteredRooms.map((room, index) => (
                    <div
                      key={room.id}
                      className={`p-4 flex items-center justify-between hover:bg-muted/50 ${
                        index !== filteredRooms.length - 1 ? 'border-b' : ''
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="font-medium">Room {room.number}</div>
                        <div className="text-sm text-muted-foreground">
                          Floor {room.floor} • {room.type}
                        </div>
                        {room.guest && <div className="text-sm">Guest: {room.guest}</div>}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm font-medium">${room.price}/night</div>
                        <div className="w-20">
                          <RoomStatusCard room={room} onActionClick={handleRoomAction} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {filteredRooms.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-muted-foreground">No rooms found matching your filters.</div>
                <Button
                  variant="link"
                  onClick={() => {
                    setSearchTerm('')
                    setStatusFilter('all')
                    setTypeFilter('all')
                  }}
                  className="mt-2"
                >
                  Clear filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
