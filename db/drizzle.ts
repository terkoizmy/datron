import { config } from "dotenv";
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { users } from "./schema";
import { eq } from "drizzle-orm";

config({ path: ".env" }); // or .env.local

const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL!);

export const db = drizzle(sql);

// Helper function to get a user by address
export async function getUserByAddress(address: string) {
  const result = await db.select().from(users).where(eq(users.address, address));
  return result[0];
}

// Helper function to create a new user
export async function createUser(address: string) {
  const result = await db.insert(users).values({ address }).returning();
  return result[0];
}