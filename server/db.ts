import { Pool, PoolClient } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "../shared/schema";

// Lazy connection - only throw error when actually trying to use the database
let _pool: Pool | null = null;
let _db: ReturnType<typeof drizzle> | null = null;

function getPool(): Pool {
  if (!_pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error(
        "DATABASE_URL must be set. Did you forget to provision a database?",
      );
    }
    
    // Configure pool for Railway's PostgreSQL with generous timeouts
    // Railway has cold starts and limited free-tier connections (typically 4-5)
    _pool = new Pool({ 
      connectionString: process.env.DATABASE_URL,
      max: 3, // Keep below Railway's connection limit to avoid exhaustion
      min: 0, // Allow pool to shrink to 0 when idle
      connectionTimeoutMillis: 30000, // 30 seconds to connect (Railway cold starts)
      idleTimeoutMillis: 30000, // Close idle connections after 30s
      allowExitOnIdle: false, // Keep pool alive
      keepAlive: true, // TCP keepalive to prevent connection drops
      keepAliveInitialDelayMillis: 10000,
      statement_timeout: 30000, // Statement timeout of 30s
      query_timeout: 30000, // Query timeout of 30s
    });

    // Handle pool errors gracefully - never crash the server
    _pool.on('error', (err) => {
      console.error('Database pool error (non-fatal):', err.message || err);
    });

    // Connection acquired
    _pool.on('connect', () => {
      console.log('Database connection established');
    });
  }
  return _pool;
}

// Graceful shutdown handler
export async function closePool() {
  if (_pool) {
    await _pool.end();
    _pool = null;
    _db = null;
    console.log('Database pool closed');
  }
}

function getDb() {
  if (!_db) {
    _db = drizzle({ client: getPool(), schema });
  }
  return _db;
}

export const pool = new Proxy({} as Pool, {
  get: (_target, prop) => {
    return getPool()[prop as keyof Pool];
  }
});

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get: (_target, prop) => {
    return getDb()[prop as keyof ReturnType<typeof drizzle>];
  }
});