import { db } from "@/config/db";
import { reviews } from "@/models/review";
import { eq } from "drizzle-orm";
import type { NewReview } from "@/models/review";

export const getReviewsByProductId = async (productId: number) =>
	db.select().from(reviews).where(eq(reviews.productId, productId));

export const createReview = async (data: NewReview) =>
	db.insert(reviews).values(data).returning();

export const getReviewById = async (id: number) =>
	db.select().from(reviews).where(eq(reviews.id, id));

export const deleteReviewById = async (id: number) =>
	db.delete(reviews).where(eq(reviews.id, id));
