import pg from "pg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { dirname } from "path";

// Initialize environment variables
dotenv.config();

// Get current file directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { Pool } = pg;

async function runMigration() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    console.log("Connecting to database...");
    const client = await pool.connect();
    console.log("Connected to database");

    try {
      // Read the migration SQL
      const migrationPath = path.join(
        __dirname,
        "..",
        "migrations",
        "add_feedback_columns.sql"
      );
      const migrationSQL = fs.readFileSync(migrationPath, "utf8");

      console.log("Running migration...");
      await client.query(migrationSQL);
      console.log("Migration completed successfully");
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Error running migration:", err);
  } finally {
    await pool.end();
  }
}

runMigration();
