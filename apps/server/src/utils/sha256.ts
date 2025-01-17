import * as crypto from "node:crypto";

export function sha256(buffer: crypto.BinaryLike) {
	return crypto.createHash("sha256").update(buffer).digest();
}
