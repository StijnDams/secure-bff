import { config as loadEnv } from "dotenv";
import invariant from "tiny-invariant";

loadEnv();

function getEnvVar(key: string): string {
	const value = process.env[key];
	invariant(value, `Missing environment variable: ${key}`);
	return value;
}

export const env = {
	CLIENT_URL: getEnvVar("CLIENT_URL"),
	API_URL: getEnvVar("API_URL"),

	SESSION_SECRET: getEnvVar("SESSION_SECRET"),

	AUTH_ISSUER: getEnvVar("AUTH_ISSUER"),
	AUTH_REDIRECT_URI: getEnvVar("AUTH_REDIRECT_URI"),
	AUTH_CLIENT_ID: getEnvVar("AUTH_CLIENT_ID"),
	AUTH_CLIENT_SECRET: getEnvVar("AUTH_CLIENT_SECRET"),
	AUTH_AUDIENCE: getEnvVar("AUTH_AUDIENCE"),
} as const;
