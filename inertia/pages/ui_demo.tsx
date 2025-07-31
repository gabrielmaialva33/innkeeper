import { useState } from 'react'
import { Head } from '@inertiajs/react'
import {
  FileText,
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react'
import { MainLayout } from '~/layouts'
import { AnimatedPage } from '~/components/animated_page'
import { ThemeCustomizer } from '~/components/theme_customizer'
import { ThemeStatus } from '~/components/theme/theme_status'
import { Button } from '~/components/ui/core/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/core/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/core/tabs'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '~/components/ui/core/drawer'
import { Stepper, StepperContent, StepperPanel } from '~/components/ui/core/stepper'
import {
  Timeline,
  TimelineItem,
  TimelineDot,
  TimelineContent,
  TimelineHeader,
  TimelineTitle,
  TimelineTime,
  TimelineDescription,
} from '~/components/ui/core/timeline'
import { EmptyState } from '~/components/ui/core/empty_state'
import { StatsCard, StatsGrid } from '~/components/ui/core/stats_card'
import { DataTable } from '~/components/ui/core/data_table'
import { AreaChart, BarChart, PieChart } from '~/components/charts'

// Sample data
const statsData = [
  {
    title: 'Total Revenue',
    value: '$45,231',
    description: 'From all sales',
    icon: DollarSign,
    trend: { value: 12.5, label: 'from last month' },
  },
  {
    title: 'New Customers',
    value: '2,543',
    description: 'Active users',
    icon: Users,
    trend: { value: -3.2, label: 'from last month' },
  },
  {
    title: 'Pending Orders',
    value: '18',
    description: 'Awaiting processing',
    icon: FileText,
    trend: { value: 8.1, label: 'from yesterday' },
  },
  {
    title: 'Growth Rate',
    value: '24.5%',
    description: 'Year over year',
    icon: TrendingUp,
    trend: { value: 5.4, label: 'from last year' },
  },
]

const tableData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Inactive' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Manager', status: 'Active' },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'User', status: 'Active' },
]

const chartData = [
  { month: 'Jan', revenue: 4000, expenses: 2400 },
  { month: 'Feb', revenue: 3000, expenses: 1398 },
  { month: 'Mar', revenue: 2000, expenses: 9800 },
  { month: 'Apr', revenue: 2780, expenses: 3908 },
  { month: 'May', revenue: 1890, expenses: 4800 },
  { month: 'Jun', revenue: 2390, expenses: 3800 },
]

const pieData = [
  { name: 'Desktop', value: 45 },
  { name: 'Mobile', value: 35 },
  { name: 'Tablet', value: 20 },
]

