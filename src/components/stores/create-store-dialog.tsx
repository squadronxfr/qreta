"use client";

import React, {useState} from "react";
import {useAuth} from "@/context/auth-context";
import {createStore} from "@/lib/firebase/store";
import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {Loader2, Plus, Store as StoreIcon, Lock} from "lucide-react";
import {useRouter} from "next/navigation";
import {SUBSCRIPTION_PLANS, PlanKey} from "@/config/subscription";
import Link from "next/link";
import {toast} from "sonner";

interface CreateStoreDialogProps {
    storeCount: number;
}

export function CreateStoreDialog({storeCount}: CreateStoreDialogProps) {
    const {user, userData} = useAuth();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const planKey = (userData?.subscription?.plan as PlanKey) || "free";
    const plan = SUBSCRIPTION_PLANS[planKey];
    const isQuotaReached = storeCount >= plan.quota;

    const handleCreate = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user) return;

        if (name.length < 2) {
            toast.error("Le nom est trop court", {
                description: "Le nom de la boutique doit contenir au moins 2 caractères."
            });
            return;
        }

        setLoading(true);

        try {
            const storeId = await createStore(user.uid, {name, description});

            toast.success("Boutique créée !", {
                description: "Votre espace de vente est prêt à être configuré."
            });

            setOpen(false);
            setName("");
            setDescription("");
            router.push(`/stores/${storeId}`);
        } catch (err) {
            console.error(err);
            toast.error("Erreur de création", {
                description: "Une erreur est survenue lors de la création de la boutique."
            });
        } finally {
            setLoading(false);
        }
    };

    if (isQuotaReached) {
        return (
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="rounded-xl opacity-80" variant="outline">
                        <Lock className="mr-2 h-4 w-4"/> Nouvelle Boutique
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-106.25 rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-slate-900">
                            <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                                <Lock className="h-5 w-5"/>
                            </div>
                            Limite atteinte
                        </DialogTitle>
                        <DialogDescription>
                            Votre plan <strong>{plan.name}</strong> ne permet de gérer que {plan.quota} boutique(s).
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4 text-center space-y-4">
                        <p className="text-sm text-slate-500">
                            Passez au plan supérieur pour débloquer plus de boutiques et de fonctionnalités.
                        </p>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)} className="rounded-xl">
                            Annuler
                        </Button>
                        <Button asChild className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white">
                            <Link href="/billing">Voir les offres</Link>
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200">
                    <Plus className="mr-2 h-4 w-4"/> Nouvelle Boutique
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-106.25 rounded-2xl">
                <form onSubmit={handleCreate}>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                                <StoreIcon className="h-5 w-5"/>
                            </div>
                            Créer une boutique
                        </DialogTitle>
                        <DialogDescription>
                            Configurez les informations de base de votre nouvel établissement.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nom de l&#39;établissement</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Ex: Le Barbier de Paris"
                                className="rounded-xl"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description courte</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Dites-en plus sur votre activité..."
                                className="rounded-xl resize-none"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="submit"
                            disabled={loading || !name}
                            className="rounded-xl w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                            Créer la boutique
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}