import type { CustomHonoVariables } from "@/types/CustomHonoVariables";
import type { Context } from "hono";

import apiHandler from "./api";

export const getProductsHandler = async (c: Context<CustomHonoVariables>) =>
	apiHandler(
		c,
		(api) => {
			return api.get("/products");
		},
		(data) => {
			return { ...data };
		},
	);
