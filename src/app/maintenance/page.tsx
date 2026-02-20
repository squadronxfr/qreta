"use client";

import {useState} from "react";
import {db} from "@/lib/firebase/config";
import {collection, addDoc, serverTimestamp} from "firebase/firestore";
import {SplitText} from "@/components/ui/split-text";
import {toast} from "sonner";

export default function MaintenancePage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        try {
            // Enregistrement dans la collection "waitlist"
            await addDoc(collection(db, "waitlist"), {
                email,
                createdAt: serverTimestamp(),
            });
            toast.success("Votre adresse a bien été enregistrée.");
            setEmail("");
        } catch (error) {
            toast.error("Impossible d'enregistrer votre e-mail pour le moment.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main
            className="relative min-h-screen w-full flex flex-col items-center justify-center bg-slate-950 text-slate-50 p-6 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_30%,#1e293b,transparent)]"/>

            <div className="relative z-10 flex flex-col items-center text-center max-w-2xl w-full">
                {/* Votre Logo */}
                <div className="mb-12">
          <span className="font-heading text-4xl font-bold tracking-tight text-white">
            Qreta<span className="text-indigo-500">.</span>
          </span>
                </div>

                {/* Titre simple et français */}
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                    <SplitText text="La plateforme est en cours de développement"/>
                </h1>

                <p className="text-slate-400 text-lg mb-10 max-w-md">
                    Nous travaillons actuellement sur la création de l'outil. Laissez-nous votre e-mail pour être
                    informé dès l'ouverture.
                </p>

                {/* Formulaire d'inscription */}
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md mb-12">
                    <input
                        type="email"
                        required
                        placeholder="votre@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white"
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium px-6 py-3 rounded-lg transition-colors text-sm"
                    >
                        {isLoading ? "Envoi..." : "Me prévenir"}
                    </button>
                </form>

                {/* Animation des barres de progression */}
                <div className="flex gap-3">
                    <div className="h-1 w-10 bg-indigo-500/40 rounded-full animate-bounce"/>
                    <div className="h-1 w-10 bg-indigo-500/60 rounded-full animate-bounce delay-200"/>
                    <div className="h-1 w-10 bg-indigo-500/80 rounded-full animate-bounce delay-400"/>
                </div>
            </div>

            <footer className="absolute bottom-8 text-slate-600 text-[10px] uppercase tracking-[0.2em]">
                Développement en cours • Arrivée prochaine
            </footer>
        </main>
    );
}