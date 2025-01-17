import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
	const user = useAuth();
	return (
		<div className="p-8">
			<h1 className="text-2xl font-bold mb-4">Welcome, {user?.name}!</h1>
			<Button asChild>
				<Link to={"http://localhost:3001/logout"}>Log out</Link>
			</Button>
		</div>
	);
}
