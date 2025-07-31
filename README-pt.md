<h1 align="center">
  <img src=".github/assets/ui-design.png" height="250" alt="Adonis Web Kit">
</h1>

<p align="center">
  <img src="https://img.shields.io/github/license/gabrielmaialva33/adonis-web-kit?color=00b8d3&style=flat-square" alt="Licença" />
  <img src="https://img.shields.io/github/languages/top/gabrielmaialva33/adonis-web-kit?style=flat-square" alt="Linguagem principal do GitHub" >
  <img src="https://img.shields.io/github/repo-size/gabrielmaialva33/adonis-web-kit?style=flat-square" alt="Tamanho do repositório" >
  <a href="https://github.com/gabrielmaialva33/adonis-web-kit/commits/main">
    <img src="https://img.shields.io/github/last-commit/gabrielmaialva33/adonis-web-kit?style=flat-square" alt="Último commit do GitHub" >
  </a>
</p>

<p align="center">
    <a href="README.md">Inglês</a>
    ·
    <a href="README-pt.md">Português</a>
</p>

<p align="center">
  <a href="#bookmark-sobre">Sobre</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#rocket-desenvolvimento-ai-first">Desenvolvimento AI-First</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#computer-tecnologias">Tecnologias</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#package-instalação">Instalação</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#memo-licença">Licença</a>
</p>

## :bookmark: Sobre

O **Adonis Web Kit** é um _starter kit_ full-stack moderno, opinativo e focado em IA, projetado para acelerar o
desenvolvimento de aplicações web robustas. Ele combina um poderoso backend em **AdonisJS v6** com um frontend dinâmico
em **React 19** e **Inertia.js**, tudo dentro de uma estrutura monorepo unificada.

Este projeto não é apenas uma coleção de tecnologias; é uma fundação projetada para eficiência, escalabilidade e
colaboração transparente com parceiros de desenvolvimento de IA. Ao fornecer uma arquitetura bem definida com recursos
como autenticação, controle de acesso baseado em papéis (RBAC) e gerenciamento de arquivos prontos para uso, ele permite
que desenvolvedores (humanos e IAs) se concentrem na construção de lógicas de negócio únicas, em vez de código
repetitivo.

### 🏗️ Visão Geral da Arquitetura

```mermaid
graph TD
    subgraph "Frontend (Inertia.js)"
        FE_UI[Componentes React & Páginas]
        FE_HOOKS["Hooks (useAuth, useApi)"]
        FE_UTILS[Utilitários & Tipos]
    end

    subgraph "Backend (AdonisJS)"
        BE_ROUTES[Rotas]
        BE_MW["Middleware (Auth, ACL)"]
        BE_CTRL[Controllers]
        BE_SERVICES[Serviços]
        BE_REPOS[Repositórios]
        BE_MODELS[Modelos Lucid]
    end

    subgraph "Compartilhado (Shared)"
        SHARED_TYPES[Tipos TypeScript]
        SHARED_CONFIG[Arquivos de Configuração]
    end

    subgraph "Camada de Dados (Data Layer)"
        DB[(PostgreSQL)]
        CACHE[(Redis)]
    end

    FE_UI --> BE_ROUTES
    BE_ROUTES --> BE_MW
    BE_MW --> BE_CTRL
    BE_CTRL --> BE_SERVICES
    BE_SERVICES --> BE_REPOS
    BE_REPOS --> BE_MODELS
    BE_MODELS --> DB

    BE_SERVICES --> CACHE
    FE_HOOKS --> BE_ROUTES

    FE_UTILS --> SHARED_TYPES
    BE_CTRL --> SHARED_TYPES
```

## :rocket: Desenvolvimento AI-First

Este _starter kit_ foi projetado de forma única para maximizar a eficácia da codificação assistida por IA.

- **Contexto Unificado (Monorepo)**: Ter o código do backend e do frontend em um único repositório fornece um contexto
  completo para ferramentas de IA, permitindo que elas gerem código mais preciso e coeso que abrange toda a stack.
