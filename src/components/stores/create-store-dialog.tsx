"use client";

import {useState, SyntheticEvent, ChangeEvent} from "react";
import {db} from "@/lib/firebase/config";
import {collection, addDoc, serverTimestamp} from "firebase/firestore";
import {FirebaseError} from "firebase/app";
import {useAuth} from "@/context/auth-context";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {PlusCircle} from "lucide-react";

export function CreateStoreDialog() {
    const [name, setName] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const {user} = useAuth();

    const handleCreate = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user || !name) return;

        setLoading(true);
        try {
            await addDoc(collection(db, "stores"), {
                name,
                ownerId: user.uid,
                createdAt: serverTimestamp(),
                slug: name.toLowerCase().trim().replace(/[^\w ]+/g, '').replace(/ +/g, '-'),
            });
            setName("");
            setOpen(false);
        } catch (err: unknown) {
            if (err instanceof FirebaseError) {
                console.error("Firebase Error:", err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                    <PlusCircle className="h-4 w-4"/>
                    Nouvelle boutique
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Créer une nouvelle boutique</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreate} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nom de la boutique</Label>
                        <Input
                            id="name"
                            placeholder="Ex: Ma Super Boulangerie"
                            value={name}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Création..." : "Créer la boutique"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}