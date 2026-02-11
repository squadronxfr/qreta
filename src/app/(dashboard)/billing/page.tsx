"use client";

import {useSearchParams} from "next/navigation";
import {useBilling} from "@/hooks/use-billing";
import {SUBSCRIPTION_PLANS, PlanKey} from "@/config/subscription";
import {
    CreditCard, Shield, Check, ExternalLink,
    Sparkles, AlertCircle, Zap, Crown, Download, History
} from "lucide-react";
import {Spinner} from "@/components/ui/spinner";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {cn} from "@/lib/utils";
import {toast} from "sonner";
import {useEffect} from "react";

const PLAN_ICONS = {
    free: Zap,
    starter: Sparkles,
    pro: Crown,
};

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
    active: {label: "Actif", className: "bg-green-100 text-green-700"},
    trialing: {label: "Essai gratuit", className: "bg-blue-100 text-blue-700"},
    past_due: {label: "Retard de paiement", className: "bg-orange-100 text-orange-700"},
    canceled: {label: "Annulé", className: "bg-red-100 text-red-700"},
    unpaid: {label: "Impayé", className: "bg-red-50 text-red-600"}
};

export default function BillingPage() {
    const searchParams = useSearchParams();
    const {
        invoices,
        isLoadingInvoices,
        isProcessing,
        currentPlanKey,
        isSubscribed,
        renewalDate,
        cancelAtPeriodEnd,
        onPlanAction,
        handlePortal,
        userData
    } = useBilling();

    const currentPlan = SUBSCRIPTION_PLANS[currentPlanKey];
    const CurrentIcon = PLAN_ICONS[currentPlanKey];
    const getStatusInfo = () => {
        if (!userData?.subscription?.status || currentPlanKey === "free") {
            return {label: "Gratuit", className: "bg-slate-100 text-slate-600"};
        }

        if (cancelAtPeriodEnd) {
            return {label: "Se termine bientôt", className: "bg-orange-100 text-orange-700"};
        }

        return STATUS_LABELS[userData.subscription.status] || {
            label: "Gratuit",
            className: "bg-slate-100 text-slate-600"
        };
    };

    const statusInfo = getStatusInfo();

    const showSuccess = searchParams.get("success") === "true";
    const showCanceled = searchParams.get("canceled") === "true";

    useEffect(() => {
        if (showSuccess) {
            toast.success("Paiement réussi ! Votre abonnement est actif.");
        }
    }, [showSuccess]);

    const hasStripeAccount = !!userData?.subscription?.stripeCustomerId;


    return (
        <div className="container max-w-6xl mx-auto py-10 px-4">
            <div className="flex flex-col gap-2 mb-8">
                <h1 className="text-3xl font-bold font-heading text-slate-900 flex items-center gap-3">
                    <CreditCard className="h-8 w-8 text-indigo-600"/> Facturation
                </h1>
                <p className="text-slate-500">Gérez votre abonnement et vos informations de paiement.</p>
            </div>

            {showCanceled && (
                <Alert className="mb-6 bg-orange-50 border-orange-200 text-orange-800 rounded-2xl">
                    <AlertCircle className="h-4 w-4 text-orange-600"/>
                    <AlertDescription>Paiement annulé.</AlertDescription>
                </Alert>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">

                    <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                        <CardHeader
                            className="pb-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm text-slate-500 mb-1">
                                        Plan actuel
                                    </p>
                                    <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                        <CurrentIcon className="h-6 w-6 text-indigo-600"/>
                                        {currentPlan.name}
                                    </CardTitle>
                                </div>
                                <Badge className={statusInfo.className}>{statusInfo.label}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="flex items-baseline gap-1 mb-1">
                                <span className="text-4xl font-bold text-slate-900">{currentPlan.price}€</span>
                                <span className="text-sm text-slate-400">/mois</span>
                            </div>

                            <p className="text-sm text-slate-500 mb-6 font-medium">
                                {currentPlanKey === "free" ? (
                                    "Plan gratuit à vie."
                                ) : cancelAtPeriodEnd ? (
                                    <span className="text-orange-600">
                                        Votre abonnement se termine le {renewalDate}
                                    </span>
                                ) : renewalDate ? (
                                    <span className="text-green-700">
                                        Prochain renouvellement le {renewalDate}
                                    </span>
                                ) : (
                                    "Date de renouvellement indisponible"
                                )}
                            </p>

                            {hasStripeAccount && (
                                <div className="flex gap-3">
                                    <Button
                                        onClick={() => handlePortal("portal_top")}
                                        disabled={isProcessing === "portal_top"}
                                        className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl"
                                    >
                                        {isProcessing === "portal_top" ?
                                            <Spinner className="mr-2 h-4 w-4"/> :
                                            <ExternalLink className="mr-2 h-4 w-4"/>} Gérer mon abonnement
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-indigo-600"/> Changer de formule
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {(Object.keys(SUBSCRIPTION_PLANS) as PlanKey[])
                                .filter(key => key !== "free")
                                .map((key) => {
                                    const plan = SUBSCRIPTION_PLANS[key];
                                    const Icon = PLAN_ICONS[key];
                                    const isCurrent = currentPlanKey === key;

                                    const isDisabled = isProcessing === key;

                                    return (
                                        <Card
                                            key={key}
                                            className={cn(
                                                "relative rounded-2xl transition-all border",
                                                isCurrent ? "border-indigo-600 ring-1 ring-indigo-600 shadow-md" : "border-slate-200 hover:border-indigo-200",
                                                key === "pro" && !isCurrent && "bg-indigo-50/30 border-indigo-200"
                                            )}
                                        >
                                            {key === "pro" && !isCurrent && (
                                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                                    <Badge
                                                        className="bg-indigo-600 text-white text-xs px-3">Populaire</Badge>
                                                </div>
                                            )}
                                            <CardContent className="pt-6">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <Icon className="h-5 w-5 text-indigo-600"/>
                                                        <span className="font-bold text-slate-900">{plan.name}</span>
                                                    </div>
                                                    {isCurrent &&
                                                        <Badge className="bg-indigo-100 text-indigo-700">Actuel</Badge>}
                                                </div>
                                                <div className="flex items-baseline gap-1 mb-4">
                                                    <span
                                                        className="text-3xl font-bold text-slate-900">{plan.price}€</span>
                                                    <span className="text-sm text-slate-400">/mois</span>
                                                </div>
                                                <ul className="space-y-2 mb-6">
                                                    {plan.features.map((f) => (
                                                        <li key={f}
                                                            className="flex items-center gap-2 text-sm text-slate-600">
                                                            <Check className="h-4 w-4 text-green-500 shrink-0"/> {f}
                                                        </li>
                                                    ))}
                                                </ul>

                                                <Button
                                                    onClick={() => onPlanAction(key)}
                                                    disabled={isDisabled}
                                                    className={cn(
                                                        "w-full rounded-xl",
                                                        isCurrent ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-slate-900 hover:bg-slate-800 text-white",
                                                        key === "pro" && !isCurrent && "bg-indigo-600 hover:bg-indigo-700"
                                                    )}
                                                >
                                                    {isProcessing === key &&
                                                        <Spinner className="mr-2 h-4 w-4"/>}
                                                    {isCurrent
                                                        ? "Annuler l'abonnement"
                                                        : (isSubscribed ? "Changer vers ce plan" : `Choisir ${plan.name}`)}
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <History className="h-5 w-5 text-indigo-600"/> Historique
                        </h2>
                        <Card className="border-slate-200 rounded-2xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead
                                        className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase text-[10px] font-bold">
                                    <tr>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4">Montant</th>
                                        <th className="px-6 py-4">Statut</th>
                                        <th className="px-6 py-4 text-right">PDF</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                    {isLoadingInvoices ? (
                                        <tr>
                                            <td colSpan={4} className="p-6 text-center"><Spinner
                                                className="h-5 w-5 mx-auto"/></td>
                                        </tr>
                                    ) : invoices.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="p-6 text-center text-slate-400">Aucune facture
                                            </td>
                                        </tr>
                                    ) : (
                                        invoices.map((inv) => (
                                            <tr key={inv.id} className="hover:bg-slate-50">
                                                <td className="px-6 py-4">{new Date(inv.date * 1000).toLocaleDateString("fr-FR")}</td>
                                                <td className="px-6 py-4 font-medium">{inv.amount.toFixed(2)}€</td>
                                                <td className="px-6 py-4">
                                                    <Badge variant="outline"
                                                           className={inv.status === "paid" ? "bg-green-50 text-green-700 border-green-100" : ""}>
                                                        {inv.status === "paid" ? "Payée" : inv.status}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    {inv.pdf && (
                                                        <a href={inv.pdf} target="_blank"
                                                           className="inline-flex p-2 hover:bg-slate-100 rounded-lg">
                                                            <Download
                                                                className="h-4 w-4 text-slate-400 hover:text-indigo-600"/>
                                                        </a>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>
                </div>

                <div className="space-y-6">
                    <Card className="bg-slate-50 border-slate-200 shadow-none rounded-2xl">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-medium text-slate-700 flex items-center gap-2">
                                <Shield className="h-4 w-4 text-green-600"/> Paiement sécurisé
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-slate-500">
                            Données chiffrées et gérées par Stripe.
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}