import { base64URLEncode } from "./base64URLEncode";
import { sha256 } from "./sha256";

export function getCodeChallenge(verifier: string) {
	return base64URLEncode(sha256(verifier));
}
