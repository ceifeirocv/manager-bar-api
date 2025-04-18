import express from "express";
import { healthRouter } from "./modules/health/health.routes.js";
import { errorHandler } from "./common/middleware/error.middleware.js";
import * as dotenv from "dotenv";
import { testConnection } from "./db/index.js";
import { setupDatabase } from "./db-setup.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { usersRouter } from "./modules/users/users.routes.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use("/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);

// Default route
app.get("/", (_req, res) => {
  res.json({ message: "Welcome to the Express 5 API with TypeScript" });
});

// Database health check route
app.get("/db-health", async (_req, res) => {
  console.log("Received request to /db-health");
  try {
    const result = await testConnection();
    res.json({
      status: "ok",
      api: "running",
      database: "connected",
      result,
    });
  } catch (error: any) {
    console.error("Database connection error:", error);
    res.status(500).json({
      status: "error",
      api: "running",
      database: "disconnected",
      error: error.message || "Unknown error",
    });
  }
});

// Error handling middleware (should be after all routes)
app.use(errorHandler);

// Run database setup before starting the server
const startServer = async () => {
  try {
    // Run database setup
    console.log("Running database setup before starting server...");
    const dbSetupSuccess = await setupDatabase();

    if (!dbSetupSuccess) {
      console.error(
        "Database setup failed. Server will start but database features may not work."
      );
    } else {
      console.log("Database setup completed successfully!");
    }

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Start the server
startServer();

export default app;
