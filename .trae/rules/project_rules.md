# Project Rules for Adonis Web Kit

## ⚠️ CRITICAL RULE: ALWAYS USE ADONISJS COMMANDS

**NEVER manually create files in this project.** Always use AdonisJS Ace commands:

- `node ace make:controller` for controllers
- `node ace make:model` for models
- `node ace make:migration` for migrations
- `node ace make:service` for services
- See "AdonisJS Commands (MUST USE)" section for complete command reference

This ensures proper file structure, naming conventions, and boilerplate code.

## Framework Versions and Dependencies

### Core Framework

- **AdonisJS**: v6.x (latest stable)
- **Node.js**: >= 20.6.0 (required for ESM support)
- **Package Manager**: pnpm (required, npm/yarn not supported)

### Frontend Stack

- **React**: v19.x
- **Inertia.js**: v2.x for SPA-like experience
- **TypeScript**: v5.x across entire stack
- **Vite**: v6.x as build tool

### Styling and UI

- **TailwindCSS**: v4.x (latest version)
- **shadcn/ui**: Latest components
- **CSS Variables**: Use for theming and dark mode

### Database and ORM

- **Lucid ORM**: AdonisJS native ORM
- **PostgreSQL**: Production database
- **Redis**: For caching, sessions, and queues

### Authentication and Security

- **Default Guard**: JWT (do not change without discussion)
- **Available Guards**: JWT, API tokens, session, basic auth
- **Password Hashing**: Argon2 (never use bcrypt or plain text)
- **CSRF Protection**: Always enabled via Shield

## Testing Framework

### Test Runners

- **Japa**: Primary testing framework (AdonisJS native)
- **Vitest**: For React component testing only
- **Playwright**: For browser/e2e tests

### Test Organization

- **Unit Tests**: `tests/unit/**/*.spec.ts` (2s timeout)
- **Functional Tests**: `tests/functional/**/*.spec.ts` (30s timeout)
- **Browser Tests**: `tests/browser/**/*.spec.ts` (60s timeout)

### Testing Best Practices

- Always use database transactions for functional tests with `testUtils.db().withGlobalTransaction()`
- Use `testUtils.db().truncate()` when transactions aren't feasible
- Mock external services using MSW
- Use factories for test data generation
- Never use production database for testing
- Define test-specific env vars in `.env.test` (overrides `.env`)
- Use `cleanup` hooks for proper test isolation
- Configure `SESSION_DRIVER=memory` in `.env.test`
- Register appropriate Japa plugins: apiClient, sessionApiClient, authApiClient, shieldApiClient

## API and Architecture Guidelines

### Import Aliases (Always Use)

- `#controllers/*` for controllers
- `#services/*` for services
- `#models/*` for models
- `#repositories/*` for repositories
- `#validators/*` for validators
- `#middleware/*` for middleware
- `#config/*` for config files
- Never use relative imports like `../../`

### Architecture Patterns

1. **Controller → Service → Repository → Model** flow (strict separation)
2. Services must be single-responsibility (one service per use case)
3. Use dependency injection with `@inject()` decorator
4. Repositories must extend `LucidRepository`
5. Domain logic belongs in services, not controllers
6. Use abstract classes for interfaces (TypeScript limitation)
7. Register services in IoC container when needed
8. Avoid static properties accessing HttpContext

### File Organization

- Services organized by domain: `app/services/{domain}/{action}.ts`
- One service per use case (e.g., `CreateUserService`, `UpdateUserService`)
- Controllers handle HTTP only, no business logic
- Models contain relationships and hooks only

## Restricted APIs and Practices

### Never Use

1. **Direct database queries** - Always use Lucid ORM
2. **process.env** - Use AdonisJS Env module
3. **console.log** - Use AdonisJS Logger
4. **require()** - Use ES modules import
5. **Synchronous file operations** - Use async/await
6. **Global variables** - Use IoC container
7. **Hardcoded secrets** - Use environment variables

### Deprecated or Avoided

1. **Class-based React components** - Use functional components
2. **Redux** - Use Inertia.js shared data
3. **Axios** - Use fetch or AdonisJS HTTP client
4. **Moment.js** - Use native Date or date-fns
5. **jQuery** - Use vanilla JS or React

## Code Style and Conventions

### TypeScript

- Strict mode always enabled
- Explicit return types for public methods
- Use interfaces over types for objects
- Prefer `unknown` over `any`

### Naming Conventions

