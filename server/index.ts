import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { storage } from "./storage";
import { ensureDatabaseSetup, diagnoseDatabaseIssues } from "./migrate";
import { seedCategories } from "./seed-categories";

const app = express();

// Configure for Railway deployment
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// CRITICAL: Healthcheck must be FIRST and ALWAYS respond immediately
// Railway healthcheck cannot wait for DB, routes, or anything else
app.get('/health', (_req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: Date.now(),
    env: process.env.NODE_ENV 
  });
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

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

// Error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  log(`Error: ${err.message || err}`);
  if (err.stack) {
    log(err.stack);
  }
  
  res.status(status).json({ message });
});

(async () => {
  // Create HTTP server immediately
  const server = createServer(app);

  // CRITICAL: Start listening IMMEDIATELY before anything else
  const port = parseInt(process.env.PORT || '5000', 10);
  
  await new Promise<void>((resolve) => {
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true,
    }, () => {
      log(`🚀 Server listening on port ${port}`);
      log(`✅ Healthcheck ready at /health`);
      resolve();
    });
  });

  // NOW the server is listening and healthcheck is responding
  // Everything below runs in background and won't affect healthcheck

  // Database initialization - completely async
  const initializeDatabase = async () => {
    try {
      if (process.env.NODE_ENV === 'production') {
        log('Production mode - skipping database setup (already done in build)');
      } else {
        await ensureDatabaseSetup();
        
        try {
          await seedCategories();
        } catch (error) {
          log(`Warning: Could not seed categories: ${error}`);
        }
        
        await diagnoseDatabaseIssues();
      }

      if (typeof (storage as any).initializeSeedData === 'function') {
        log('Initializing database seed data...');
        await (storage as any).initializeSeedData();
        log('Database seed data initialized successfully');
      }
    } catch (error) {
      log(`Error during database initialization: ${error}`);
    }
  };

  // App initialization - completely async
  const initializeApp = async () => {
    try {
      // Register routes (may depend on database for sessions)
      await registerRoutes(app, server);
      log('✅ Routes registered successfully');

      // Setup Vite or static serving
      if (app.get("env") === "development") {
        await setupVite(app, server);
      } else {
        serveStatic(app);
      }

      // Initialize database
      await initializeDatabase();
    } catch (error) {
      log(`❌ Error during app initialization: ${error}`);
      if (error instanceof Error && error.stack) {
        log(error.stack);
      }
      // Don't crash - server should keep running for healthcheck
    }
  };

  // Start background initialization - server is already listening
  initializeApp().catch(err => {
    log(`Fatal error during initialization: ${err}`);
    // Don't crash - server must stay up for Railway healthcheck
  });
})();
