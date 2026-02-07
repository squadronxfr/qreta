"use client";

import {useState, useEffect} from "react";
import {useAuth} from "@/context/auth-context";
import {useSearchParams} from "next/navigation";
import {
    CreditCard, Shield, Loader2, Check,
    ExternalLink, Sparkles, AlertCircle, Zap, Crown,
    Download, History
} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Alert, AlertDescription} from "@/components/ui/alert";

interface Invoice {
    id: string;
    amount: number;
    currency: string;
    status: string;
    date: number;
    pdf: string;
    number: string;
}

const PLANS = {
    free: {
        name: "Gratuit",
        price: "0€",
        period: "",
        limit: "1 Boutique",
        features: ["1 Boutique", "Produits illimités", "QR Code"],
        priceId: null,
        icon: Zap,
    },
    starter: {
        name: "Starter",
        price: "9€",
        period: "/mois",
        limit: "3 Boutiques",
        features: ["3 Boutiques", "Produits illimités", "QR Code", "Support standard", "Analytics de base"],
        priceId: "price_1Sxtea9mcp2EBniBzRXXntql",
        icon: Sparkles,
    },
    pro: {
        name: "Pro",
        price: "29€",
        period: "/mois",
        limit: "Illimité",
        features: ["Boutiques illimitées", "Produits illimités", "QR Code", "Support prioritaire", "Analytics avancés", "Marque blanche"],
        priceId: "price_1Sxtex9mcp2EBniBDOFUCQEr",
        icon: Crown,
    },
} as const;

type PlanKey = keyof typeof PLANS;

const STATUS_MAP: Record<string, { label: string; className: string }> = {
    active: {label: "Actif", className: "bg-green-100 text-green-700"},
    trialing: {label: "Essai gratuit", className: "bg-blue-100 text-blue-700"},
    past_due: {label: "Paiement en retard", className: "bg-orange-100 text-orange-700"},
    canceled: {label: "Annulé", className: "bg-red-100 text-red-700"},
    incomplete: {label: "Incomplet", className: "bg-slate-100 text-slate-600"},
};

