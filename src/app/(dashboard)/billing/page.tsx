"use client";

import {useState} from "react";
import {useAuth} from "@/context/auth-context";
import {
    CreditCard, Shield,
    Loader2
} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

const PLANS_DETAILS = {
    free: {name: "Gratuit", price: "0€", limit: "1 Boutique", features: ["1 Boutique", "Support basique"]},
    starter: {
        name: "Starter",
        price: "9€",
        limit: "3 Boutiques",
        features: ["3 Boutiques", "Support standard", "Analytics"]
    },
    pro: {
        name: "Pro",
        price: "29€",
        limit: "Illimité",
        features: ["Boutiques illimitées", "Support prioritaire", "Marque blanche"]
    }
};

export default function BillingPage() {
    const {user, userData} = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const subscription = userData?.subscription;
    const planKey = subscription?.plan || "free";
    const currentPlan = PLANS_DETAILS[planKey];

    const renewalDate = subscription?.currentPeriodEnd
        ? new Date(subscription.currentPeriodEnd.seconds * 1000).toLocaleDateString()
        : "-";

    const handleSubscriptionAction = async (targetPlanKey?: string) => {
        if (!user) return;
        setIsLoading(true);

        try {
            if (subscription?.stripeCustomerId && subscription.status === 'active') {
                const response = await fetch("/api/stripe/portal", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({userId: user.uid}),
                });
                const data = await response.json();
                window.location.href = data.url;
                return;
            }

            let priceId = "";
            if (targetPlanKey === 'starter') priceId = "price_1Sxtea9mcp2EBniBzRXXntql";
            if (targetPlanKey === 'pro') priceId = "price_1Sxtex9mcp2EBniBDOFUCQEr";

            if (!priceId) {
                alert("Erreur de configuration du plan");
                return;
            }

            const response = await fetch("/api/stripe/checkout", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    priceId: priceId,
                    userId: user.uid,
                    email: user.email,
                    returnUrl: window.location.href
                }),
            });

            const data = await response.json();
            window.location.href = data.url;

        } catch (error) {
            console.error("Erreur Stripe:", error);
            alert("Une erreur est survenue lors de la redirection.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container max-w-6xl mx-auto py-10 px-4">
            <div className="flex flex-col gap-2 mb-8">
                <h1 className="text-3xl font-bold font-heading text-slate-900 flex items-center gap-3">
                    <CreditCard className="h-8 w-8 text-indigo-600"/> Facturation
                </h1>
                <p className="text-slate-500">
                    Gérez votre abonnement via Stripe.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-indigo-100 bg-white shadow-sm rounded-2xl">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-6">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-2xl font-bold text-slate-900">
                                    {currentPlan.name}
                                </CardTitle>
                                <Badge
                                    className={subscription?.status === 'active' ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}>
                                    {subscription?.status === 'active' ? 'Actif' : 'Gratuit / Inactif'}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-8">
                            <div className="text-4xl font-bold text-slate-900 mb-2">
                                {currentPlan.price}<span className="text-lg text-slate-400 font-normal">/mois</span>
                            </div>
                            {subscription?.status === 'active' && (
                                <p className="text-sm text-slate-500 mb-6">
                                    Renouvellement automatique le {renewalDate}
                                </p>
                            )}

                            {planKey === 'free' ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                                    <div
                                        className="border rounded-xl p-4 hover:border-indigo-300 transition-colors cursor-pointer"
                                        onClick={() => handleSubscriptionAction('starter')}>
                                        <div className="font-bold text-indigo-900">Starter</div>
                                        <div className="text-sm text-slate-500">9€/mois</div>
                                        <Button className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700">Choisir
                                            Starter</Button>
                                    </div>
                                    <div
                                        className="border rounded-xl p-4 hover:border-indigo-300 transition-colors cursor-pointer"
                                        onClick={() => handleSubscriptionAction('pro')}>
                                        <div className="font-bold text-indigo-900">Pro</div>
                                        <div className="text-sm text-slate-500">29€/mois</div>
                                        <Button className="w-full mt-3 bg-slate-900 hover:bg-slate-800">Choisir
                                            Pro</Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-6">
                                    <Button onClick={() => handleSubscriptionAction()} disabled={isLoading}
                                            className="bg-slate-900 text-white w-full sm:w-auto">
                                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                        Gérer l'abonnement & Factures
                                    </Button>
                                    <p className="text-xs text-slate-400 mt-2">
                                        Vous serez redirigé vers le portail sécurisé Stripe pour changer de plan, mettre
                                        à jour votre carte ou télécharger vos factures.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="bg-slate-50 border-slate-200 shadow-none rounded-2xl">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-medium text-slate-700 flex items-center gap-2">
                                <Shield className="h-4 w-4"/> Sécurité
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-slate-500 space-y-4">
                            <p>Nous ne stockons jamais vos données bancaires. Tout est chiffré et géré par Stripe,
                                leader mondial du paiement en ligne.</p>
                            <div className="flex items-center gap-2 mt-2">
                                <div
                                    className="h-6 w-10 bg-white border rounded flex items-center justify-center text-[10px] font-bold text-slate-400">VISA
                                </div>
                                <div
                                    className="h-6 w-10 bg-white border rounded flex items-center justify-center text-[10px] font-bold text-slate-400">CB
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}