- **Files**: kebab-case (e.g., `create-user-service.ts`)
- **Classes**: PascalCase (e.g., `CreateUserService`)
- **Variables/Functions**: camelCase
- **Database**: snake_case (handled by Lucid)
- **Routes**: kebab-case URLs

### Database Conventions

- **Migrations**: Timestamp prefix, descriptive names
- **Models**: Singular names (User, not Users)
- **Tables**: Plural snake_case (users, not user)
- **Foreign Keys**: `{table}_id` format
- **Pivot Tables**: Alphabetical order (role_user, not user_role)

## Security Requirements

### Authentication

- JWT tokens must expire (never infinite)
- Refresh tokens required for long sessions
- Email verification required for new users
- Rate limiting on auth endpoints

### Permissions

- Use RBAC system exclusively
- Check permissions in middleware or services
- Cache permission checks for performance
- Never hardcode role/permission checks

### File Uploads

- Validate file types and sizes
- Scan for malware when possible
- Store outside web root
- Generate unique filenames

## Development Workflow

### Before Committing

1. Run `pnpm lint` - Must pass
2. Run `pnpm typecheck` - Must pass
3. Run `pnpm test` - Must pass
4. Format with `pnpm format`

### Branch Strategy

- Feature branches from `master`
- PR required for all changes
- Squash commits when merging
- Delete branches after merge

### Environment Variables

- Never commit `.env` files
- Document all variables in `.env.example`
- Use strong typing with Env module in `start/env.ts`
- Validate env vars at startup with `Env.schema`
- Use `.env.test` for test-specific overrides
- Reference other vars with `$VAR_NAME` syntax
- Escape `$` with backslash: `pa\$\$word`
- Production: use `ENV_PATH=/etc/secrets` for custom location

## Performance Guidelines

### Database

- Use eager loading to prevent N+1
- Add indexes for foreign keys
- Use database transactions appropriately
- Implement soft deletes where needed

### Caching

- Cache permission checks
- Use Redis for session storage
- Implement query result caching
- Clear cache on data mutations

### Frontend

- Lazy load React components
- Use React.memo for expensive components
- Implement virtual scrolling for long lists
- Optimize images before upload

## Error Handling

### API Responses

- Use consistent error format
- Return appropriate HTTP status codes
- Include error codes for client handling
- Log errors with context using `logger.error({ err: error }, 'message')`
- Handle specific exceptions in `HttpExceptionHandler`
- Return 422 for validation errors

### Validation

- Use VineJS for all input validation
- Validate at controller level
- Return detailed validation errors with messages
- Sanitize user input
- Custom validation in `start/validator.ts`

### Exception Handling

- Extend `HttpExceptionHandler` for custom handling
- Check for specific error types (e.g., `E_VALIDATION_ERROR`)
- Use `error.handle()` method when available
- Return meaningful error responses

## Documentation Requirements

### Code Comments

- JSDoc for public methods
- Explain complex algorithms
- Document API endpoints
- Include examples for services

### README Updates

- Document new features
- Update setup instructions
- Include migration guides
- List breaking changes

## Deployment Considerations

### Docker

- Use multi-stage builds for optimized images
- Don't run as root
- Include health checks
- Use specific versions, not latest
- Set `NODE_ENV=production` in final stage
- Copy only production dependencies
- Use Alpine Linux for smaller images

### Production Build

- Run `NODE_ENV=production node ace build`
- Deploy only the `build/` directory
- Start with `node build/bin/server.js`
- Use `ENV_PATH` for secure env file location

### Environment-Specific

- Separate configs for dev/staging/prod
- Use environment variables for all configs
- Enable/disable features by environment
- Different log levels per environment
- Production: disable stack traces, enable caching

## AI Assistant Guidelines

When working with AI assistants:

1. **ALWAYS USE COMMANDS** - Never create files manually
   - Use `node ace make:controller` not manual file creation
   - Use `node ace make:migration` not manual database files
   - Use `node ace make:service` not manual service files
2. Always mention the import alias being used
3. Specify the exact service/repository pattern
4. Reference existing code patterns in the project
5. Maintain consistency with existing code style
6. Follow the layered architecture strictly
7. Use dependency injection patterns
8. Write tests for new features using `node ace make:test`
9. Update types when modifying interfaces
10. Run commands in the correct order:
    - Create model before migration if needed
    - Run migrations before seeders
    - Create validators before using in controllers

### Example AI Workflow

```bash
# User asks: "Create a new blog post feature"

# AI should execute:
node ace make:model Post -m
node ace make:controller Post --resource
node ace make:validator CreatePost
node ace make:service posts/CreatePost
node ace make:service posts/UpdatePost
node ace make:service posts/DeletePost
node ace make:factory Post
node ace make:test PostController --suite=functional
node ace migration:run
```

