"use client";

import {useState, SyntheticEvent} from "react";
import {sendPasswordResetEmail} from "firebase/auth";
import {FirebaseError} from "firebase/app";
import {auth} from "@/lib/firebase/config";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {ArrowLeft, ArrowRight, MailCheck} from "lucide-react";
import {Spinner} from "@/components/ui/spinner";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isEmailSent, setIsEmailSent] = useState(false);

    const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await sendPasswordResetEmail(auth, email);
            setIsEmailSent(true);
        } catch (err: unknown) {
            if (err instanceof FirebaseError) {
                switch (err.code) {
                    case "auth/user-not-found":
                    case "auth/invalid-email":
                        setError("Aucun compte associé à cette adresse email.");
                        break;
                    case "auth/too-many-requests":
                        setError("Trop de tentatives. Réessayez dans quelques minutes.");
                        break;
                    default:
                        setError("Une erreur est survenue. Veuillez réessayer.");
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
                    href="/login"
                    className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors mb-8"
                >
                    <ArrowLeft className="h-4 w-4"/>
                    Retour à la connexion
                </Link>

                <div className="text-center mb-10">
                    <Link href="/">
                        <span className="font-heading text-3xl font-bold tracking-tight text-slate-900">
                            Qreta<span className="text-indigo-600">.</span>
                        </span>
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900 mt-6 mb-2">Mot de passe oublié</h1>
                    <p className="text-slate-500 text-sm">
                        Entrez votre email pour recevoir un lien de réinitialisation.
                    </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                    {isEmailSent ? (
                        <div className="text-center space-y-4">
                            <div
                                className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto">
                                <MailCheck className="h-8 w-8 text-indigo-600"/>
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-lg font-bold text-slate-900">Email envoyé</h2>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    Un lien de réinitialisation a été envoyé à{" "}
                                    <span className="font-medium text-slate-700">{email}</span>.
                                    Consultez votre boîte mail.
                                </p>
                            </div>
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                            >
                                Retour à la connexion
                                <ArrowRight className="h-4 w-4"/>
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="jean@exemple.com"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setError(null);
                                    }}
                                    required
                                    className="h-11 rounded-xl border-slate-200 bg-slate-50/50 focus:border-indigo-300 focus:ring-indigo-200"
                                />
                            </div>

                            {error && (
                                <Alert variant="destructive"
                                       className="bg-red-50 text-red-900 border-red-200 rounded-xl">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <Button
                                type="submit"
                                className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-all shadow-md shadow-indigo-500/20"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <><Spinner className="mr-2 h-4 w-4"/> Envoi en cours...</>
                                ) : (
                                    <>Envoyer le lien <ArrowRight className="ml-2 h-4 w-4"/></>
                                )}
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}