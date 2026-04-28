import {NextResponse} from "next/server";
import {adminDb} from "@/lib/firebase/admin";
import {verifyAuthToken} from "@/lib/firebase/auth-api";
import {Timestamp} from "firebase-admin/firestore";

export async function POST(req: Request) {
    try {
        const callerUid = await verifyAuthToken(req);
        const {targetUserId, isCurrentlyBlocked} = await req.json();

        if (!targetUserId || typeof isCurrentlyBlocked !== "boolean") {
            return NextResponse.json({error: "Missing fields"}, {status: 400});
        }

        const callerDoc = await adminDb.collection("users").doc(callerUid).get();
        if (callerDoc.data()?.role !== "superadmin") {
            return NextResponse.json({error: "Forbidden"}, {status: 403});
        }

        await adminDb.collection("users").doc(targetUserId).update({
            isBlocked: !isCurrentlyBlocked,
            updatedAt: Timestamp.now(),
        });

        return NextResponse.json({success: true});
    } catch (error: unknown) {
        if (error instanceof Error && error.message.includes("Authorization")) {
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }
        console.error("[ADMIN_TOGGLE_BLOCK]", error);
        return NextResponse.json({error: "Internal Error"}, {status: 500});
    }
}