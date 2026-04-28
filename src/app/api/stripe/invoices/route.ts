import {NextResponse} from "next/server";
import {stripe} from "@/lib/stripe";
import {adminDb} from "@/lib/firebase/admin";
import {verifyAuthToken, AuthError} from "@/lib/firebase/auth-api";

export async function POST(req: Request) {
    try {
        const callerUid = await verifyAuthToken(req);

        const userDoc = await adminDb.collection("users").doc(callerUid).get();
        const userData = userDoc.data();

        if (!userData) {
            return NextResponse.json({error: "User not found"}, {status: 404});
        }

        const customerId = userData.subscription?.stripeCustomerId;
        if (!customerId) {
            return NextResponse.json({invoices: []});
        }

        const invoices = await stripe.invoices.list({customer: customerId, limit: 12});

        const formattedInvoices = invoices.data.map((invoice) => ({
            id: invoice.id,
            amount: invoice.amount_paid / 100,
            currency: invoice.currency,
            status: invoice.status,
            date: invoice.created,
            pdf: invoice.invoice_pdf,
            number: invoice.number,
        }));

        return NextResponse.json({invoices: formattedInvoices});
    } catch (error: unknown) {
        if (error instanceof AuthError) {
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }
        console.error("[STRIPE_INVOICES]", error);
        return NextResponse.json({error: "Internal Error"}, {status: 500});
    }
}