### Using REPL for Debugging

When users need to debug or explore data:

```bash
# Start REPL
node ace repl

# In REPL, help user with:
> const User = await importDefault('#models/user')
> const users = await User.all()
> console.log(users.length)
```

**IMPORTANT**: Suggest REPL for:

- Testing queries before implementation
- Debugging data issues
- Exploring model relationships
- One-off data operations
- Testing service methods interactively

## Middleware Guidelines

### Middleware Organization

- Store in `app/middleware/` directory
- Use descriptive names (e.g., `auth_middleware.ts`)
- Register in `start/kernel.ts`
- Order matters: auth → CSRF → session → custom

### Middleware Best Practices

- Keep middleware focused on single responsibility
- Use `next()` to continue chain
- Handle errors appropriately
- Access HttpContext for request/response
- Use middleware for cross-cutting concerns only

## Routing Best Practices

### Route Organization

- Define routes in `start/routes.ts`
- Group related routes with `router.group()`
- Use route prefixes for API versioning
- Apply middleware at group level when possible

### Route Naming

- Use descriptive names: `users.index`, `posts.show`
- Follow RESTful conventions
- Use kebab-case for URLs
- Validate params with `.where()` matchers

### Route Parameters

- Use meaningful parameter names
- Validate with regex patterns
- Cast parameters in controllers
- Handle missing parameters gracefully

## Service Provider Guidelines

### When to Create Providers

- Registering services in IoC container
- Bootstrapping third-party packages
- Setting up application-wide configurations
- Extending framework functionality

### Provider Best Practices

- Use `boot` method for extensions
- Use `register` method for bindings
- Keep providers focused
- Document provider purpose

## Quality Assurance

### Code Review Checklist

- [ ] Follows architectural patterns
- [ ] Has appropriate tests
- [ ] Includes error handling
- [ ] Updates documentation
- [ ] Passes linting and type checking
- [ ] Uses correct import aliases
- [ ] Follows naming conventions
- [ ] Implements proper validation
- [ ] Considers security implications
- [ ] Optimizes for performance
- [ ] Uses proper middleware order
- [ ] Follows routing conventions
- [ ] Handles edge cases

## AdonisJS-Specific Conventions

### File Structure Standards

```
app/
├── controllers/      # HTTP request handlers
├── exceptions/       # Custom exceptions
├── middleware/       # HTTP middleware
├── models/          # Lucid ORM models
├── services/        # Business logic (domain/action pattern)
├── repositories/    # Data access layer
├── validators/      # Request validation schemas
├── policies/        # Bouncer authorization policies
├── events/          # Event classes
├── listeners/       # Event listeners
└── mails/           # Mail classes
```

## AdonisJS Commands (MUST USE)

### IMPORTANT: Always Use Commands

**NEVER manually create files** - Always use AdonisJS commands to ensure proper structure, naming conventions, and boilerplate code. This is MANDATORY for consistency.

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

### Database Commands

```bash
# Run seeders
node ace db:seed

# Truncate all tables
node ace db:truncate

# Drop all tables, views and types
node ace db:wipe
```

### Development Commands

```bash
# Start dev server with hot reload
node ace serve --hmr

# Start dev server with watch mode
node ace serve --watch

# Build for production
node ace build

# Start REPL session
node ace repl

# Run tests
node ace test

# Run specific test suite
node ace test functional

# Run tests in watch mode
node ace test --watch

# List all routes
node ace list:routes
```

## REPL (Read-Eval-Print Loop) Usage

### Starting REPL

```bash
# Start interactive REPL session
node ace repl
```

### REPL Features

The REPL provides an interactive JavaScript environment with full access to your AdonisJS application context.

### Available Helper Methods

Use `.ls` to list all available methods:

```javascript
> .ls

# GLOBAL METHODS:
importDefault         Returns the default export for a module
make                  Make class instance using "container.make" method
loadApp               Load "app" service in the REPL context
loadEncryption        Load "encryption" service in the REPL context
loadHash              Load "hash" service in the REPL context
loadRouter            Load "router" service in the REPL context
loadConfig            Load "config" service in the REPL context
loadTestUtils         Load "testUtils" service in the REPL context
loadHelpers           Load "helpers" module in the REPL context
clear                 Clear a property from the REPL context
p                     Promisify a function. Similar to Node.js "util.promisify"
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

#### Access Last Result and Error

```javascript
// Access last command result
> helpers.string.generateRandom(32)
'Z3y8QQ4HFpYSc39O2UiazwPeKYdydZ6M'
> _
'Z3y8QQ4HFpYSc39O2UiazwPeKYdydZ6M'

