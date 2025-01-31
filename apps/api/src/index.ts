import "@/config/env";

import { Hono } from "hono";
import { authMiddleware } from "./middleware/auth.js";
import productsRouter from "./routes/products.js";

const app = new Hono();

// Middleware
app.use("/api/*", authMiddleware);

// Health check endpoint
app.get("/health", (c) => c.json({ status: "ok" }));

// Routes
app.route("/api", productsRouter);

export default app;
