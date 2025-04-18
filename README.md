# Express 5 API with TypeScript

A bare bones Express 5 API with TypeScript using a modular folder structure.

## Project Structure

```
src/
├── common/           # Shared utilities and middleware
│   └── middleware/   # Express middleware
├── db/               # Database related files
│   ├── schema/        # Drizzle ORM schema definitions
│   ├── migrations/    # Database migrations
│   └── index.ts       # Database connection setup
├── modules/          # Feature modules
│   └── health/       # Health check module
└── index.ts          # Application entry point
```

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

## API Endpoints

- `GET /`: Welcome message
- `GET /health`: Health check endpoint
- `GET /db-health`: Database connection check

## Database Integration

This project uses Drizzle ORM with MySQL for database operations.

### Database Setup

Before running the application, you need to set up the database. Run the following command:

```bash
# Run the database setup script
npx tsx src/db-setup.ts
```

This script will:

1. Connect to the MySQL server
2. Create the database if it doesn't exist
3. Verify the database connection

### Database Migrations

To manage database schema changes, use the following commands:

```bash
# Generate migration files based on schema changes
npm run db:generate

# Apply migrations to the database (for production)
npm run db:migrate

# Push schema changes directly to the database (for development)
npm run db:push

# Start Drizzle Studio to view and manage your database
npm run db:studio
```

Note: These commands use the latest Drizzle Kit syntax as of version 0.21.0 and above. For production environments, it's recommended to use `db:migrate` which applies versioned migrations, while `db:push` is more suitable for development as it directly updates the schema.

### Migration Journal

Drizzle ORM uses a migration journal file located at `src/db/migrations/meta/_journal.json` to track which migrations have been applied to the database. This file is automatically updated when migrations are run and should be committed to version control.

When you run `npm run db:migrate`, Drizzle will:

1. Check the journal file to determine which migrations have already been applied
2. Apply any new migrations in the correct order
3. Update the journal file to record the newly applied migrations

This ensures that migrations are only applied once and in the correct order, even when deploying to multiple environments.

### Creating Schema Definitions

To define your database schema, create new files in the `src/db/schema` directory. For example, to create a users table, you might create a file at `src/db/schema/users.ts` with the following content:

```typescript
import { mysqlTable, varchar, int, timestamp } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});
```

Then, export your schema from the `src/db/schema/index.ts` file:

```typescript
export * from "./users.js";
```

After defining your schema, generate migrations with `npm run db:generate` and apply them with `npm run db:migrate`.

## Deployment

### Deploying to Leapcell

This project is configured for easy deployment to Leapcell.

#### Deployment Steps

1. Fork or clone this repository to your GitHub account
2. Create a Leapcell account or log in to your existing account
3. Create a new project in Leapcell
4. Connect your GitHub repository
5. Leapcell will automatically detect the `leapcell.json` configuration file
6. Configure any additional settings if needed
7. Deploy your application

#### Configuration Details

The `leapcell.json` file contains the following configuration:

```json
{
  "name": "express-ts-api",
  "type": "node",
  "build": {
    "command": "npm install && npm run build && npm run db:push"
  },
  "run": {
    "command": "node --loader ts-node/esm src/db-setup.ts && npm start"
  },
  "env": {
    "NODE_ENV": "production",
    "PORT": "3000",
    "DATABASE_HOST": "your-mysql-host",
    "DATABASE_PORT": "3306",
    "DATABASE_NAME": "your-database-name",
    "DATABASE_USER": "your-database-user",
    "DATABASE_PASSWORD": "your-database-password",
    "DATABASE_SSL": "true"
  },
  "healthCheck": {
    "path": "/db-health",
    "expectedStatus": 200
  }
}
```

You can modify this configuration to suit your specific needs.

#### Deployment Features

The Leapcell deployment includes the following features:

1. **Automatic Database Migrations**: The `db:migrate` command is run during the build process to ensure the database schema is up to date in a safe, versioned manner.

2. **Database Setup Check**: Before starting the server, the database setup script is run to ensure the database exists and is accessible.

3. **Health Check with Database Verification**: The health check endpoint (`/db-health`) verifies both the API and database connection, ensuring the entire system is operational.

The API will be available at the URL provided by Leapcell once deployment is complete.
