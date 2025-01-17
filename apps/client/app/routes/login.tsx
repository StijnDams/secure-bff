import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export default function Login() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-200 px-4 py-12 sm:px-6 lg:px-8">
			<Button asChild>
				<Link to={"http://localhost:3001/login"}>Log in</Link>
			</Button>
		</div>
	);
}
