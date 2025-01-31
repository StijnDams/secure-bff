import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useGetProducts } from "@/api/queries/getProducts";
import { useDeleteProduct } from "@/api/queries/deleteProduct";
import { useDeleteReview } from "@/api/queries/deleteReview";
import { useEffect } from "react";

export default function Home() {
	const user = useAuth();
	const products = useGetProducts();
	const { mutate: deleteProduct, error: deleteProductError } =
		useDeleteProduct();
	const { mutate: deleteReview, error: deleteReviewError } = useDeleteReview();

	const handleDeleteProduct = (id: number) => {
		deleteProduct(id.toString());
	};

	const handleDeleteReview = (id: number) => {
		deleteReview(id);
	};

	useEffect(() => {
		if (!deleteProductError && !deleteReviewError) return;
		alert(deleteProductError?.message || deleteReviewError?.message);
	}, [deleteProductError, deleteReviewError]);

	return (
		<div className="p-8">
			<h1 className="text-2xl font-bold mb-4">
				Welcome, {user?.name}! ({user?.id})
			</h1>
			<Button asChild>
				<Link to={"http://localhost:3001/logout"}>Log out</Link>
			</Button>

			<div className="mt-8 flex flex-col gap-4">
				{products.data?.map((product) => (
					<div
						key={product.id}
						className="border border-stone-950 p-4 rounded-md flex justify-between"
					>
						<div className="flex-1">
							<h2 className="text-xl font-semibold">{product.name}</h2>
							<p className="mb-4">€{product.price}</p>
							<div className="mt-2">
								<h3 className="font-medium text-lg mb-2">Reviews</h3>
								{product.reviews?.length > 0 ? (
									<div className="space-y-2">
										{product.reviews.map((review) => (
											<div
												key={review.id}
												className="bg-gray-50 p-3 rounded-md flex justify-between items-start"
											>
												<div>
													<p className="text-sm text-gray-600">
														By: {review.userId}
													</p>
													<p className="mt-1">{review.content}</p>
												</div>
												<button
													type="button"
													className="text-sm text-rose-600 hover:text-rose-800"
													onClick={() => handleDeleteReview(review.id)}
												>
													Delete
												</button>
											</div>
										))}
									</div>
								) : (
									<p className="text-gray-500 italic">No reviews yet</p>
								)}
							</div>
						</div>
						<button
							type="button"
							className="text-rose-600 hover:text-rose-800 h-fit"
							onClick={() => handleDeleteProduct(product.id)}
						>
							Delete
						</button>
					</div>
				))}
			</div>
		</div>
	);
}
