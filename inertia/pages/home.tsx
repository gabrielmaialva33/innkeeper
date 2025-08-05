import { Head, Link } from '@inertiajs/react'
import { Button } from '~/components/ui/core/button'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Head title="Innkeeper - Sistema de Gestão Hoteleira" />
      
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
        
        {/* Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          {/* Welcome Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <span className="text-sm font-medium text-primary">
              ✨ Bem-vindo ao futuro da gestão hoteleira
            </span>
          </div>
          
          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            <span className="block">Innkeeper</span>
            <span className="block text-primary">Sistema Hoteleiro</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Simplifique a gestão do seu hotel com nossa plataforma completa. 
            Reservas, hóspedes, quartos e relatórios em um só lugar.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/login">
              <Button size="lg" className="w-full sm:w-auto min-w-[140px]">
                Fazer Login
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" size="lg" className="w-full sm:w-auto min-w-[140px]">
                Criar Conta
              </Button>
            </Link>
          </div>
          
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-primary text-xl">🏨</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Gestão Completa</h3>
              <p className="text-sm text-muted-foreground">
                Controle total das operações do seu hotel em uma única plataforma
              </p>
            </div>
            
            <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-secondary text-xl">📊</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Relatórios Inteligentes</h3>
              <p className="text-sm text-muted-foreground">
                Analytics avançados para otimizar a performance do seu negócio
              </p>
            </div>
            
            <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-accent text-xl">🔒</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Seguro & Confiável</h3>
              <p className="text-sm text-muted-foreground">
                Seus dados protegidos com os mais altos padrões de segurança
              </p>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-16 h-16 bg-primary/5 rounded-full blur-xl animate-pulse hidden lg:block"></div>
        <div className="absolute bottom-20 right-10 w-20 h-20 bg-accent/5 rounded-full blur-xl animate-pulse hidden lg:block" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-20 w-12 h-12 bg-secondary/5 rounded-full blur-xl animate-pulse hidden lg:block" style={{ animationDelay: '2s' }}></div>
      </div>
    </div>
  )
}