- **Base Fortemente Tipada**: O uso de TypeScript de ponta a ponta cria um contrato claro entre as camadas de frontend,
  backend e API. Isso reduz a ambiguidade e permite que a IA entenda estruturas de dados e assinaturas de funções,
  resultando em menos erros.
- **Arquitetura Modular e Opinativa**: A clara separação de responsabilidades (controllers, serviços, repositórios)
  facilita para uma IA localizar, entender e modificar partes específicas do código com precisão.
- **Foco na Lógica de Negócio**: Com o boilerplate de autenticação, permissões e armazenamento de arquivos já resolvido,
  a IA pode ser direcionada para resolver problemas de negócio de nível superior desde o primeiro dia.

## 🌟 Principais Funcionalidades

- **🔐 Autenticação Multi-Guard**: Autenticação baseada em JWT pronta para uso.
- **👥 Controle de Acesso Avançado (RBAC)**: Gerencie permissões de usuário com papéis e regras detalhadas.
- **📁 Gerenciamento de Arquivos**: Serviço de upload de arquivos pré-configurado com suporte para drivers locais e S3.
- **⚡️ Reatividade Full-Stack**: O poder do React combinado com a simplicidade de uma aplicação tradicional renderizada
  no servidor, graças ao Inertia.js.
- **🎨 Componentes de UI**: Um conjunto de componentes de UI bonitos e reutilizáveis construídos com `shadcn/ui`,
  Tailwind CSS e `lucide-react`.
- **✅ API Type-Safe**: Autocompletar e verificação de tipos para chamadas de API e props.
- **🏥 Health Checks**: Endpoint de verificação de saúde integrado para monitoramento.

## :computer: Tecnologias

- **[AdonisJS v6](https://adonisjs.com/)**: Um framework Node.js robusto para o backend.
- **[React 19](https://react.dev/)**: Uma poderosa biblioteca para construir interfaces de usuário.
- **[Inertia.js](https://inertiajs.com/)**: A cola que conecta o frontend moderno com o backend.
- **[TypeScript](https://www.typescriptlang.org/)**: Para segurança de tipos em toda a stack.
- **[PostgreSQL](https://www.postgresql.org/)**: Um banco de dados relacional confiável e poderoso.
- **[Redis](https://redis.io/)**: Usado para cache e gerenciamento de sessões.
- **[Vite](https://vitejs.dev/)**: Para uma experiência de desenvolvimento frontend ultrarrápida.
- **[Tailwind CSS](https://tailwindcss.com/)**: Um framework CSS utility-first para desenvolvimento rápido de UI.

## :package: Instalação

### ✔️ Pré-requisitos

- **Node.js** (v18 ou superior)
- **pnpm** (ou npm/yarn)
- **Docker** (para rodar PostgreSQL e Redis)

### 🚀 Começando

1. **Clone o repositório:**

   ```sh
   git clone https://github.com/gabrielmaialva33/adonis-web-kit.git
   cd adonis-web-kit
   ```

2. **Instale as dependências:**

   ```sh
   pnpm install
   ```

3. **Configure as variáveis de ambiente:**

   ```sh
   cp .env.example .env
   ```

   _Abra o arquivo `.env` e configure suas credenciais de banco de dados e outras configurações._

4. **Execute as migrações do banco de dados:**

   ```sh
   node ace migration:run
   ```

5. **Inicie o servidor de desenvolvimento:**
   ```sh
   pnpm dev
   ```
   _Sua aplicação estará disponível em `http://localhost:3333`._

### 📜 Scripts Disponíveis

- `pnpm dev`: Inicia o servidor de desenvolvimento com HMR.
- `pnpm build`: Compila a aplicação para produção.
- `pnpm start`: Executa o servidor pronto para produção.
- `pnpm test`: Executa os testes unitários.
- `pnpm test:e2e`: Executa os testes de ponta a ponta.
- `pnpm lint`: Verifica o código com o linter.
- `pnpm format`: Formata o código com o Prettier.

## :memo: Licença

Este projeto está licenciado sob a **Licença MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<p align="center">
  Feito com ❤️ pela comunidade.
</p>
