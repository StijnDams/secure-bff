import { type CreateFetchOptions, type FetchOptions, ofetch } from "ofetch";
import { env } from "./env";

export const createApi = (
	options?: FetchOptions,
	globalOptions?: CreateFetchOptions,
): Api => {
	const { headers = {} as HeadersInit, ...restOptions } = options || {};
	const _ofetch = ofetch.create(
		{
			baseURL: `${env.API_URL}/api`,
			retry: false,
			headers: {
				"Content-Type": "application/json",
				...headers,
			},
			onRequestError: (ctx) => {
				console.error(ctx);
			},
			...restOptions,
		},
		globalOptions,
	);

	return {
		get: async (url, params) => {
			const result = await _ofetch(url, { params });
			return new Response(result);
		},
		post: async (url, params) => {
			const result = await _ofetch(url, { method: "POST", params });
			return new Response(result);
		},
		put: async (url, params) => {
			const result = await _ofetch(url, { method: "PUT", params });
			return new Response(result);
		},
		delete: async (url, params) => {
			const result = await _ofetch(url, { method: "DELETE", params });
			return new Response(result);
		},
	};
};

export interface Api {
	get: <T = any>(
		url: string,
		params?: Omit<FetchOptions, "body">,
	) => Promise<ApiResponse<T>>;
	post: <T = any>(
		url: string,
		params?: FetchOptions,
	) => Promise<ApiResponse<T>>;
	put: <T = any>(url: string, params?: FetchOptions) => Promise<ApiResponse<T>>;
	delete: <T = any>(
		url: string,
		params?: FetchOptions,
	) => Promise<ApiResponse<T>>;
}

export interface ApiResponse<T = any> extends Response {
	json: () => Promise<T>;
}
