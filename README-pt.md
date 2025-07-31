<h1 align="center">
  🏨 Innkeeper
</h1>

<p align="center">
  <strong>Um Sistema Moderno de Gerenciamento Hoteleiro Multi-Tenant</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/github/license/gabrielmaialva33/innkeeper?color=00b8d3&style=flat-square" alt="Licença" />
  <img src="https://img.shields.io/github/languages/top/gabrielmaialva33/innkeeper?style=flat-square" alt="Linguagem principal do GitHub" >
  <img src="https://img.shields.io/github/repo-size/gabrielmaialva33/innkeeper?style=flat-square" alt="Tamanho do repositório" >
  <a href="https://github.com/gabrielmaialva33/innkeeper/commits/main">
    <img src="https://img.shields.io/github/last-commit/gabrielmaialva33/innkeeper?style=flat-square" alt="Último commit do GitHub" >
  </a>
</p>

<p align="center">
    <a href="README.md">Inglês</a>
    ·
    <a href="README-pt.md">Português</a>
</p>

<p align="center">
  <a href="#bookmark-sobre">Sobre</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#sparkles-funcionalidades">Funcionalidades</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#rocket-tecnologias">Tecnologias</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#hammer_and_wrench-instalação">Instalação</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#memo-licença">Licença</a>
</p>

## :bookmark: Sobre

**Innkeeper** é um sistema completo de gerenciamento hoteleiro multi-tenant projetado para otimizar e modernizar as
operações hoteleiras. Construído sobre uma base robusta de backend **AdonisJS v6** e frontend **React 19** com *
*Inertia.js**, fornece uma solução completa para gerenciar múltiplas propriedades hoteleiras a partir de uma única
plataforma.

Este sistema atende às necessidades complexas dos negócios de hospitalidade modernos, desde pequenos hotéis boutique até
grandes cadeias hoteleiras. Com sua arquitetura multi-tenant, cada propriedade hoteleira mantém isolamento completo de
dados enquanto se beneficia de infraestrutura compartilhada e recursos de gerenciamento centralizado.

### 🏗️ Visão Geral da Arquitetura

```mermaid
graph TD
    subgraph "Frontend (React + Inertia.js)"
        FE_GUEST[Portal do Hóspede]
        FE_STAFF[Painel da Equipe]
        FE_ADMIN[Painel Administrativo]
        FE_SHARED[Componentes Compartilhados]
    end

    subgraph "Backend (AdonisJS)"
        BE_API[Camada API]
        BE_AUTH[Auth Multi-Tenant]
        BE_BOOKING[Motor de Reservas]
        BE_PMS[Gestão de Propriedades]
        BE_BILLING[Sistema de Faturamento]
        BE_REPORTS[Análises e Relatórios]
    end

    subgraph "Camada Multi-Tenant"
        MT_RESOLVER[Resolvedor de Tenant]
        MT_ISOLATION[Isolamento de Dados]
        MT_CONFIG[Config do Tenant]
    end

    subgraph "Camada de Dados"
        DB[(PostgreSQL)]
        CACHE[(Redis)]
        STORAGE[(Armazenamento de Arquivos)]
    end

    FE_GUEST --> BE_API
    FE_STAFF --> BE_API
    FE_ADMIN --> BE_API

    BE_API --> MT_RESOLVER
    MT_RESOLVER --> BE_AUTH
    MT_RESOLVER --> BE_BOOKING
    MT_RESOLVER --> BE_PMS
    MT_RESOLVER --> BE_BILLING
    MT_RESOLVER --> BE_REPORTS

    BE_AUTH --> MT_ISOLATION
    BE_BOOKING --> MT_ISOLATION
    BE_PMS --> MT_ISOLATION
    BE_BILLING --> MT_ISOLATION
    BE_REPORTS --> MT_ISOLATION

    MT_ISOLATION --> DB
    BE_BOOKING --> CACHE
    BE_AUTH --> CACHE
    BE_REPORTS --> STORAGE
```

### 🗄️ Esquema do Banco de Dados

Para uma visão detalhada da estrutura do banco de dados, você pode acessar nosso diagrama interativo:

