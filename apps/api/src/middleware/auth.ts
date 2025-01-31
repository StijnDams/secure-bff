import type { Context, Next } from "hono";
import * as jose from "jose";
import { env } from "@/config/env";

const JWKS = jose.createRemoteJWKSet(
	new URL(`${env.AUTH0_DOMAIN}.well-known/jwks.json`),
);

export async function authMiddleware(c: Context, next: Next) {
	try {
		const authHeader = c.req.header("authorization");
		if (!authHeader?.startsWith("Bearer ")) {
			return c.json({ error: "Missing or invalid token" }, 401);
		}
		const token = authHeader.split(" ")[1];
		const { payload } = await jose.jwtVerify(token, JWKS, {
			issuer: env.AUTH0_DOMAIN,
			audience: env.AUTH0_AUDIENCE,
		});
		c.set("access_token", payload);
		return next();
	} catch (error) {
		console.error({ error });
		if (error instanceof Error) {
			return c.json({ error: error.message }, 401);
		}
		return c.json({ error: "Invalid token" }, 401);
	}
}
