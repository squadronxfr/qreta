"use client";
// TODO : changer la facon dont est gérer la protection de la route admin
import {useEffect, ReactNode} from "react";
import {useAuthStore} from "@/providers/auth-store-provider";
import {useRouter} from "next/navigation";
import {Spinner} from "@/components/ui/spinner";
import {AlertTriangle} from "lucide-react";

export function ProtectedAdmin({children}: { children: ReactNode }) {
    const user = useAuthStore((s) => s.user);
    const userData = useAuthStore((s) => s.userData);
    const loading = useAuthStore((s) => s.loading);
    const router = useRouter();

    useEffect(() => {
        if (loading) return;

        if (!user) {
            router.replace("/login");
            return;
        }

        if (userData?.role !== "superadmin") {
            router.replace("/stores");
        }
    }, [user, userData, loading, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spinner className="h-8 w-8 text-indigo-600"/>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    if (userData?.role !== "superadmin") {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-4 px-4">
                <AlertTriangle className="h-16 w-16 text-red-500"/>
                <h1 className="text-2xl font-bold text-slate-900">Accès refusé</h1>
                <p className="text-slate-600 text-center max-w-md">
                    Vous n&apos;avez pas les permissions nécessaires pour accéder à cette page.
                </p>
            </div>
        );
    }

    return <>{children}</>;
}