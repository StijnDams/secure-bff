import {
	getAllProducts,
	getAllProductsWithReviews,
	createProduct,
	getProductById,
	deleteProductById,
} from "@/services/products";
import type { Context } from "hono";

export const getProductsHandler = async (c: Context) => {
	const products = await getAllProducts();
	return c.json(products);
};

export const getProductsWithReviewsHandler = async (c: Context) => {
	const productsWithReviews = await getAllProductsWithReviews();
	return c.json(Object.values(productsWithReviews));
};

export const createProductHandler = async (c: Context) => {
	const body: any = await c.req.parseBody();
	const newProduct = await createProduct(body);
	c.status(201);
	return c.json(newProduct);
};

export const getProductHandler = async (c: Context) => {
	const product = await getProductById(Number(c.req.param("id")));
	if (product) return c.json(product);
	c.status(404);
	return c.json({ error: "Product not found" });
};

export const deleteProductHandler = async (c: Context) => {
	const token = c.get("access_token");
	if (!token.permissions.includes("delete:products")) {
		c.status(403);
		return c.json({ error: "Forbidden" });
	}
	await deleteProductById(Number(c.req.param("id")));
	return c.json({ message: "Product deleted" });
};
