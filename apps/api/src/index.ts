import "@/config";

import { Hono } from "hono";
import { authMiddleware } from "./middleware/auth.js";
import productsRouter from "./routes/products.js";

const app = new Hono();

// Health check route (no auth required)
app.get("/health", (c) => c.json({ status: "ok" }));

app.use("/api/*", authMiddleware);

app.route("/api/products", productsRouter);

export default app;