export default function BillingPage() {
    const {user, userData} = useAuth();
    const searchParams = useSearchParams();
    const [loadingAction, setLoadingAction] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loadingInvoices, setLoadingInvoices] = useState(false);

    useEffect(() => {
        if (!user) return;

        const fetchInvoices = async () => {
            setLoadingInvoices(true);
            try {
                const res = await fetch("/api/stripe/invoices", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({userId: user.uid}),
                });
                const data = await res.json();
                if (res.ok) {
                    setInvoices(data.invoices);
                }
            } catch (err) {
                console.error("Failed to fetch invoices", err);
            } finally {
                setLoadingInvoices(false);
            }
        };

        fetchInvoices();
    }, [user]);

    const subscription = userData?.subscription;
    const planKey: PlanKey = (subscription?.plan as PlanKey) || "free";
    const currentPlan = PLANS[planKey];
    const statusInfo = STATUS_MAP[subscription?.status || ""] || {
        label: "Gratuit",
        className: "bg-slate-100 text-slate-600"
    };

    const isSubscribed = ["active", "trialing", "past_due"].includes(subscription?.status || "");
    const hasStripeCustomer = !!subscription?.stripeCustomerId;

    const renewalDate = subscription?.currentPeriodEnd
        ? new Date(
            typeof subscription.currentPeriodEnd === "object" && "seconds" in subscription.currentPeriodEnd
                ? subscription.currentPeriodEnd.seconds * 1000
                : subscription.currentPeriodEnd
        ).toLocaleDateString("fr-FR", {day: "numeric", month: "long", year: "numeric"})
        : null;

    const showSuccess = searchParams.get("success") === "true";
    const showCanceled = searchParams.get("canceled") === "true";

    const handleAction = async (targetPlan: PlanKey) => {
        if (!user) return;
        const targetPriceId = PLANS[targetPlan].priceId;

        if (targetPlan === planKey && isSubscribed) {
            handlePortal();
            return;
        }

        if (isSubscribed && hasStripeCustomer) {
            handlePortal(targetPriceId);
            return;
        }

        handleCheckout(targetPlan);
    };

    const handleCheckout = async (targetPlan: PlanKey) => {
        if (!user) return;
        const plan = PLANS[targetPlan];
        if (!plan.priceId) return;

        setLoadingAction(targetPlan);
        setError(null);

        try {
            const res = await fetch("/api/stripe/checkout", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    priceId: plan.priceId,
                    userId: user.uid,
                    email: user.email,
                }),
            });
            const data = await res.json();
            if (!res.ok || !data.url) {
                setError(data.error || "Impossible de créer la session de paiement.");
                return;
            }
            window.location.href = data.url;
        } catch {
            setError("Erreur de connexion au serveur.");
        } finally {
            setLoadingAction(null);
        }
    };

    const handlePortal = async (targetPriceId?: string | null) => {
        if (!user) return;
        setLoadingAction(targetPriceId ? "portal_price" : "portal");
        setError(null);

        try {
            const res = await fetch("/api/stripe/portal", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    userId: user.uid,
                    priceId: targetPriceId,
                }),
            });
            const data = await res.json();
            if (!res.ok || !data.url) {
                setError(data.error || "Impossible d'accéder au portail.");
                return;
            }
            window.location.href = data.url;
        } catch {
            setError("Erreur de connexion au serveur.");
        } finally {
            setLoadingAction(null);
        }
    };
    return (
        <div className="container max-w-6xl mx-auto py-10 px-4">
            <div className="flex flex-col gap-2 mb-8">
                <h1 className="text-3xl font-bold font-heading text-slate-900 flex items-center gap-3">
                    <CreditCard className="h-8 w-8 text-indigo-600"/> Facturation
                </h1>
                <p className="text-slate-500">Gérez votre abonnement et vos informations de paiement.</p>
            </div>

            {showSuccess && (
                <Alert className="mb-6 bg-green-50 border-green-200 text-green-800 rounded-2xl">
                    <Check className="h-4 w-4 text-green-600"/>
                    <AlertDescription className="font-medium">
                        Paiement réussi ! Votre abonnement est maintenant actif. Il peut prendre quelques secondes pour
                        se mettre à jour.
                    </AlertDescription>
                </Alert>
            )}
            {showCanceled && (
                <Alert className="mb-6 bg-orange-50 border-orange-200 text-orange-800 rounded-2xl">
                    <AlertCircle className="h-4 w-4 text-orange-600"/>
                    <AlertDescription className="font-medium">
                        Paiement annulé. Vous pouvez réessayer à tout moment.
                    </AlertDescription>
                </Alert>
            )}
            {error && (
                <Alert className="mb-6 bg-red-50 border-red-200 text-red-800 rounded-2xl">
                    <AlertCircle className="h-4 w-4 text-red-600"/>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">

                    <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                        <CardHeader
                            className="bg-gradient-to-r from-slate-50 to-indigo-50/30 border-b border-slate-100 pb-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm text-slate-500 mb-1">Plan actuel</p>
                                    <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                        <currentPlan.icon className="h-6 w-6 text-indigo-600"/>
                                        {currentPlan.name}
                                    </CardTitle>
                                </div>
                                <Badge className={statusInfo.className}>{statusInfo.label}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="flex items-baseline gap-1 mb-1">
                                <span className="text-4xl font-bold text-slate-900">{currentPlan.price}</span>
                                {currentPlan.period &&
                                    <span className="text-lg text-slate-400">{currentPlan.period}</span>}
                            </div>
                            <p className="text-sm text-slate-500 mb-6">
                                {currentPlan.limit}
                                {isSubscribed && renewalDate && ` · Renouvellement le ${renewalDate}`}
                            </p>

                            {isSubscribed && hasStripeCustomer && (
                                <div className="mt-6 flex flex-wrap gap-3">
                                    <Button
                                        onClick={() => handlePortal()}
                                        disabled={loadingAction === "portal"}
                                        className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl"
                                    >
                                        {loadingAction === "portal"
                                            ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                            : <ExternalLink className="mr-2 h-4 w-4"/>}
                                        Gérer l&#39;abonnement
                                    </Button>

                                    <Button
                                        variant="outline"
                                        onClick={() => handlePortal()}
                                        className="border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl"
                                    >
                                        Mettre à jour le paiement
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
                            {(["starter", "pro"] as const).map((key) => {
                                const plan = PLANS[key];
                                const Icon = plan.icon;
                                const isCurrent = planKey === key && isSubscribed;

                                return (
                                    <Card
                                        key={key}
                                        className={`relative rounded-2xl transition-all ${
                                            isCurrent
                                                ? "border-indigo-600 ring-1 ring-indigo-600 shadow-md"
                                                : key === "pro"
                                                    ? "border-indigo-200 bg-indigo-50/30 shadow-sm"
                                                    : "border-slate-200 hover:border-indigo-200"
                                        }`}
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
                                                {isCurrent && (
                                                    <Badge
                                                        className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100">Actuel</Badge>
                                                )}
                                            </div>
                                            <div className="flex items-baseline gap-1 mb-4">
                                                <span
                                                    className="text-3xl font-bold text-slate-900">{plan.price}</span>
                                                <span className="text-sm text-slate-400">{plan.period}</span>
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
                                                onClick={() => handleAction(key)}
                                                disabled={isCurrent || !!loadingAction}
                                                className={`w-full rounded-xl ${
                                                    isCurrent
                                                        ? "bg-slate-100 text-slate-400"
                                                        : key === "pro"
                                                            ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                                                            : "bg-slate-900 hover:bg-slate-800 text-white"
                                                }`}
                                            >
                                                {loadingAction === key &&
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                                {isCurrent ? "Plan actuel" : (isSubscribed ? "Changer pour ce plan" : `Choisir ${plan.name}`)}
                                            </Button>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>

                    {/* Historique de facturation */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <History className="h-5 w-5 text-indigo-600"/> Historique de facturation
                        </h2>
                        <Card className="border-slate-200 rounded-2xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead
                                        className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">Numéro</th>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4">Montant</th>
                                        <th className="px-6 py-4">Statut</th>
                                        <th className="px-6 py-4 text-right">Facture</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                    {loadingInvoices ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-10 text-center">
                                                <Loader2 className="h-6 w-6 animate-spin mx-auto text-slate-300"/>
                                            </td>
                                        </tr>
                                    ) : invoices.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-10 text-center text-slate-400">
                                                Aucune facture trouvée.
                                            </td>
                                        </tr>
                                    ) : (
                                        invoices.map((invoice) => (
                                            <tr key={invoice.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-slate-900">{invoice.number}</td>
                                                <td className="px-6 py-4 text-slate-500">
                                                    {new Date(invoice.date * 1000).toLocaleDateString("fr-FR")}
                                                </td>
                                                <td className="px-6 py-4 text-slate-900 font-medium">
                                                    {(invoice.amount).toFixed(2)}€
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge
                                                        variant="outline"
                                                        className={invoice.status === "paid" ? "bg-green-50 text-green-700 border-green-100" : "bg-slate-50 text-slate-600"}
                                                    >
                                                        {invoice.status === "paid" ? "Payée" : invoice.status}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    {invoice.pdf && (
                                                        <a
                                                            href={invoice.pdf}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
                                                        >
                                                            <Download className="h-4 w-4"/>
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
                        <CardContent className="text-sm text-slate-500 space-y-3">
                            <p>Vos données bancaires ne sont jamais stockées sur nos serveurs. Tout est chiffré et géré
                                par Stripe.</p>
                            <div className="flex items-center gap-2">
                                <div
                                    className="h-6 w-10 bg-white border rounded flex items-center justify-center text-[10px] font-bold text-slate-400">VISA
                                </div>
                                <div
                                    className="h-6 w-10 bg-white border rounded flex items-center justify-center text-[10px] font-bold text-slate-400">MC
                                </div>
                                <div
                                    className="h-6 w-10 bg-white border rounded flex items-center justify-center text-[10px] font-bold text-slate-400">CB
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {isSubscribed && hasStripeCustomer && (
                        <Card className="bg-indigo-50/50 border-indigo-100 shadow-none rounded-2xl">
                            <CardContent className="pt-6 text-sm text-indigo-800 space-y-2">
                                <p className="font-medium">Besoin de changer ?</p>
                                <p className="text-indigo-700/80 text-xs">
                                    Upgrade, downgrade, mise à jour de carte et factures sont accessibles depuis le
                                    portail Stripe.
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}