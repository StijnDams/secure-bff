import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { products } from "./product";

export const reviews = sqliteTable("reviews", {
	id: integer("id").primaryKey(),
	productId: integer("product_id")
		.notNull()
		.references(() => products.id),
	userId: text("user_id").notNull(),
	content: text("content").notNull(),
});

export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
