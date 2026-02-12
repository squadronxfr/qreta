"use client";

import {useAuthStore} from "@/providers/auth-store-provider";
import {useBillingStore} from "@/providers/billing-store-provider";
import {PlanKey} from "@/config/subscription";
import {toast} from "sonner";

export interface Invoice {
    id: string;
    amount: number;
    status: string;
    date: number;
    pdf: string;
    number: string;
}

export function useBilling() {
    const user = useAuthStore((s) => s.user);
    const userData = useAuthStore((s) => s.userData);

    const invoices = useBillingStore((s) => s.invoices);
    const isLoadingInvoices = useBillingStore((s) => s.isLoadingInvoices);
    const isProcessing = useBillingStore((s) => s.isProcessing);
    const handleCheckoutStore = useBillingStore((s) => s.handleCheckout);
    const handlePortalStore = useBillingStore((s) => s.handlePortal);

    const subscription = userData?.subscription;
    const currentPlanKey = (subscription?.plan as PlanKey) || "free";

    const isSubscribed = ["active", "trialing", "past_due"].includes(subscription?.status || "");
    const hasStripeId = !!subscription?.stripeCustomerId;

    const onPlanAction = async (targetPlanKey: PlanKey) => {
        if (!user) return;

        try {
            if (isSubscribed && hasStripeId) {
                await handlePortalStore(user, targetPlanKey, window.location.href);
            } else {
                await handleCheckoutStore(user, targetPlanKey, window.location.href);
            }
        } catch (error) {
            console.error("Plan action error:", error);
            toast.error(isSubscribed ? "Impossible d'accéder au portail." : "Impossible d'initialiser le paiement.");
        }
    };

    const handlePortal = async (sourceKey: string = "portal_main") => {
        if (!user) return;

        if (!hasStripeId) {
            toast.error("Aucun abonnement actif à gérer.");
            return;
        }

        try {
            await handlePortalStore(user, sourceKey, window.location.href);
        } catch (error) {
            console.error("Portal error:", error);
            toast.error("Impossible d'accéder au portail.");
        }
    };

    let renewalDate = null;
    if (subscription?.currentPeriodEnd) {
        const seconds = typeof subscription.currentPeriodEnd === "object" && "seconds" in subscription.currentPeriodEnd
            ? subscription.currentPeriodEnd.seconds
            : subscription.currentPeriodEnd;

        renewalDate = new Date(seconds * 1000).toLocaleDateString("fr-FR", {
            day: "numeric", month: "long", year: "numeric",
        });
    }

    return {
        invoices,
        isLoadingInvoices,
        isProcessing,
        currentPlanKey,
        isSubscribed,
        renewalDate,
        cancelAtPeriodEnd: subscription?.cancelAtPeriodEnd,
        onPlanAction,
        handlePortal,
        userData,
    };
}