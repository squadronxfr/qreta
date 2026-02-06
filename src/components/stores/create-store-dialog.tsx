"use client";

import {useState} from "react";
import {useAuth} from "@/context/auth-context"; // On récupère l'utilisateur connecté
import {db} from "@/lib/firebase/config";
import {collection, addDoc, query, where, getDocs} from "firebase/firestore";
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
import {Loader2, Plus, Store as StoreIcon} from "lucide-react";
import {useRouter} from "next/navigation";
import {FirebaseError} from "firebase/app";

export function CreateStoreDialog() {
    const {user} = useAuth();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState<string | null>(null);

    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .trim()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-');
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        setError(null);

        try {
            const baseSlug = generateSlug(name);
            let uniqueSlug = baseSlug;
            let counter = 1;

            while (true) {
                const q = query(collection(db, "stores"), where("slug", "==", uniqueSlug));
                const snapshot = await getDocs(q);
                if (snapshot.empty) break;
                uniqueSlug = `${baseSlug}-${counter}`;
                counter++;
            }

            const docRef = await addDoc(collection(db, "stores"), {
                name: name,
                description: description,
                slug: uniqueSlug,
                userId: user.uid,
                isActive: false,
                createdAt: new Date(),
                updatedAt: new Date(),
                logoUrl: "",
                bannerUrl: "",
                phone: "",
                instagram: "",
                address: "",
                website: "",
                primaryColor: "#4F46E5"
            });

            setOpen(false);
            setName("");
            setDescription("");

            router.push(`/stores/${docRef.id}`);

        } catch (err: unknown) {
            console.error("Erreur création boutique:", err);
            if (err instanceof FirebaseError) {
                if (err.code === 'permission-denied') {
                    setError("Permission refusée. Vérifiez que vous êtes bien connecté.");
                } else {
                    setError(err.message);
                }
            } else {
                setError("Une erreur inconnue est survenue.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200">
                    <Plus className="mr-2 h-4 w-4"/> Nouvelle Boutique
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-2xl">
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
                            <Label htmlFor="name">Nom de l'établissement</Label>
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

                        {error && (
                            <div className="text-sm text-red-500 bg-red-50 p-2 rounded-lg border border-red-100">
                                {error}
                            </div>
                        )}

                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading || !name} className="rounded-xl w-full sm:w-auto">
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                            Créer la boutique
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}