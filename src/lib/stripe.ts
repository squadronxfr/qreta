import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    typescript: true,
});

export const PLANS = {
    free: {
        name: "Gratuit",
        priceId: null,
        quota: 1
    },
    starter: {
        name: "Starter",
        priceId: "price_1Sxtea9mcp2EBniBzRXXntql",
        quota: 3
    },
    pro: {
        name: "Pro",
        priceId: "price_1Sxtex9mcp2EBniBDOFUCQEr",
        quota: Infinity
    }
} as const;

export type PlanKey = keyof typeof PLANS;

export function getPlanFromPriceId(priceId: string): PlanKey | null {
    const entry = Object.entries(PLANS).find(
        ([, plan]) => plan.priceId === priceId
    );
    return (entry?.[0] as PlanKey) ?? null;
}