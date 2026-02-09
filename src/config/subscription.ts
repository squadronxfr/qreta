export const SUBSCRIPTION_PLANS = {
    free: {
        key: "free",
        name: "Gratuit",
        price: 0,
        priceId: null,
        quota: 1,
        features: ["1 Boutique", "Produits illimités", "QR Code", "Branding Qreta"],
    },
    starter: {
        key: "starter",
        name: "Starter",
        price: 9,
        priceId: "price_1Sxtea9mcp2EBniBzRXXntql",
        quota: 3,
        features: ["3 Boutiques", "Gestion des ruptures", "Support standard", "Branding Qreta"],
    },
    pro: {
        key: "pro",
        name: "Pro",
        price: 29,
        priceId: "price_1Sxtex9mcp2EBniBDOFUCQEr",
        quota: Infinity,
        features: ["Boutiques illimitées", "Marque blanche", "Support prioritaire"],
    },
} as const;

export type PlanKey = keyof typeof SUBSCRIPTION_PLANS;

export const getPlanByPriceId = (priceId: string): PlanKey => {
    const plan = Object.values(SUBSCRIPTION_PLANS).find((p) => p.priceId === priceId);
    return (plan?.key as PlanKey) || "free";
};