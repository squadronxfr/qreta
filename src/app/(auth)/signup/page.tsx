"use client";

import {useState, SyntheticEvent} from "react";
import {createUserWithEmailAndPassword, updateProfile} from "firebase/auth";
import {doc, setDoc} from "firebase/firestore";
import {auth, db} from "@/lib/firebase/config";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter} from "@/components/ui/card";
import {Loader2, ArrowRight, CheckCircle2} from "lucide-react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {Alert, AlertDescription} from "@/components/ui/alert";

export default function SignupPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [e.target.id]: e.target.value});
        setError(null);
    };

    const handleSignup = async (e: SyntheticEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

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
                    plan: "starter",
                    status: "trialing",
                    currentPeriodEnd: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14)
                },
                createdAt: new Date(),
                updatedAt: new Date()
            });

            router.push("/stores");

        } catch (err: any) {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') {
                setError("Cet email est déjà utilisé.");
            } else {
                setError("Une erreur est survenue lors de l'inscription.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <Card className="w-full max-w-md border-slate-200 shadow-xl">
                <CardHeader className="space-y-1">
                    <div className="flex justify-center mb-4">
                        <h1 className="text-3xl font-bold font-heading tracking-tight text-slate-900">
                            Qreta<span className="text-indigo-600">.</span>
                        </h1>
                    </div>
                    <CardTitle className="text-2xl text-center">Créer un compte</CardTitle>
                    <CardDescription className="text-center">
                        Commencez gratuitement votre catalogue digital
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignup} className="space-y-4">

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstname">Prénom</Label>
                                <Input id="firstname" placeholder="Jean" required value={formData.firstname}
                                       onChange={handleChange} className="bg-slate-50"/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastname">Nom</Label>
                                <Input id="lastname" placeholder="Dupont" required value={formData.lastname}
                                       onChange={handleChange} className="bg-slate-50"/>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="jean@exemple.com" required
                                   value={formData.email} onChange={handleChange} className="bg-slate-50"/>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Mot de passe</Label>
                            <Input id="password" type="password" required value={formData.password}
                                   onChange={handleChange} className="bg-slate-50"/>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                            <Input id="confirmPassword" type="password" required value={formData.confirmPassword}
                                   onChange={handleChange} className="bg-slate-50"/>
                        </div>

                        {error && (
                            <Alert variant="destructive" className="bg-red-50 text-red-900 border-red-200">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <Button type="submit"
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium h-11"
                                disabled={isLoading}>
                            {isLoading ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Création en cours...</>
                            ) : (
                                <>S'inscrire <ArrowRight className="ml-2 h-4 w-4"/></>
                            )}
                        </Button>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-slate-200"/>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-slate-500">Avantages</span>
                            </div>
                        </div>
                        <ul className="mt-4 space-y-2 text-sm text-slate-600">
                            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600"/> 1
                                Boutique gratuite à vie
                            </li>
                            <li className="flex items-center gap-2"><CheckCircle2
                                className="h-4 w-4 text-green-600"/> Produits illimités
                            </li>
                            <li className="flex items-center gap-2"><CheckCircle2
                                className="h-4 w-4 text-green-600"/> QR Code généré automatiquement
                            </li>
                        </ul>
                    </div>

                </CardContent>
                <CardFooter className="flex justify-center border-t border-slate-100 py-4">
                    <p className="text-sm text-slate-500">
                        Déjà un compte ?{" "}
                        <Link href="/login" className="text-indigo-600 hover:underline font-medium">
                            Se connecter
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}