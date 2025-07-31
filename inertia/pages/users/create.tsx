import { Head, useForm } from '@inertiajs/react'

import { MainLayout } from '~/layouts'

import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/core/card'
import { Button } from '~/components/ui/core/button'
import { FormInput } from '~/components/ui/core/form_input'

export default function CreateUserPage() {
  const { data, setData, post, processing, errors } = useForm({
    full_name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    post('/users')
  }

  return (
    <MainLayout>
      <Head title="Create User" />

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create New User</h1>
          <p className="text-muted-foreground mt-1">Fill out the form to add a new user.</p>
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

              <FormInput
                label="Password"
                id="password"
                type="password"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                error={errors.password}
                autoComplete="new-password"
                required
              />

              <FormInput
                label="Confirm Password"
                id="password_confirmation"
                type="password"
                value={data.password_confirmation}
                onChange={(e) => setData('password_confirmation', e.target.value)}
                error={errors.password_confirmation}
                autoComplete="new-password"
                required
              />

              <div className="flex justify-end">
                <Button type="submit" disabled={processing}>
                  {processing ? 'Saving...' : 'Save User'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
