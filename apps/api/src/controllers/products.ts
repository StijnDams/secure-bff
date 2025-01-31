import {
	getAllProducts,
	createProduct,
	getProductById,
	deleteProductById,
} from "@/services/products";
import type { Context } from "hono";

export const getProductsHandler = async (c: Context) => {
	const products = await getAllProducts();
	return c.newResponse(JSON.stringify(products), 200);
};

export const createProductHandler = async (c: Context) => {
	const body: any = await c.req.parseBody();
	const newProduct = await createProduct(body);
	c.status(201);
	return c.newResponse(JSON.stringify(newProduct), 200);
};

export const getProductHandler = async (c: Context) => {
	const product = await getProductById(Number(c.req.param("id")));
	if (product) return c.newResponse(JSON.stringify(product), 200);
	return c.newResponse(JSON.stringify({ message: "Product not found" }), 404);
};

export const deleteProductHandler = async (c: Context) => {
	await deleteProductById(Number(c.req.param("id")));
	return c.status(204);
};
