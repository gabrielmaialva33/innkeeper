import { Head, Link, router } from '@inertiajs/react'
import { Edit, Eye, MoreVertical, Plus, Search, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { MainLayout } from '~/layouts'
import { ConfirmDialog } from '~/components/ui/core/confirm_dialog'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/core/card'
import { Button } from '~/components/ui/core/button'
import { Input } from '~/components/ui/core/input'
import { Badge } from '~/components/ui/core/badge'
import { type Column, DataTable } from '~/components/ui/core/data_table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/core/dropdown_menu'
import type { PaginatedResponse, User } from '~/types'

import { formatDate } from '~/utils/formatters'

interface UsersPageProps {
  users: PaginatedResponse<User>
  search: string
  sortBy: string
  direction: 'asc' | 'desc'
}

export default function UsersPage({ users, search, sortBy, direction }: UsersPageProps) {
  const [userToDelete, setUserToDelete] = useState<User | null>(null)

  const handleSort = (key: string, dir: 'asc' | 'desc') => {
    router.get('/users', { search, sort_by: key, order: dir }, { preserveState: true })
  }

  const handleSearch = (value: string) => {
    router.get(
      '/users',
      { search: value, sort_by: sortBy, order: direction },
      { preserveState: true }
    )
  }

  const handleDelete = () => {
    if (userToDelete) {
      router.delete(`/users/${userToDelete.id}`, {
        preserveScroll: true,
        onSuccess: () => setUserToDelete(null),
      })
    }
  }

  const columns: Column<User>[] = [
    {
      key: 'full_name',
      label: 'Name',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-xs font-medium text-primary">
              {value.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-medium">{value}</p>
            <p className="text-xs text-muted-foreground">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'username',
      label: 'Username',
      sortable: true,
      render: (value) => value || <span className="text-muted-foreground">-</span>,
    },
    {
      key: 'email_verified_at',
      label: 'Status',
      render: (value) =>
        value ? (
          <Badge variant="success">Verified</Badge>
        ) : (
          <Badge variant="warning">Unverified</Badge>
        ),
    },
    {
      key: 'created_at',
      label: 'Created',
      sortable: true,
      render: (value: string) => formatDate(value),
    },
    {
      key: 'actions',
      label: '',
      className: 'w-[50px]',
      render: (_, row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={`/users/${row.id}`} className="flex items-center">
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={`/users/${row.id}/edit`} className="flex items-center">
                <Edit className="h-4 w-4 mr-2" />
                Edit User
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onSelect={() => setUserToDelete(row)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <MainLayout>
      <Head title="Users" />

      <ConfirmDialog
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleDelete}
        title="Are you sure?"
        description={`This will permanently delete the user "${userToDelete?.full_name}". This action cannot be undone.`}
        confirmText="Yes, delete user"
      />

      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Users</h1>
            <p className="text-muted-foreground mt-1">
              Manage your application users and their permissions
            </p>
          </div>
          <Link href="/users/create">
            <Button size="sm" className="mt-4 sm:mt-0">
              <Plus className="h-4 w-4 mr-1" />
              Add User
            </Button>
          </Link>
        </div>

        {/* Users Table Card */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle>All Users</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search users..."
                  className="pl-10 w-full sm:w-64"
                  inputSize="sm"
                  defaultValue={search}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={users.data}
              onSort={handleSort}
              sortKey={sortBy}
              sortDirection={direction}
            />

            {/* Pagination */}
            {Number(users.meta.last_page) > 1 && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t">
                <p className="text-sm text-muted-foreground">
                  Showing page {Number(users.meta.current_page)} of {Number(users.meta.last_page)}
                </p>
                <div className="flex gap-2">
                  {users.meta.previous_page_url && (
                    <Link href={users.meta.previous_page_url} preserveScroll>
                      <Button variant="outline" size="sm">
                        Previous
                      </Button>
                    </Link>
                  )}
                  {users.meta.next_page_url && (
                    <Link href={users.meta.next_page_url} preserveScroll>
                      <Button variant="outline" size="sm">
                        Next
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
