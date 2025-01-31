import { env } from "@/config/env";
import { requireAuth } from "@/middleware/requireAuth";

import type { CustomHonoVariables } from "@/types/CustomHonoVariables";
import { getCodeChallenge } from "@/utils/getCodeChallenge";
import { getCodeVerifier } from "@/utils/getCodeVerifier";

import { Hono } from "hono";
import { deleteCookie } from "hono/cookie";
import invariant from "tiny-invariant";
import type { SessionData } from "hono-session-middleware";
import { store } from "@/config/db";

const authRouter = new Hono<CustomHonoVariables>();

// Auth routes
authRouter.get("/login", async (c) => {
	const verifier = getCodeVerifier();
	const challenge = getCodeChallenge(verifier);

	const session = c.get("sessionID");
	session.codeVerifier = verifier;
	await store.persistSessionData(session.id, session);
	c.set("session", session);

	const authUrl = new URL(`${env.AUTH_ISSUER}/authorize`);
	authUrl.searchParams.append("response_type", "code");
	authUrl.searchParams.append("scope", "openid profile email");
	authUrl.searchParams.append("audience", env.AUTH_AUDIENCE);
	authUrl.searchParams.append("client_id", env.AUTH_CLIENT_ID);
	authUrl.searchParams.append("redirect_uri", env.AUTH_REDIRECT_URI);
	authUrl.searchParams.append("code_challenge", challenge);
	authUrl.searchParams.append("code_challenge_method", "S256");

	return c.redirect(authUrl.toString());
});

authRouter.get("/login/callback", async (c) => {
	const code = c.req.query("code");
	const session = c.get("session");
	console.log({ session });
	const verifier = session.codeVerifier;
	if (!code || !verifier) {
		return c.json({ error: "Unable to authenticate, bad request" }, 400);
	}

	try {
		// Exchange code for tokens
		const tokenResponse = await fetch(`${env.AUTH_ISSUER}/oauth/token`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				grant_type: "authorization_code",
				client_id: env.AUTH_CLIENT_ID,
				client_secret: env.AUTH_CLIENT_SECRET,
				code_verifier: verifier,
				code,
				redirect_uri: env.AUTH_REDIRECT_URI,
			}),
		});
		const tokens = await tokenResponse.json();
		invariant(
			tokenResponse.ok,
			tokens.error_description || "Failed to exchange code for tokens",
		);

		// Get user info
		const userInfoResponse = await fetch(`${env.AUTH_ISSUER}/userinfo`, {
			headers: {
				Authorization: `Bearer ${tokens.access_token}`,
			},
		});
		const userInfo = await userInfoResponse.json();

		// Update session with tokens and user info
		const session = c.get("session");
		session.accessToken = tokens.access_token;
		session.userId = userInfo.sub;
		session.userEmail = userInfo.email;
		session.userName = userInfo.name;
		console.log(session);
		await store.persistSessionData(session.id, session);

		// Redirect back to frontend
		return c.redirect(env.CLIENT_URL);
	} catch (error) {
		console.error("Auth error:", error);
		return c.json({ error: "Authentication failed" }, 500);
	}
});

authRouter.get("/logout", async (c) => {
	const session = c.get("session") as SessionData;

	// Clear session data
	await store.deleteSession(session.id);

	// Remove the session cookie
	deleteCookie(c, "sessionID", {
		path: "/",
		secure: true,
		httpOnly: true,
	});

	// Redirect to Auth0 logout
	const logoutUrl = new URL(`${env.AUTH_ISSUER}/logout`);
	logoutUrl.searchParams.append("client_id", env.AUTH_CLIENT_ID);
	logoutUrl.searchParams.append("returnTo", "http://localhost:3000");

	return c.redirect(logoutUrl.toString());
});

authRouter.get("/me", requireAuth, async (c) => {
	const session = c.get("session") as SessionData;
	return c.json({
		id: session.userId,
		email: session.userEmail,
		name: session.userName,
	});
});

export default authRouter;
