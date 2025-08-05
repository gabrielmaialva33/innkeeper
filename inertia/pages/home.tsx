import { Head, Link } from '@inertiajs/react'
import { Button } from '~/components/ui/core/button'
import { StatsCard, StatsGrid } from '~/components/ui/core/stats_card'
import { HeroSection } from '~/components/landing/hero_section'
import { AnimatedFeatureCard } from '~/components/landing/animated_feature_card'
import { InteractiveTimeline } from '~/components/landing/interactive_timeline'
import { StatsCounter } from '~/components/landing/stats_counter'
import { ScrollReveal, StaggerContainer, StaggerItem } from '~/components/animations/scroll_reveal'
import { TextReveal } from '~/components/ui/text-reveal'
import {
  Hotel,
  BarChart3,
  Shield,
  Users,
  DollarSign,
  Bed,
  Settings,
  Zap,
  Star,
  Calendar,
  Clock,
  CheckCircle,
  TrendingUp,
  Award,
  Phone,
} from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Head title="Innkeeper - Sistema de Gestão Hoteleira" />

      {/* Hero Section */}
      <HeroSection />

      {/* Principais Soluções Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              <TextReveal variant="slideUp" delay={0.1} staggerDelay={0.04} wordLevel={true}>
                Conheça nossas principais soluções
              </TextReveal>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              <TextReveal variant="fade" delay={0.4} staggerDelay={0.01}>
                O Innkeeper é uma plataforma completa com soluções tecnológicas que tornam mais
                simples, produtivo, eficiente e seguro o processo de gestão hoteleira.
              </TextReveal>
            </p>
          </div>

          {/* Solutions Grid */}
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StaggerItem>
              <AnimatedFeatureCard
                title="Gestão de Reservas"
                description="Sistema completo de reservas, check-in/out automatizado e controle de ocupação em tempo real."
                icon={Calendar}
                delay={0}
              />
            </StaggerItem>

            <StaggerItem>
              <AnimatedFeatureCard
                title="Relatórios Inteligentes"
                description="Analytics avançados e dashboards personalizados para otimizar a performance do seu negócio."
                icon={BarChart3}
                delay={0.1}
              />
            </StaggerItem>

            <StaggerItem>
              <AnimatedFeatureCard
                title="Gestão de Hóspedes"
                description="CRM completo para fidelização, histórico de preferências e campanhas personalizadas."
                icon={Users}
                delay={0.2}
              />
            </StaggerItem>

            <StaggerItem>
              <AnimatedFeatureCard
                title="Controle de Quartos"
                description="Housekeeping inteligente, manutenção preventiva e status em tempo real de todos os quartos."
                icon={Bed}
                delay={0.3}
              />
            </StaggerItem>

            <StaggerItem>
              <AnimatedFeatureCard
                title="Gestão Financeira"
                description="Faturamento automatizado, controle de receitas e integração com sistemas contábeis."
                icon={DollarSign}
                delay={0.4}
              />
            </StaggerItem>

            <StaggerItem>
              <AnimatedFeatureCard
                title="Segurança Total"
                description="Dados protegidos com criptografia avançada e conformidade com padrões internacionais."
                icon={Shield}
                delay={0.5}
              />
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* Resultados/Métricas Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              <TextReveal variant="slideUp" delay={0.1} staggerDelay={0.04} wordLevel={true}>
                Por que hotéis escolhem o Innkeeper?
              </TextReveal>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              <TextReveal variant="fade" delay={0.4} staggerDelay={0.015}>
                Resultados comprovados que transformam a gestão hoteleira e impulsionam o
                crescimento do seu negócio.
              </TextReveal>
            </p>
          </div>

          {/* Stats Grid */}
          <ScrollReveal>
            <StatsGrid columns={4} className="mb-12">
              <StatsCard
                title="Aumento em Reservas"
                value="+30%"
                trend={{
                  value: 12,
                  label: 'vs mês anterior',
                  type: 'up',
                }}
                className="bg-success/5 border-success/20"
              />
              <StatsCard
                title="Redução em Processos"
                value="-50%"
                trend={{
                  value: 25,
                  label: 'tempo economizado',
                  type: 'up',
                }}
                className="bg-primary/5 border-primary/20"
              />
              <StatsCard
                title="Disponibilidade"
                value="99.9%"
                trend={{
                  value: 0.1,
                  label: 'uptime garantido',
                  type: 'neutral',
                }}
                className="bg-info/5 border-info/20"
              />
              <StatsCard
                title="Hotéis Ativos"
                value="500+"
                trend={{
                  value: 15,
                  label: 'novos este mês',
                  type: 'up',
                }}
                className="bg-accent/5 border-accent/20"
              />
            </StatsGrid>
          </ScrollReveal>

          {/* Additional Metrics Row */}
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StaggerItem>
              <div className="text-center p-6 bg-card rounded-xl border border-border group hover:shadow-lg transition-all duration-300">
                <StatsCounter value={24} suffix="/7" className="mb-2" />
                <div className="text-sm font-medium text-foreground mb-1 group-hover:text-primary transition-colors">
                  Suporte Especializado
                </div>
                <div className="text-xs text-muted-foreground">
                  Equipe técnica sempre disponível
                </div>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="text-center p-6 bg-card rounded-xl border border-border group hover:shadow-lg transition-all duration-300">
                <StatsCounter value={2} prefix="R$ " suffix="M+" className="mb-2" delay={0.2} />
                <div className="text-sm font-medium text-foreground mb-1 group-hover:text-success transition-colors">
                  Receita Processada
                </div>
                <div className="text-xs text-muted-foreground">Por mês na plataforma</div>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="text-center p-6 bg-card rounded-xl border border-border group hover:shadow-lg transition-all duration-300">
                <StatsCounter value={98} suffix="%" className="mb-2" delay={0.4} />
                <div className="text-sm font-medium text-foreground mb-1 group-hover:text-accent transition-colors">
                  Satisfação Cliente
                </div>
                <div className="text-xs text-muted-foreground">Avaliação média dos usuários</div>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* Como Funciona Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Como funciona o Innkeeper?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Implementação simples e rápida que transforma sua gestão hoteleira em poucos passos.
            </p>
          </div>

          {/* Timeline */}
          <ScrollReveal>
            <InteractiveTimeline
              items={[
                {
                  id: '1',
                  title: 'Configuração Personalizada',
                  subtitle: 'Semana 1',
                  description:
                    'Nossa equipe configura o sistema de acordo com as necessidades específicas do seu hotel. Importamos seus dados existentes e personalizamos workflows.',
                  icon: Settings,
                  color: 'rgb(var(--primary))',
                },
                {
                  id: '2',
                  title: 'Integração com Sistemas',
                  subtitle: 'Semana 2',
                  description:
                    'Conectamos com PMS, sistemas de pagamento, OTAs e outras ferramentas que você já utiliza. Tudo funciona em harmonia sem interrupções.',
                  icon: Zap,
                  color: 'rgb(var(--secondary))',
                },
                {
                  id: '3',
                  title: 'Treinamento da Equipe',
                  subtitle: 'Semana 3',
                  description:
                    'Capacitamos sua equipe com treinamentos práticos e personalizados. Em apenas 2 dias, todos estarão dominando a plataforma.',
                  icon: Users,
                  color: 'rgb(var(--accent))',
                },
                {
                  id: '4',
                  title: 'Resultados Imediatos',
                  subtitle: 'Go Live',
                  description:
                    'Seu hotel entra em operação com o Innkeeper. Acompanhamos métricas em tempo real e oferecemos suporte contínuo para maximizar resultados.',
                  icon: TrendingUp,
                  color: 'rgb(var(--success))',
                },
              ]}
            />
          </ScrollReveal>

          {/* CTA dentro da seção */}
          <ScrollReveal delay={0.4}>
            <div className="text-center mt-12">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-success/10 border border-success/20 mb-4 group hover:bg-success/15 transition-colors">
                <CheckCircle className="w-4 h-4 text-success mr-2" />
                <span className="text-sm font-medium text-success">
                  Implementação em apenas 3 semanas
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  variant="outline"
                  className="hover:scale-105 transition-transform"
                >
                  Agendar Demonstração
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  className="hover:scale-105 transition-transform text-primary hover:text-primary-foreground hover:bg-primary"
                >
                  Falar com Especialista
                </Button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Para Quem é o Innkeeper Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Para quem é o Innkeeper?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Soluções sob medida para cada tipo de negócio hoteleiro, desde pousadas independentes
              até grandes cadeias.
            </p>
          </div>

          {/* Target Audience Cards */}
          <div className="space-y-8">
            {/* Hotéis Independentes */}
            <ScrollReveal delay={0.1}>
              <div className="flex flex-col lg:flex-row items-center gap-8 p-8 bg-card rounded-2xl border border-border shadow-sm hover:shadow-lg transition-all duration-300 group">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors group-hover:scale-105 transition-transform">
                    <Hotel className="text-primary w-10 h-10" />
                  </div>
                </div>
                <div className="flex-1 text-center lg:text-left">
                  <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                    Hotéis Independentes
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Maximize sua receita com ferramentas profissionais de gestão. Automatize
                    processos, melhore a experiência do hóspede e foque no que realmente importa:
                    crescer seu negócio.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full hover:bg-primary/20 transition-colors">
                      Channel Manager
                    </span>
                    <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full hover:bg-primary/20 transition-colors">
                      Automação
                    </span>
                    <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full hover:bg-primary/20 transition-colors">
                      Relatórios
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <Button
                    variant="outline"
                    size="lg"
                    className="hover:scale-105 transition-transform"
                  >
                    Saiba Mais
                  </Button>
                </div>
              </div>
            </ScrollReveal>

            {/* Cadeias Hoteleiras */}
            <ScrollReveal delay={0.2}>
              <div className="flex flex-col lg:flex-row items-center gap-8 p-8 bg-card rounded-2xl border border-border shadow-sm hover:shadow-lg transition-all duration-300 group">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-secondary/10 rounded-2xl flex items-center justify-center group-hover:bg-secondary/20 transition-colors group-hover:scale-105 transition-transform">
                    <Hotel className="text-secondary w-10 h-10" />
                  </div>
                </div>
                <div className="flex-1 text-center lg:text-left">
                  <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-secondary transition-colors">
                    Cadeias Hoteleiras
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Centralize a gestão de múltiplas propriedades em uma única plataforma. Dashboard
                    unificado, relatórios consolidados e controle total da operação.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                    <span className="px-3 py-1 bg-secondary/10 text-secondary text-sm rounded-full hover:bg-secondary/20 transition-colors">
                      Multi-propriedades
                    </span>
                    <span className="px-3 py-1 bg-secondary/10 text-secondary text-sm rounded-full hover:bg-secondary/20 transition-colors">
                      Dashboard Central
                    </span>
                    <span className="px-3 py-1 bg-secondary/10 text-secondary text-sm rounded-full hover:bg-secondary/20 transition-colors">
                      Escalabilidade
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <Button
                    variant="outline"
                    size="lg"
                    className="hover:scale-105 transition-transform"
                  >
                    Saiba Mais
                  </Button>
                </div>
              </div>
            </ScrollReveal>

            {/* Pousadas Boutique */}
            <ScrollReveal delay={0.3}>
              <div className="flex flex-col lg:flex-row items-center gap-8 p-8 bg-card rounded-2xl border border-border shadow-sm hover:shadow-lg transition-all duration-300 group">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-accent/10 rounded-2xl flex items-center justify-center group-hover:bg-accent/20 transition-colors group-hover:scale-105 transition-transform">
                    <Star className="text-accent w-10 h-10" />
                  </div>
                </div>
                <div className="flex-1 text-center lg:text-left">
                  <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-accent transition-colors">
                    Pousadas Boutique
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Mantenha o charme pessoal enquanto profissionaliza a gestão. CRM avançado para
                    experiências únicas e fidelização de hóspedes especiais.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                    <span className="px-3 py-1 bg-accent/10 text-accent text-sm rounded-full hover:bg-accent/20 transition-colors">
                      Experiência Única
                    </span>
                    <span className="px-3 py-1 bg-accent/10 text-accent text-sm rounded-full hover:bg-accent/20 transition-colors">
                      CRM Personalizado
                    </span>
                    <span className="px-3 py-1 bg-accent/10 text-accent text-sm rounded-full hover:bg-accent/20 transition-colors">
                      Boutique
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <Button
                    variant="outline"
                    size="lg"
                    className="hover:scale-105 transition-transform"
                  >
                    Saiba Mais
                  </Button>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA Final Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Main CTA Content */}
          <ScrollReveal>
            <div className="mb-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/20 border border-primary/30 mb-6 group hover:bg-primary/25 transition-colors">
                <CheckCircle className="w-4 h-4 text-primary mr-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-primary">
                  Transforme seu hotel hoje mesmo
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Pronto para revolucionar
                <span className="block text-primary">seu hotel?</span>
              </h2>

              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
                Junte-se a centenas de hotéis que já aumentaram suas receitas e melhoraram a
                experiência dos hóspedes com o Innkeeper.
              </p>
            </div>
          </ScrollReveal>

          {/* CTA Buttons */}
          <ScrollReveal delay={0.2}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                size="lg"
                className="w-full sm:w-auto min-w-[200px] text-lg px-8 py-4 hover:scale-105 transition-transform"
              >
                Solicitar Demo Gratuita
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto min-w-[180px] text-lg px-8 py-4 bg-background/80 backdrop-blur-sm hover:scale-105 transition-transform"
              >
                Ver Preços
              </Button>
            </div>
          </ScrollReveal>

          {/* Additional Contact Option */}
          <ScrollReveal delay={0.3}>
            <div className="text-center">
              <p className="text-muted-foreground mb-4">Quer conversar com um especialista?</p>
              <Button
                variant="ghost"
                size="lg"
                className="text-primary hover:text-primary-foreground hover:bg-primary group hover:scale-105 transition-all"
              >
                <Phone className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Falar com Consultor
              </Button>
            </div>
          </ScrollReveal>

          {/* Trust Indicators */}
          <ScrollReveal delay={0.4}>
            <div className="mt-12 pt-8 border-t border-border/20">
              <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2 hover:text-foreground transition-colors hover:scale-105 transition-transform">
                  <Clock className="w-4 h-4 text-success" />
                  <span>Implementação em 3 semanas</span>
                </div>
                <div className="flex items-center gap-2 hover:text-foreground transition-colors hover:scale-105 transition-transform">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>Suporte 24/7 incluído</span>
                </div>
                <div className="flex items-center gap-2 hover:text-foreground transition-colors hover:scale-105 transition-transform">
                  <DollarSign className="w-4 h-4 text-accent" />
                  <span>Sem taxa de setup</span>
                </div>
                <div className="flex items-center gap-2 hover:text-foreground transition-colors hover:scale-105 transition-transform">
                  <Award className="w-4 h-4 text-info" />
                  <span>Garantia de satisfação</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-primary/10 rounded-full blur-2xl animate-pulse hidden lg:block"></div>
        <div
          className="absolute bottom-10 right-10 w-24 h-24 bg-accent/10 rounded-full blur-2xl animate-pulse hidden lg:block"
          style={{ animationDelay: '1s' }}
        ></div>
        <div
          className="absolute top-1/2 right-1/4 w-16 h-16 bg-secondary/10 rounded-full blur-xl animate-pulse hidden lg:block"
          style={{ animationDelay: '2s' }}
        ></div>
      </section>
    </div>
  )
}
