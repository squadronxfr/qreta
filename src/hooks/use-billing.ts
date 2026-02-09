import {useState, useEffect} from "react";
import {useAuth} from "@/context/auth-context";
import {SUBSCRIPTION_PLANS, PlanKey} from "@/config/subscription";

export interface Invoice {
    id: string;
    amount: number;
    status: string;
    date: number;
    pdf: string;
    number: string;
}

export function useBilling() {
    const {user, userData} = useAuth();
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [isLoadingInvoices, setIsLoadingInvoices] = useState(false);
    const [isProcessing, setIsProcessing] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) return;

        const fetchInvoices = async () => {
            setIsLoadingInvoices(true);
            try {
                const res = await fetch("/api/stripe/invoices", {
                    method: "POST",
                    body: JSON.stringify({userId: user.uid}),
                });
                if (res.ok) {
                    const data = await res.json();
                    setInvoices(data.invoices);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoadingInvoices(false);
            }
        };

        fetchInvoices();
    }, [user]);

    const handleCheckout = async (targetPlanKey: PlanKey) => {
        if (!user) return;
        setIsProcessing(targetPlanKey);
        setError(null);

        try {
            const res = await fetch("/api/stripe/checkout", {
                method: "POST",
                body: JSON.stringify({
                    priceId: SUBSCRIPTION_PLANS[targetPlanKey].priceId,
                    userId: user.uid,
                    email: user.email,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            window.location.href = data.url;
        } catch (err) {
            setError("Erreur lors de l'initialisation du paiement.");
            setIsProcessing(null);
        }
    };

    const handlePortal = async (sourceKey: string = "portal_main") => {
        if (!user) return;
        setIsProcessing(sourceKey);

        try {
            const res = await fetch("/api/stripe/portal", {
                method: "POST",
                body: JSON.stringify({userId: user.uid}),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            window.location.href = data.url;
        } catch (err) {
            setError("Impossible d'accéder au portail.");
            setIsProcessing(null);
        }
    };

    const subscription = userData?.subscription;
    const currentPlanKey = (subscription?.plan as PlanKey) || "free";
    const isSubscribed = ["active", "trialing", "past_due"].includes(subscription?.status || "");

    let renewalDate = null;
    if (subscription?.currentPeriodEnd) {
        const seconds = typeof subscription.currentPeriodEnd === 'object' && 'seconds' in subscription.currentPeriodEnd
            ? subscription.currentPeriodEnd.seconds
            : subscription.currentPeriodEnd;

        renewalDate = new Date(seconds * 1000).toLocaleDateString("fr-FR", {
            day: "numeric", month: "long", year: "numeric"
        });
    }

    return {
        invoices,
        isLoadingInvoices,
        isProcessing,
        error,
        currentPlanKey,
        isSubscribed,
        renewalDate,
        handleCheckout,
        handlePortal,
        user,
        userData
    };
}