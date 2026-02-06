import {NextResponse} from "next/server";
import {stripe} from "@/lib/stripe";
import {adminDb} from "@/lib/firebase/admin";

export async function POST(req: Request) {
    try {
        const {priceId, userId, email} = await req.json();

        if (!userId || !priceId) {
            return new NextResponse("Missing data", {status: 400});
        }

        const userDoc = await adminDb.collection("users").doc(userId).get();
        const userData = userDoc.data();

        let customerId = userData?.subscription?.stripeCustomerId;

        if (!customerId) {
            const customer = await stripe.customers.create({
                email: email,
                metadata: {
                    firebaseUserId: userId,
                },
            });
            customerId = customer.id;

            await adminDb.collection("users").doc(userId).update({
                "subscription.stripeCustomerId": customerId
            });
        }

        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: "subscription",
            payment_method_types: ["card"],
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?canceled=true`,
            client_reference_id: userId,
            allow_promotion_codes: true,
            subscription_data: {
                trial_period_days: 14,
                metadata: {
                    firebaseUserId: userId
                }
            },
        });

        return NextResponse.json({url: session.url});
    } catch (error) {
        console.error("[STRIPE_CHECKOUT]", error);
        return new NextResponse("Internal Error", {status: 500});
    }
}