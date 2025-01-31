import { db } from "../src/config/db";
import { products } from "../src/models/product";
import { reviews } from "../src/models/review";

const seed = async () => {
	try {
		// Delete existing records
		await db.delete(reviews);
		await db.delete(products);

		// Insert mock products
		const [
			headphones,
			smartWatch,
			backpack,
			keyboard,
			powerBank,
			mouse,
			hub,
			monitor,
		] = await db
			.insert(products)
			.values([
				{
					name: "Wireless Headphones",
					price: 9999, // $99.99
					description:
						"Premium noise-cancelling wireless headphones with 30-hour battery life",
				},
				{
					name: "Smart Watch",
					price: 24999, // $249.99
					description:
						"Fitness tracking smartwatch with heart rate monitoring and GPS",
				},
				{
					name: "Laptop Backpack",
					price: 4999, // $49.99
					description: "Water-resistant laptop backpack with USB charging port",
				},
				{
					name: "Mechanical Keyboard",
					price: 12999, // $129.99
					description: "RGB mechanical gaming keyboard with custom switches",
				},
				{
					name: "Portable Power Bank",
					price: 3999, // $39.99
					description: "20000mAh fast-charging power bank with dual USB ports",
				},
				{
					name: "Wireless Mouse",
					price: 2999, // $29.99
					description: "Ergonomic wireless mouse with adjustable DPI",
				},
				{
					name: "USB-C Hub",
					price: 4499, // $44.99
					description: "7-in-1 USB-C hub with HDMI and card reader",
				},
				{
					name: "Gaming Monitor",
					price: 29999, // $299.99
					description: "27-inch 144Hz gaming monitor with 1ms response time",
				},
			])
			.returning();

		// Insert mock reviews
		await db.insert(reviews).values([
			{
				productId: headphones.id,
				userId: "auth0|6780d7454c4991faeecbf1d7",
				content:
					"Best headphones I've ever owned! The noise cancellation is amazing.",
			},
			{
				productId: headphones.id,
				userId: "auth0|456",
				content:
					"Great sound quality, but the ear cups could be more comfortable.",
			},
			{
				productId: smartWatch.id,
				userId: "auth0|789",
				content:
					"Perfect for tracking my workouts. Battery life is impressive!",
			},
			{
				productId: keyboard.id,
				userId: "auth0|123",
				content: "The mechanical switches feel amazing for typing and gaming.",
			},
			{
				productId: monitor.id,
				userId: "auth0|456",
				content:
					"Great gaming monitor, colors are vibrant. Wish it had built-in speakers.",
			},
		]);

		console.log("✅ Database seeded successfully");
		process.exit(0);
	} catch (error) {
		console.error("❌ Error seeding database:", error);
		process.exit(1);
	}
};

seed();
