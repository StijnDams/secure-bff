import type { SessionData } from "../types";

export interface Store {
	getSessionById(sessionId?: string): Promise<SessionData | null | undefined>;
	createSession(sessionId: string): Promise<void>;
	persistSessionData(
		sessionId: string,
		sessionData: SessionData,
	): Promise<void>;
	deleteSession(sessionId: string): Promise<void>;
}
