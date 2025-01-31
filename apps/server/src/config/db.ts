import { Database } from "bun:sqlite";
import { BunSQLiteStore } from "hono-session-middleware";

export const db = new Database("sqlite.db");
export const store = new BunSQLiteStore(db);
