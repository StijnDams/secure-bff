import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useGetProducts } from "@/api/queries/getProducts";

export default function Home() {
	const user = useAuth();
	const { data: products } = useGetProducts();
	return (
		<div className="p-8">
			<h1 className="text-2xl font-bold mb-4">Welcome, {user?.name}!</h1>
			<Button asChild>
				<Link to={"http://localhost:3001/logout"}>Log out</Link>
			</Button>

			<ul>
				{products?.map((product) => {
					return (
						<li key={product.id}>
							<h2>{product.name}</h2>
							<p>{product.description}</p>
						</li>
					);
				})}
			</ul>
		</div>
	);
}
