"use client";

import {useState} from "react";
import {useAuth} from "@/context/auth-context";
import {
    CreditCard, Check, Shield, ExternalLink,
    FileText, AlertCircle, Loader2, Zap
} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Separator} from "@/components/ui/separator";

const PLANS_DETAILS = {
    free: {name: "Gratuit", price: "0€", limit: "1 Boutique"},
    starter: {name: "Starter", price: "9€", limit: "3 Boutiques"},
    pro: {name: "Pro", price: "29€", limit: "Illimité"}
};

export default function BillingPage() {
    const {userData} = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const subscription = userData?.subscription;
    const planKey = subscription?.plan || "free";
    const currentPlan = PLANS_DETAILS[planKey as keyof typeof PLANS_DETAILS];

    const renewalDate = subscription?.currentPeriodEnd
        ? new Date(subscription.currentPeriodEnd.seconds * 1000).toLocaleDateString()
        : "-";
    const handleManageSubscription = async () => {
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (subscription?.stripeCustomerId) {
                alert("Redirection vers le Portail Client Stripe...\n(Ici vous connecterez votre API Stripe)");
            } else {
                alert("Redirection vers le paiement (Stripe Checkout)...");
            }
        } catch (error) {
            console.error("Erreur redirection Stripe", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container max-w-5xl mx-auto py-10 px-4">
            <div className="flex flex-col gap-2 mb-8">
                <h1 className="text-3xl font-bold font-heading text-slate-900 flex items-center gap-3">
                    <CreditCard className="h-8 w-8 text-indigo-600"/> Facturation
                </h1>
                <p className="text-slate-500">
                    Gérez votre abonnement et vos informations de paiement via notre partenaire sécurisé Stripe.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                <div className="lg:col-span-2 space-y-6">

                    <Card className="border-indigo-100 bg-white shadow-sm rounded-2xl overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div
                                        className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Forfait
                                        actuel
                                    </div>
                                    <CardTitle className="text-3xl font-bold text-slate-900">
                                        {currentPlan.name}
                                    </CardTitle>
                                </div>
                                <Badge
                                    className={`text-sm px-3 py-1 capitalize ${subscription?.status === 'active' ? 'bg-green-100 text-green-700 hover:bg-green-100 shadow-none' : 'bg-slate-100 text-slate-600 shadow-none'}`}>
                                    {subscription?.status === 'active' ? 'Actif' : subscription?.status || 'Gratuit'}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div>
                                    <div className="text-4xl font-bold text-slate-900">
                                        {currentPlan.price}<span
                                        className="text-lg text-slate-400 font-normal">/mois</span>
                                    </div>
                                    <p className="text-sm text-slate-500 mt-2">
                                        {planKey === 'free'
                                            ? "Compte gratuit à vie"
                                            : `Renouvellement le ${renewalDate}`
                                        }
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-sm text-slate-700">
                                        <div
                                            className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                                            <Zap className="h-4 w-4 text-indigo-600"/>
                                        </div>
                                        <span>Limite : <strong>{currentPlan.limit}</strong></span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-slate-700">
                                        <div
                                            className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                                            <Shield className="h-4 w-4 text-indigo-600"/>
                                        </div>
                                        <span>Paiement sécurisé par Stripe</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-slate-50/50 border-t border-slate-100 py-4 px-6">
                            <Button
                                onClick={handleManageSubscription}
                                disabled={isLoading}
                                className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white shadow-md rounded-xl"
                            >
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                {planKey === 'free' ? "Mettre à niveau (Upgrade)" : "Gérer l'abonnement & Factures"}
                                {!isLoading && <ExternalLink className="ml-2 h-4 w-4 opacity-70"/>}
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card className="border-slate-200 shadow-sm rounded-2xl">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <FileText className="h-5 w-5 text-slate-400"/> Dernières factures
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {planKey === 'free' ? (
                                <div className="text-center py-8 text-slate-500 text-sm">
                                    Aucune facture disponible pour le plan gratuit.
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                                    <div className="p-3 bg-slate-100 rounded-full">
                                        <ExternalLink className="h-6 w-6 text-slate-400"/>
                                    </div>
                                    <div className="max-w-md space-y-1">
                                        <h3 className="font-medium text-slate-900">Vos factures sont sur Stripe</h3>
                                        <p className="text-sm text-slate-500">
                                            Pour des raisons de sécurité et de conformité, l'historique complet et les
                                            téléchargements PDF sont disponibles sur votre portail client sécurisé.
                                        </p>
                                    </div>
                                    <Button variant="outline" onClick={handleManageSubscription}
                                            className="mt-2 rounded-xl">
                                        Accéder aux factures
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                </div>

                <div className="space-y-6">

                    <Card className="bg-slate-50 border-slate-200 shadow-none rounded-2xl">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-medium text-slate-700">Méthode de paiement</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm">
                            {planKey === 'free' ? (
                                <p className="text-slate-500">Aucune carte enregistrée.</p>
                            ) : (
                                <div
                                    className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200">
                                    <div
                                        className="h-8 w-12 bg-slate-100 rounded flex items-center justify-center border border-slate-200">
                                        <div className="h-4 w-4 bg-slate-400 rounded-full opacity-20"/>
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">•••• 4242</p>
                                        <p className="text-xs text-slate-400">Géré via Stripe</p>
                                    </div>
                                </div>
                            )}

                            <Separator className="my-4"/>

                            <div className="flex items-start gap-2 text-xs text-slate-500">
                                <Shield className="h-3 w-3 mt-0.5 text-green-600"/>
                                <p>Nous ne stockons jamais vos coordonnées bancaires. Tout est chiffré et géré par
                                    Stripe.</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Alert className="bg-indigo-50 border-indigo-100 text-indigo-900 rounded-2xl">
                        <AlertCircle className="h-4 w-4 text-indigo-600"/>
                        <AlertTitle>Besoin de changer ?</AlertTitle>
                        <AlertDescription className="text-xs mt-1 text-indigo-800/80">
                            Vous pouvez modifier votre forfait ou annuler votre abonnement à tout moment. Les
                            changements prennent effet immédiatement ou à la fin de la période en cours.
                        </AlertDescription>
                    </Alert>

                </div>
            </div>
        </div>
    );
}