import type { Express } from "express";
import { authStorage } from "./storage";
import { isAuthenticated } from "./replitAuth";
import { storage } from "../../storage";

// Register auth-specific routes
export function registerAuthRoutes(app: Express): void {
  // Get current authenticated user
  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await authStorage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.get("/api/auth/role", isAuthenticated, async (req: any, res) => {
    try {
      if (process.env.LOCAL_AUTH === "true") {
        const sessionData = (req.session as any) || {};
        const role = sessionData.localRole || "player";
        return res.json({ role });
      }

      const profile = await storage.getPlayerProfile(req.user.claims.sub);
      if (profile?.isAdmin) {
        return res.json({ role: "admin" });
      }
      return res.json({ role: "player" });
    } catch (error) {
      console.error("Error fetching role:", error);
      res.status(500).json({ message: "Failed to fetch role" });
    }
  });
}
