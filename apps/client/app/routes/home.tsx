import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useGetProducts } from "@/api/queries/getProducts";
import { useDeleteProduct } from "@/api/queries/deleteProduct";
import { useEffect } from "react";

export default function Home() {
	const user = useAuth();
	const products = useGetProducts();
	const { mutate, error } = useDeleteProduct();
	const handleDelete = (id: string) => {
		mutate(id);
	};
	useEffect(() => {
		if (!error) return;
		alert(error.message);
	}, [error]);
	return (
		<div className="p-8">
			<h1 className="text-2xl font-bold mb-4">Welcome, {user?.name}!</h1>
			<Button asChild>
				<Link to={"http://localhost:3001/logout"}>Log out</Link>
			</Button>

			<div className="mt-8 flex flex-col gap-4">
				{products.data?.map((product) => (
					<div
						key={product.id}
						className="border border-stone-950 p-4 rounded-md flex justify-between"
					>
						<div>
							<h2 className="text-xl font-semibold">{product.name}</h2>
							<p>€{product.price}</p>
						</div>
						<button
							type="button"
							className="bg-rose-300"
							onClick={() => handleDelete(product.id)}
						>
							Delete
						</button>
					</div>
				))}
			</div>
		</div>
	);
}
