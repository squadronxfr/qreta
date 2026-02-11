"use client";

import {createContext, useEffect, useState, use, type ReactNode} from "react";
import {useStore, type StoreApi} from "zustand";
import {createAuthStore, type AuthStore} from "@/stores/auth-store";

const AuthStoreContext = createContext<StoreApi<AuthStore> | null>(null);

export function AuthStoreProvider({children}: { children: ReactNode }) {
    const [store] = useState(() => createAuthStore());

    useEffect(() => {
        const cleanup = store.getState().initialize();
        return cleanup;
    }, [store]);

    return (
        <AuthStoreContext value={store}>
            {children}
        </AuthStoreContext>
    );
}

export function useAuthStore<T>(selector: (state: AuthStore) => T): T {
    const contextStore = use(AuthStoreContext);
    if (!contextStore) {
        throw new Error("useAuthStore must be used within AuthStoreProvider");
    }
    return useStore(contextStore, selector);
}