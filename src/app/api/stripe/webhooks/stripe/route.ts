import {headers} from "next/headers";
import {NextResponse} from "next/server";
import {stripe, getPlanFromPriceId} from "@/lib/stripe";
import {adminDb} from "@/lib/firebase/admin";
import Stripe from "stripe";

async function getUserByCustomerId(customerId: string) {
    const snapshot = await adminDb
        .collection("users")
        .where("subscription.stripeCustomerId", "==", customerId)
        .limit(1)
        .get();

    return snapshot.empty ? null : snapshot.docs[0];
}

function getCurrentPeriodEnd(subscription: Stripe.Subscription): Date {
    return new Date(subscription.items.data[0].current_period_end * 1000);
}

function resolvePlan(subscription: Stripe.Subscription): string {
    const priceId = subscription.items.data[0]?.price.id;
    if (!priceId) return "free";
    return getPlanFromPriceId(priceId) ?? "free";
}

function buildSubscriptionUpdate(subscription: Stripe.Subscription, overrides?: Partial<Record<string, unknown>>) {
    return {
        "subscription.status": subscription.status,
        "subscription.plan": resolvePlan(subscription),
        "subscription.currentPeriodEnd": getCurrentPeriodEnd(subscription),
        ...overrides,
    };
}


async function isEventProcessed(eventId: string): Promise<boolean> {
    const doc = await adminDb.collection("processedStripeEvents").doc(eventId).get();
    return doc.exists;
}

async function markEventProcessed(eventId: string, eventType: string): Promise<void> {
    await adminDb.collection("processedStripeEvents").doc(eventId).set({
        type: eventType,
        processedAt: new Date(),
    });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    const userId = session.client_reference_id;
    const subscriptionId = session.subscription as string;

    if (!userId || !subscriptionId) return;

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    await adminDb.collection("users").doc(userId).update(
        buildSubscriptionUpdate(subscription, {
            "subscription.stripeCustomerId": session.customer as string,
        })
    );
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    const userDoc = await getUserByCustomerId(subscription.customer as string);
    if (!userDoc) return;

    await userDoc.ref.update(buildSubscriptionUpdate(subscription));
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    const userDoc = await getUserByCustomerId(subscription.customer as string);
    if (!userDoc) return;

    await userDoc.ref.update({
        "subscription.status": "canceled",
        "subscription.plan": "free",
        "subscription.currentPeriodEnd": getCurrentPeriodEnd(subscription),
    });
}

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get("Stripe-Signature");

    if (!signature) {
        return new NextResponse("Missing Stripe-Signature header", {status: 400});
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return new NextResponse(`Webhook Error: ${message}`, {status: 400});
    }

    // --- Idempotence : skip si déjà traité ---
    if (await isEventProcessed(event.id)) {
        return new NextResponse(null, {status: 200});
    }

    try {
        switch (event.type) {
            case "checkout.session.completed":
                await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
                break;

            case "customer.subscription.updated":
                await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
                break;

            case "customer.subscription.deleted":
                await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
                break;

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        await markEventProcessed(event.id, event.type);
    } catch (error) {
        console.error(`Error processing event ${event.id} (${event.type}):`, error);
        return new NextResponse("Webhook handler failed", {status: 500});
    }

    return new NextResponse(null, {status: 200});
}