import { useMutation, useQueryClient } from "@tanstack/react-query";

export async function deleteReview(id: number): Promise<void> {
	const response = await fetch(`http://localhost:3001/api/reviews/${id}`, {
		method: "DELETE",
		credentials: "include",
	});
	if (!response.ok) {
		const msg = await response.json();
		throw new Error(msg.error);
	}
}

export const useDeleteReview = () => {
	return useMutation({
		mutationFn: deleteReview,
	});
};
