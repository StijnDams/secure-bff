import * as crypto from "node:crypto";
import { base64URLEncode } from "./base64URLEncode";

export function getCodeVerifier() {
	return base64URLEncode(crypto.randomBytes(32));
}
