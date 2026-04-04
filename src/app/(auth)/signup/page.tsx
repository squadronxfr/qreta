"use client";

import {useState, SyntheticEvent} from "react";
import {createUserWithEmailAndPassword, updateProfile, sendEmailVerification} from "firebase/auth";
import {FirebaseError} from "firebase/app";
import {doc, setDoc, serverTimestamp} from "firebase/firestore";
import {auth, db} from "@/lib/firebase/config";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Checkbox} from "@/components/ui/checkbox";
import {ArrowRight, ArrowLeft, Check} from "lucide-react";
import {Spinner} from "@/components/ui/spinner";
import Link from "next/link";
import {useRouter} from "next/navigation";

export default function SignupPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [e.target.id]: e.target.value});
        setError(null);
    };

    const handleSignup = async (e: SyntheticEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        if (!acceptedTerms) {
            setError("Vous devez accepter les conditions générales d'utilisation.");
            setIsLoading(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Les mots de passe ne correspondent pas.");
            setIsLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError("Le mot de passe doit contenir au moins 6 caractères.");
            setIsLoading(false);
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const user = userCredential.user;

            const displayName = `${formData.firstname} ${formData.lastname}`.trim();
            await updateProfile(user, {displayName});

            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                email: user.email,
                firstname: formData.firstname,
                lastname: formData.lastname,
                role: "store_owner",
                photoUrl: "",
                subscription: {
                    plan: "free",
                    status: "active",
                    currentPeriodEnd: null,
                },
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });

            await sendEmailVerification(user);
            router.push("/verify-email");
        } catch (err: unknown) {
            if (err instanceof FirebaseError) {
                switch (err.code) {
                    case "auth/email-already-in-use":
                        setError("Cet email est déjà utilisé.");
                        break;
                    case "auth/weak-password":
                        setError("Le mot de passe est trop faible.");
                        break;
                    default:
                        setError("Une erreur est survenue lors de l'inscription.");
                }
            } else {
                setError("Une erreur inattendue est survenue.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white p-4">
            <div className="absolute inset-0 overflow-hidden">
                <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-225 h-125 bg-linear-to-b from-indigo-100/40 via-violet-50/20 to-transparent rounded-full blur-[100px]"/>
            </div>

            <div className="w-full max-w-md relative z-10">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors mb-8"
                >
                    <ArrowLeft className="h-4 w-4"/>
                    Retour
                </Link>

                <div className="text-center mb-10">
                    <Link href="/">
                        <span className="font-heading text-3xl font-bold tracking-tight text-slate-900">
                            Qreta<span className="text-indigo-600">.</span>
                        </span>
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900 mt-6 mb-2">Créer un compte</h1>
                    <p className="text-slate-500 text-sm">Commencez gratuitement votre catalogue digital</p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                    <form onSubmit={handleSignup} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstname" className="text-sm font-medium text-slate-700">Prénom</Label>
                                <Input
                                    id="firstname"
                                    placeholder="Jean"
                                    required
                                    value={formData.firstname}
                                    onChange={handleChange}
                                    className="h-11 rounded-xl border-slate-200 bg-slate-50/50 focus:border-indigo-300 focus:ring-indigo-200"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastname" className="text-sm font-medium text-slate-700">Nom</Label>
                                <Input
                                    id="lastname"
                                    placeholder="Dupont"
                                    required
                                    value={formData.lastname}
                                    onChange={handleChange}
                                    className="h-11 rounded-xl border-slate-200 bg-slate-50/50 focus:border-indigo-300 focus:ring-indigo-200"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="jean@exemple.com"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="h-11 rounded-xl border-slate-200 bg-slate-50/50 focus:border-indigo-300 focus:ring-indigo-200"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium text-slate-700">Mot de
                                passe</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="h-11 rounded-xl border-slate-200 bg-slate-50/50 focus:border-indigo-300 focus:ring-indigo-200"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">Confirmer le
                                mot de passe</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                required
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="h-11 rounded-xl border-slate-200 bg-slate-50/50 focus:border-indigo-300 focus:ring-indigo-200"
                            />
                        </div>

                        <div className="flex items-start gap-3 pt-1">
                            <Checkbox
                                id="terms"
                                checked={acceptedTerms}
                                onCheckedChange={(checked) => {
                                    setAcceptedTerms(checked === true);
                                    setError(null);
                                }}
                                className="mt-0.5"
                            />
                            <Label htmlFor="terms"
                                   className="text-sm text-slate-600 leading-relaxed font-normal cursor-pointer">
                                J&apos;accepte les{" "}
                                <Link
                                    href="/terms"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-600 hover:text-indigo-700 font-medium underline underline-offset-2"
                                >
                                    conditions générales d&apos;utilisation
                                </Link>
                            </Label>
                        </div>

                        {error && (
                            <Alert variant="destructive" className="bg-red-50 text-red-900 border-red-200 rounded-xl">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-all shadow-md shadow-indigo-500/20"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <><Spinner className="mr-2 h-4 w-4"/> Création en cours...</>
                            ) : (
                                <>S&apos;inscrire <ArrowRight className="ml-2 h-4 w-4"/></>
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-slate-100">
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider text-center mb-4">Inclus
                            gratuitement</p>
                        <div className="flex flex-col gap-2.5">
                            {[
                                "1 Catalogue gratuite à vie",
                                "Produits illimités",
                                "QR Code généré automatiquement",
                            ].map((feature) => (
                                <div key={feature} className="flex items-center gap-2.5 text-sm text-slate-600">
                                    <div
                                        className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                        <Check className="h-3 w-3"/>
                                    </div>
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <p className="text-center text-sm text-slate-500 mt-6">
                    Déjà un compte ?{" "}
                    <Link href="/login" className="text-slate-900 hover:text-indigo-600 font-medium transition-colors">
                        Se connecter
                    </Link>
                </p>
            </div>
        </div>
    );
}