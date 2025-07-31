import { FormEvent } from 'react'
import { useForm } from '@inertiajs/react'

import {
  Alert,
  AlertDescription,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  FormInput,
} from '~/components/ui/core'

export function RegisterForm() {
  const { data, setData, post, processing, errors } = useForm({
    full_name: '',
    email: '',
    username: '',
    password: '',
    password_confirmation: '',
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    post('/register')
  }

  return (
    <Card className="w-full max-w-md">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>Enter your information to get started</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {errors?.general && (
            <Alert variant="destructive">
              <AlertDescription>{errors.general}</AlertDescription>
            </Alert>
          )}

          <FormInput
            label="Full Name"
            type="text"
            name="full_name"
            value={data.full_name}
            onChange={(e) => setData('full_name', e.target.value)}
            errorMessage={errors.full_name}
            placeholder="John Doe"
            required
            autoComplete="name"
          />

          <FormInput
            label="Email"
            type="email"
            name="email"
            value={data.email}
            onChange={(e) => setData('email', e.target.value)}
            errorMessage={errors.email}
            placeholder="john@example.com"
            required
            autoComplete="email"
          />

          <FormInput
            label="Username (optional)"
            type="text"
            name="username"
            value={data.username}
            onChange={(e) => setData('username', e.target.value)}
            errorMessage={errors.username}
            placeholder="johndoe"
            autoComplete="username"
          />

          <FormInput
            label="Password"
            type="password"
            name="password"
            value={data.password}
            onChange={(e) => setData('password', e.target.value)}
            errorMessage={errors.password}
            hint="Must be at least 8 characters"
            required
            autoComplete="new-password"
          />

          <FormInput
            label="Confirm Password"
            type="password"
            name="password_confirmation"
            value={data.password_confirmation}
            onChange={(e) => setData('password_confirmation', e.target.value)}
            errorMessage={errors.password_confirmation}
            required
            autoComplete="new-password"
          />
        </CardContent>

        <CardFooter>
          <Button type="submit" loading={processing} disabled={processing} className="w-full">
            Create account
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

export default RegisterForm
