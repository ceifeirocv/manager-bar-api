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

### System Endpoints

- `GET /`: Welcome message
- `GET /health`: Health check endpoint
- `GET /db-health`: Database connection check

### User Endpoints

- `GET /api/users/me`: Get current user profile (protected)

### Authentication Endpoints (BetterAuth)

- `POST /api/auth/signup`: Register a new user
- `POST /api/auth/signin`: Log in a user
- `POST /api/auth/signout`: Log out a user
- `POST /api/auth/reset-password`: Request a password reset
- `POST /api/auth/verify-email`: Verify a user's email

## Authentication with BetterAuth

This project uses BetterAuth for authentication, which provides a comprehensive authentication solution with features like email/password authentication, social sign-on, and more.

### Authentication Setup

The authentication system is configured in `src/auth.ts` and uses the Drizzle adapter to integrate with the MySQL database.

```typescript
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db/index.js";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "mysql",
  }),
  emailAndPassword: {
    enabled: true,
  },
});
```

### Built-in Authentication Routes

BetterAuth provides built-in routes for user management, including:

- User registration: `POST /api/auth/signup`
- User login: `POST /api/auth/signin`
- User logout: `POST /api/auth/signout`
- Password reset: `POST /api/auth/reset-password`
- Email verification: `POST /api/auth/verify-email`

These routes are automatically available when you mount the BetterAuth handler in your Express app.

### Authentication Flow

1. **User Registration**:

   - User submits email and password to `/api/auth/signup`
   - BetterAuth creates a new user in the database
   - A verification email is sent to the user's email address
   - User receives a success response

2. **Email Verification**:

   - User clicks the verification link in the email
   - BetterAuth verifies the token and marks the email as verified
   - User is redirected to the application

3. **User Login**:

   - User submits email and password to `/api/auth/signin`
   - BetterAuth validates the credentials
   - If valid, BetterAuth creates a new session and returns a session token
   - The session token is stored in a cookie

4. **Accessing Protected Routes**:

   - The client includes the session cookie in requests to protected routes
   - The `requireAuth` middleware verifies the session
   - If valid, the request proceeds to the route handler
   - If invalid, a 401 Unauthorized response is returned

5. **Password Reset**:
   - User requests a password reset at `/api/auth/reset-password`
   - BetterAuth sends a password reset email
   - User clicks the reset link and sets a new password
   - User can now log in with the new password

### Email Configuration with MailerSend

This project uses MailerSend for sending verification and password reset emails. The email functionality is configured directly in the `emailAndPassword` section of the BetterAuth configuration:

```typescript
emailAndPassword: {
  enabled: true,
  verifyEmail: true, // Require email verification

  // Email verification handler
  sendVerificationEmail: async ({ user, url }, _request) => {
    // Create and send verification email using MailerSend
    const emailParams = new EmailParams()
      .setFrom(new Sender(defaultSender.email, defaultSender.name))
      .setTo([new Recipient(user.email)])
      .setSubject("Verify your email address")
      .setHtml(`
        <h1>Verify your email address</h1>
        <p>Click the link below to verify your email address:</p>
        <p><a href="${url}">${url}</a></p>
      `);

    await mailerSend.email.send(emailParams);
  },

  // Password reset handler
  sendResetPassword: async ({ user, url }, _request) => {
    // Create and send password reset email using MailerSend
    // ...
  },
},
```

### Protected Routes

To protect routes that require authentication, use the `requireAuth` middleware:

```typescript
import { requireAuth } from "../auth/auth.routes.js";

// Public route - accessible to everyone
app.get("/api/public", (req, res) => {
  res.json({ message: "This is a public endpoint" });
});

// Protected route - only accessible to authenticated users
app.get("/api/protected", requireAuth, async (req, res) => {
  // Fetch the session directly from the auth API
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  res.json({
    message: "This is a protected endpoint",
    user: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name || null,
    },
  });
});
```

### Environment Variables

The application requires the following environment variables:

```
# BetterAuth Configuration
BETTER_AUTH_SECRET=your-secret-key-at-least-32-characters-long
BETTER_AUTH_URL=http://localhost:3000

# MailerSend Configuration
MAILERSEND_API_KEY=apikey-mlsn.cb034321de8857846b6431aca458d16c436bd2639f0f125e61369236a16a543c
EMAIL_FROM=auth@yourdomain.com
EMAIL_FROM_NAME=Your App Name

# Database Configuration
DATABASE_HOST=your-database-host
DATABASE_PORT=your-database-port
DATABASE_NAME=your-database-name
DATABASE_USER=your-database-user
DATABASE_PASSWORD=your-database-password
DATABASE_SSL=true
```

Make sure to update these values with your actual configuration details.

### Email Configuration

This project uses MailerSend for sending verification and password reset emails. The email templates are configured in the `src/auth.ts` file:

```typescript
// Email verification configuration
emailVerification: {
  sendVerificationEmail: async ({ user, url }, _request) => {
    try {
      // Create email parameters using MailerSend
      const emailParams = new EmailParams()
        .setFrom(new Sender(defaultSender.email, defaultSender.name))
        .setTo([new Recipient(user.email)])
        .setSubject("Verify your email address")
        .setHtml(`
          <h1>Verify your email address</h1>
          <p>Click the link below to verify your email address:</p>
          <p><a href="${url}">${url}</a></p>
        `);

      // Send the email
      await mailerSend.email.send(emailParams);
    } catch (error) {
      console.error("Error sending verification email:", error);
      throw new Error("Failed to send verification email");
    }
  }
},

// Password reset configuration
passwordReset: {
  sendResetPasswordEmail: async ({ user, url }, _request) => {
    // Create and send password reset email using MailerSend
    // ...
  }
},
```

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
