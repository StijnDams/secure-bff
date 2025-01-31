import {
	createProductHandler,
	deleteProductHandler,
	getProductHandler,
	getProductsHandler,
	getProductsWithReviewsHandler,
} from "@/controllers/products";
import { Hono } from "hono";

const productsRouter = new Hono();

productsRouter.get("/products", getProductsWithReviewsHandler);
productsRouter.get("/products/:id", getProductHandler);
productsRouter.post("/products", createProductHandler);
productsRouter.delete("/products/:id", deleteProductHandler);

export default productsRouter;
