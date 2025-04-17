import express from "express";
import { healthRouter } from "./modules/health/health.routes.js";
import { errorHandler } from "./common/middleware/error.middleware.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use("/health", healthRouter);

// Default route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Express 5 API with TypeScript" });
});

// Error handling middleware (should be after all routes)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
