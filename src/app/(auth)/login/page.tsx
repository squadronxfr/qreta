"use client";

import {useState, SyntheticEvent} from "react";
import {signInWithEmailAndPassword} from "firebase/auth";
import {FirebaseError} from "firebase/app";
import {auth} from "@/lib/firebase/config";
import {useRouter} from "next/navigation";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {ArrowRight, ArrowLeft} from "lucide-react";
import {Spinner} from "@/components/ui/spinner";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push("/stores");
        } catch (err: unknown) {
            if (err instanceof FirebaseError) {
                switch (err.code) {
                    case "auth/user-not-found":
                    case "auth/wrong-password":
                    case "auth/invalid-credential":
                        setError("Email ou mot de passe incorrect.");
                        break;
                    case "auth/too-many-requests":
                        setError("Trop de tentatives. Réessayez dans quelques minutes.");
                        break;
                    default:
                        setError("Erreur de connexion. Veuillez réessayer.");
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
                    <h1 className="text-2xl font-bold text-slate-900 mt-6 mb-2">Bon retour parmi nous</h1>
                    <p className="text-slate-500 text-sm">Accédez à votre espace commerçant</p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email</Label>
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

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium text-slate-700">Mot de
                                passe</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError(null);
                                }}
                                required
                                className="h-11 rounded-xl border-slate-200 bg-slate-50/50 focus:border-indigo-300 focus:ring-indigo-200"
                            />
                        </div>

                        {error && (
                            <Alert variant="destructive" className="bg-red-50 text-red-900 border-red-200 rounded-xl">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-11 rounded-xl bg-linear-to-r bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-all shadow-md shadow-indigo-500/20"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <><Spinner className="mr-2 h-4 w-4"/> Connexion en cours...</>
                            ) : (
                                <>Se connecter <ArrowRight className="ml-2 h-4 w-4"/></>
                            )}
                        </Button>
                    </form>
                </div>

                <p className="text-center text-sm text-slate-500 mt-6">
                    Pas encore de compte ?{" "}
                    <Link href="/signup" className="text-slate-900 hover:text-indigo-600 font-medium transition-colors">
                        Créer un compte
                    </Link>
                </p>
            </div>
        </div>
    );
}