import {headers} from "next/headers";
import {NextResponse} from "next/server";
import {stripe} from "@/lib/stripe";
import {getPlanByPriceId} from "@/config/subscription";
import {adminDb} from "@/lib/firebase/admin";
import {Timestamp} from "firebase-admin/firestore";
import Stripe from "stripe";

interface ExtendedSubscription extends Stripe.Subscription {
    current_period_end: number;
    cancel_at_period_end: boolean;
}

const toFirestoreTimestamp = (seconds: number | null | undefined): Timestamp => {
    if (!seconds) return Timestamp.now();
    return Timestamp.fromMillis(seconds * 1000);
};

async function updateUserSubscription(
    userId: string,
    subscription: Stripe.Subscription,
    customerId?: string
) {
    if (!userId) {
        console.error("[STRIPE WEBHOOK] UserId manquante");
        return;
    }

    const priceId = subscription.items.data[0]?.price.id;
    const planId = getPlanByPriceId(priceId);

    const sub = subscription as unknown as ExtendedSubscription;

    const updateData: Record<string, unknown> = {
        "subscription.status": sub.status,
        "subscription.plan": planId,
        "subscription.currentPeriodEnd": toFirestoreTimestamp(sub.current_period_end),
        "subscription.cancelAtPeriodEnd": sub.cancel_at_period_end,
        "subscription.stripeSubscriptionId": sub.id,
        "subscription.stripePriceId": priceId,
        "updatedAt": Timestamp.now()
    };

    if (customerId) {
        updateData["subscription.stripeCustomerId"] = customerId;
    }

    await adminDb.collection("users").doc(userId).update(updateData);
    console.log(`[STRIPE WEBHOOK] User ${userId} updated to plan ${planId}`);
}

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get("Stripe-Signature");

    if (!signature) return new NextResponse("Missing Signature", {status: 400});

    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err) {
        return new NextResponse(`Webhook Error: ${err instanceof Error ? err.message : "Unknown"}`, {status: 400});
    }

    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;
                if (session.subscription) {
                    const sub = await stripe.subscriptions.retrieve(session.subscription as string);
                    const userId = session.client_reference_id || session.metadata?.userId;

                    if (userId) {
                        await updateUserSubscription(userId, sub, session.customer as string);
                    }
                }
                break;
            }

            case "customer.subscription.updated":
            case "customer.subscription.deleted": {
                const sub = event.data.object as Stripe.Subscription;
                const usersSnap = await adminDb.collection("users")
                    .where("subscription.stripeCustomerId", "==", sub.customer)
                    .limit(1)
                    .get();

                if (!usersSnap.empty) {
                    await updateUserSubscription(usersSnap.docs[0].id, sub);
                }
                break;
            }
        }
    } catch (error) {
        console.error(`[WEBHOOK ERROR] ${event.type}:`, error);
        return new NextResponse("Internal Server Error", {status: 500});
    }

    return new NextResponse(null, {status: 200});
}