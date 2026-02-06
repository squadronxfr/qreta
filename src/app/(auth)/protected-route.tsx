"use client";

import {useEffect, ReactNode} from "react";
import {useAuth} from "@/context/auth-context";
import {useRouter} from "next/navigation";

interface ProtectedRouteProps {
    children: ReactNode;
    requiredRole?: "superadmin" | "store_owner";
}

export const ProtectedRoute = ({children, requiredRole}: ProtectedRouteProps) => {
    const {user, loading, userData} = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push("/login");
                return;
            }

            if (requiredRole && userData?.role !== requiredRole) {
                if (requiredRole === "superadmin") {
                    router.push("/stores");
                } else {
                    router.push("/login");
                }
            }
        }
    }, [user, loading, userData, router, requiredRole]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p className="text-slate-500 animate-pulse">Chargement de qreta...</p>
            </div>
        );
    }

    if (!user || (requiredRole && userData?.role !== requiredRole)) {
        return null;
    }

    return <>{children}</>;
};