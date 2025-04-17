# Express 5 API with TypeScript

A bare bones Express 5 API with TypeScript using a modular folder structure.

## Project Structure

```
src/
├── common/           # Shared utilities and middleware
│   └── middleware/   # Express middleware
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
    "command": "npm install && npm run build"
  },
  "run": {
    "command": "npm start"
  },
  "env": {
    "NODE_ENV": "production",
    "PORT": "3000"
  },
  "healthCheck": {
    "path": "/health",
    "expectedStatus": 200
  }
}
```

You can modify this configuration to suit your specific needs.

The API will be available at the URL provided by Leapcell once deployment is complete.
