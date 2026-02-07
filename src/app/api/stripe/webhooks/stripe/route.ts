import {headers} from "next/headers";
import {NextResponse} from "next/server";
import {stripe, getPlanFromPriceId} from "@/lib/stripe";
import {adminDb} from "@/lib/firebase/admin";
import {Timestamp} from "firebase-admin/firestore";
import Stripe from "stripe";

async function getUserByCustomerId(customerId: string) {
    const snapshot = await adminDb
        .collection("users")
        .where("subscription.stripeCustomerId", "==", customerId)
        .limit(1)
        .get();

    return snapshot.empty ? null : snapshot.docs[0];
}

function getCurrentPeriodEnd(subscription: Stripe.Subscription): Timestamp | null {
    const seconds = subscription.current_period_end;
    if (typeof seconds !== 'number' || isNaN(seconds)) {
        console.warn("[STRIPE WEBHOOK] Invalid current_period_end:", seconds);
        return null;
    }
    return Timestamp.fromMillis(seconds * 1000);
}

function resolvePlan(subscription: Stripe.Subscription): string {
    const items = subscription.items?.data;
    if (!items || items.length === 0) return "free";
    const priceId = items[0].price?.id;
    if (!priceId) return "free";
    return getPlanFromPriceId(priceId) ?? "free";
}

function buildSubscriptionUpdate(subscription: Stripe.Subscription, overrides?: Partial<Record<string, unknown>>) {
    return {
        "subscription.id": subscription.id,
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


    if (!userId || !subscriptionId) {
        console.warn("[STRIPE WEBHOOK] Missing userId or subscriptionId in session");
        return;
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    await adminDb.collection("users").doc(userId).update(
        buildSubscriptionUpdate(subscription, {
            "subscription.stripeCustomerId": session.customer as string,
        })
    );
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    try {
        const customerId = subscription.customer as string;

        const userDoc = await getUserByCustomerId(customerId);

        if (!userDoc) {
            console.warn(`[STRIPE WEBHOOK] No user found for customerId: ${customerId}`);
            return;
        }

        const updateData = buildSubscriptionUpdate(subscription);

        await userDoc.ref.update(updateData);
    } catch (error: unknown) {
        console.error(`[STRIPE WEBHOOK ERROR] handleSubscriptionUpdated:`, error);
        throw error;
    }
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

async function handleInvoicePaid(invoice: Stripe.Invoice) {
    if (!invoice.subscription) return;

    console.log(`[STRIPE WEBHOOK] Handling invoice.paid for subscription: ${invoice.subscription}`);
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
    await handleSubscriptionUpdated(subscription);
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

    if (await isEventProcessed(event.id)) {
        return new NextResponse(null, {status: 200});
    }

    try {
        console.log(`[STRIPE WEBHOOK] Received event: ${event.type} (${event.id})`);
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

            case "invoice.paid":
            case "invoice.payment_succeeded":
            case "invoice_payment.paid":
                await handleInvoicePaid(event.data.object as Stripe.Invoice);
                break;

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        await markEventProcessed(event.id, event.type);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        const errorStack = error instanceof Error ? error.stack : "";
        console.error(`[STRIPE WEBHOOK ERROR] Event ${event.id} (${event.type}):`, errorMessage, errorStack);
        return new NextResponse(`Webhook handler failed: ${errorMessage}`, {status: 500});
    }

    return new NextResponse(null, {status: 200});
}