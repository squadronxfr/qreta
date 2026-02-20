"use client";

import {createContext, useEffect, useState, use, type ReactNode} from "react";
import {useStore, type StoreApi} from "zustand";
import {createCatalogStore, type CatalogStore} from "@/stores/catalog-store";

const CatalogStoreContext = createContext<StoreApi<CatalogStore> | null>(null);

interface CatalogStoreProviderProps {
    storeId: string;
    children: ReactNode;
}

export function CatalogStoreProvider({storeId, children}: CatalogStoreProviderProps) {
    const [store] = useState(() => createCatalogStore());

    useEffect(() => {
        const cleanup = store.getState().subscribe(storeId);
        return cleanup;
    }, [store, storeId]);

    return (
        <CatalogStoreContext value={store}>
            {children}
        </CatalogStoreContext>
    );
}

export function useCatalogStore<T>(selector: (state: CatalogStore) => T): T {
    const contextStore = use(CatalogStoreContext);
    if (!contextStore) {
        throw new Error("useCatalogStore must be used within CatalogStoreProvider");
    }
    return useStore(contextStore, selector);
}