import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";

// Initialize SQLite database
const sqlite = new Database("sqlite.db");
export const db = drizzle(sqlite);
