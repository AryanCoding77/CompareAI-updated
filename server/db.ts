import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });

// Initialize tables
const initDb = async () => {
  try {
    const queries = [
      // Create users table if not exists
      `CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        score INTEGER NOT NULL DEFAULT 0
      )`,
      // Create matches table if not exists
      `CREATE TABLE IF NOT EXISTS matches (
        id SERIAL PRIMARY KEY,
        creator_id INTEGER NOT NULL,
        invited_id INTEGER NOT NULL,
        creator_photo TEXT NOT NULL,
        invited_photo TEXT,
        creator_score DECIMAL(10,3),
        invited_score DECIMAL(10,3),
        status TEXT NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )`
    ];

    for (const query of queries) {
      await pool.query(query);
    }
    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database tables:', error);
    throw error;
  }
};

// Initialize tables on startup
initDb().catch(console.error);