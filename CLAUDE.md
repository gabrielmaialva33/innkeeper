# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ⚠️ CRITICAL RULE: ALWAYS USE ADONISJS COMMANDS

**NEVER manually create files in this project.** Always use AdonisJS Ace commands:

- `node ace make:controller` for controllers
- `node ace make:model` for models
- `node ace make:migration` for migrations
- `node ace make:service` for services
- See "AdonisJS Commands Reference" section below for complete list

This ensures proper file structure, naming conventions, and boilerplate code.

## Common Development Commands

### Development

- `pnpm run dev` - Start development server with hot reload
- `pnpm run build` - Build application for production
- `pnpm start` - Start production server

### Testing

- `pnpm test` - Run unit tests only
- `pnpm run test:e2e` - Run all tests (functional and e2e)

### Code Quality

- `pnpm run lint` - Run ESLint
- `pnpm run lint:fix` - Fix linting issues automatically
- `pnpm run format` - Format code with Prettier
- `pnpm run typecheck` - Run TypeScript type checking

### Database

- `node ace migration:run` - Run pending migrations
- `node ace db:seed` - Run database seeders
- `node ace migration:rollback` - Rollback last migration

### Docker

- `pnpm run docker` - Run migrations, seeders, and start server

## Architecture Overview

This is an AdonisJS v6 application with React frontend using Inertia.js. The project follows a modular structure with
clear separation of concerns.

### Key Technologies

- **Backend**: AdonisJS v6 (Node.js framework)
- **Frontend**: React 19 with Inertia.js for SPA-like experience
- **Database**: PostgreSQL (production), SQLite (testing)
- **Styling**: TailwindCSS v4
- **Authentication**: Multiple guards - JWT (default), API tokens, session, basic auth
- **Validation**: VineJS
- **Testing**: Japa framework
- **Queue**: Bull Queue with Redis

### Project Structure

#### Backend Architecture (`app/`)

- **controllers/**: HTTP request handlers organized by domain (user, role, permission, file, health)
- **models/**: Lucid ORM models with relationships and hooks
- **services/**: Business logic layer organized by domain with specific use cases
- **repositories/**: Data access layer abstraction
- **middleware/**: HTTP middleware for auth, ACL, ownership checks
- **validators/**: Request validation schemas
- **events/**: Domain events and listeners
- **exceptions/**: Custom exception classes

#### Frontend (`inertia/`)

- **app/**: React application entry points
- **pages/**: React page components
- **css/**: Stylesheets

#### Configuration (`config/`)

- **auth.ts**: Multi-guard authentication (JWT default, API tokens, session, basic auth)
- **database.ts**: PostgreSQL/SQLite configuration
- **drive.ts**: File storage (local, S3, GCS)

### Authentication & Authorization

The application uses a comprehensive RBAC (Role-Based Access Control) system:

- **Multiple Auth Guards**: JWT (default), API tokens, session, basic auth
- **Role-Permission System**: Users have roles, roles have permissions, users can have direct permissions
- **Permission Inheritance**: Roles can inherit permissions from other roles
- **Permission Caching**: Optimized permission checking with caching
- **Ownership-based Access**: Middleware for resource ownership validation

### Key Features

- **User Management**: CRUD operations with email verification
- **Role Management**: Dynamic role creation and permission assignment
- **File Upload**: Multi-provider file storage (local, S3, GCS)
- **Audit Logging**: Track user actions and changes
- **Rate Limiting**: API throttling
- **Internationalization**: Multi-language support (en/pt)
- **Health Checks**: System health monitoring

### Import Aliases

The project uses extensive import aliases defined in `package.json`:

- `#controllers/*` → `./app/controllers/*.js`
- `#models/*` → `./app/models/*.js`
- `#services/*` → `./app/services/*.js`
- `#repositories/*` → `./app/repositories/*.js`
- `#middleware/*` → `./app/middleware/*.js`
- `#validators/*` → `./app/validators/*.js`
- `#config/*` → `./config/*.js`
- And many more...

### Database

- **ORM**: Lucid with snake_case naming strategy
- **Migrations**: Located in `database/migrations/`
- **Soft Deletes**: Implemented in User model
- **Relationships**: Extensive use of many-to-many relationships for RBAC

### Testing

Two test suites configured in `adonisrc.ts`:

- **Unit tests**: `tests/unit/**/*.spec.ts` (2s timeout)
- **Functional tests**: `tests/functional/**/*.spec.ts` (30s timeout)

Uses Japa testing framework with API client and OpenAPI assertion support.

### File Organization

Services are organized by domain with specific use cases:

- `app/services/users/` - User-related operations
- `app/services/permissions/` - Permission management
- `app/services/roles/` - Role management
- `app/services/audits/` - Audit logging
- `app/services/upload/` - File upload handling

This structure promotes maintainability and clear separation of business logic.

## AdonisJS Commands Reference (MUST USE)

### File Generation Commands

#### Controllers

```bash
node ace make:controller User
# Creates: app/controllers/users_controller.ts

node ace make:controller Post --resource
# Creates controller with all RESTful methods
```

#### Models

```bash
node ace make:model User
# Creates: app/models/user.ts

