import express from "express";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import { auth } from "../../auth.js";

// Create a router for auth-related routes
export const authRouter = express.Router();

// Mount the BetterAuth handler for all auth routes
// This will handle all requests to /api/auth/* including registration, login, etc.
authRouter.all("/*splat", toNodeHandler(auth));

// Create a middleware to protect routes
export const requireAuth = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    // Get the session from the request headers
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    // If there's no session, return 401 Unauthorized
    if (!session) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
};
