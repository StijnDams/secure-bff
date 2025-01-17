import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const products = sqliteTable("products", {
	id: integer("id").primaryKey(),
	name: text("name").notNull(),
	price: integer("price").notNull(),
	description: text("description"),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
