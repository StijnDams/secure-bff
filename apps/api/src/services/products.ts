import { db } from "@/config/db";
import { products } from "@/models/product";
import { reviews } from "@/models/review";
import { eq } from "drizzle-orm";

export const getAllProducts = async () => db.select().from(products);

export const getAllProductsWithReviews = async () => {
	const productsWithReviews = await db
		.select()
		.from(products)
		.leftJoin(reviews, eq(products.id, reviews.productId));

	// Group reviews by product
	return productsWithReviews.reduce<Record<number, any>>((acc, row) => {
		const productId = row.products.id;
		if (!acc[productId]) {
			acc[productId] = {
				...row.products,
				reviews: [],
			};
		}
		if (row.reviews) {
			acc[productId].reviews.push(row.reviews);
		}
		return acc;
	}, {});
};

export const createProduct = async (data: {
	name: string;
	price: number;
	description?: string;
}) => db.insert(products).values(data).returning();

export const getProductById = async (id: number) =>
	db.select().from(products).where(eq(products.id, id));

export const deleteProductById = async (id: number) =>
	db.delete(products).where(eq(products.id, id));
