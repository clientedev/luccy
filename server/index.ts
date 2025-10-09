import express, { type Request, Response, NextFunction } from "express";
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

// CRITICAL: Healthcheck must be FIRST, before any middleware or DB operations
// Railway needs immediate response, not waiting for DB initialization
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
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

(async () => {
  // 1. Verificar e configurar banco de dados
  await ensureDatabaseSetup();
  
  // 2. Adicionar categorias padrão (incluindo Roupas)
  try {
    await seedCategories();
  } catch (error) {
    log(`Warning: Could not seed categories: ${error}`);
    // Continue - não é crítico para o funcionamento do app
  }
  
  // 3. Executar diagnóstico (apenas em desenvolvimento)
  if (app.get("env") === "development") {
    await diagnoseDatabaseIssues();
  }

  // 4. Initialize database seed data
  try {
    if (typeof (storage as any).initializeSeedData === 'function') {
      log('Initializing database seed data...');
      await (storage as any).initializeSeedData();
      log('Database seed data initialized successfully');
    }
  } catch (error) {
    log(`Error initializing seed data: ${error}`);
    // Continue execution even if seed data fails - the app should still work
  }

  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    log(`Error: ${err.message || err}`);
    if (err.stack) {
      log(err.stack);
    }
    
    res.status(status).json({ message });
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
