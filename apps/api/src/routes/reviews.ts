import {
	createReviewHandler,
	deleteReviewHandler,
	getReviewHandler,
	getProductReviewsHandler,
} from "@/controllers/reviews";
import { Hono } from "hono";

const reviewsRouter = new Hono();

reviewsRouter.get("/products/:productId/reviews", getProductReviewsHandler);
reviewsRouter.post("/products/:productId/reviews", createReviewHandler);
reviewsRouter.get("/reviews/:id", getReviewHandler);
reviewsRouter.delete("/reviews/:id", deleteReviewHandler);

export default reviewsRouter;
