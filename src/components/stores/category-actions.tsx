"use client";

import {useState, SyntheticEvent, ChangeEvent} from "react";
import {updateCategory, deleteCategory} from "@/lib/firebase/categories";
import {Category} from "@/types/store";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Spinner} from "@/components/ui/spinner";

interface CategoryActionsProps {
    category: Category;
}

export function CategoryActions({category}: CategoryActionsProps) {
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [loading, setLoading] = useState(false);
    const [newName, setNewName] = useState(category.name);

    const handleUpdate = async (e: SyntheticEvent) => {
        e.preventDefault();
        if (!newName.trim() || newName === category.name) return;

        setLoading(true);
        try {
            await updateCategory(category.id, {name: newName.trim()});
            setOpenEdit(false);
        } catch {
            console.error("Impossible de mettre à jour la categorie")
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            await deleteCategory(category.id);
            setOpenDelete(false);
        } catch {
            // noop
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex gap-2">
            <Dialog open={openEdit} onOpenChange={setOpenEdit}>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="sm"
                            className="h-8 text-xs text-slate-400 hover:text-indigo-600 cursor-pointer">
                        Renommer
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Renommer la catégorie</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUpdate} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-cat-name">Nom</Label>
                            <Input
                                id="edit-cat-name"
                                value={newName}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setNewName(e.target.value)}
                                required
                                className="rounded-xl"
                            />
                        </div>
                        <Button type="submit" className="w-full bg-indigo-600 rounded-xl" disabled={loading}>
                            {loading ? <Spinner className="h-4 w-4"/> : "Mettre à jour"}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs text-red-400 hover:text-red-600 cursor-pointer"
                onClick={() => setOpenDelete(true)}
            >
                Supprimer
            </Button>

            <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
                <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer la catégorie ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Cela supprimera la section &quot;{category.name}&quot; et tous les articles liés.
                            Cette action est définitive.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl cursor-pointer">Annuler</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                void handleDelete();
                            }}
                            className="bg-red-600 hover:bg-red-700 rounded-xl cursor-pointer"
                            disabled={loading}
                        >
                            {loading ? <Spinner className="h-4 w-4"/> : "Supprimer"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
