import "@/config/env";

import { Hono } from "hono";
import { authMiddleware } from "./middleware/auth.js";
import productsRouter from "./routes/products.js";

const app = new Hono();

// Health check route (no auth required)
app.get("/health", (c) => c.json({ status: "ok" }));

// Apply auth middleware to all /api routes
app.use("/api/*", authMiddleware);

// API routes
app.route("/api", productsRouter);

export default app;
