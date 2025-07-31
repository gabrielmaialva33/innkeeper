import { Head, Link } from '@inertiajs/react'
import {
  Activity,
  AlertCircle,
  CreditCard,
  DollarSign,
  FileText,
  Settings,
  TrendingUp,
  Users,
} from 'lucide-react'

import { MainLayout } from '~/layouts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/core/card'
import { Button } from '~/components/ui/core/button'
import { Badge } from '~/components/ui/core/badge'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/core/alert'
import { useAuth } from '~/hooks/use_auth'

export default function DashboardPage() {
  const { user } = useAuth()

  const stats = [
    {
      title: 'Total Revenue',
      value: '$45,231.89',
      description: '+20.1% from last month',
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
      trend: 'up',
    },
    {
      title: 'Active Users',
      value: '2,350',
      description: '+180 new users',
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
      trend: 'up',
    },
    {
      title: 'Sales',
      value: '12,234',
      description: '+19% from last month',
      icon: <CreditCard className="h-4 w-4 text-muted-foreground" />,
      trend: 'up',
    },
    {
      title: 'Active Now',
      value: '573',
      description: 'In the last hour',
      icon: <Activity className="h-4 w-4 text-muted-foreground" />,
      trend: 'neutral',
    },
  ]

  return (
    <MainLayout>
      <Head title="Dashboard" />

      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user?.full_name}!</h1>
            <p className="text-muted-foreground mt-1">
              Here's what's happening with your business today.
            </p>
          </div>
          <div className="flex gap-2 mt-4 sm:mt-0">
            <Button variant="outline" size="sm">
              Download Report
            </Button>
            <Button size="sm">
              <TrendingUp className="h-4 w-4 mr-1" />
              View Analytics
            </Button>
          </div>
        </div>

        {/* Email Verification Alert */}
        {user?.email_verified_at === null && (
          <Alert variant="warning">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Verify Your Email</AlertTitle>
            <AlertDescription>
              Please verify your email address to access all features.
              <Button variant="link" className="px-2 h-auto">
                Resend verification email
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>User Management</CardTitle>
                <Badge variant="info">Active</Badge>
              </div>
              <CardDescription>Manage users, roles, and permissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/users" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  View Users
                </Button>
              </Link>
              <Link href="/roles" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Manage Roles
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>File Management</CardTitle>
                <Badge variant="success">Updated</Badge>
              </div>
              <CardDescription>Upload and manage your files</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/files" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Browse Files
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="secondary" className="w-full justify-start" size="sm">
                Create New User
              </Button>
              <Button variant="secondary" className="w-full justify-start" size="sm">
                Upload File
              </Button>
              <Button variant="secondary" className="w-full justify-start" size="sm">
                Generate Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
