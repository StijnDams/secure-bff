import { useContext } from "react";
import { AuthContext } from "./AuthProvider";
import type { User } from "./types";

export function useAuth(): User | undefined {
	return useContext(AuthContext);
}
