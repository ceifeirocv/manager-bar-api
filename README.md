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
