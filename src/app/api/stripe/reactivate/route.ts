import {NextResponse} from "next/server";
import {stripe} from "@/lib/stripe";
import {adminDb} from "@/lib/firebase/admin";
import {verifyAuthToken} from "@/lib/firebase/auth-api";

export async function POST(req: Request) {
    try {
        const callerUid = await verifyAuthToken(req);
        const {userId} = await req.json();

        if (!userId) {
            return NextResponse.json({error: "Missing userId"}, {status: 400});
        }

        if (callerUid !== userId) {
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }

        const userDoc = await adminDb.collection("users").doc(userId).get();
        const userData = userDoc.data();

        if (!userData) {
            return NextResponse.json({error: "User not found"}, {status: 404});
        }

        const subscriptionId = userData.subscription?.stripeSubscriptionId;

        if (!subscriptionId) {
            return NextResponse.json({error: "No active subscription found"}, {status: 400});
        }

        await stripe.subscriptions.update(subscriptionId, {
            cancel_at_period_end: false,
        });

        return NextResponse.json({success: true});
    } catch (error: unknown) {
        if (error instanceof Error && error.message.includes("Authorization")) {
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }
        console.error("[STRIPE_REACTIVATE]", error);
        return NextResponse.json({error: "Internal Error"}, {status: 500});
    }
}