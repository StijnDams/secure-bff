import type { ReactNode } from "react";

export interface User {
	id: string;
	email: string;
	name: string;
}

export interface AuthProviderProps {
	children: ReactNode;
}
