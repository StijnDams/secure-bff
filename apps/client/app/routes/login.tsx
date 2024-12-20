import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-200 px-4 py-12 sm:px-6 lg:px-8">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl font-bold">Login</CardTitle>
					<CardDescription>
						Enter your email and password to access your account
					</CardDescription>
				</CardHeader>
				<CardFooter>
					<Button className="w-full">Sign in</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
