import { Head, Link } from '@inertiajs/react'
import { ArrowRight } from 'lucide-react'
import { Button } from '~/components/ui/core/button'

// Custom GitHub icon component to replace deprecated lucide-react Github icon
const GitHubIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
)

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Head title="AdonisKit - AI-First Full-Stack Starter in 1 repo" />

      {/* Simple Header */}
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">AdonisKit</h1>
          </div>

          <nav className="flex items-center gap-6">
            <a
              href="https://github.com/gabrielmaialva33/adonis-web-kit"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              GitHub
            </a>
            <Link href="/login">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            AI-First Full-Stack Starter in 1 repo
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Enterprise-ready AdonisJS + React starter with authentication, RBAC, file storage, and
            AI-optimized architecture. Production-ready from day one.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4 mb-16">
          <Link href="/register">
            <Button size="lg" className="px-8">
              Get Started
            </Button>
          </Link>
          <a href="https://github.com/gabrielmaialva33/adonis-web-kit" target="_blank">
            <Button variant="outline" size="lg" className="px-8">
              <GitHubIcon className="w-4 h-4 mr-2" />
              View on GitHub
            </Button>
          </a>
        </div>

        {/* Code Example - Main Feature */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
            <p className="text-sm text-gray-600 dark:text-gray-400">// JavaScript SDK</p>
          </div>
          <div className="p-6">
            <pre className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed overflow-x-auto">
              <code>{`import { useForm } from '@inertiajs/react'
import { useAuth } from '~/hooks/useAuth'

// Sign up a new user with AI-optimized validation
const { data, setData, post } = useForm({
  email: '',
  password: '',
  full_name: ''
})

const handleSubmit = (e) => {
  e.preventDefault()
  post('/register') // Auto JWT + role assignment
}

// Check permissions with advanced RBAC
const { can } = useAuth()
if (can('users.create')) {
  // User has permission
}

// Upload files with multi-provider support
const handleUpload = async (files) => {
  const result = await upload(files, {
    disk: 's3', // or 'local', 'gcs'
    folder: 'avatars',
    resize: { width: 200, height: 200 }
  })
  return result.urls
}

// Real-time with built-in WebSocket support
import { useRealtime } from '~/hooks/useRealtime'

useRealtime('notifications', (data) => {
  console.log('New notification:', data)
})`}</code>
            </pre>
          </div>
        </div>

        {/* Features List */}
        <div className="mt-20 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Authentication</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Multi-guard auth with JWT, sessions, API tokens, and OAuth providers. Email
              verification and password reset included.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Advanced RBAC</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Role-based access control with permissions, inheritance, and time-based rules. Perfect
              for enterprise applications.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">File Storage</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Upload to local, S3, or Google Cloud Storage. Image resizing, validation, and secure
              URLs out of the box.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Database Ready</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              PostgreSQL with migrations, seeders, and Lucid ORM. SQLite for testing. Fully
              type-safe queries.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">AI-Optimized</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Monorepo structure with clear architecture designed for seamless AI collaboration and
              code generation.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Production Ready</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Docker support, health checks, logging, rate limiting, and comprehensive testing setup
              included.
            </p>
          </div>
        </div>

        {/* Quick Start */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Get started
          </h2>

          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="p-6">
              <pre className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                <code>{`# Clone the repository
git clone https://github.com/gabrielmaialva33/adonis-web-kit.git
cd adonis-web-kit

# Install dependencies
pnpm install

# Set up environment
cp .env.example .env

# Run migrations and start
node ace migration:run
pnpm dev

# Your app is now running at http://localhost:3333 🚀`}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-20 text-center">
          <Link href="/register">
            <Button size="lg" className="px-8">
              Start building now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 mt-20">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Built with ❤️ using AdonisJS and React. MIT Licensed.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/gabrielmaialva33/adonis-web-kit"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                GitHub
              </a>
              <a
                href="/docs"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                Documentation
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
