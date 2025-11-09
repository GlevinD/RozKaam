import {
  users,
  workerProfiles,
  householdProfiles,
  bookings,
  transactions,
  type User,
  type UpsertUser,
  type WorkerProfile,
  type InsertWorkerProfile,
  type HouseholdProfile,
  type InsertHouseholdProfile,
  type Booking,
  type InsertBooking,
  type Transaction,
  type InsertTransaction,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, sql } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Worker profile operations
  getWorkerProfile(userId: string): Promise<WorkerProfile | undefined>;
  createWorkerProfile(profile: InsertWorkerProfile): Promise<WorkerProfile>;
  updateWorkerProfile(userId: string, updates: Partial<InsertWorkerProfile>): Promise<WorkerProfile | undefined>;
  getAllWorkers(): Promise<Array<User & { profile: WorkerProfile | null }>>;
  getVerifiedWorkers(): Promise<Array<User & { profile: WorkerProfile }>>;
  
  // Household profile operations
  getHouseholdProfile(userId: string): Promise<HouseholdProfile | undefined>;
  createHouseholdProfile(profile: InsertHouseholdProfile): Promise<HouseholdProfile>;
  
  // Booking operations
  getBooking(id: string): Promise<Booking | undefined>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  getWorkerBookings(workerId: string): Promise<Booking[]>;
  getHouseholdBookings(householdId: string): Promise<Booking[]>;
  getAllBookings(): Promise<Booking[]>;
  updateBookingStatus(id: string, status: "pending" | "active" | "completed" | "cancelled"): Promise<Booking | undefined>;
  
  // Transaction operations
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getTotalCommission(): Promise<number>;
  getMonthlyCommission(): Promise<number>;
}

export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Worker profile operations
  async getWorkerProfile(userId: string): Promise<WorkerProfile | undefined> {
    const [profile] = await db
      .select()
      .from(workerProfiles)
      .where(eq(workerProfiles.userId, userId));
    return profile;
  }

  async createWorkerProfile(profileData: InsertWorkerProfile): Promise<WorkerProfile> {
    const [profile] = await db
      .insert(workerProfiles)
      .values(profileData)
      .returning();
    return profile;
  }

  async updateWorkerProfile(userId: string, updates: Partial<InsertWorkerProfile>): Promise<WorkerProfile | undefined> {
    const [profile] = await db
      .update(workerProfiles)
      .set(updates)
      .where(eq(workerProfiles.userId, userId))
      .returning();
    return profile;
  }

  async getAllWorkers(): Promise<Array<User & { profile: WorkerProfile | null }>> {
    const result = await db
      .select()
      .from(users)
      .leftJoin(workerProfiles, eq(users.id, workerProfiles.userId))
      .where(eq(users.role, "worker"));
    
    return result.map(row => ({
      ...row.users,
      profile: row.worker_profiles,
    }));
  }

  async getVerifiedWorkers(): Promise<Array<User & { profile: WorkerProfile }>> {
    const result = await db
      .select()
      .from(users)
      .innerJoin(workerProfiles, eq(users.id, workerProfiles.userId))
      .where(
        and(
          eq(users.role, "worker"),
          eq(workerProfiles.verificationStatus, "verified")
        )
      );
    
    return result.map(row => ({
      ...row.users,
      profile: row.worker_profiles,
    }));
  }

  // Household profile operations
  async getHouseholdProfile(userId: string): Promise<HouseholdProfile | undefined> {
    const [profile] = await db
      .select()
      .from(householdProfiles)
      .where(eq(householdProfiles.userId, userId));
    return profile;
  }

  async createHouseholdProfile(profileData: InsertHouseholdProfile): Promise<HouseholdProfile> {
    const [profile] = await db
      .insert(householdProfiles)
      .values(profileData)
      .returning();
    return profile;
  }

  // Booking operations
  async getBooking(id: string): Promise<Booking | undefined> {
    const [booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, id));
    return booking;
  }

  async createBooking(bookingData: InsertBooking): Promise<Booking> {
    const [booking] = await db
      .insert(bookings)
      .values(bookingData)
      .returning();
    return booking;
  }

  async getWorkerBookings(workerId: string): Promise<Booking[]> {
    return await db
      .select()
      .from(bookings)
      .where(eq(bookings.workerId, workerId))
      .orderBy(bookings.createdAt);
  }

  async getHouseholdBookings(householdId: string): Promise<Booking[]> {
    return await db
      .select()
      .from(bookings)
      .where(eq(bookings.householdId, householdId))
      .orderBy(bookings.createdAt);
  }

  async getAllBookings(): Promise<Booking[]> {
    return await db
      .select()
      .from(bookings)
      .orderBy(bookings.createdAt);
  }

  async updateBookingStatus(
    id: string,
    status: "pending" | "active" | "completed" | "cancelled"
  ): Promise<Booking | undefined> {
    const updates: any = { status };
    if (status === "completed") {
      updates.completedAt = new Date();
    }
    
    const [booking] = await db
      .update(bookings)
      .set(updates)
      .where(eq(bookings.id, id))
      .returning();
    return booking;
  }

  // Transaction operations
  async createTransaction(transactionData: InsertTransaction): Promise<Transaction> {
    const [transaction] = await db
      .insert(transactions)
      .values(transactionData)
      .returning();
    return transaction;
  }

  async getTotalCommission(): Promise<number> {
    const result = await db
      .select({ total: sql<number>`COALESCE(SUM(${transactions.platformCommission}), 0)` })
      .from(transactions);
    return Number(result[0]?.total || 0);
  }

  async getMonthlyCommission(): Promise<number> {
    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);
    firstDayOfMonth.setHours(0, 0, 0, 0);

    const result = await db
      .select({ total: sql<number>`COALESCE(SUM(${transactions.platformCommission}), 0)` })
      .from(transactions)
      .where(sql`${transactions.createdAt} >= ${firstDayOfMonth}`);
    
    return Number(result[0]?.total || 0);
  }
}

export const storage = new DatabaseStorage();
