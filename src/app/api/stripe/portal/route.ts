import {NextResponse} from "next/server";
import {stripe} from "@/lib/stripe";
import {adminDb} from "@/lib/firebase/admin";
import {verifyAuthToken} from "@/lib/firebase/auth-api";
import Stripe from "stripe";

export async function POST(req: Request) {
    try {
        const callerUid = await verifyAuthToken(req);
        const {userId, priceId} = await req.json();

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

        const customerId = userData.subscription?.stripeCustomerId;

        if (!customerId) {
            return NextResponse.json({error: "No Stripe Customer ID found"}, {status: 400});
        }

        const portalParams: Stripe.BillingPortal.SessionCreateParams = {
            customer: customerId,
            return_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
        };

        if (priceId) {
            let subscriptionId = userData.subscription?.id;

            if (!subscriptionId) {
                const subscriptions = await stripe.subscriptions.list({
                    customer: customerId,
                    status: "all",
                    limit: 1,
                });
                if (subscriptions.data.length > 0) {
                    subscriptionId = subscriptions.data[0].id;
                }
            }

            if (subscriptionId) {
                const subscription = await stripe.subscriptions.retrieve(subscriptionId);

                portalParams.flow_data = {
                    type: "subscription_update_confirm",
                    subscription_update_confirm: {
                        subscription: subscriptionId,
                        items: [
                            {
                                id: subscription.items.data[0].id,
                                price: priceId,
                            },
                        ],
                    },
                };
            }
        }

        const session = await stripe.billingPortal.sessions.create(portalParams);

        return NextResponse.json({url: session.url});
    } catch (error: unknown) {
        if (error instanceof Error && error.message.includes("Authorization")) {
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }
        console.error("[STRIPE_PORTAL]", error);

        if (error instanceof Error && "type" in error && (error as {
            type: unknown
        }).type === "StripeInvalidRequestError") {
            return NextResponse.json({error: "Une erreur est survenue lors de la requête"}, {status: 400});
        }

        return NextResponse.json({error: "Internal Error"}, {status: 500});
    }
}