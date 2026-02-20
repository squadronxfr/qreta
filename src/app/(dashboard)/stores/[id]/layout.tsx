import {ReactNode} from "react";
import {ProtectedStore} from "@/components/dashboard/protected-store";
import {CatalogStoreProvider} from "@/providers/catalog-store-provider";

interface LayoutProps {
    params: Promise<{ id: string }>;
    children: ReactNode;
}

export default async function StoreDashboardLayout({params, children}: LayoutProps) {
    const {id} = await params;

    return (
        <ProtectedStore>
            <CatalogStoreProvider storeId={id}>
                {children}
            </CatalogStoreProvider>
        </ProtectedStore>
    );
}