import { Head, Link } from '@inertiajs/react'
import { 
  ArrowRight, 
  Hotel, 
  Users, 
  Calendar, 
  CreditCard, 
  BarChart3, 
  Shield, 
  Clock, 
  Building,
  CheckCircle,
  Star,
  TrendingUp,
  Zap
} from 'lucide-react'
import { Button } from '~/components/ui/core/button'
import { Badge } from '~/components/ui/badge'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <Head title="Innkeeper - Sistema Profissional de Gerenciamento Hoteleiro" />

      {/* Professional Header */}
      <header className="backdrop-blur-sm bg-white/80 dark:bg-gray-950/80 sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <Hotel className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Innkeeper</h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">Hotel Management System</p>
              </div>
            </div>

            <nav className="flex items-center gap-4">
              <Link href="/login" className="hidden sm:block">
                <Button variant="ghost" size="sm">
                  Entrar
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                  Começar Gratuitamente
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative">
        {/* Hero Content */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-4 px-4 py-1">
              <Zap className="w-3 h-3 mr-1" />
              Trusted by 500+ Hotels Worldwide
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Gerencie seu Hotel com 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-700"> Inteligência</span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed max-w-3xl mx-auto">
              Sistema completo de gerenciamento hoteleiro com reservas em tempo real, 
              controle de quartos, gestão de hóspedes e análise de desempenho. 
              Aumente sua taxa de ocupação e maximize sua receita.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link href="/register">
                <Button size="lg" className="px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-xl">
                  Teste Grátis por 30 Dias
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/hotel/dashboard">
                <Button variant="outline" size="lg" className="px-8">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Ver Demonstração
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-8 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Setup em 5 minutos</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Sem cartão de crédito</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Suporte 24/7</span>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Preview */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Dashboard Intuitivo e Poderoso
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Tenha controle total do seu hotel em uma única tela
              </p>
            </div>
            
            {/* Mock Dashboard */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
              <div className="bg-gray-100 dark:bg-gray-900 px-4 py-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 ml-2">innkeeper.app/dashboard</div>
              </div>
              
              <div className="p-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {[
                    { label: 'Taxa de Ocupação', value: '78.5%', icon: TrendingUp, color: 'text-blue-600' },
                    { label: 'Check-ins Hoje', value: '24', icon: Users, color: 'text-green-600' },
                    { label: 'Receita do Mês', value: 'R$ 145.8k', icon: CreditCard, color: 'text-purple-600' },
                    { label: 'Satisfação', value: '4.8/5', icon: Star, color: 'text-yellow-600' }
                  ].map((stat, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</span>
                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                      </div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                    </div>
                  ))}
                </div>
                
                {/* Chart Placeholder */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 h-64 flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 dark:text-gray-400">Gráfico de Ocupação Mensal</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white dark:bg-gray-950">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Recursos Poderosos para Hotéis Modernos
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Tudo que você precisa para gerenciar seu hotel com eficiência
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Calendar,
                  title: 'Gestão de Reservas',
                  description: 'Sistema completo de reservas com confirmação automática, gestão de disponibilidade e integração com canais de venda.'
                },
                {
                  icon: Building,
                  title: 'Controle de Quartos',
                  description: 'Visualização em tempo real do status de cada quarto, gestão de limpeza e manutenção com notificações automáticas.'
                },
                {
                  icon: Users,
                  title: 'Gestão de Hóspedes',
                  description: 'Perfis detalhados de hóspedes com histórico de estadias, preferências e programa de fidelidade integrado.'
                },
                {
                  icon: CreditCard,
                  title: 'Faturamento Inteligente',
                  description: 'Sistema de cobrança automática, split de pagamentos, integração com gateways e relatórios financeiros detalhados.'
                },
                {
                  icon: BarChart3,
                  title: 'Analytics Avançado',
                  description: 'Dashboards interativos com KPIs do setor hoteleiro, previsão de ocupação e insights para maximizar receita.'
                },
                {
                  icon: Shield,
                  title: 'Segurança Enterprise',
                  description: 'Criptografia de dados, backups automáticos, controle de acesso por função e compliance com LGPD.'
                }
              ].map((feature, index) => (
                <div key={index} className="group hover:scale-105 transition-transform duration-300">
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 h-full">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Metrics Section */}
        <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-700">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center text-white mb-12">
              <h2 className="text-3xl font-bold mb-4">Resultados Comprovados</h2>
              <p className="text-lg text-blue-100">Nossos clientes reportam melhorias significativas em suas operações</p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { value: '+32%', label: 'Aumento na Taxa de Ocupação' },
                { value: '-45%', label: 'Redução no Tempo de Check-in' },
                { value: '+28%', label: 'Crescimento na Receita' },
                { value: '4.9/5', label: 'Satisfação dos Hóspedes' }
              ].map((metric, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">{metric.value}</div>
                  <div className="text-blue-100">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Pronto para Transformar seu Hotel?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Junte-se a centenas de hotéis que já revolucionaram sua gestão com o Innkeeper
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="px-10 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-xl">
                  Começar Teste Grátis
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="px-10">
                  Falar com Consultor
                </Button>
              </Link>
            </div>
            
            <p className="mt-6 text-sm text-gray-600 dark:text-gray-400">
              Não é necessário cartão de crédito • Configuração em 5 minutos • Suporte incluído
            </p>
          </div>
        </section>
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
