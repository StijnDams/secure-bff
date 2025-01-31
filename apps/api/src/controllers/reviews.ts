import {
	createReview,
	getReviewById,
	getReviewsByProductId,
	deleteReviewById,
} from "@/services/reviews";
import type { Context } from "hono";

export const getProductReviewsHandler = async (c: Context) => {
	const reviews = await getReviewsByProductId(Number(c.req.param("productId")));
	return c.json(reviews);
};

export const createReviewHandler = async (c: Context) => {
	const body: any = await c.req.parseBody();
	const token = c.get("access_token");
	const newReview = await createReview({
		...body,
		userId: token.sub,
	});
	c.status(201);
	return c.json(newReview);
};

export const getReviewHandler = async (c: Context) => {
	const review = await getReviewById(Number(c.req.param("id")));
	if (review) return c.json(review);
	c.status(404);
	return c.json({ error: "Review not found" });
};

export const deleteReviewHandler = async (c: Context) => {
	const token = c.get("access_token");
	const review = await getReviewById(Number(c.req.param("id")));

	if (!review) {
		c.status(404);
		return c.json({ error: "Review not found" });
	}

	// Only allow users to delete their own reviews
	if (review[0].userId !== token.sub) {
		c.status(403);
		return c.json({ error: "Forbidden" });
	}

	await deleteReviewById(Number(c.req.param("id")));
	return c.json({ message: "Review deleted" });
};
