import {ProtectedStore} from "@/components/dashboard/protected-store";
import {ReactNode} from "react";

export default function StoreDashboardLayout({children}:
                                             {
                                                 children: ReactNode;
                                             }) {
    return (
        <ProtectedStore>
            {children}
        </ProtectedStore>
    );
}