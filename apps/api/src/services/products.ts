import { db } from "@/config/db";
import { products } from "@/models/product";
import { eq } from "drizzle-orm";

export const getAllProducts = async () => db.select().from(products);

export const createProduct = async (data: {
	name: string;
	price: number;
	description?: string;
}) => db.insert(products).values(data).returning();

export const getProductById = async (id: number) =>
	db.select().from(products).where(eq(products.id, id));

export const deleteProductById = async (id: number) =>
	db.delete(products).where(eq(products.id, id));
