"use client";

import {createContext, useEffect, useState, use, type ReactNode} from "react";
import {useStore, type StoreApi} from "zustand";
import {createAdminStore, type AdminStore} from "@/stores/admin-store";
import {useAuthStore} from "@/providers/auth-store-provider";

const AdminStoreContext = createContext<StoreApi<AdminStore> | null>(null);

export function AdminStoreProvider({children}: { children: ReactNode }) {
    const [store] = useState(() => createAdminStore());
    const userData = useAuthStore((s) => s.userData);
    const authLoading = useAuthStore((s) => s.loading);

    useEffect(() => {
        if (authLoading) return;

        if (userData?.role !== "superadmin") {
            store.getState().reset();
            return;
        }

        void store.getState().loadUsers(true);
    }, [userData?.role, authLoading, store]);

    return (
        <AdminStoreContext value={store}>
            {children}
        </AdminStoreContext>
    );
}

export function useAdminStore<T>(selector: (state: AdminStore) => T): T {
    const contextStore = use(AdminStoreContext);
    if (!contextStore) {
        throw new Error("useAdminStore must be used within AdminStoreProvider");
    }
    return useStore(contextStore, selector);
}