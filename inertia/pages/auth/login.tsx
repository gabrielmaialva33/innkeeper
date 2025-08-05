import { Head, Link } from '@inertiajs/react'

import { LoginForm } from '~/components/auth'
import { ThemeToggle } from '~/components/theme/theme_toggle'
import { Card } from '~/components/ui/core/card'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      <Head title="Entrar - Innkeeper" />

      {/* Left side - Form */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="p-6 lg:p-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">🏨</span>
            </div>
            <span className="text-xl font-bold">Innkeeper</span>
          </Link>
        </header>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-[400px]">
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight">Entrar</h1>
              <p className="text-muted-foreground mt-2">
                Digite seu email e senha para acessar sua conta
              </p>
            </div>

            <Card className="p-0 shadow-none border-0">
              <LoginForm />
            </Card>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Não tem uma conta? </span>
              <Link href="/register" className="font-medium text-primary hover:underline">
                Criar conta
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
            <h2 className="text-4xl font-bold mb-4">Bem-vindo ao Innkeeper</h2>
            <p className="text-lg text-muted-foreground">
              Sistema completo de gestão hoteleira desenvolvido para a hospitalidade moderna.
              Gerencie reservas, hóspedes, quartos e operações com facilidade.
            </p>
          </div>
        </div>
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
      </div>
    </div>
  )
}
