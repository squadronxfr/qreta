import {NextResponse} from "next/server";
import {stripe} from "@/lib/stripe";
import {adminDb, adminAuth} from "@/lib/firebase/admin";
import {verifyAuthToken} from "@/lib/firebase/auth-api";

async function cancelStripeSubscription(userId: string): Promise<void> {
    const userDoc = await adminDb.collection("users").doc(userId).get();
    const userData = userDoc.data();

    const subscriptionId = userData?.subscription?.stripeSubscriptionId;
    if (!subscriptionId) return;

    const sub = await stripe.subscriptions.retrieve(subscriptionId);
    if (sub.status === "canceled") return;

    await stripe.subscriptions.cancel(subscriptionId);
}

async function deleteUserStores(userId: string): Promise<void> {
    const storesSnap = await adminDb
        .collection("stores")
        .where("userId", "==", userId)
        .get();

    const deletions = storesSnap.docs.map((d) => d.ref.delete());
    await Promise.all(deletions);
}

export async function POST(req: Request) {
    try {
        const callerUid = await verifyAuthToken(req);
        const {targetUserId} = await req.json();

        if (!targetUserId) {
            return NextResponse.json({error: "Missing targetUserId"}, {status: 400});
        }

        const callerDoc = await adminDb.collection("users").doc(callerUid).get();
        if (callerDoc.data()?.role !== "superadmin") {
            return NextResponse.json({error: "Forbidden"}, {status: 403});
        }

        await cancelStripeSubscription(targetUserId);
        await deleteUserStores(targetUserId);
        await adminDb.collection("users").doc(targetUserId).delete();
        await adminAuth.deleteUser(targetUserId);

        return NextResponse.json({success: true});
    } catch (error: unknown) {
        if (error instanceof Error && error.message.includes("Authorization")) {
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }
        console.error("[ADMIN_DELETE_USER]", error);
        return NextResponse.json({error: "Internal Error"}, {status: 500});
    }
}