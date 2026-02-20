import {headers} from "next/headers";
import {NextResponse} from "next/server";
import {stripe} from "@/lib/stripe";
import {getPlanByPriceId} from "@/config/subscription";
import {adminDb} from "@/lib/firebase/admin";
import {Timestamp} from "firebase-admin/firestore";
import Stripe from "stripe";


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
        return;
    }

    const priceId = subscription.items.data[0]?.price.id;
    const planId = getPlanByPriceId(priceId);

    const subscriptionAny = subscription as unknown as Record<string, unknown>;

    const isCanceled = subscriptionAny.cancel_at_period_end || !!subscriptionAny.cancel_at;
    const cancelDate = subscriptionAny.cancel_at ?
        toFirestoreTimestamp(subscriptionAny.cancel_at as number) :
        subscriptionAny.current_period_end ? toFirestoreTimestamp(subscriptionAny.current_period_end as number) : null;

    const updateData: Record<string, unknown> = {
        "subscription.status": subscription.status,
        "subscription.plan": planId,
        "subscription.currentPeriodEnd": cancelDate || toFirestoreTimestamp(subscriptionAny.billing_cycle_anchor as number),
        "subscription.cancelAtPeriodEnd": isCanceled,
        "subscription.stripeSubscriptionId": subscription.id,
        "subscription.stripePriceId": priceId,
        "updatedAt": Timestamp.now()
    };

    if (customerId) {
        updateData["subscription.stripeCustomerId"] = customerId;
    }

    await adminDb.collection("users").doc(userId).update(updateData);
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
                const subFromEvent = event.data.object as Stripe.Subscription;
                const fullSub = await stripe.subscriptions.retrieve(subFromEvent.id);

                const usersSnap = await adminDb.collection("users")
                    .where("subscription.stripeCustomerId", "==", fullSub.customer)
                    .limit(1)
                    .get();

                if (!usersSnap.empty) {
                    await updateUserSubscription(usersSnap.docs[0].id, fullSub);
                }
                break;
            }
        }
    } catch {
        return new NextResponse("Internal Server Error", {status: 500});
    }

    return new NextResponse(null, {status: 200});
}