import { db } from "../src/config/db";
import { products } from "../src/models/product";

const seed = async () => {
	try {
		// Delete existing records
		await db.delete(products);

		// Insert mock products
		await db.insert(products).values([
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
		]);

		console.log("✅ Database seeded successfully");
		process.exit(0);
	} catch (error) {
		console.error("❌ Error seeding database:", error);
		process.exit(1);
	}
};

seed();
