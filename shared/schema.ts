import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  timestamp,
  decimal,
} from "drizzle-orm/pg-core";
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

// Feedback table to store user feedback
export const feedback = pgTable("feedback", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  feedback: text("feedback").notNull(),
  name: text("name"),
  email: text("email"),
  message: text("message"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users)
  .pick({
    username: true,
    password: true,
  })
  .extend({
    acceptPolicy: z.boolean(),
  })
  .refine((data) => data.username.length > 0, {
    message: "Username is required",
    path: ["username"],
  })
  .refine((data) => data.password.length > 0, {
    message: "Password is required",
    path: ["password"],
  })
  .refine((data) => data.acceptPolicy === true, {
    message: "You must accept the privacy policy",
    path: ["acceptPolicy"],
  });

export const insertMatchSchema = createInsertSchema(matches);

// Schema for inserting feedback
export const insertFeedbackSchema = createInsertSchema(feedback)
  .pick({
    userId: true,
    feedback: true,
    name: true,
    email: true,
    message: true,
  })
  .refine((data) => data.feedback.length > 0, {
    message: "Feedback is required",
    path: ["feedback"],
  });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Match = typeof matches.$inferSelect;
export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;
export type Feedback = typeof feedback.$inferSelect;
