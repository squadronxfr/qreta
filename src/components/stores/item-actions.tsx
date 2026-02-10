"use client";

import {useState} from "react";
import {db, storage} from "@/lib/firebase/config";
import {doc, deleteDoc} from "firebase/firestore";
import {ref, deleteObject} from "firebase/storage";
import {Item} from "@/types/store";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {Button} from "@/components/ui/button";
import {MoreHorizontal, Pencil, Trash2, Loader2} from "lucide-react";

interface ItemActionsProps {
    item: Item;
    onEdit: () => void;
}

export function ItemActions({item, onEdit}: ItemActionsProps) {
    const [showDelete, setShowDelete] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            if (item.imageUrl) {
                const imageRef = ref(storage, item.imageUrl);
                await deleteObject(imageRef).catch(() => null);
            }
            await deleteDoc(doc(db, "items", item.id));
        } catch (error) {
            console.error(error);
        } finally {
            setIsDeleting(false);
            setShowDelete(false);
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 rounded-lg bg-white/50 hover:bg-white"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <MoreHorizontal className="h-4 w-4 text-slate-500"/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40 rounded-xl shadow-lg border-slate-100">
                    <DropdownMenuItem
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit();
                        }}
                        className="gap-2 cursor-pointer"
                    >
                        <Pencil className="h-3.5 w-3.5"/> Modifier
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowDelete(true);
                        }}
                        className="gap-2 text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                    >
                        <Trash2 className="h-3.5 w-3.5"/> Supprimer
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
                <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer l&apos;article ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Cette action est définitive.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl cursor-pointer">Annuler</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                handleDelete();
                            }}
                            className="bg-red-600 rounded-xl cursor-pointer"
                            disabled={isDeleting}
                        >
                            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin"/> : "Supprimer"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}