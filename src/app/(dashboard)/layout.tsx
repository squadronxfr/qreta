import {ReactNode} from "react";
import {AuthStoreProvider} from "@/providers/auth-store-provider";
import {StoreStoreProvider} from "@/providers/store-store-provider";
import {BillingStoreProvider} from "@/providers/billing-store-provider";
import {AdminStoreProvider} from "@/providers/admin-store-provider";
import {ProtectedRoute} from "@/app/(auth)/protected-route";
import {DashboardHeader} from "@/components/dashboard/dashboard-header";

export default function DashboardLayout({children}: { children: ReactNode }) {
    return (
        <AuthStoreProvider>
            <ProtectedRoute>
                <StoreStoreProvider>
                    <BillingStoreProvider>
                        <AdminStoreProvider>
                            <div className="min-h-screen bg-slate-50/50">
                                <DashboardHeader/>
                                <main className="animate-in fade-in duration-500">
                                    {children}
                                </main>
                            </div>
                        </AdminStoreProvider>
                    </BillingStoreProvider>
                </StoreStoreProvider>
            </ProtectedRoute>
        </AuthStoreProvider>
    );
}