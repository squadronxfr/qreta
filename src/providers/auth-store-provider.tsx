"use client";

import {createContext, type ReactNode, use, useEffect, useState} from "react";
import {type StoreApi, useStore} from "zustand";
import {type AuthStore, createAuthStore} from "@/stores/auth-store";

const AuthStoreContext = createContext<StoreApi<AuthStore> | null>(null);

export function AuthStoreProvider({children}: { children: ReactNode }) {
    const [store] = useState(() => createAuthStore());

    useEffect(() => {
        return store.getState().initialize();
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