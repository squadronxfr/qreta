"use client";

import {useEffect, ReactNode} from "react";
import {useRouter, useParams} from "next/navigation";
import {useAuthStore} from "@/providers/auth-store-provider";
import {useStoreStore} from "@/providers/store-store-provider";
import {Spinner} from "@/components/ui/spinner";

export function ProtectedStore({children}: { children: ReactNode }) {
    const user = useAuthStore((s) => s.user);
    const authLoading = useAuthStore((s) => s.loading);
    const stores = useStoreStore((s) => s.stores);
    const storesLoading = useStoreStore((s) => s.isLoading);
    const router = useRouter();
    const params = useParams();

    const storeId = typeof params?.id === "string" ? params.id : null;

    const isLoadingOrNotAuthorized = authLoading || storesLoading || !user || !storeId || (user && storeId && !stores.some((s) => s.id === storeId));

    useEffect(() => {
        if (authLoading || storesLoading) return;

        if (!user || !storeId) {
            router.replace("/stores");
            return;
        }

        const ownsStore = stores.some((s) => s.id === storeId);

        if (!ownsStore) {
            router.replace("/stores");
            return;
        }

    }, [user, authLoading, storesLoading, stores, storeId, router]);

    if (isLoadingOrNotAuthorized) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-2">
                    <Spinner className="h-8 w-8 text-indigo-600"/>
                    <p className="text-xs text-slate-500 font-medium">Vérification des accès...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}