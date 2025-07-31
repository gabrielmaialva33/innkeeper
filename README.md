<h1 align="center">
  🏨 Innkeeper
</h1>

<p align="center">
  <strong>A Modern Multi-Tenant Hotel Management System</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/github/license/gabrielmaialva33/innkeeper?color=00b8d3&style=flat-square" alt="License" />
  <img src="https://img.shields.io/github/languages/top/gabrielmaialva33/innkeeper?style=flat-square" alt="GitHub top language" >
  <img src="https://img.shields.io/github/repo-size/gabrielmaialva33/innkeeper?style=flat-square" alt="Repository size" >
  <a href="https://github.com/gabrielmaialva33/innkeeper/commits/main">
    <img src="https://img.shields.io/github/last-commit/gabrielmaialva33/innkeeper?style=flat-square" alt="GitHub last commit" >
  </a>
</p>

<p align="center">
    <a href="README.md">English</a>
    ·
    <a href="README-pt.md">Portuguese</a>
</p>

<p align="center">
  <a href="#bookmark-about">About</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#sparkles-features">Features</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#rocket-technologies">Technologies</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#hammer_and_wrench-installation">Installation</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#memo-license">License</a>
</p>

## :bookmark: About

**Innkeeper** is a comprehensive multi-tenant hotel management system designed to streamline and modernize hotel operations. Built on a robust foundation of **AdonisJS v6** backend and **React 19** with **Inertia.js** frontend, it provides a complete solution for managing multiple hotel properties from a single platform.

This system addresses the complex needs of modern hospitality businesses, from small boutique hotels to large hotel chains. With its multi-tenant architecture, each hotel property maintains complete data isolation while benefiting from shared infrastructure and centralized management capabilities.

### 🏗️ Architecture Overview

```mermaid
graph TD
    subgraph "Frontend (React + Inertia.js)"
        FE_GUEST[Guest Portal]
        FE_STAFF[Staff Dashboard]
        FE_ADMIN[Admin Panel]
        FE_SHARED[Shared Components]
    end

    subgraph "Backend (AdonisJS)"
        BE_API[API Layer]
        BE_AUTH[Multi-Tenant Auth]
        BE_BOOKING[Booking Engine]
        BE_PMS[Property Management]
        BE_BILLING[Billing System]
        BE_REPORTS[Analytics & Reports]
    end

    subgraph "Multi-Tenant Layer"
        MT_RESOLVER[Tenant Resolver]
        MT_ISOLATION[Data Isolation]
        MT_CONFIG[Tenant Config]
    end

    subgraph "Data Layer"
        DB[(PostgreSQL)]
        CACHE[(Redis)]
        STORAGE[(File Storage)]
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

## :sparkles: Features

### Core Hotel Management

- **🏢 Multi-Tenant Architecture**: Manage multiple hotel properties with complete data isolation
- **🛏️ Room Management**: Comprehensive room inventory, types, amenities, and pricing
- **📅 Reservation System**: Advanced booking engine with real-time availability
- **👥 Guest Management**: Complete guest profiles, preferences, and history
- **💼 Front Desk Operations**: Check-in/out, room assignments, and walk-ins
- **🧹 Housekeeping**: Room status tracking, cleaning schedules, and maintenance
- **💰 Billing & Invoicing**: Flexible pricing, taxes, discounts, and payment processing

### Advanced Features

- **📊 Analytics Dashboard**: Real-time occupancy, revenue, and performance metrics
- **🔄 Channel Manager**: Integration with OTAs (Booking.com, Expedia, etc.)
- **📱 Mobile-Responsive**: Full functionality across all devices
- **🌐 Multi-Language Support**: Internationalization for global operations
- **👷 Staff Management**: Roles, permissions, schedules, and task assignments
- **📧 Communication Hub**: Automated emails, SMS notifications, and guest messaging
- **🎯 Revenue Management**: Dynamic pricing and yield optimization
- **🔗 Third-Party Integrations**: POS systems, door locks, and accounting software

### Technical Features

- **🔐 Role-Based Access Control**: Granular permissions for different user types
- **🚀 Real-Time Updates**: WebSocket-powered live updates across the platform
- **📈 Scalable Architecture**: Built to handle properties of any size
- **🔒 Data Security**: End-to-end encryption and compliance with hospitality standards
- **🔄 API-First Design**: RESTful API for easy integrations
- **📱 Progressive Web App**: Installable on mobile devices
- **🎨 Customizable UI**: Theming system for brand consistency

## :rocket: Technologies

### Backend

- **[AdonisJS v6](https://adonisjs.com/)**: Enterprise-grade Node.js framework
- **[PostgreSQL](https://www.postgresql.org/)**: Robust relational database with multi-tenant support
- **[Redis](https://redis.io/)**: High-performance caching and session management
- **[Bull Queue](https://github.com/OptimalBits/bull)**: Background job processing
- **[JWT](https://jwt.io/)**: Secure authentication

### Frontend

- **[React 19](https://react.dev/)**: Modern UI library
- **[Inertia.js](https://inertiajs.com/)**: SPA experience without the complexity
- **[TypeScript](https://www.typescriptlang.org/)**: Type-safe development
- **[Tailwind CSS](https://tailwindcss.com/)**: Utility-first styling
- **[shadcn/ui](https://ui.shadcn.com/)**: Beautiful, accessible components
- **[Recharts](https://recharts.org/)**: Data visualization

### DevOps & Tools

- **[Docker](https://www.docker.com/)**: Containerization
- **[Vite](https://vitejs.dev/)**: Lightning-fast development
- **[ESLint](https://eslint.org/)** & **[Prettier](https://prettier.io/)**: Code quality
- **[Japa](https://japa.dev/)**: Testing framework

## :hammer_and_wrench: Installation

### Prerequisites

- **Node.js** (v18 or higher)
- **pnpm** (recommended) or npm/yarn
- **PostgreSQL** (v14 or higher)
- **Redis** (v6 or higher)
- **Docker** (optional, for containerized setup)

### Quick Start

1. **Clone the repository:**

   ```bash
   git clone https://github.com/gabrielmaialva33/innkeeper.git
   cd innkeeper
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Set up environment variables:**

   ```bash
   cp .env.example .env
   ```

   Configure your database, Redis, and other settings in the `.env` file.

4. **Run database migrations:**

   ```bash
   node ace migration:run
   ```

5. **Seed initial data (optional):**

   ```bash
   node ace db:seed
   ```

6. **Start the development server:**

   ```bash
   pnpm dev
   ```

   Your application will be available at `http://localhost:3333`

### Docker Setup

For a containerized environment:

```bash
docker-compose up -d
pnpm docker
```

### Production Deployment

1. **Build the application:**

   ```bash
   pnpm build
   ```

2. **Run migrations in production:**

   ```bash
   node ace migration:run --force
   ```

3. **Start the production server:**
   ```bash
   pnpm start
   ```

## :books: Documentation

For detailed documentation, visit our [Wiki](https://github.com/gabrielmaialva33/innkeeper/wiki) or check the `/docs` folder.

### API Documentation

API documentation is available at `/api/docs` when running in development mode.

## :handshake: Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## :memo: License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with ❤️ for the hospitality industry
</p>
