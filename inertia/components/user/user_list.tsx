import { Link } from '@inertiajs/react'

import { Button } from '../ui/core/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/core/card'

import type { PaginatedResponse, User } from '~/types'
import { formatDate } from '~/utils/api'

interface UserListProps {
  users: PaginatedResponse<User>
}

export function UserList({ users }: UserListProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Users</CardTitle>
        <Link href="/users/create">
          <Button size="sm">Add User</Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sand-7">
                <th className="text-left font-medium text-sand-11 p-2">Name</th>
                <th className="text-left font-medium text-sand-11 p-2">Email</th>
                <th className="text-left font-medium text-sand-11 p-2">Username</th>
                <th className="text-left font-medium text-sand-11 p-2">Verified</th>
                <th className="text-left font-medium text-sand-11 p-2">Created</th>
                <th className="text-left font-medium text-sand-11 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.data.map((user) => (
                <tr key={user.id} className="border-b border-sand-6 hover:bg-sand-3">
                  <td className="p-2 font-medium">{user.full_name}</td>
                  <td className="p-2 text-sand-11">{user.email}</td>
                  <td className="p-2 text-sand-11">{user.username || '-'}</td>
                  <td className="p-2">
                    {user.email_verified_at ? (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-full">
                        Unverified
                      </span>
                    )}
                  </td>
                  <td className="p-2 text-sand-11">{formatDate(user.created_at)}</td>
                  <td className="p-2">
                    <div className="flex items-center space-x-2">
                      <Link href={`/users/${user.id}`}>
                        <Button size="sm" variant="ghost">
                          View
                        </Button>
                      </Link>
                      <Link href={`/users/${user.id}/edit`}>
                        <Button size="sm" variant="ghost">
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.meta.last_page > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-sand-7">
            <div className="text-sm text-sand-11">
              Showing {users.meta.current_page} of {users.meta.last_page} pages
            </div>
            <div className="flex space-x-2">
              {users.meta.previous_page_url && (
                <Link href={users.meta.previous_page_url}>
                  <Button size="sm" variant="outline">
                    Previous
                  </Button>
                </Link>
              )}
              {users.meta.next_page_url && (
                <Link href={users.meta.next_page_url}>
                  <Button size="sm" variant="outline">
                    Next
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default UserList
