"use client";

import {useState, SyntheticEvent} from "react";
import {signInWithEmailAndPassword} from "firebase/auth";
import {FirebaseError} from "firebase/app";
import {auth} from "@/lib/firebase/config";
import {useRouter} from "next/navigation";
import {Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {ArrowRight} from "lucide-react";
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
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <Card className="w-full max-w-md border-slate-200 shadow-xl rounded-2xl">
                <CardHeader className="space-y-1">
                    <div className="flex justify-center mb-4">
                        <h1 className="text-3xl font-bold font-heading tracking-tight text-slate-900">
                            Qreta<span className="text-indigo-600">.</span>
                        </h1>
                    </div>
                    <CardTitle className="text-2xl text-center">Connexion</CardTitle>
                    <CardDescription className="text-center">
                        Accédez à votre espace commerçant
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
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
                                className="bg-slate-50"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Mot de passe</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError(null);
                                }}
                                required
                                className="bg-slate-50"
                            />
                        </div>

                        {error && (
                            <Alert variant="destructive" className="bg-red-50 text-red-900 border-red-200 rounded-xl">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium h-11 rounded-xl"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <><Spinner className="mr-2 h-4 w-4"/> Connexion en cours...</>
                            ) : (
                                <>Se connecter <ArrowRight className="ml-2 h-4 w-4"/></>
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center border-t border-slate-100 py-4">
                    <p className="text-sm text-slate-500">
                        Pas encore de compte ?{" "}
                        <Link href="/signup" className="text-indigo-600 hover:underline font-medium">
                            Créer un compte
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}