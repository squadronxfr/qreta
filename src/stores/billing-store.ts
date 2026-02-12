import {createStore} from "zustand";
import {User} from "firebase/auth";
import {SUBSCRIPTION_PLANS, PlanKey} from "@/config/subscription";

export interface Invoice {
    id: string;
    amount: number;
    status: string;
    date: number;
    pdf: string;
    number: string;
}

export interface BillingState {
    invoices: Invoice[];
    isLoadingInvoices: boolean;
    isProcessing: string | null;
}

export interface BillingActions {
    fetchInvoices: (user: User) => Promise<void>;
    handleCheckout: (user: User, targetPlanKey: PlanKey, returnUrl: string) => Promise<void>;
    handlePortal: (user: User, sourceKey: string, returnUrl: string) => Promise<void>;
    reset: () => void;
}

export type BillingStore = BillingState & BillingActions;

const getAuthHeaders = async (user: User): Promise<Record<string, string>> => {
    const token = await user.getIdToken();
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
    };
};

export const createBillingStore = () => {
    return createStore<BillingStore>((set, get) => ({
        invoices: [],
        isLoadingInvoices: false,
        isProcessing: null,

        fetchInvoices: async (user: User) => {
            set({isLoadingInvoices: true});
            try {
                const headers = await getAuthHeaders(user);
                const res = await fetch("/api/stripe/invoices", {
                    method: "POST",
                    headers,
                    body: JSON.stringify({userId: user.uid}),
                });

                if (res.ok) {
                    const data = await res.json();
                    set({invoices: data.invoices || []});
                }
            } catch (error) {
                console.error("Erreur récupération factures:", error);
            } finally {
                set({isLoadingInvoices: false});
            }
        },

        handleCheckout: async (user: User, targetPlanKey: PlanKey, returnUrl: string) => {
            set({isProcessing: targetPlanKey});

            try {
                const headers = await getAuthHeaders(user);
                const res = await fetch("/api/stripe/checkout", {
                    method: "POST",
                    headers,
                    body: JSON.stringify({
                        priceId: SUBSCRIPTION_PLANS[targetPlanKey].priceId,
                        userId: user.uid,
                        email: user.email,
                        returnUrl,
                    }),
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Erreur Checkout");

                window.location.href = data.url;
            } catch (error) {
                console.error("Checkout error:", error);
                set({isProcessing: null});
                throw error;
            }
        },

        handlePortal: async (user: User, sourceKey: string, returnUrl: string) => {
            set({isProcessing: sourceKey});

            try {
                const headers = await getAuthHeaders(user);
                const res = await fetch("/api/stripe/portal", {
                    method: "POST",
                    headers,
                    body: JSON.stringify({userId: user.uid, returnUrl}),
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.error);

                window.location.href = data.url;
            } catch (error) {
                console.error("Portal error:", error);
                set({isProcessing: null});
                throw error;
            }
        },

        reset: () => {
            set({invoices: [], isLoadingInvoices: false, isProcessing: null});
        },
    }));
};