import { createContext, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { getMe } from "../../api/queries/getMe";
import type { User, AuthProviderProps } from "./types";

export const AuthContext = createContext<User | undefined>({} as any);

export function AuthProvider({ children }: AuthProviderProps) {
	const navigate = useNavigate();

	const hasSessionCookie = useMemo(() => {
		if (typeof document === "undefined") return false;
		return document?.cookie.includes("sessionID=");
	}, []);

	const {
		data: user,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["me"],
		queryFn: getMe,
		retry: false,
		enabled: hasSessionCookie,
	});

	useEffect(() => {
		if (!error) return;
		navigate("/login");
	}, [error]);

	useEffect(() => {
		if (hasSessionCookie) return;
		navigate("/login");
	}, [hasSessionCookie]);

	if (isLoading) return <div>Loading...</div>;
	return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}
