import {NextResponse} from "next/server";
import {stripe} from "@/lib/stripe";
import {adminDb} from "@/lib/firebase/admin";

export async function POST(req: Request) {
    try {
        const {priceId, userId, email, returnUrl: url} = await req.json();

        if (!userId || !priceId) {
            return new NextResponse(JSON.stringify({error: "Missing data"}), {status: 400});
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
        console.error("[STRIPE CHECKOUT ERROR]", error);
        return new NextResponse(JSON.stringify({error: error instanceof Error ? error.message : 'Unknown error'}), {status: 500});
    }
}