// TODO: setup Swagger

import { useQuery } from "@tanstack/react-query";

export async function getProducts(): Promise<any> {
	const response = await fetch("http://localhost:3001/api/products", {
		credentials: "include",
	});
	if (!response.ok) {
		throw new Error("Failed to fetch user data");
	}
	return response.json();
}
export const useGetProducts = () => {
	return useQuery({
		queryKey: ["products"],
		queryFn: getProducts,
	});
};
