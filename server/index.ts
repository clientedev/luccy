import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { storage } from "./storage";
import { ensureDatabaseSetup, diagnoseDatabaseIssues } from "./migrate";
import { seedCategories } from "./seed-categories";
import { closePool } from "./db";

const app = express();

// Configure for Railway deployment
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// CRITICAL: Healthcheck must be FIRST and ALWAYS respond immediately
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
  try {
    // Create HTTP server immediately
    const server = createServer(app);

    // CRITICAL: Start listening IMMEDIATELY before anything else
    const port = parseInt(process.env.PORT || '5000', 10);
    
    log(`Starting server on port ${port}...`);
    log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    log(`DATABASE_URL configured: ${!!process.env.DATABASE_URL}`);
    
    await new Promise<void>((resolve, reject) => {
      server.on('error', (err) => {
        log(`Server error: ${err.message}`);
        reject(err);
      });
      
      server.listen(port, "0.0.0.0", () => {
        log(`🚀 Server listening on port ${port}`);
        log(`✅ Healthcheck ready at /health`);
        resolve();
      });
    });

  // Database initialization - completely async, never fails startup
  const initializeDatabase = async () => {
    try {
      // PRODUCTION: Migrations already ran during build (railway-migrate.ts)
      // Skip all database initialization in production to ensure instant healthcheck response
      if (process.env.NODE_ENV !== 'production') {
        await ensureDatabaseSetup();
        await seedCategories();
        await diagnoseDatabaseIssues();
        
        // Initialize seed data only in development
        if (typeof (storage as any).initializeSeedData === 'function') {
          log('Initializing database seed data...');
          await (storage as any).initializeSeedData();
          log('Database seed data initialized successfully');
        }
      } else {
        log('⚡ Production mode: Skipping database initialization (already done during build)');
      }
    } catch (error) {
      log(`Error during database initialization: ${error}`);
      // Never crash - server must stay up
    }
  };

  // App initialization - completely async
  const initializeApp = async () => {
    try {
      // Register routes
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
    }
  };

    // Start background initialization
    initializeApp().catch(err => {
      log(`Fatal error during initialization: ${err}`);
    });

    // Graceful shutdown handlers
    const gracefulShutdown = async (signal: string) => {
      log(`\n${signal} received. Starting graceful shutdown...`);
      
      try {
        // Close server to stop accepting new connections
        await new Promise<void>((resolve) => {
          server.close(() => {
            log('HTTP server closed');
            resolve();
          });
        });

        // Close database pool
        await closePool();
        
        log('Graceful shutdown completed');
        process.exit(0);
      } catch (error) {
        log(`Error during shutdown: ${error}`);
        process.exit(1);
      }
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  } catch (error) {
    log(`❌ Fatal startup error: ${error}`);
    process.exit(1);
  }
})();
