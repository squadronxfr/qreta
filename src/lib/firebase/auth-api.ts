import {adminDb} from "@/lib/firebase/admin";
import {getAuth} from "firebase-admin/auth";
import {getApps} from "firebase-admin/app";

const adminAuth = getApps().length > 0 ? getAuth() : null;

export async function verifyAuthToken(req: Request): Promise<string> {
    const authorization = req.headers.get("Authorization");

    if (!authorization?.startsWith("Bearer ")) {
        throw new Error("Missing or invalid Authorization header");
    }

    const idToken = authorization.split("Bearer ")[1];

    if (!adminAuth) {
        throw new Error("Firebase Admin not initialized");
    }

    const decoded = await adminAuth.verifyIdToken(idToken);
    return decoded.uid;
}