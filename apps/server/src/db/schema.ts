import { sqliteTable, text, index } from "drizzle-orm/sqlite-core";

export const sessions = sqliteTable("sessions", {
	id: text("id").primaryKey(),
	userId: text("user_id"),
	userEmail: text("user_email"),
	userName: text("user_name"),
	codeVerifier: text("code_verifier"),
	accessToken: text("access_token"),
});
