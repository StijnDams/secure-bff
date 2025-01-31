import type { Context, Next } from "hono";
import type { SessionData } from "hono-session-middleware";
import type { CustomHonoVariables } from "@/types/CustomHonoVariables";

// Middleware to check if user is authenticated
export const requireAuth = async (
	c: Context<CustomHonoVariables>,
	next: Next,
) => {
	const session = c.get("session") as SessionData;
	if (!session.accessToken) {
		return c.json({ error: "Unauthorized" }, 401);
	}
	return next();
};
