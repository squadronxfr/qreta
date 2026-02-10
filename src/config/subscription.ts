export const SUBSCRIPTION_PLANS = {
    free: {
        key: "free",
        name: "Gratuit",
        price: 0,
        priceId: null,
        quota: 1,
        features: ["1 Boutique", "Produits & Services illimités", "QR Code", "Branding Qreta"],
    },
    starter: {
        key: "starter",
        name: "Starter",
        price: 9,
        priceId: "price_1SyqH59mcp2EBniB2SH5CoGX",
        quota: 3,
        features: ["Tous les avantages Free", "3 Boutiques", "Gestion de l'affichage", "Branding Qreta"],
    },
    pro: {
        key: "pro",
        name: "Pro",
        price: 19,
        priceId: "price_1SyqG69mcp2EBniBjqYnoCFL",
        quota: Infinity,
        features: ["Tous les avantages Starter", "Boutiques illimitées", "Marque blanche", "Support"],
    },
} as const;

export type PlanKey = keyof typeof SUBSCRIPTION_PLANS;

export const getPlanByPriceId = (priceId: string): PlanKey => {
    const plan = Object.values(SUBSCRIPTION_PLANS).find((p) => p.priceId === priceId);
    return (plan?.key as PlanKey) || "free";
};