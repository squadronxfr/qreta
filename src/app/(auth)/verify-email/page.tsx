"use client";

import {useState} from "react";
import {sendEmailVerification} from "firebase/auth";
import {useAuthStore} from "@/providers/auth-store-provider";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {ArrowLeft, Mail, RefreshCw} from "lucide-react";
import {Spinner} from "@/components/ui/spinner";
import {toast} from "sonner";
import Link from "next/link";

export default function VerifyEmailPage() {
    const user = useAuthStore((s) => s.user);
    const logout = useAuthStore((s) => s.logout);
    const router = useRouter();
    const [isResending, setIsResending] = useState(false);
    const [isChecking, setIsChecking] = useState(false);

    const handleResend = async () => {
        if (!user) return;
        setIsResending(true);
        try {
            await sendEmailVerification(user);
            toast.success("Email de vérification renvoyé.");
        } catch {
            toast.error("Impossible d'envoyer l'email. Réessayez dans quelques minutes.");
        } finally {
            setIsResending(false);
        }
    };

    const handleCheckVerification = async () => {
        if (!user) return;
        setIsChecking(true);
        try {
            await user.reload();
            if (user.emailVerified) {
                router.push("/stores");
            } else {
                toast.error("Email pas encore vérifié. Consultez votre boîte mail.");
            }
        } catch {
            toast.error("Une erreur est survenue.");
        } finally {
            setIsChecking(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        router.push("/login");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white p-4">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-225 h-125 bg-linear-to-b from-indigo-100/40 via-violet-50/20 to-transparent rounded-full blur-[100px]"/>
            </div>

            <div className="w-full max-w-md relative z-10">
                <button
                    onClick={handleLogout}
                    className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors mb-8"
                >
                    <ArrowLeft className="h-4 w-4"/>
                    Se déconnecter
                </button>

                <div className="text-center mb-10">
                    <Link href="/">
                        <span className="font-heading text-3xl font-bold tracking-tight text-slate-900">
                            Qreta<span className="text-indigo-600">.</span>
                        </span>
                    </Link>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm text-center space-y-6">
                    <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto">
                        <Mail className="h-8 w-8 text-indigo-600"/>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-xl font-bold text-slate-900">Vérifiez votre email</h1>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            Un lien de vérification a été envoyé à{" "}
                            <span className="font-medium text-slate-700">{user?.email}</span>.
                            Cliquez sur ce lien pour activer votre compte.
                        </p>
                    </div>

                    <Button
                        onClick={handleCheckVerification}
                        disabled={isChecking}
                        className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium"
                    >
                        {isChecking ? (
                            <><Spinner className="mr-2 h-4 w-4"/> Vérification...</>
                        ) : (
                            "J'ai vérifié mon email"
                        )}
                    </Button>

                    <div className="pt-2 border-t border-slate-100">
                        <p className="text-xs text-slate-400 mb-3">Vous n&apos;avez pas reçu l&apos;email ?</p>
                        <Button
                            variant="ghost"
                            onClick={handleResend}
                            disabled={isResending}
                            className="text-sm text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                        >
                            {isResending ? (
                                <><Spinner className="mr-2 h-4 w-4"/> Envoi...</>
                            ) : (
                                <><RefreshCw className="mr-2 h-4 w-4"/> Renvoyer l&apos;email</>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
