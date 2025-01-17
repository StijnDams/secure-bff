// TODO: setup Swagger

export async function getMe(): Promise<any> {
	const response = await fetch("http://localhost:3001/me", {
		credentials: "include",
	});
	if (!response.ok) {
		throw new Error("Failed to fetch user data");
	}
	return response.json();
}
