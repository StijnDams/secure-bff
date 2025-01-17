import type { Context, Handler, MiddlewareHandler } from "hono";
import { getSignedCookie, setSignedCookie } from "hono/cookie";
import { eq } from "drizzle-orm";
import * as crypto from "node:crypto";
import { sessions } from "../db/schema";
import { db } from "../db/db";
import { createMiddleware } from "hono/factory";
import invariant from "tiny-invariant";

export type Session = typeof sessions.$inferSelect;

const session = createMiddleware(async (c, next) => {
	const session = (await getSession(c)) ?? (await createSession(c));
	c.set("session", session);
	return next();
});

export async function getSessionID(c: Context) {
	const authSecret = process.env.AUTH_SECRET;
	invariant(authSecret, "AUTH_SECRET is not set");
	const sessionID = await getSignedCookie(c, authSecret, "sessionID");
	invariant(
		typeof sessionID !== "boolean",
		"Failed to read session ID. Invalid cookie signature.",
	);
	return sessionID;
}

async function createSession(c: Context) {
	const authSecret = process.env.AUTH_SECRET;
	invariant(authSecret, "AUTH_SECRET is not set");
	const sessionID: string = crypto.randomUUID();
	const [session] = await db
		.insert(sessions)
		.values({
			id: sessionID,
		})
		.returning();
	await setSignedCookie(c, "sessionID", sessionID, authSecret);
	return session;
}

async function getSession(c: Context) {
	const sessionID = (await getSessionID(c)) as string;
	return db.select().from(sessions).where(eq(sessions.id, sessionID)).get();
}

export default session;
