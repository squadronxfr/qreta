"use client";

import {createContext, useEffect, useState, use, type ReactNode} from "react";
import {useStore, type StoreApi} from "zustand";
import {createBillingStore, type BillingStore} from "@/stores/billing-store";
import {useAuthStore} from "@/providers/auth-store-provider";

const BillingStoreContext = createContext<StoreApi<BillingStore> | null>(null);

export function BillingStoreProvider({children}: { children: ReactNode }) {
    const [store] = useState(() => createBillingStore());
    const user = useAuthStore((s) => s.user);
    const userData = useAuthStore((s) => s.userData);

    useEffect(() => {
        if (!user) {
            store.getState().reset();
            return;
        }

        const hasStripeId = !!userData?.subscription?.stripeCustomerId;
        if (hasStripeId) {
            void store.getState().fetchInvoices(user);
        }
    }, [user, userData?.subscription?.stripeCustomerId, store]);

    return (
        <BillingStoreContext value={store}>
            {children}
        </BillingStoreContext>
    );
}

export function useBillingStore<T>(selector: (state: BillingStore) => T): T {
    const contextStore = use(BillingStoreContext);
    if (!contextStore) {
        throw new Error("useBillingStore must be used within BillingStoreProvider");
    }
    return useStore(contextStore, selector);
}