import { Head, Link } from '@inertiajs/react'
import { Button } from '~/components/ui/core/button'

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
      <Head title="Innkeeper - Sistema de Gestão Hoteleira" />
      
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-8">
          Olá Mundo
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Bem-vindo ao Innkeeper - Sistema de Gestão Hoteleira
        </p>
        
        <div className="space-x-4">
          <Link href="/login">
            <Button variant="outline" size="lg">
              Login
            </Button>
          </Link>
          <Link href="/register">
            <Button size="lg">
              Cadastrar
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
