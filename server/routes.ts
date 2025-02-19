import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertMatchSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import { analyzeFace } from "./services/facepp";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
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
});

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // Create a new match
  app.post("/api/matches", upload.single("photo"), async (req, res) => {
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
  app.post("/api/matches/:id/respond", upload.single("photo"), async (req, res) => {
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
        const creatorScore = await analyzeFace(match.creatorPhoto);
        // Add a small delay between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
        const invitedScore = await analyzeFace(match.invitedPhoto!);

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

    res.json(match);
  });

  // Get leaderboard
  app.get("/api/leaderboard", async (req, res) => {
    const leaderboard = await storage.getLeaderboard();
    res.json(leaderboard);
  });

  const httpServer = createServer(app);
  return httpServer;
}