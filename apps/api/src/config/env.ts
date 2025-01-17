import { config } from "dotenv";
import invariant from "tiny-invariant";

// Load environment variables
config();

function getEnvVar(key: string): string {
	const value = process.env[key];
	invariant(value, `Missing environment variable: ${key}`);
	return value;
}

export const env = {
	PORT: Number(getEnvVar("PORT")),
	AUTH0_DOMAIN: getEnvVar("AUTH0_DOMAIN"),
	AUTH0_AUDIENCE: getEnvVar("AUTH0_AUDIENCE"),
} as const;
