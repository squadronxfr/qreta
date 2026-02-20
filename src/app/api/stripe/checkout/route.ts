import {NextResponse} from "next/server";
import Stripe from "stripe";
import {stripe} from "@/lib/stripe";
import {adminDb} from "@/lib/firebase/admin";
import {verifyAuthToken} from "@/lib/firebase/auth-api";
import {SUBSCRIPTION_PLANS} from "@/config/subscription";
import {sanitizeReturnUrl} from "@/lib/utils";

type CheckoutBody = {
    priceId: string;
    userId: string;
    returnUrl?: string;
    email?: string | null;
};

function getAppOrigin(req: Request): string {
    const env = process.env.NEXT_PUBLIC_APP_URL ?? process.env.APP_URL;
    if (env) return new URL(env).origin;
    return new URL(req.url).origin;
}


function isAllowedPriceId(priceId: string): boolean {
    const allowedPriceIds = Object.values(SUBSCRIPTION_PLANS)
        .map((p) => p.priceId)
        .filter((v): v is NonNullable<typeof v> => typeof v === "string" && v.length > 0);

    const allowed = new Set<string>(allowedPriceIds);

    return allowed.has(priceId);
}

export async function POST(req: Request) {
    try {
        const callerUid = await verifyAuthToken(req);
        const body = (await req.json()) as unknown;

        if (typeof body !== "object" || body === null) {
            return NextResponse.json({error: "Invalid body"}, {status: 400});
        }

        const {priceId, userId, returnUrl, email} = body as CheckoutBody;

        if (!userId || !priceId) {
            return NextResponse.json({error: "Missing data"}, {status: 400});
        }
        if (callerUid !== userId) {
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }
        if (!isAllowedPriceId(priceId)) {
            return NextResponse.json({error: "Invalid priceId"}, {status: 400});
        }

        const userDoc = await adminDb.collection("users").doc(userId).get();
        const userData = userDoc.data();

        const existingCustomerId = userData?.subscription?.stripeCustomerId as string | undefined;

        const appOrigin = getAppOrigin(req);
        const safeReturn = sanitizeReturnUrl(returnUrl, appOrigin);

        const successUrl = new URL(safeReturn.toString());
        successUrl.searchParams.set("success", "true");
        successUrl.searchParams.delete("canceled");

        const cancelUrl = new URL(safeReturn.toString());
        cancelUrl.searchParams.set("canceled", "true");
        cancelUrl.searchParams.delete("success");

        const sessionConfig: Stripe.Checkout.SessionCreateParams = {
            mode: "subscription",
            payment_method_types: ["card"],
            line_items: [{price: priceId, quantity: 1}],
            success_url: successUrl.toString(),
            cancel_url: cancelUrl.toString(),
            client_reference_id: userId,
            metadata: {userId},
            allow_promotion_codes: true,
        };

        if (existingCustomerId) {
            sessionConfig.customer = existingCustomerId;
        } else {
            const fallbackEmail = typeof userData?.email === "string" ? userData.email : undefined;
            const safeEmail = typeof email === "string" && email.includes("@") ? email : fallbackEmail;

            if (safeEmail) sessionConfig.customer_email = safeEmail;
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
