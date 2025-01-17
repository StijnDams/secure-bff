import {
	getAllProducts,
	createProduct,
	getProductById,
	deleteProductById,
} from "@/services/products";
import type { Context } from "hono";

export const getProductsHandler = async (c: Context) => {
	const products = await getAllProducts();
	return c.json(products);
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
	await deleteProductById(Number(c.req.param("id")));
	return c.status(204);
};
