// MODIFIÉ : page.tsx devient un wrapper Suspense
import {Suspense} from "react";
import {Spinner} from "@/components/ui/spinner";
import BillingContent from "@/components/billing/billing-content";

export default function BillingPage() {
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center h-48">
                <Spinner className="h-8 w-8 text-indigo-600"/>
            </div>
        }>
            <BillingContent/>
        </Suspense>
    );
}