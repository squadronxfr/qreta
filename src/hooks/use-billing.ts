"use client";

import {useState, useEffect} from "react";
import {useAuthStore} from "@/providers/auth-store-provider";
import {SUBSCRIPTION_PLANS, PlanKey} from "@/config/subscription";
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
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [isLoadingInvoices, setIsLoadingInvoices] = useState(false);
    const [isProcessing, setIsProcessing] = useState<string | null>(null);

    const subscription = userData?.subscription;
    const currentPlanKey = (subscription?.plan as PlanKey) || "free";

    const isSubscribed = ["active", "trialing", "past_due"].includes(subscription?.status || "");
    const hasStripeId = !!subscription?.stripeCustomerId;

    const getAuthHeaders = async (): Promise<Record<string, string>> => {
        if (!user) throw new Error("Not authenticated");
        const token = await user.getIdToken();
        return {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        };
    };

    useEffect(() => {
        if (!user || !hasStripeId) return;

        const fetchInvoices = async () => {
            setIsLoadingInvoices(true);
            try {
                const headers = await getAuthHeaders();
                const res = await fetch("/api/stripe/invoices", {
                    method: "POST",
                    headers,
                    body: JSON.stringify({userId: user.uid}),
                });
                if (res.ok) {
                    const data = await res.json();
                    setInvoices(data.invoices || []);
                }
            } catch {
                console.error("Erreur lors de la récupération des factures.");
            } finally {
                setIsLoadingInvoices(false);
            }
        };

        void fetchInvoices();
    }, [user, hasStripeId]);

    const handleCheckout = async (targetPlanKey: PlanKey) => {
        if (!user) return;
        setIsProcessing(targetPlanKey);

        try {
            const headers = await getAuthHeaders();
            const res = await fetch("/api/stripe/checkout", {
                method: "POST",
                headers,
                body: JSON.stringify({
                    priceId: SUBSCRIPTION_PLANS[targetPlanKey].priceId,
                    userId: user.uid,
                    email: user.email,
                    returnUrl: window.location.href,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Erreur Checkout");

            window.location.href = data.url;
        } catch (err) {
            console.error(err);
            toast.error("Impossible d'initialiser le paiement.");
            setIsProcessing(null);
        }
    };

    const handlePortal = async (sourceKey: string = "portal_main") => {
        if (!user) return;

        if (!hasStripeId) {
            toast.error("Aucun abonnement actif à gérer.");
            return;
        }

        setIsProcessing(sourceKey);

        try {
            const headers = await getAuthHeaders();
            const res = await fetch("/api/stripe/portal", {
                method: "POST",
                headers,
                body: JSON.stringify({userId: user.uid, returnUrl: window.location.href}),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            window.location.href = data.url;
        } catch {
            toast.error("Impossible d'accéder au portail.");
            setIsProcessing(null);
        }
    };

    const onPlanAction = async (targetPlanKey: PlanKey) => {
        if (isSubscribed && hasStripeId) {
            await handlePortal(targetPlanKey);
            return;
        }
        await handleCheckout(targetPlanKey);
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