**[📊 Diagrama Interativo do Banco de Dados](https://dbdiagram.io/d/innkeeper-diagram-688adda9cca18e685c90b3f7)**

```mermaid
---
config:
  layout: elk
---
classDiagram
direction BT
class adonis_schema {
   varchar(255) name
   integer batch
   timestamp with time zone migration_time
   integer id
}
class adonis_schema_versions {
   integer version
}
class amenities {
   varchar(255) name
   varchar(255) code
   text description
   text category
   varchar(255) icon
   boolean is_active
   jsonb metadata
   timestamp with time zone created_at
   timestamp with time zone updated_at
   integer id
}
class audit_logs {
   integer user_id
   varchar(100) session_id
   varchar(45) ip_address
   varchar(500) user_agent
   varchar(100) resource
   varchar(50) action
   varchar(50) context
   integer resource_id
   varchar(10) method
   varchar(500) url
   json request_data
   text result
   varchar(255) reason
   integer response_code
   json metadata
   timestamp with time zone created_at
   timestamp with time zone updated_at
   integer id
}
class auth_access_tokens {
   integer tokenable_id
   varchar(255) type
   varchar(255) name
   varchar(255) hash
   text abilities
   timestamp with time zone created_at
   timestamp with time zone updated_at
   timestamp with time zone last_used_at
   timestamp with time zone expires_at
   integer id
}
class files {
   integer owner_id
   varchar(255) client_name
   varchar(255) file_name
   integer file_size
   varchar(255) file_type
   varchar(255) file_category
   varchar(255) url
   timestamp with time zone created_at
   timestamp with time zone updated_at
   integer id
}
class folios {
   integer organization_id
   integer reservation_id
   integer guest_id
   varchar(255) folio_number
   text status
   numeric(12,2) room_charges
   numeric(12,2) service_charges
   numeric(10,2) tax_amount
   numeric(10,2) discount_amount
   numeric(12,2) total_amount
   numeric(12,2) paid_amount
   numeric(12,2) balance
   varchar(3) currency
   timestamp with time zone opened_at
   timestamp with time zone closed_at
   integer closed_by_user_id
   text notes
   boolean is_deleted
   jsonb metadata
   timestamp with time zone created_at
   timestamp with time zone updated_at
   integer id
}
class guests {
   integer organization_id
   integer user_id
   varchar(255) first_name
   varchar(255) last_name
   varchar(255) email
   varchar(255) phone
   varchar(255) mobile
   text document_type
   varchar(255) document_number
   varchar(255) document_issuer
   date document_expiry_date
   date date_of_birth
   varchar(255) nationality
   text gender
   varchar(255) address
   varchar(255) city
   varchar(255) state
   varchar(255) country
   varchar(255) postal_code
   varchar(255) company_name
   varchar(255) tax_id
   text vip_status
   varchar(255) loyalty_number
   integer loyalty_points
   boolean is_blacklisted
   text blacklist_reason
   boolean is_deleted
   jsonb preferences
   jsonb marketing
   jsonb metadata
   timestamp with time zone last_stay_date
   integer total_stays
   numeric(12,2) total_spent
   timestamp with time zone created_at
   timestamp with time zone updated_at
   integer id
}
class hotel_amenities {
   timestamp with time zone created_at
   timestamp with time zone updated_at
   integer hotel_id
   integer amenity_id
}
class hotels {
   integer organization_id
   varchar(255) name
   varchar(255) slug
   text description
   varchar(255) email
   varchar(255) phone
   varchar(255) website
   varchar(255) address
   varchar(255) city
   varchar(255) state
   varchar(255) country
   varchar(255) postal_code
   numeric(10,8) latitude
   numeric(11,8) longitude
   varchar(255) timezone
   varchar(3) currency
   integer star_rating
   integer total_rooms
   time check_in_time
   time check_out_time
   boolean is_active
   boolean is_deleted
   jsonb policies
   jsonb contact_info
   jsonb metadata
   timestamp with time zone created_at
   timestamp with time zone updated_at
   integer id
}
class organizations {
   varchar(255) name
   varchar(255) slug
   varchar(255) tax_id
   varchar(255) email
   varchar(255) phone
   varchar(255) address
   varchar(255) city
   varchar(255) state
   varchar(255) country
   varchar(255) postal_code
   varchar(3) currency
   varchar(255) timezone
   boolean is_active
   boolean is_deleted
   jsonb settings
   jsonb metadata
   timestamp with time zone created_at
   timestamp with time zone updated_at
   integer id
}
class payments {
   integer organization_id
   integer reservation_id
   integer folio_id
   integer guest_id
   integer processed_by_user_id
   varchar(255) transaction_id
   text type
   text method
   text status
   numeric(12,2) amount
   varchar(3) currency
   numeric(10,6) exchange_rate
   numeric(12,2) base_currency_amount
   varchar(255) gateway
   varchar(255) gateway_transaction_id
   text gateway_response
   varchar(4) card_last_four
   varchar(255) card_brand
   varchar(255) reference_number
   text notes
   varchar(255) receipt_number
   timestamp with time zone paid_at
   timestamp with time zone failed_at
   text failure_reason
   boolean is_deleted
   jsonb metadata
   timestamp with time zone created_at
   timestamp with time zone updated_at
   integer id
}
class permissions {
   varchar(255) name
   varchar(500) description
   varchar(100) resource
   varchar(50) action
   varchar(50) context
   timestamp with time zone created_at
   timestamp with time zone updated_at
   integer id
}
class rate_limits {
   integer points
   bigint expire
   varchar(255) key
}
class reservation_services {
   integer quantity
   numeric(10,2) unit_price
   numeric(12,2) total_price
   timestamp with time zone created_at
   timestamp with time zone updated_at
   integer reservation_id
   integer service_id
}
class reservations {
   integer organization_id
   integer hotel_id
   integer room_id
   integer room_type_id
   integer guest_id
   integer created_by_user_id
   integer group_reservation_id
   varchar(255) confirmation_number
   text status
   text channel
   varchar(255) channel_reference
   timestamp with time zone check_in_date
   timestamp with time zone check_out_date
   timestamp with time zone actual_check_in
   timestamp with time zone actual_check_out
   integer adults
   integer children
   integer infants
   numeric(10,2) room_rate
   numeric(12,2) total_amount
   numeric(12,2) paid_amount
   numeric(10,2) discount_amount
   numeric(10,2) tax_amount
   varchar(3) currency
   text payment_status
   text payment_method
   text special_requests
   time arrival_time
   text purpose_of_visit
   boolean is_vip
   boolean requires_pickup
   varchar(255) pickup_location
   timestamp with time zone pickup_time
   text cancellation_reason
   timestamp with time zone cancelled_at
   integer cancelled_by_user_id
   boolean is_deleted
   jsonb guest_details
   jsonb metadata
   timestamp with time zone created_at
   timestamp with time zone updated_at
   integer id
}
class role_permissions {
   integer role_id
   integer permission_id
   timestamp with time zone created_at
   timestamp with time zone updated_at
   integer id
}
class roles {
   varchar(255) name
   text description
   varchar(255) slug
   timestamp with time zone created_at
   timestamp with time zone updated_at
   integer id
}
class room_type_amenities {
   timestamp with time zone created_at
   timestamp with time zone updated_at
   integer room_type_id
   integer amenity_id
}
class room_types {
   integer organization_id
   integer hotel_id
   varchar(255) name
   varchar(255) code
   text description
   integer max_occupancy
   integer max_adults
   integer max_children
   numeric(10,2) base_price
   numeric(10,2) extra_bed_price
   numeric(8,2) size_sqm
   varchar(255) bed_type
   integer bed_count
   varchar(255) view_type
   boolean is_active
   boolean is_deleted
   jsonb images
   jsonb metadata
   timestamp with time zone created_at
   timestamp with time zone updated_at
   integer id
}
class rooms {
   integer organization_id
   integer hotel_id
   integer room_type_id
   varchar(255) room_number
   varchar(255) floor
   varchar(255) building
   text status
   text housekeeping_status
   boolean is_smoking
   boolean is_accessible
   integer connecting_room_id
   timestamp with time zone last_cleaned_at
   timestamp with time zone last_inspected_at
   boolean is_active
   boolean is_deleted
   jsonb notes
   jsonb metadata
   timestamp with time zone created_at
   timestamp with time zone updated_at
   integer id
}
class services {
   integer organization_id
   integer hotel_id
   varchar(255) name
   varchar(255) code
   text description
   text category
   numeric(10,2) unit_price
   text unit_type
   numeric(5,2) tax_rate
   boolean is_taxable
   boolean is_available_24h
   time available_from
   time available_until
   integer max_quantity_per_day
   boolean requires_advance_booking
   integer advance_booking_hours
   boolean is_active
   boolean is_deleted
   jsonb metadata
   timestamp with time zone created_at
   timestamp with time zone updated_at
   integer id
}
class staff {
   integer organization_id
   integer user_id
   varchar(255) employee_id
   text department
   varchar(255) position
   date hire_date
   date termination_date
   boolean is_active
   boolean is_deleted
   jsonb contact_info
   jsonb metadata
   timestamp with time zone created_at
   timestamp with time zone updated_at
   integer id
}
class staff_hotels {
   boolean is_primary
   timestamp with time zone started_at
   timestamp with time zone ended_at
   timestamp with time zone created_at
   timestamp with time zone updated_at
   integer staff_id
   integer hotel_id
}
class user_permissions {
   integer user_id
   integer permission_id
   boolean granted
   timestamp with time zone expires_at
   timestamp with time zone created_at
   timestamp with time zone updated_at
   integer id
}
class user_roles {
   integer user_id
   integer role_id
   timestamp with time zone created_at
   timestamp with time zone updated_at
   integer id
}
class users {
   varchar(255) full_name
   varchar(254) email
   varchar(80) username
   varchar(255) password
   integer organization_id
   boolean is_deleted
   jsonb metadata
   timestamp with time zone created_at
   timestamp with time zone updated_at
   integer id
}
audit_logs --> users : user_id
auth_access_tokens --> users : tokenable_id
files --> users : owner_id
folios --> guests : guest_id
folios --> organizations : organization_id
folios --> reservations : reservation_id
folios --> users : closed_by_user_id
guests --> organizations : organization_id
guests --> users : user_id
hotel_amenities --> amenities : amenity_id
hotel_amenities --> hotels : hotel_id
hotels --> organizations : organization_id
payments --> folios : folio_id
payments --> guests : guest_id
payments --> organizations : organization_id
payments --> reservations : reservation_id
payments --> users : processed_by_user_id
reservation_services --> reservations : reservation_id
reservation_services --> services : service_id
reservations --> guests : guest_id
reservations --> hotels : hotel_id
reservations --> organizations : organization_id
reservations --> room_types : room_type_id
reservations --> rooms : room_id
reservations --> users : created_by_user_id
reservations --> users : cancelled_by_user_id
role_permissions --> permissions : permission_id
role_permissions --> roles : role_id
room_type_amenities --> amenities : amenity_id
room_type_amenities --> room_types : room_type_id
room_types --> hotels : hotel_id
room_types --> organizations : organization_id
rooms --> hotels : hotel_id
rooms --> organizations : organization_id
rooms --> room_types : room_type_id
rooms --> rooms : connecting_room_id
services --> hotels : hotel_id
services --> organizations : organization_id
staff --> organizations : organization_id
staff --> users : user_id
staff_hotels --> hotels : hotel_id
staff_hotels --> staff : staff_id
user_permissions --> permissions : permission_id
user_permissions --> users : user_id
user_roles --> roles : role_id
user_roles --> users : user_id
users --> organizations : organization_id
```

## :sparkles: Funcionalidades

### Gerenciamento Hoteleiro Principal

- **🏢 Arquitetura Multi-Tenant**: Gerencie múltiplas propriedades hoteleiras com isolamento completo de dados
- **🛏️ Gestão de Quartos**: Inventário completo de quartos, tipos, comodidades e preços
- **📅 Sistema de Reservas**: Motor de reservas avançado com disponibilidade em tempo real
- **👥 Gestão de Hóspedes**: Perfis completos de hóspedes, preferências e histórico
- **💼 Operações de Recepção**: Check-in/out, atribuição de quartos e walk-ins
- **🧹 Governança**: Rastreamento do status dos quartos, cronogramas de limpeza e manutenção
- **💰 Faturamento e Cobrança**: Preços flexíveis, impostos, descontos e processamento de pagamentos

### Funcionalidades Avançadas

- **📊 Painel de Análises**: Métricas de ocupação, receita e desempenho em tempo real
- **🔄 Gerenciador de Canais**: Integração com OTAs (Booking.com, Expedia, etc.)
- **📱 Mobile-Responsive**: Funcionalidade completa em todos os dispositivos
- **🌐 Suporte Multi-Idiomas**: Internacionalização para operações globais
- **👷 Gestão de Equipe**: Papéis, permissões, horários e atribuição de tarefas
- **📧 Central de Comunicação**: E-mails automatizados, notificações SMS e mensagens para hóspedes
- **🎯 Gestão de Receita**: Preços dinâmicos e otimização de rendimento
- **🔗 Integrações de Terceiros**: Sistemas POS, fechaduras de portas e software de contabilidade

### Funcionalidades Técnicas

- **🔐 Controle de Acesso Baseado em Papéis**: Permissões granulares para diferentes tipos de usuários
- **🚀 Atualizações em Tempo Real**: Atualizações ao vivo via WebSocket em toda a plataforma
- **📈 Arquitetura Escalável**: Construída para lidar com propriedades de qualquer tamanho
- **🔒 Segurança de Dados**: Criptografia ponta a ponta e conformidade com padrões hoteleiros
- **🔄 Design API-First**: API RESTful para integrações fáceis
- **📱 Progressive Web App**: Instalável em dispositivos móveis
- **🎨 UI Personalizável**: Sistema de temas para consistência de marca

## :rocket: Tecnologias

### Backend

- **[AdonisJS v6](https://adonisjs.com/)**: Framework Node.js de nível empresarial
- **[PostgreSQL](https://www.postgresql.org/)**: Banco de dados relacional robusto com suporte multi-tenant
- **[Redis](https://redis.io/)**: Cache de alto desempenho e gerenciamento de sessões
- **[Bull Queue](https://github.com/OptimalBits/bull)**: Processamento de jobs em background
- **[JWT](https://jwt.io/)**: Autenticação segura

### Frontend

- **[React 19](https://react.dev/)**: Biblioteca moderna de UI
- **[Inertia.js](https://inertiajs.com/)**: Experiência SPA sem a complexidade
- **[TypeScript](https://www.typescriptlang.org/)**: Desenvolvimento type-safe
- **[Tailwind CSS](https://tailwindcss.com/)**: Estilização utility-first
- **[shadcn/ui](https://ui.shadcn.com/)**: Componentes bonitos e acessíveis
- **[Recharts](https://recharts.org/)**: Visualização de dados

### DevOps & Ferramentas

- **[Docker](https://www.docker.com/)**: Containerização
- **[Vite](https://vitejs.dev/)**: Desenvolvimento ultrarrápido
- **[ESLint](https://eslint.org/)** & **[Prettier](https://prettier.io/)**: Qualidade de código
- **[Japa](https://japa.dev/)**: Framework de testes

## :hammer_and_wrench: Instalação

### Pré-requisitos

- **Node.js** (v18 ou superior)
- **pnpm** (recomendado) ou npm/yarn
- **PostgreSQL** (v14 ou superior)
- **Redis** (v6 ou superior)
- **Docker** (opcional, para configuração containerizada)

### Início Rápido

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/gabrielmaialva33/innkeeper.git
   cd innkeeper
   ```

2. **Instale as dependências:**

   ```bash
   pnpm install
   ```

3. **Configure as variáveis de ambiente:**

   ```bash
   cp .env.example .env
   ```

   Configure seu banco de dados, Redis e outras configurações no arquivo `.env`.

4. **Execute as migrações do banco de dados:**

   ```bash
   node ace migration:run
   ```

5. **Popule dados iniciais (opcional):**

   ```bash
   node ace db:seed
   ```

6. **Inicie o servidor de desenvolvimento:**

   ```bash
   pnpm dev
   ```

   Sua aplicação estará disponível em `http://localhost:3333`

### Configuração com Docker

Para um ambiente containerizado:

```bash
docker-compose up -d
pnpm docker
```

### Deploy em Produção

1. **Compile a aplicação:**

   ```bash
   pnpm build
   ```

2. **Execute as migrações em produção:**

   ```bash
   node ace migration:run --force
   ```

3. **Inicie o servidor de produção:**
   ```bash
   pnpm start
   ```

## :books: Documentação

Para documentação detalhada, visite nossa [Wiki](https://github.com/gabrielmaialva33/innkeeper/wiki) ou verifique a
pasta `/docs`.

### Documentação da API

A documentação da API está disponível em `/api/docs` quando executada em modo de desenvolvimento.

## :handshake: Contribuindo

Contribuições são bem-vindas! Por favor, leia nosso [Guia de Contribuição](CONTRIBUTING.md) para detalhes sobre nosso
código de conduta e o processo para enviar pull requests.

## :memo: Licença

Este projeto está licenciado sob a **Licença MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<p align="center">
  Feito com ❤️ para a indústria hoteleira
</p>
