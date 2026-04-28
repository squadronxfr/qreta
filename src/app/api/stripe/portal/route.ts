import {NextResponse} from "next/server";
import Stripe from "stripe";
import {stripe} from "@/lib/stripe";
import {adminDb} from "@/lib/firebase/admin";
import {verifyAuthToken, AuthError} from "@/lib/firebase/auth-api";
import {SUBSCRIPTION_PLANS} from "@/config/subscription";
import {sanitizeReturnUrl} from "@/lib/utils";

type PortalBody = {
    userId: string;
    returnUrl?: string;
    priceId?: string;
    action?: "cancel";
};

type UserData = {
    subscription?: {
        stripeSubscriptionId?: string;
    };
};

function getAppOrigin(req: Request): string {
    const env = process.env.NEXT_PUBLIC_APP_URL ?? process.env.APP_URL;
    if (env) return new URL(env).origin;
    return new URL(req.url).origin;
}

function allowedPriceIds(): string[] {
    return Object.values(SUBSCRIPTION_PLANS)
        .map((p) => p.priceId)
        .filter((v): v is NonNullable<typeof v> => typeof v === "string" && v.length > 0);
}

function isAllowedPriceId(priceId: string): boolean {
    return new Set<string>(allowedPriceIds()).has(priceId);
}

async function resolveSubscriptionId(customerId: string, userData: unknown): Promise<string | null> {
    const subId =
        typeof userData === "object" &&
        userData !== null &&
        "subscription" in userData &&
        typeof (userData as UserData).subscription?.stripeSubscriptionId === "string"
            ? (userData as UserData).subscription!.stripeSubscriptionId!
            : null;

    if (subId) return subId;

    const subs = await stripe.subscriptions.list({customer: customerId, status: "all", limit: 10});
    const preferred = subs.data.find((s) => ["active", "trialing", "past_due"].includes(s.status));
    return (preferred ?? subs.data[0])?.id ?? null;
}

export async function POST(req: Request) {
    try {
        const callerUid = await verifyAuthToken(req);
        const body = (await req.json()) as unknown;

        if (typeof body !== "object" || body === null) {
            return NextResponse.json({error: "Invalid body"}, {status: 400});
        }

        const {userId, priceId, action, returnUrl} = body as PortalBody;

        if (!userId) return NextResponse.json({error: "Missing userId"}, {status: 400});
        if (callerUid !== userId) return NextResponse.json({error: "Unauthorized"}, {status: 401});

        if (priceId && !isAllowedPriceId(priceId)) {
            return NextResponse.json({error: "Invalid priceId"}, {status: 400});
        }

        const userDoc = await adminDb.collection("users").doc(userId).get();
        const userData = userDoc.data();
        if (!userData) return NextResponse.json({error: "User not found"}, {status: 404});

        const customerId = userData.subscription?.stripeCustomerId as string | undefined;
        if (!customerId) return NextResponse.json({error: "No Stripe Customer ID found"}, {status: 400});

        const appOrigin = getAppOrigin(req);
        const safeReturn = sanitizeReturnUrl(returnUrl, appOrigin);

        const portalParams: Stripe.BillingPortal.SessionCreateParams = {
            customer: customerId,
            return_url: safeReturn.toString(),
        };

        if (action === "cancel") {
            const subscriptionId = await resolveSubscriptionId(customerId, userData);
            if (!subscriptionId) {
                const session = await stripe.billingPortal.sessions.create(portalParams);
                return NextResponse.json({url: session.url});
            }

            const after = new URL(safeReturn.toString());
            after.searchParams.set("subscriptionCanceled", "true");

            portalParams.flow_data = {
                type: "subscription_cancel",
                subscription_cancel: {subscription: subscriptionId},
                after_completion: {
                    type: "redirect",
                    redirect: {return_url: after.toString()},
                },
            };

            const session = await stripe.billingPortal.sessions.create(portalParams);
            return NextResponse.json({url: session.url});
        }

        if (priceId) {
            const subscriptionId = await resolveSubscriptionId(customerId, userData);
            if (subscriptionId) {
                const subscription = await stripe.subscriptions.retrieve(subscriptionId);

                if (subscription.items.data.length === 1) {
                    const item = subscription.items.data[0];
                    const currentPriceId = item.price?.id;

                    if (currentPriceId && currentPriceId === priceId) {
                        const session = await stripe.billingPortal.sessions.create(portalParams);
                        return NextResponse.json({url: session.url});
                    }

                    portalParams.flow_data = {
                        type: "subscription_update_confirm",
                        subscription_update_confirm: {
                            subscription: subscriptionId,
                            items: [{id: item.id, price: priceId}],
                        },
                    };
                }
            }
        }

        const session = await stripe.billingPortal.sessions.create(portalParams);
        return NextResponse.json({url: session.url});
    } catch (error: unknown) {
        if (error instanceof AuthError) {
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }
        if (error instanceof Stripe.errors.StripeError) {
            return NextResponse.json({error: error.message}, {status: 400});
        }
        console.error("[STRIPE_PORTAL]", error);
        return NextResponse.json({error: "Internal Error"}, {status: 500});
    }
}