// Access last error
> helpers.string.generateRandom()
> _error.message
'The value of "size" is out of range...'
```

#### Multi-line Editor Mode

```javascript
// Enter editor mode for multi-line code
> .editor
// Entering editor mode (Ctrl+D to finish, Ctrl+C to cancel)

const result = users.map(user => {
  return {
    id: user.id,
    email: user.email
  }
})
// Press Ctrl+D to execute
```

### Custom REPL Methods

Create a REPL preload file to add custom methods:

```bash
node ace make:preload repl -e=repl
```

Example `start/repl.ts`:

```typescript
import app from '@adonisjs/core/services/app'
import repl from '@adonisjs/core/services/repl'
import { fsImportAll } from '@adonisjs/core/helpers'

repl.addMethod('loadModels', async () => {
  const models = await fsImportAll(app.makePath('app/models'))
  repl.server!.context.models = models

  repl.notify('Imported models. Access using "models" property')
  repl.server!.displayPrompt()
})
```

Use custom method:

```javascript
> await loadModels()
// All models now available via models object
> models.User
```

### REPL Best Practices

1. **Use for debugging and data exploration**
   - Test queries before implementing
   - Inspect data relationships
   - Debug service methods

2. **Avoid in production**
   - REPL has full application access
   - Use only in development/staging

3. **Create helper methods**
   - Add frequently used imports
   - Create data generation helpers
   - Add debugging utilities

4. **Common Use Cases**
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
- Use `clear('propertyName')` to remove from context
- Press Tab for auto-completion
- Use `.exit` or Ctrl+C twice to quit

### Cache Commands

```bash
# Clear all cache
node ace cache:clear

# Delete specific cache key
node ace cache:delete user:1

# Remove expired entries
node ace cache:prune
```

### Environment Commands

```bash
# Add new environment variable
node ace env:add

# Add with specific details
node ace env:add MY_VARIABLE value --type=string
```

### Queue Commands

```bash
# Listen to queues
node ace queue:listen

# Listen to specific queues
node ace queue:listen --queue=emails,payments
```

### Permission Commands (Custom)

```bash
# Sync permissions with roles
node ace permission:sync
```

### Package Management

```bash
# Install and configure a package
node ace add @adonisjs/lucid

# Configure already installed package
node ace configure @adonisjs/lucid
```

### Command Best Practices

1. **Always use commands** - Never create files manually
2. **Follow naming conventions** - Commands handle proper casing
3. **Use appropriate flags** - Like `--resource` for RESTful controllers
4. **Group related files** - Use subdirectories in names (e.g., `users/CreateUser`)
5. **Check command help** - Use `node ace make:controller --help`

### Why Use Commands?

- Ensures consistent file structure
- Applies correct naming conventions
- Generates proper boilerplate code
- Registers files automatically when needed
- Prevents common mistakes
- Follows AdonisJS best practices

### Configuration Best Practices

- All config files in `config/` directory
- Use `defineConfig` helper for type safety
- Access config via `import config from '#config/app'`
- Never hardcode values in config files
- Use env variables for environment-specific values

### Database Patterns

- Use migrations for schema changes
- Use seeders for test data only
- Enable soft deletes where appropriate
- Use database transactions for data integrity
- Implement proper indexes for performance

### Event-Driven Patterns

- Define events in `app/events/`
- Define listeners in `app/listeners/`
- Use `emitter.emit()` to trigger events
- Handle errors with `emitter.onError()`
- Keep events focused and descriptive

### Inertia.js Integration

- Page components in `inertia/pages/`
- Use `inertia.render()` in controllers
- Share data via `inertia.share()`
- Handle errors with Inertia error bags
- Use `withInertia()` in tests

### Redis Usage

- Use for caching, sessions, and queues
- Define connections in `config/redis.ts`
- Use pub/sub for real-time features
- Handle connection errors gracefully
- Clear cache after data mutations

### Static Assets

- Store in `public/` directory
- Use Vite for asset bundling
- Import CSS in JS entrypoints
- Configure in `config/vite.ts`
- Use `@vite()` in Edge templates

### Logging Best Practices

- Use AdonisJS Logger, not console.log
- Log errors with context: `logger.error({ err }, 'message')`
- Use appropriate log levels
- Configure per environment
- Include request IDs for tracing
