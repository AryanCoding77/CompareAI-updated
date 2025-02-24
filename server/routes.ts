import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertMatchSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import { analyzeFace } from "./services/facepp";
import { hashPassword } from './utils'; // Assuming this function exists elsewhere
import passport from 'passport'; // Assuming passport is used for authentication

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit to accommodate larger images
  fileFilter: (_req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only jpeg, jpg and png files are allowed"));
    }
  }
}).single('photo');

// Custom error handling middleware for multer
const uploadMiddleware = (req: any, res: any, next: any) => {
  upload(req, res, (err: any) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File is too large. Maximum size is 25MB' });
      }
      return res.status(400).json({ message: err.message });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // Add login route
  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      req.login(user, (err) => {
        if (err) return next(err);
        res.status(200).json(user);
      });
    })(req, res, next);
  });


  // Create a new match
  app.post("/api/matches", uploadMiddleware, async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    if (!req.file) return res.status(400).send("No photo uploaded");

    const invitedUser = await storage.getUserByUsername(req.body.invitedUsername);
    if (!invitedUser) return res.status(404).send("Invited user not found");

    const match = await storage.createMatch({
      creatorId: req.user.id,
      invitedId: invitedUser.id,
      creatorPhoto: req.file.buffer.toString("base64"),
      status: "pending",
      createdAt: new Date(),
    });

    res.json(match);
  });

  // Accept/decline match invitation
  app.post("/api/matches/:id/respond", uploadMiddleware, async (req, res) => {
    if (!req.user) return res.sendStatus(401);

    const match = await storage.getMatch(parseInt(req.params.id));
    if (!match) return res.status(404).send("Match not found");
    if (match.invitedId !== req.user.id) return res.status(403).send("Not authorized");

    const accept = req.body.accept === "true";
    if (!accept) {
      await storage.updateMatch(match.id, { status: "declined" });
      return res.sendStatus(200);
    }

    if (!req.file) return res.status(400).send("No photo uploaded");

    await storage.updateMatch(match.id, {
      invitedPhoto: req.file.buffer.toString("base64"),
      status: "ready"
    });

    res.sendStatus(200);
  });

  // Compare photos and calculate scores
  app.post("/api/matches/:id/compare", async (req, res) => {
    if (!req.user) return res.sendStatus(401);

    try {
      const match = await storage.getMatch(parseInt(req.params.id));
      if (!match) return res.status(404).send("Match not found");
      if (match.creatorId !== req.user.id) return res.status(403).send("Not authorized");
      if (match.status !== "ready") return res.status(400).send("Match not ready for comparison");

      try {
        console.log('Analyzing creator photo...');
        const creatorScore = await analyzeFace(match.creatorPhoto);
        console.log('Creator photo analysis complete:', creatorScore);

        // Add a small delay between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));

        console.log('Analyzing invited photo...');
        const invitedScore = await analyzeFace(match.invitedPhoto!);
        console.log('Invited photo analysis complete:', invitedScore);

        const winner = creatorScore > invitedScore ? match.creatorId : match.invitedId;
        await storage.updateUserScore(winner);

        await storage.updateMatch(match.id, {
          creatorScore,
          invitedScore,
          status: "completed"
        });

        res.json({ creatorScore, invitedScore });
      } catch (error) {
        console.error('Face++ API Error:', error);
        if (error instanceof Error) {
          res.status(400).json({ message: error.message });
        } else {
          res.status(500).json({ message: "An unexpected error occurred during face analysis" });
        }
      }
    } catch (error) {
      console.error('Server Error:', error);
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  });

  // Get user's matches
  app.get("/api/matches", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const matches = await storage.getUserMatches(req.user.id);
    res.json(matches);
  });

  // Get specific match
  app.get("/api/matches/:id", async (req, res) => {
    if (!req.user) return res.sendStatus(401);

    const match = await storage.getMatch(parseInt(req.params.id));
    if (!match) return res.status(404).send("Match not found");

    // Only allow creator or invited user to view the match
    if (match.creatorId !== req.user.id && match.invitedId !== req.user.id) {
      return res.status(403).send("Not authorized");
    }

    // Only include photos if match is completed
    const responseMatch = match.status === "completed" ? match : {
      ...match,
      creatorPhoto: undefined,
      invitedPhoto: undefined
    };
    res.json(responseMatch);
  });

  // Get leaderboard
  app.get("/api/leaderboard", async (req, res) => {
    const leaderboard = await storage.getLeaderboard();
    res.json(leaderboard);
  });

  app.post("/api/feedback", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    try {
      if (!req.body.feedback) {
        return res.status(400).json({ message: "Feedback is required" });
      }
      await storage.saveFeedback(req.user.id, req.body.feedback);
      res.json({ message: "Feedback submitted successfully" });
    } catch (error) {
      console.error("Error saving feedback:", error);
      res.status(500).json({ message: "Failed to submit feedback" });
    }
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    res.json(req.user);
  });

  app.post("/api/user/update", async (req, res) => {
    if (!req.isAuthenticated) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const { username, password } = req.body;
      if (username) {
        const existingUser = await storage.getUserByUsername(username);
        if (existingUser && existingUser.id !== req.user.id) {
          return res.status(400).json({ message: "Username already taken" });
        }
      }

      const updatedUser = await storage.updateUser(req.user.id, {
        ...(username && { username }),
        ...(password && { password: await hashPassword(password) })
      });

      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  app.post("/api/user/delete", async (req, res) => {
    if (!req.isAuthenticated) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      await storage.deleteUserMatches(req.user.id);
      await storage.deleteUser(req.user.id);
      req.logout((err) => {
        if (err) return res.status(500).json({ message: "Error during logout" });
        res.sendStatus(200);
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}