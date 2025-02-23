import dotenv from 'dotenv';
import express, { type Request, Response, NextFunction } from "express";
import { WebSocketServer, WebSocket } from 'ws';
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import cors from 'cors';
dotenv.config();

const app = express();
// Make app globally available for broadcasting
(global as any).app = app;

// Configure CORS
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Store active WebSocket connections
const clients = new Set<WebSocket>();

// Add request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = registerRoutes(app);

  // Set up WebSocket server with proper error handling
  const wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (ws) => {
    log('New WebSocket client connected');
    clients.add(ws);

    ws.on('error', (error) => {
      log(`WebSocket error: ${error.message}`);
    });

    ws.on('close', () => {
      log('WebSocket client disconnected');
      clients.delete(ws);
    });

    // Send initial connection confirmation
    ws.send(JSON.stringify({ type: 'connected' }));
  });

  // Enhanced broadcast function with error handling
  (app as any).broadcast = (message: any) => {
    const messageStr = JSON.stringify(message);
    const deadClients = new Set<WebSocket>();

    clients.forEach((client) => {
      try {
        if (client.readyState === WebSocket.OPEN) {
          client.send(messageStr);
        } else if (client.readyState === WebSocket.CLOSED) {
          deadClients.add(client);
        }
      } catch (error) {
        log(`Broadcast error: ${error}`);
        deadClients.add(client);
      }
    });

    // Clean up dead connections
    deadClients.forEach(client => {
      clients.delete(client);
    });
  };

  // Global error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    log(`Error: ${status} - ${message}`);
    res.status(status).json({ message });
  });

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    log(`Server running on port ${PORT}`);
    log('WebSocket server initialized');
  });
})();