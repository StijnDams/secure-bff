import type { Api, ApiResponse } from "@/config/api";
import type { CustomHonoVariables } from "@/types/CustomHonoVariables";
import type { Context } from "hono";
import type { StatusCode } from "hono/utils/http-status";

const apiHandler = async <T = any>(
	c: Context<CustomHonoVariables>,
	cb: (api: Api) => Promise<ApiResponse<T>>,
	mapper: (data: T) => any = (data) => data,
) => {
	const api = c.get("api");
	try {
		const response = await cb(api);
		if (!response.ok) return c.status(response.status as StatusCode);
		const data = await response.json();
		return c.json(mapper(data));
	} catch (error) {
		console.log(error);
		return c.json(
			{ error: (error as Error).message ?? "Internal server error" },
			500,
		);
	}
};

export default apiHandler;
