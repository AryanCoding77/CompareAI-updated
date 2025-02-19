import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  score: integer("score").notNull().default(0),
});

export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  creatorId: integer("creator_id").notNull(),
  invitedId: integer("invited_id").notNull(),
  creatorPhoto: text("creator_photo").notNull(),
  invitedPhoto: text("invited_photo"),
  creatorScore: decimal("creator_score", { precision: 10, scale: 3 }),
  invitedScore: decimal("invited_score", { precision: 10, scale: 3 }),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertMatchSchema = createInsertSchema(matches);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Match = typeof matches.$inferSelect;