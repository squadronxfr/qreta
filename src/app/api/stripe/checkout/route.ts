import {NextResponse} from "next/server";
import {stripe} from "@/lib/stripe";
import {adminDb} from "@/lib/firebase/admin";
import {verifyAuthToken} from "@/lib/firebase/auth-api";

export async function POST(req: Request) {
    try {
        const callerUid = await verifyAuthToken(req);
        const {priceId, userId, email, returnUrl: url} = await req.json();

        if (!userId || !priceId) {
            return NextResponse.json({error: "Missing data"}, {status: 400});
        }

        if (callerUid !== userId) {
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }

        const userDoc = await adminDb.collection("users").doc(userId).get();
        const userData = userDoc.data();
        const existingCustomerId = userData?.subscription?.stripeCustomerId;

        const sessionConfig: Record<string, unknown> = {
            mode: "subscription",
            payment_method_types: ["card"],
            line_items: [{price: priceId, quantity: 1}],
            success_url: `${url}?success=true`,
            cancel_url: `${url}?canceled=true`,
            client_reference_id: userId,
            metadata: {userId},
            allow_promotion_codes: true,
        };

        if (existingCustomerId) {
            sessionConfig.customer = existingCustomerId;
        } else {
            sessionConfig.customer_email = email;
        }

        const session = await stripe.checkout.sessions.create(sessionConfig);

        return NextResponse.json({url: session.url});
    } catch (error: unknown) {
        if (error instanceof Error && error.message.includes("Authorization")) {
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }
        console.error("[STRIPE CHECKOUT ERROR]", error);
        return NextResponse.json(
            {error: error instanceof Error ? error.message : "Unknown error"},
            {status: 500}
        );
    }
}