export const SUBSCRIPTION_PLANS = {
    free: {
        key: "free",
        name: "Gratuit",
        price: 0,
        priceId: null,
        quota: 1,
        description: "L'essentiel pour lancer votre vitrine digitale sans frais.",
        features: ["1 Catalogue", "Produits & Services illimités", "QR Code", "Branding Qreta"],
    },
    pro: {
        key: "pro",
        name: "Pro",
        price: 9,
        priceId: "price_1SyqH59mcp2EBniB2SH5CoGX",
        quota: Infinity,
        description: "L'outil complet pour professionnaliser votre activité.",
        features: [
            "Catalogues illimités",
            "Produits & Services illimités",
            "QR Code",
            "Masquer / Rupture de stock",
            "Promotions avec prix barré",
            "Marque blanche (sans footer Qreta)",
        ],
    },
} as const;

export type PlanKey = keyof typeof SUBSCRIPTION_PLANS;

export const getPlanByPriceId = (priceId: string): PlanKey => {
    const plan = Object.values(SUBSCRIPTION_PLANS).find((p) => p.priceId === priceId);
    return (plan?.key as PlanKey) || "free";
};