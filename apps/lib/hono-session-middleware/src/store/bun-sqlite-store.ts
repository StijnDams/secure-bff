import type { Store } from "./store.js";
import type { SessionData } from "../types";
import type { Database } from "bun:sqlite";

export class BunSQLiteStore implements Store {
	db: Database;
	tableName: string;

	constructor(db: Database, tableName?: string) {
		this.tableName = tableName || "sessions";
		this.db = db;

		this.db
			.query(
				`CREATE TABLE IF NOT EXISTS ${this.tableName} (id TEXT PRIMARY KEY, data TEXT)`,
			)
			.run();
	}

	async createSession(sessionId: string): Promise<void> {
		const query = this.db.query(
			`INSERT INTO ${this.tableName} (id, data) VALUES ($sessionId, $data)`,
		);
		query.values({
			$sessionId: sessionId,
			$data: JSON.stringify({ id: sessionId }),
		});
		await query.run();
	}

	async deleteSession(sessionId: string): Promise<void> {
		const query = this.db.query(
			`DELETE FROM ${this.tableName} WHERE id = $sessionId`,
		);
		query.values({ $sessionId: sessionId });
		await query.run();
	}

	async getSessionById(
		sessionId: string,
	): Promise<SessionData | null | undefined> {
		const query = this.db.query(
			`SELECT data FROM ${this.tableName} WHERE id = $sessionId`,
		);
		query.values({ $sessionId: sessionId });
		const result = query.get() as { data: string };
		if (!result?.data) {
			return undefined;
		}

		try {
			return JSON.parse(result.data) as SessionData;
		} catch {
			return undefined;
		}
	}

	async persistSessionData(
		sessionId: string,
		sessionData: SessionData,
	): Promise<void> {
		const query = this.db.query(
			`UPDATE ${this.tableName} SET data = $data WHERE id = $sessionId`,
		);
		query.values({
			$data: JSON.stringify(sessionData),
			$sessionId: sessionId,
		});
		await query.run();
	}
}
