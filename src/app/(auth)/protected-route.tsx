"use client";

import React, {useEffect, ReactNode, useState} from "react";
import {useAuthStore} from "@/providers/auth-store-provider";
import {useRouter} from "next/navigation";
import {Progress} from "@/components/ui/progress";

interface ProtectedRouteProps {
    children: ReactNode;
    requiredRole?: "superadmin" | "store_owner";
}

export const ProtectedRoute = ({children, requiredRole}: ProtectedRouteProps) => {
    const user = useAuthStore((s) => s.user);
    const userData = useAuthStore((s) => s.userData);
    const loading = useAuthStore((s) => s.loading);
    const router = useRouter();

    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (loading) {
            setTimeout(() => setProgress(0), 0);
            interval = setInterval(() => {
                setProgress((oldProgress) => {
                    if (oldProgress >= 90) {
                        clearInterval(interval!);
                        return oldProgress;
                    }
                    return Math.min(oldProgress + 5, 90);
                });
            }, 200);
        } else {
            setTimeout(() => setProgress(100), 0);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [loading]);

    useEffect(() => {
        if (loading) return;

        if (!user) {
            router.push("/login");
            return;
        }

        if (requiredRole && userData?.role !== requiredRole) {
            router.push(requiredRole === "superadmin" ? "/stores" : "/login");
        }
    }, [user, loading, userData, router, requiredRole]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-4">
                <Progress value={progress} className="w-48" />
                <p className="text-slate-500">Chargement de Qreta...</p>
            </div>
        );
    }

    if (!user || (requiredRole && userData?.role !== requiredRole)) {
        return null;
    }

    return <>{children}</>;
};