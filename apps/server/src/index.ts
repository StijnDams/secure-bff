import "@/config/env";

import { Hono } from "hono";
import { cors } from "hono/cors";

import authRouter from "./routes/auth";
import productsRouter from "./routes/products";
import { env } from "@/config/env";
import type { CustomHonoVariables } from "@/types/CustomHonoVariables";
import apiMiddleware from "./middleware/api";
import { sessionMiddleware } from "hono-session-middleware";
import { store } from "./config/db";

const app = new Hono<CustomHonoVariables>();

// Middleware
app.use(
	"*",
	cors({
		origin: [env.CLIENT_URL],
		credentials: true,
	}),
);
app.use(
	"*",
	sessionMiddleware({
		cookieName: "session",
		sessionSecret: env.SESSION_SECRET,
		store,
		cookieOptions: {
			sameSite: "Lax",
			httpOnly: true,
			secure: true,
		},
	}),
);
app.use("*", apiMiddleware);

// Health check endpoint
app.get("/health", (c) => c.json({ status: "ok" }));

// Routes
app.route("/", authRouter);
app.route("/api", productsRouter);

export default app;
