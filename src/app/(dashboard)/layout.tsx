import {ReactNode} from "react";
import {ProtectedRoute} from "@/app/(auth)/protected-route"
import {DashboardHeader} from "@/components/dashboard/dashboard-header";

interface DashboardLayoutProps {
    children: ReactNode;
}

export default function DashboardLayout({children}: DashboardLayoutProps) {
    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-slate-50/50">
                <DashboardHeader/>
                <main className="animate-in fade-in duration-500">
                    {children}
                </main>
            </div>
        </ProtectedRoute>
    );
}