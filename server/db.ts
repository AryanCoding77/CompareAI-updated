import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
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
      )`,
      // Create feedback table if not exists
      `CREATE TABLE IF NOT EXISTS feedback (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        feedback TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )`,
    ];

    for (const query of queries) {
      await pool.query(query);
    }

    // Try to run migrations for feedback table
    try {
      await migrateDb();
    } catch (err) {
      console.warn("Migration warning (non-critical):", err.message);
    }

    console.log("Database tables initialized successfully");
  } catch (error) {
    console.error("Error initializing database tables:", error);
    throw error;
  }
};

// Migrate database to add new columns
export const migrateDb = async () => {
  try {
    // Check if columns already exist
    const checkColumnQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'feedback' AND column_name = 'name'
    `;

    const { rows } = await pool.query(checkColumnQuery);

    // If name column doesn't exist, add all the new columns
    if (rows.length === 0) {
      console.log("Running feedback table migration...");

      const migrationQueries = [
        // Add new columns to the feedback table
        `ALTER TABLE "feedback" ADD COLUMN IF NOT EXISTS "name" text`,
        `ALTER TABLE "feedback" ADD COLUMN IF NOT EXISTS "email" text`,
        `ALTER TABLE "feedback" ADD COLUMN IF NOT EXISTS "message" text`,

        // Update existing records to extract structured data if possible
        `UPDATE "feedback"
        SET 
          "name" = CASE 
            WHEN "feedback" ~ 'Name/Username:\\s*(.+?)(?=\\n|$)' 
            THEN regexp_replace("feedback", '.*Name/Username:\\s*(.+?)(?=\\n|$).*', '\\1', 'g')
            ELSE NULL
          END,
          "email" = CASE 
            WHEN "feedback" ~ 'Email:\\s*(.+?)(?=\\n|$)' 
            THEN regexp_replace("feedback", '.*Email:\\s*(.+?)(?=\\n|$).*', '\\1', 'g')
            ELSE NULL
          END,
          "message" = CASE 
            WHEN "feedback" ~ 'Message:\\s*(.+?)(?=\\n|$)' 
            THEN regexp_replace("feedback", '.*Message:\\s*(.+?)(?=\\n|$).*', '\\1', 'g')
            ELSE NULL
          END
        WHERE "feedback" LIKE '%Name/Username:%' OR "feedback" LIKE '%Email:%' OR "feedback" LIKE '%Message:%'`,
      ];

      for (const query of migrationQueries) {
        await pool.query(query);
      }

      console.log("Feedback table migration completed successfully");
    } else {
      console.log("Feedback table already has the required columns");
    }

    return true;
  } catch (error) {
    console.error("Error migrating database:", error);
    throw error;
  }
};

// Initialize tables on startup
initDb().catch(console.error);
