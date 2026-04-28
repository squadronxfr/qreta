import {ReactNode} from "react";
import {AuthStoreProvider} from "@/providers/auth-store-provider";

export default function AuthLayout({children}: { children: ReactNode }) {
    return (
        <AuthStoreProvider>
            {children}
        </AuthStoreProvider>
    );
}