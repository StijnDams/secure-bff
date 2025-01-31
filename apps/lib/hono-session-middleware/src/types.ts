import type { CookieOptions } from "hono/utils/cookie";
import type { BunSQLiteStore } from "./store";

export type SessionMiddlewareOptions = {
	store: BunSQLiteStore;
	sessionSecret: string;
	cookieName: string;
	cookieOptions?: CookieOptions;
};

// export interface SessionData {
// 	id: string;
// 	userId: string;
// 	userEmail: string;
// 	userName: string;
// 	accessToken: string;
// 	codeVerifier: string;
// }
