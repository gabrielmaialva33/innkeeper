import { Head, Link } from '@inertiajs/react'
import { Hotel } from 'lucide-react'
import { RegisterForm } from '~/components/auth'
import { ThemeToggle } from '~/components/theme/theme_toggle'
import { Card } from '~/components/ui/core/card'

interface RegisterPageProps {
  errors?: Record<string, string>
}

export default function RegisterPage({ errors }: RegisterPageProps) {
  return (
    <div className="min-h-screen flex">
      <Head title="Criar Conta - Innkeeper" />

      {/* Left side - Form */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="p-6 lg:p-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <Hotel className="text-primary-foreground w-5 h-5" />
            </div>
            <span className="text-xl font-bold">Innkeeper</span>
          </Link>
        </header>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-[400px]">
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight">Criar Conta</h1>
              <p className="text-muted-foreground mt-2">
                Digite suas informações para criar sua conta
              </p>
            </div>

            <Card className="p-0 shadow-none border-0">
              <RegisterForm errors={errors} />
            </Card>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Já tem uma conta? </span>
              <Link href="/login" className="font-medium text-primary hover:underline">
                Entrar
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="p-6 lg:p-8">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>&copy; 2025 Innkeeper. Todos os direitos reservados.</span>
            <ThemeToggle />
          </div>
        </footer>
      </div>

      {/* Right side - Content */}
      <div className="hidden lg:block lg:w-[50%] xl:w-[60%] relative bg-muted/30">
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="max-w-md text-center">
            <h2 className="text-4xl font-bold mb-4">Junte-se ao Innkeeper</h2>
            <p className="text-lg text-muted-foreground">
              Comece a gerenciar seu hotel com nosso sistema completo. Acesse gestão de hóspedes,
              reservas, governança e relatórios detalhados.
            </p>
          </div>
        </div>
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
      </div>
    </div>
  )
}
