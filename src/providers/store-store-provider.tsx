"use client";

import {createContext, useEffect, useState, use, type ReactNode} from "react";
import {useStore, type StoreApi} from "zustand";
import {createStoreStore, type StoreStore} from "@/stores/store-store";
import {useAuthStore} from "@/providers/auth-store-provider";

const StoreStoreContext = createContext<StoreApi<StoreStore> | null>(null);

export function StoreStoreProvider({children}: { children: ReactNode }) {
    const [store] = useState(() => createStoreStore());
    const user = useAuthStore((s) => s.user);

    useEffect(() => {
        if (!user) {
            store.getState().reset();
            return;
        }

        const unsubscribe = store.getState().subscribe(user.uid);
        return () => unsubscribe();
    }, [user, store]);

    return (
        <StoreStoreContext value={store}>
            {children}
        </StoreStoreContext>
    );
}

export function useStoreStore<T>(selector: (state: StoreStore) => T): T {
    const contextStore = use(StoreStoreContext);
    if (!contextStore) {
        throw new Error("useStoreStore must be used within StoreStoreProvider");
    }
    return useStore(contextStore, selector);
}