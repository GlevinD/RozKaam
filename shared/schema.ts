import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, jsonb, index, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const roleEnum = pgEnum("role", ["worker", "household", "admin"]);
export const verificationStatusEnum = pgEnum("verification_status", ["pending", "verified", "rejected"]);
export const bookingStatusEnum = pgEnum("booking_status", ["pending", "active", "completed", "cancelled"]);

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Users table - stores auth and role information
// Compatible with Replit Auth requirements
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: roleEnum("role"),
  contact: text("contact"),
  location: text("location"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Worker profiles - extended info for workers
export const workerProfiles = pgTable("worker_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  services: text("services").array().notNull(),
  hourlyRate: integer("hourly_rate").notNull(),
  isAvailable: boolean("is_available").default(true).notNull(),
  policeVerificationNumber: text("police_verification_number").notNull(),
  verificationStatus: verificationStatusEnum("verification_status").default("pending").notNull(),
  photo: text("photo"),
});

// Household profiles - extended info for households
export const householdProfiles = pgTable("household_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  address: text("address"),
});

// Bookings table
export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workerId: varchar("worker_id").notNull().references(() => users.id),
  householdId: varchar("household_id").notNull().references(() => users.id),
  workerProfileId: varchar("worker_profile_id").notNull().references(() => workerProfiles.id),
  service: text("service").notNull(),
  scheduledDate: timestamp("scheduled_date").notNull(),
  location: text("location").notNull(),
  amount: integer("amount").notNull(),
  status: bookingStatusEnum("status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

// Transactions table - tracks payments and commissions
export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bookingId: varchar("booking_id").notNull().references(() => bookings.id),
  totalAmount: integer("total_amount").notNull(),
  platformCommission: integer("platform_commission").notNull(), // 5% of total
  workerEarnings: integer("worker_earnings").notNull(), // 95% of total
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, updatedAt: true });
export const insertWorkerProfileSchema = createInsertSchema(workerProfiles).omit({ id: true });
export const insertHouseholdProfileSchema = createInsertSchema(householdProfiles).omit({ id: true });
export const insertBookingSchema = createInsertSchema(bookings).omit({ id: true, createdAt: true, completedAt: true });
export const insertTransactionSchema = createInsertSchema(transactions).omit({ id: true, createdAt: true });

// Types
export type UpsertUser = typeof users.$inferInsert;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertWorkerProfile = z.infer<typeof insertWorkerProfileSchema>;
export type WorkerProfile = typeof workerProfiles.$inferSelect;

export type InsertHouseholdProfile = z.infer<typeof insertHouseholdProfileSchema>;
export type HouseholdProfile = typeof householdProfiles.$inferSelect;

export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;
