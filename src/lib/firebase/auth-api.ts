import {getAuth} from "firebase-admin/auth";
import "@/lib/firebase/admin";

export class AuthError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "AuthError";
    }
}

export async function verifyAuthToken(req: Request): Promise<string> {
    const authorization = req.headers.get("Authorization");

    if (!authorization?.startsWith("Bearer ")) {
        throw new AuthError("Missing or invalid Authorization header");
    }

    const idToken = authorization.split("Bearer ")[1];
    const decoded = await getAuth().verifyIdToken(idToken);

    if (!decoded.email_verified) {
        throw new AuthError("Email not verified");
    }

    return decoded.uid;
}