node ace make:model Post -m
# Creates model with migration
```

#### Migrations

```bash
node ace make:migration users
# Creates: database/migrations/[timestamp]_create_users_table.ts

node ace make:migration add_email_to_users --alter
# Creates migration for altering existing table
```

#### Services

```bash
node ace make:service users/CreateUser
# Creates: app/services/users/create_user.ts

node ace make:service auth/VerifyEmail
# Creates: app/services/auth/verify_email.ts
```

#### Middleware

```bash
node ace make:middleware Auth
# Creates: app/middleware/auth_middleware.ts

node ace make:middleware RateLimit --stack=router
# Creates middleware for router stack
```

#### Validators

```bash
node ace make:validator CreateUser
# Creates: app/validators/create_user.ts

node ace make:validator users/UpdateProfile
# Creates: app/validators/users/update_profile.ts
```

#### Tests

```bash
node ace make:test UserController --suite=functional
# Creates: tests/functional/user_controller.spec.ts

node ace make:test UserService --suite=unit
# Creates: tests/unit/user_service.spec.ts
```

#### Other Resources

```bash
node ace make:factory User
# Creates: database/factories/user_factory.ts

node ace make:seeder User
# Creates: database/seeders/user_seeder.ts

node ace make:event UserRegistered
# Creates: app/events/user_registered.ts

node ace make:listener SendWelcomeEmail
# Creates: app/listeners/send_welcome_email.ts

node ace make:mail VerifyEmail
# Creates: app/mails/verify_email.ts

node ace make:exception ValidationException
# Creates: app/exceptions/validation_exception.ts

node ace make:provider AppProvider
# Creates: providers/app_provider.ts

node ace make:command SendEmails
# Creates: commands/send_emails.ts

node ace make:job ProcessPayment
# Creates: app/jobs/process_payment.ts

node ace make:preload redis
# Creates: start/redis.ts

node ace make:view users/index
# Creates: resources/views/users/index.edge
```

### Migration Commands

```bash
# Run pending migrations
node ace migration:run

# Rollback last batch
node ace migration:rollback

# Rollback all migrations
node ace migration:reset

# Drop all tables and re-migrate
node ace migration:fresh

# Rollback and re-run all migrations
node ace migration:refresh

# Check migration status
node ace migration:status

# Rollback to specific batch
node ace migration:rollback --batch=2
```

### Package Management

```bash
# Install and configure a package
node ace add @adonisjs/lucid

# Configure already installed package
node ace configure @adonisjs/lucid
```

## REPL (Read-Eval-Print Loop) Usage

### Starting REPL

```bash
# Start interactive REPL session
node ace repl
```

### Common REPL Operations

#### Import Models and Services

```javascript
// Import default export
const User = await importDefault('#models/user')

// Alternative import syntax
const { default: User } = await import('#models/user')

// Import services
const UserService = await importDefault('#services/users/create_user')
```

#### Working with Models

```javascript
// Query users
const users = await User.all()
const user = await User.find(1)

// Create user
const newUser = await User.create({
  email: 'test@example.com',
  password: 'secret',
})

// Update user
user.email = 'newemail@example.com'
await user.save()
```

#### Load Application Services

```javascript
// Load specific services
await loadApp() // Access app service
await loadRouter() // Access router service
await loadConfig() // Access config service
await loadHash() // Access hash service
await loadHelpers() // Access helpers module
```

### REPL Best Practices

1. **Use for debugging and data exploration**
   - Test queries before implementing
   - Inspect data relationships
   - Debug service methods

2. **Common Use Cases**
   - Testing model queries
   - Debugging service logic
   - Inspecting configuration
   - Running one-off data migrations
   - Testing email templates
   - Verifying queue jobs

### REPL Tips

- Use `importDefault()` for cleaner imports
- Access configs via `await loadConfig()`
- Test services interactively before implementing
- Use `.ls` to list all available methods
- Press Tab for auto-completion
- Use `.exit` or Ctrl+C twice to quit

## Important Instructions for AI Assistants

1. **ALWAYS USE COMMANDS** - Never create files manually
   - Use `node ace make:controller` not manual file creation
   - Use `node ace make:migration` not manual database files
   - Use `node ace make:service` not manual service files

2. **Follow the Architecture**
   - Controller → Service → Repository → Model flow
   - Use dependency injection with `@inject()` decorator
   - Keep business logic in services, not controllers

3. **Use Import Aliases**
   - Always use `#controllers/*`, `#services/*`, etc.
   - Never use relative imports like `../../`

4. **Test Before Committing**
   - Run `pnpm lint` - Must pass
   - Run `pnpm typecheck` - Must pass
   - Run `pnpm test` - Must pass

5. **Suggest REPL for Debugging**
   - When users need to explore data
   - When testing queries before implementation
   - When debugging service methods

6. **Example Workflow**

   ```bash
   # User asks: "Create a new product feature"

   # Execute in order:
   node ace make:model Product -m
   node ace make:controller Product --resource
   node ace make:validator CreateProduct
   node ace make:service products/CreateProduct
   node ace make:service products/UpdateProduct
   node ace make:service products/DeleteProduct
   node ace make:factory Product
   node ace make:test ProductController --suite=functional
   node ace migration:run
   ```
