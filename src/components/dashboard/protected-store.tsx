"use client";

import {useEffect, useState, ReactNode} from "react";
import {useRouter, useParams} from "next/navigation";
import {useAuth} from "@/context/auth-context";
import {db} from "@/lib/firebase/config";
import {doc, getDoc} from "firebase/firestore";
import {Loader2} from "lucide-react";

export function ProtectedStore({children}: { children: ReactNode }) {
    const {user, loading: authLoading} = useAuth();
    const router = useRouter();
    const params = useParams();

    const storeId = typeof params?.id === 'string' ? params.id : null;

    const [isAuthorized, setIsAuthorized] = useState(false);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        if (authLoading) return;

        if (!user || !storeId) {
            router.replace("/stores");
            return;
        }

        const verifyOwnership = async () => {
            try {
                const storeRef = doc(db, "stores", storeId);
                const storeSnap = await getDoc(storeRef);

                if (!storeSnap.exists()) {
                    console.warn("Boutique introuvable");
                    router.replace("/stores");
                    return;
                }

                const storeData = storeSnap.data();

                if (storeData.userId !== user.uid) {
                    router.replace("/stores");
                    return;
                }

                setIsAuthorized(true);
            } catch (error) {
                console.error("Erreur vérification droits", error);
                router.replace("/stores");
            } finally {
                setChecking(false);
            }
        };

        verifyOwnership();
    }, [user, authLoading, storeId, router]);

    if (authLoading || checking) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-600"/>
                    <p className="text-xs text-slate-500 font-medium">Vérification des accès...</p>
                </div>
            </div>
        );
    }

    return isAuthorized ? <>{children}</> : null;
}