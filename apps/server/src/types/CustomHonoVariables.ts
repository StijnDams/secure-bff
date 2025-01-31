import type { Api } from "@/config/api";
import type { Session } from "@/middleware/session";

export type CustomHonoVariables = {
	Variables: {
		session: Session;
		api: Api;
	};
};
