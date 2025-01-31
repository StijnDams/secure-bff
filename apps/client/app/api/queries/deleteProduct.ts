// TODO: setup Swagger

import { useMutation } from "@tanstack/react-query";

export const useDeleteProduct = () => {
	return useMutation({
		mutationFn: async (id: string) => {
			const response = await fetch(`http://localhost:3001/api/products/${id}`, {
				method: "DELETE",
				credentials: "include",
			});
			if (!response.ok) {
				const msg = await response.json();
				throw new Error(msg.error);
			}
			return response.json();
		},
	});
};
