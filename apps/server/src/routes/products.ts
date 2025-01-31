import { getProductsHandler } from "@/controllers/products";
import { requireAuth } from "@/middleware/requireAuth";
import type { CustomHonoVariables } from "@/types/CustomHonoVariables";
import { Hono } from "hono";

const router = new Hono<CustomHonoVariables>();

router.get("/products", requireAuth, getProductsHandler);

export default router;
