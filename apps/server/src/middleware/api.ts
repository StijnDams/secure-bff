import { createApi } from "@/config/api";
import type { CustomHonoVariables } from "@/types/CustomHonoVariables";
import { createMiddleware } from "hono/factory";

const apiMiddleware = createMiddleware<CustomHonoVariables>(async (c, next) => {
	const session = c.get("session");
	const api = createApi({
		headers: {
			Authorization: `Bearer ${session?.accessToken}`,
		},
	});
	c.set("api", api);
	return next();
});

export default apiMiddleware;
