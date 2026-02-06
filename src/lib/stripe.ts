import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    typescript: true,
});

export const PLANS = {
    free: {
        name: "Gratuit",
        priceId: "price_1Sxtlq9mcp2EBniBwfHEoKZH",
        quota: 1
    },
    starter: {
        name: "Starter",
        priceId: "price_1Sxtea9mcp2EBniBzRXXntql",
        quota: 1
    },
    pro: {
        name: "Pro",
        priceId: "price_1Sxtex9mcp2EBniBDOFUCQEr",
        quota: 1
    }
};

export function getPlanFromPriceId(priceId: string) {
    return Object.keys(PLANS).find(
        (key) => PLANS[key as keyof typeof PLANS].priceId === priceId
    ) as keyof typeof PLANS | null;
}