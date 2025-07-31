import { Head, useForm } from '@inertiajs/react'

import { MainLayout } from '~/layouts'

import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/core/card'
import { Button } from '~/components/ui/core/button'
import { FormInput } from '~/components/ui/core/form_input'

import type { User } from '~/types'

interface EditUserPageProps {
  user: User
}

export default function EditUserPage({ user }: EditUserPageProps) {
  const { data, setData, put, processing, errors } = useForm({
    full_name: user.full_name || '',
    email: user.email || '',
  })

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    put(`/users/${user.id}`)
  }

  return (
    <MainLayout>
      <Head title={`Edit User: ${user.full_name}`} />

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit User</h1>
          <p className="text-muted-foreground mt-1">Update the user's details.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <FormInput
                label="Full Name"
                id="full_name"
                value={data.full_name}
                onChange={(e) => setData('full_name', e.target.value)}
                error={errors.full_name}
                autoComplete="name"
                required
              />

              <FormInput
                label="Email"
                id="email"
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                error={errors.email}
                autoComplete="email"
                required
              />

              <div className="flex justify-end">
                <Button type="submit" disabled={processing}>
                  {processing ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
