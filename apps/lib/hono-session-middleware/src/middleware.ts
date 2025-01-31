import type { Context } from "hono";
import { getSignedCookie, setSignedCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import * as crypto from "node:crypto";
import invariant from "tiny-invariant";
import type { SessionMiddlewareOptions } from "./types";

export const sessionMiddleware = ({
	cookieName = "session",
	cookieOptions,
	sessionSecret,
	store,
}: SessionMiddlewareOptions) => {
	return createMiddleware(async (c, next) => {
		const sessionID = await getSignedCookie(c, sessionSecret, cookieName);
		invariant(
			typeof sessionID !== "boolean",
			"Failed to read session ID. Tampered cookie signature.",
		);

		// If a session ID is found, retrieve the session from the store.
		if (sessionID) {
			const session = await store.getSessionById(sessionID);
			if (session) c.set("session", session);
			return next();
		}

		// If no session ID is found, create a new session and set the cookie.
		const newSessionID = crypto.randomUUID();
		await setSignedCookie(
			c,
			cookieName,
			newSessionID,
			sessionSecret,
			cookieOptions,
		);
		await store.createSession(newSessionID);
		c.set(cookieName, newSessionID);
		return next();
	});
};
