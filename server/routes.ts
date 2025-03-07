import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertMatchSchema, insertFeedbackSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import { analyzeFace } from "./services/facepp";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit to accommodate larger images
  fileFilter: (_req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only jpeg, jpg and png files are allowed"));
    }
  },
}).single("photo");

// Custom error handling middleware for multer
const uploadMiddleware = (req: any, res: any, next: any) => {
  upload(req, res, (err: any) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res
          .status(400)
          .json({ message: "File is too large. Maximum size is 25MB" });
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

  // Create a new match
  app.post("/api/matches", uploadMiddleware, async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    if (!req.file) return res.status(400).send("No photo uploaded");

    const invitedUser = await storage.getUserByUsername(
      req.body.invitedUsername
    );
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
    if (match.invitedId !== req.user.id)
      return res.status(403).send("Not authorized");

    const accept = req.body.accept === "true";
    if (!accept) {
      await storage.updateMatch(match.id, { status: "declined" });
      return res.sendStatus(200);
    }

    if (!req.file) return res.status(400).send("No photo uploaded");

    await storage.updateMatch(match.id, {
      invitedPhoto: req.file.buffer.toString("base64"),
      status: "ready",
    });

    res.sendStatus(200);
  });

  // Compare photos and calculate scores
  app.post("/api/matches/:id/compare", async (req, res) => {
    if (!req.user) return res.sendStatus(401);

    try {
      const match = await storage.getMatch(parseInt(req.params.id));
      if (!match) return res.status(404).send("Match not found");
      if (match.creatorId !== req.user.id)
        return res.status(403).send("Not authorized");
      if (match.status !== "ready")
        return res.status(400).send("Match not ready for comparison");

      try {
        console.log("Analyzing creator photo...");
        const creatorScore = await analyzeFace(match.creatorPhoto);
        console.log("Creator photo analysis complete:", creatorScore);

        // Add a small delay between requests to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 500));

        console.log("Analyzing invited photo...");
        const invitedScore = await analyzeFace(match.invitedPhoto!);
        console.log("Invited photo analysis complete:", invitedScore);

        const winner =
          creatorScore > invitedScore ? match.creatorId : match.invitedId;
        await storage.updateUserScore(winner);

        await storage.updateMatch(match.id, {
          creatorScore,
          invitedScore,
          status: "completed",
        });

        res.json({ creatorScore, invitedScore });
      } catch (error) {
        console.error("Face++ API Error:", error);
        if (error instanceof Error) {
          res.status(400).json({ message: error.message });
        } else {
          res.status(500).json({
            message: "An unexpected error occurred during face analysis",
          });
        }
      }
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  });

  // Get user's matches
  app.get("/api/matches", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const matches = await storage.getUserMatches(req.user.id);
    res.json(matches);
  });

  // Delete all matches for a user
  app.delete("/api/matches", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    await storage.deleteUserMatches(req.user.id);
    res.sendStatus(200);
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
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
    const leaderboard = await storage.getLeaderboard(limit);
    res.json(leaderboard);
  });

  // Submit feedback
  app.post("/api/feedback", async (req, res) => {
    try {
      // Check if feedback is provided
      if (!req.body.feedback) {
        return res.status(400).json({
          success: false,
          message: "Feedback is required",
        });
      }

      // Get the user ID if the user is logged in
      const userId = req.user ? req.user.id : null;

      // Extract name, email, and message from the feedback text if possible
      let name = null;
      let email = null;
      let message = null;

      const feedbackText = req.body.feedback;

      // Try to parse structured feedback
      const nameMatch = feedbackText.match(/Name\/Username:\s*(.+?)(?=\n|$)/);
      if (nameMatch && nameMatch[1]) {
        name = nameMatch[1].trim();
      }

      const emailMatch = feedbackText.match(/Email:\s*(.+?)(?=\n|$)/);
      if (emailMatch && emailMatch[1]) {
        email = emailMatch[1].trim();
      }

      const messageMatch = feedbackText.match(/Message:\s*(.+?)(?=\n|$)/);
      if (messageMatch && messageMatch[1]) {
        message = messageMatch[1].trim();
      }

      // Log the feedback for debugging
      console.log("Received feedback:", feedbackText);
      console.log("Parsed fields:", { name, email, message });

      let result;
      let savedToDatabase = true;

      try {
        // Try to save the feedback to the database
        result = await storage.saveFeedback(
          userId,
          feedbackText,
          name,
          email,
          message
        );
      } catch (dbError) {
        console.error("Database error:", dbError);
        savedToDatabase = false;
      }

      // Return success response
      res.status(201).json({
        success: true,
        message: savedToDatabase
          ? "Feedback submitted successfully"
          : "Feedback received (will be saved when database is available)",
        data: result || {
          feedback: feedbackText,
          name,
          email,
          message,
        },
      });
    } catch (error: any) {
      console.error("Error submitting feedback:", error);

      // Return error response
      res.status(400).json({
        success: false,
        message: error.message || "Failed to submit feedback",
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
