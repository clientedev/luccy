import { Pool } from 'pg';
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
    
    // Configure pool for Railway's PostgreSQL limits (typically 4-5 connections for free tier)
    _pool = new Pool({ 
      connectionString: process.env.DATABASE_URL,
      max: 3, // Keep below Railway's connection limit to avoid exhaustion
      connectionTimeoutMillis: 5000, // Fail fast if can't connect in 5s
      idleTimeoutMillis: 10000, // Close idle connections after 10s
      allowExitOnIdle: false, // Keep pool alive
      keepAlive: true, // TCP keepalive to prevent connection drops
      keepAliveInitialDelayMillis: 10000,
    });

    // Handle pool errors gracefully
    _pool.on('error', (err) => {
      console.error('Unexpected database pool error:', err);
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