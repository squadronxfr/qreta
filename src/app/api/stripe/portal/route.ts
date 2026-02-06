import {NextResponse} from "next/server";
import {stripe} from "@/lib/stripe";
import {adminDb} from "@/lib/firebase/admin";

export async function POST(req: Request) {
    try {
        const {userId} = await req.json();

        const userDoc = await adminDb.collection("users").doc(userId).get();
        const userData = userDoc.data();
        const customerId = userData?.subscription?.stripeCustomerId;

        if (!customerId) {
            return new NextResponse("No Stripe Customer ID found", {status: 400});
        }

        const session = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
        });

        return NextResponse.json({url: session.url});
    } catch (error) {
        console.error("[STRIPE_PORTAL]", error);
        return new NextResponse("Internal Error", {status: 500});
    }
}