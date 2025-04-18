import express from "express";
import { requireAuth } from "../auth/auth.routes.js";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../../auth.js";

// Create a router for user-related routes
export const usersRouter = express.Router();

// Protected route - Get current user profile
usersRouter.get("/me", requireAuth, async (req, res) => {
  try {
    // Fetch the session directly from the auth API
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session || !session.user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    res.json({
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name || null,
        emailVerified: session.user.emailVerified || false,
        image: session.user.image || null,
      },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