export default function UiDemoPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const steps = [
    { label: 'Account Details', description: 'Enter your information' },
    { label: 'Preferences', description: 'Set your preferences' },
    { label: 'Review', description: 'Review and confirm' },
    { label: 'Complete', description: 'Setup complete' },
  ]

  return (
    <MainLayout>
      <Head title="UI Components Demo" />

      <AnimatedPage>
        <div className="space-y-8">
          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">UI Components Demo</h1>
            <p className="text-muted-foreground mt-2">
              Showcase of new UI components and enhancements
            </p>
          </div>

          <Tabs defaultValue="components" className="space-y-6">
            <TabsList>
              <TabsTrigger value="components">Components</TabsTrigger>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="tables">Tables</TabsTrigger>
              <TabsTrigger value="charts">Charts</TabsTrigger>
            </TabsList>

            {/* Components Tab */}
            <TabsContent value="components" className="space-y-8">
              {/* Drawer Demo */}
              <Card>
                <CardHeader>
                  <CardTitle>Drawer Component</CardTitle>
                </CardHeader>
                <CardContent>
                  <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                    <DrawerTrigger asChild>
                      <Button>Open Drawer</Button>
                    </DrawerTrigger>
                    <DrawerContent>
                      <DrawerHeader>
                        <DrawerTitle>Drawer Example</DrawerTitle>
                        <DrawerDescription>
                          This is a drawer component that slides in from the side.
                        </DrawerDescription>
                      </DrawerHeader>
                      <div className="p-4">
                        <p className="text-sm text-muted-foreground">
                          Drawer content goes here. You can put any content inside the drawer.
                        </p>
                      </div>
                    </DrawerContent>
                  </Drawer>
                </CardContent>
              </Card>

              {/* Stepper Demo */}
              <Card>
                <CardHeader>
                  <CardTitle>Stepper Component</CardTitle>
                </CardHeader>
                <CardContent>
                  <Stepper steps={steps} currentStep={currentStep} />
                  <StepperContent currentStep={currentStep}>
                    <StepperPanel>
                      <p>Step {currentStep + 1} content</p>
                    </StepperPanel>
                    <StepperPanel>
                      <p>Preferences content</p>
                    </StepperPanel>
                    <StepperPanel>
                      <p>Review content</p>
                    </StepperPanel>
                    <StepperPanel>
                      <p>Complete!</p>
                    </StepperPanel>
                  </StepperContent>
                  <div className="flex gap-2 mt-6">
                    <Button
                      onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                      disabled={currentStep === 0}
                      variant="outline"
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                      disabled={currentStep === steps.length - 1}
                    >
                      {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Theme System Demo */}
              <Card>
                <CardHeader>
                  <CardTitle>Theme System Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      The theme system automatically detects your OS preferences by default. You can
                      override this by selecting a specific theme.
                    </p>
                    <ThemeStatus />
                  </div>
                </CardContent>
              </Card>

              {/* Timeline Demo */}
              <Card>
                <CardHeader>
                  <CardTitle>Timeline Component</CardTitle>
                </CardHeader>
                <CardContent>
                  <Timeline>
                    <TimelineItem>
                      <TimelineDot variant="success">
                        <CheckCircle className="h-4 w-4" />
                      </TimelineDot>
                      <TimelineContent>
                        <TimelineHeader>
                          <TimelineTitle>Order Placed</TimelineTitle>
                          <TimelineTime>2 hours ago</TimelineTime>
                        </TimelineHeader>
                        <TimelineDescription>
                          Your order #12345 has been successfully placed.
                        </TimelineDescription>
                      </TimelineContent>
                    </TimelineItem>
                    <TimelineItem>
                      <TimelineDot variant="primary">
                        <Clock className="h-4 w-4" />
                      </TimelineDot>
                      <TimelineContent>
                        <TimelineHeader>
                          <TimelineTitle>Processing</TimelineTitle>
                          <TimelineTime>1 hour ago</TimelineTime>
                        </TimelineHeader>
                        <TimelineDescription>
                          Your order is being processed by our team.
                        </TimelineDescription>
                      </TimelineContent>
                    </TimelineItem>
                    <TimelineItem>
                      <TimelineDot variant="default">
                        <Calendar className="h-4 w-4" />
                      </TimelineDot>
                      <TimelineContent>
                        <TimelineHeader>
                          <TimelineTitle>Scheduled for Delivery</TimelineTitle>
                          <TimelineTime>Expected tomorrow</TimelineTime>
                        </TimelineHeader>
                        <TimelineDescription>
                          Your order will be delivered tomorrow between 9AM - 5PM.
                        </TimelineDescription>
                      </TimelineContent>
                    </TimelineItem>
                  </Timeline>
                </CardContent>
              </Card>

              {/* Empty State Demo */}
              <Card>
                <CardHeader>
                  <CardTitle>Empty State Component</CardTitle>
                </CardHeader>
                <CardContent>
                  <EmptyState
                    icon={FileText}
                    title="No documents found"
                    description="Get started by creating your first document"
                    action={{
                      label: 'Create Document',
                      onClick: () => console.log('Create document'),
                    }}
                    secondaryAction={{
                      label: 'Learn more',
                      onClick: () => console.log('Learn more'),
                    }}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <StatsGrid>
                {statsData.map((stat, index) => (
                  <StatsCard key={index} {...stat} />
                ))}
              </StatsGrid>
            </TabsContent>

            {/* Tables Tab */}
            <TabsContent value="tables">
              <Card>
                <CardHeader>
                  <CardTitle>Enhanced Data Table</CardTitle>
                </CardHeader>
                <CardContent>
                  <DataTable
                    columns={[
                      { key: 'id', label: 'ID', sortable: true },
                      { key: 'name', label: 'Name', sortable: true },
                      { key: 'email', label: 'Email', sortable: true },
                      {
                        key: 'role',
                        label: 'Role',
                        sortable: true,
                        filterType: 'select',
                        filterOptions: [
                          { value: 'Admin', label: 'Admin' },
                          { value: 'User', label: 'User' },
                          { value: 'Manager', label: 'Manager' },
                        ],
                      },
                      {
                        key: 'status',
                        label: 'Status',
                        render: (value) => (
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              value === 'Active'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                            }`}
                          >
                            {value}
                          </span>
                        ),
                      },
                    ]}
                    data={tableData}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Charts Tab */}
            <TabsContent value="charts" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AreaChart
                  data={chartData}
                  dataKey="revenue"
                  xAxisKey="month"
                  title="Revenue Overview"
                  description="Monthly revenue trend"
                />
                <BarChart
                  data={chartData}
                  bars={[
                    { dataKey: 'revenue', name: 'Revenue', color: 'hsl(var(--primary))' },
                    { dataKey: 'expenses', name: 'Expenses', color: 'hsl(var(--destructive))' },
                  ]}
                  xAxisKey="month"
                  title="Revenue vs Expenses"
                  description="Monthly comparison"
                />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PieChart
                  data={pieData}
                  title="Traffic Sources"
                  description="User distribution by device"
                />
                <Card>
                  <CardHeader>
                    <CardTitle>Chart Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      These charts are built using Recharts library with custom styling that matches
                      our design system. They are fully responsive and support dark mode.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </AnimatedPage>

      {/* Theme Customizer */}
      <ThemeCustomizer />
    </MainLayout>
  )
}
