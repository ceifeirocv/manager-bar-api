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

### Deploying to Render

This project is configured for easy deployment to [Render](https://render.com).

#### Using Render Blueprint

1. Fork or clone this repository to your GitHub account
2. Create a new Render account or log in to your existing account
3. Click on the "New +" button and select "Blueprint"
4. Connect your GitHub account and select this repository
5. Render will automatically detect the `render.yaml` file and configure the service
6. Click "Apply" to deploy the service

#### Manual Deployment

1. Create a new Web Service in Render
2. Connect your GitHub repository
3. Use the following settings:
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. Add the following environment variables:
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (Render assigns this automatically)
5. Click "Create Web Service" to deploy

The API will be available at the URL provided by Render once deployment is complete.
