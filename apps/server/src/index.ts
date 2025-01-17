import { Hono } from "hono";
import type { Context, Next } from "hono";
import { cors } from "hono/cors";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import session, { type Session } from "./middleware/session";
import { getCodeVerifier } from "./utils/getCodeVerifier";
import { getCodeChallenge } from "./utils/getCodeChallenge";
import invariant from "tiny-invariant";
import { db } from "./db/db";
import { sessions } from "./db/schema";
import { eq } from "drizzle-orm";

const app = new Hono<{
	Variables: {
		session: Session;
	};
}>();

const AUTH_ISSUER = process.env.AUTH_ISSUER;
const AUTH_CLIENT_ID = process.env.AUTH_CLIENT_ID;
const AUTH_CLIENT_SECRET = process.env.AUTH_CLIENT_SECRET;
invariant(AUTH_ISSUER, "AUTH_ISSUER is required");
invariant(AUTH_CLIENT_ID, "AUTH_CLIENT_ID is required");
invariant(AUTH_CLIENT_SECRET, "AUTH_CLIENT_SECRET is required");

app.use(
	"*",
	cors({
		origin: ["http://localhost:3000"],
		credentials: true,
	}),
);
app.use("*", session);

// Middleware to check if user is authenticated
const requireAuth = async (
	c: Context<{ Variables: { session: Session } }>,
	next: Next,
) => {
	const session = c.get("session") as Session;
	if (!session.accessToken) {
		return c.json({ error: "Unauthorized" }, 401);
	}
	return next();
};

// Public routes
app.get("/", (c) => {
	return c.json({ message: "Hello Hono!" });
});

// Auth routes
app.get("/login", async (c) => {
	const verifier = getCodeVerifier();
	const challenge = getCodeChallenge(verifier);

	await db
		.update(sessions)
		.set({ codeVerifier: verifier })
		.where(eq(sessions.id, c.get("session").id));

	const authUrl = new URL(`${AUTH_ISSUER}/authorize`);
	authUrl.searchParams.append("response_type", "code");
	authUrl.searchParams.append("client_id", AUTH_CLIENT_ID);
	authUrl.searchParams.append(
		"redirect_uri",
		"http://localhost:3001/login/callback",
	);
	authUrl.searchParams.append("scope", "openid profile email");
	authUrl.searchParams.append("code_challenge", challenge);
	authUrl.searchParams.append("code_challenge_method", "S256");

	return c.redirect(authUrl.toString());
});

app.get("/login/callback", async (c) => {
	const code = c.req.query("code");
	const session = c.get("session") as Session;
	const verifier = session.codeVerifier;
	if (!code || !verifier) {
		return c.json({ error: "Unable to authenticate, bad request" }, 400);
	}

	try {
		// Exchange code for tokens
		const tokenResponse = await fetch(`${AUTH_ISSUER}/oauth/token`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				grant_type: "authorization_code",
				client_id: AUTH_CLIENT_ID,
				client_secret: AUTH_CLIENT_SECRET,
				code_verifier: verifier,
				code,
				redirect_uri: "http://localhost:3001/callback",
			}),
		});
		const tokens = await tokenResponse.json();
		invariant(
			tokenResponse.ok,
			tokens.error_description || "Failed to exchange code for tokens",
		);

		// Get user info
		const userInfoResponse = await fetch(`${AUTH_ISSUER}/userinfo`, {
			headers: {
				Authorization: `Bearer ${tokens.access_token}`,
			},
		});
		const userInfo = await userInfoResponse.json();

		// Update session with tokens and user info
		await db
			.update(sessions)
			.set({
				accessToken: tokens.access_token,
				userId: userInfo.sub,
				userEmail: userInfo.email,
				userName: userInfo.name,
				codeVerifier: null, // Clear the code verifier
			})
			.where(eq(sessions.id, session.id));

		// Redirect back to frontend
		return c.redirect("http://localhost:3000");
	} catch (error) {
		console.error("Auth error:", error);
		return c.json({ error: "Authentication failed" }, 500);
	}
});

app.get("/logout", async (c) => {
	const session = c.get("session") as Session;

	// Clear session data
	await db
		.update(sessions)
		.set({
			accessToken: null,
			userId: null,
			userEmail: null,
			userName: null,
		})
		.where(eq(sessions.id, session.id));

	// Remove the session cookie
	deleteCookie(c, "sessionID", {
		path: "/",
		secure: true,
		httpOnly: true,
	});

	// Redirect to Auth0 logout
	const logoutUrl = new URL(`${AUTH_ISSUER}/logout`);
	logoutUrl.searchParams.append("client_id", AUTH_CLIENT_ID);
	logoutUrl.searchParams.append("returnTo", "http://localhost:3000");

	return c.redirect(logoutUrl.toString());
});

app.get("/me", requireAuth, async (c) => {
	const session = c.get("session") as Session;
	return c.json({
		id: session.userId,
		email: session.userEmail,
		name: session.userName,
	});
});

export default app;
