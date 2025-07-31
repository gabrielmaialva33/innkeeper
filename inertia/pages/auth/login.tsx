import { Head, Link } from '@inertiajs/react'

import { LoginForm } from '~/components/auth'
import { ThemeToggle } from '~/components/theme/theme_toggle'
import { Card } from '~/components/ui/core/card'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      <Head title="Login" />

      {/* Left side - Form */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="p-6 lg:p-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">A</span>
            </div>
            <span className="text-xl font-bold">AdonisKit</span>
          </Link>
        </header>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-[400px]">
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight">Sign In</h1>
              <p className="text-muted-foreground mt-2">
                Enter your email and password to access your account
              </p>
            </div>

            <Card className="p-0 shadow-none border-0">
              <LoginForm />
            </Card>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Link href="/register" className="font-medium text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="p-6 lg:p-8">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>&copy; 2025 AdonisKit. All rights reserved.</span>
            <ThemeToggle />
          </div>
        </footer>
      </div>

      {/* Right side - Image/Pattern */}
      <div className="hidden lg:block lg:w-[50%] xl:w-[60%] relative bg-muted">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="max-w-md text-center">
            <h2 className="text-4xl font-bold mb-4">Welcome to AdonisKit</h2>
            <p className="text-lg text-muted-foreground">
              A modern, full-stack web application starter kit built with AdonisJS and React. Get
              started quickly with authentication, user management, and more.
            </p>
          </div>
        </div>
        {/* Pattern overlay */}
        <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1" fill="currentColor" className="text-primary/10" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern)" />
        </svg>
      </div>
    </div>
  )
}
