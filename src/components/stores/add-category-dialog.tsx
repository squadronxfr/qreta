"use client";

import {useState, SyntheticEvent, ChangeEvent} from "react";
import {db} from "@/lib/firebase/config";
import {collection, addDoc} from "firebase/firestore";
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
import {Plus} from "lucide-react";

export function AddCategoryDialog({storeId}: { storeId: string }) {
    const [name, setName] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);

    const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!name.trim()) return;

        setLoading(true);
        try {
            await addDoc(collection(db, "categories"), {
                name: name.trim(),
                storeId,
                order: Date.now(),
                isActive: true,
            });
            setName("");
            setOpen(false);
        } catch (error: unknown) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="flex items-center gap-2">
                    <Plus className="h-4 w-4"/>
                    Nouvelle catégorie
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Ajouter une catégorie</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="cat-name">Nom de la catégorie</Label>
                        <Input
                            id="cat-name"
                            value={name}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                            placeholder="Ex: Forfaits Coupe, Robinetterie, Soins..."
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full bg-indigo-600" disabled={loading}>
                        {loading ? "Chargement..." : "Créer la catégorie"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}