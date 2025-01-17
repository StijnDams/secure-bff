// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
	dialect: "sqlite",
	schema: "./src/models",
	dbCredentials: {
		url: "./sqlite.db",
	},
	migrations: {
		table: "journal",
		schema: "drizzle",
	},
});
