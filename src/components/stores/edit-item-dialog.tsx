"use client";

import React, {useState, useRef, useEffect, ChangeEvent} from "react";
import {updateItem} from "@/lib/firebase/items";
import {Item, Category} from "@/types/store";
import {useAuthStore} from "@/providers/auth-store-provider";
import {PlanKey} from "@/config/subscription";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {Checkbox} from "@/components/ui/checkbox";
import {Switch} from "@/components/ui/switch";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {ImageIcon, X, Lock} from "lucide-react";
import {Spinner} from "@/components/ui/spinner";
import {toast} from "sonner";

interface EditItemDialogProps {
    item: Item;
    categories: Category[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EditItemDialog({item, categories, open, onOpenChange}: EditItemDialogProps) {
    const userData = useAuthStore((s) => s.userData);
    const [loading, setLoading] = useState<boolean>(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const userPlanKey = (userData?.subscription?.plan as PlanKey) || "free";
    const canManageAvailability = userPlanKey !== "free";

    const [formData, setFormData] = useState({
        name: item.name,
        description: item.description,
        price: item.price.toString(),
        categoryId: item.categoryId,
        type: item.type,
        isStartingPrice: item.isStartingPrice,
        duration: item.duration || "",
        isActive: item.isActive ?? true
    });

    useEffect(() => {
        if (open) {
            setFormData({
                name: item.name,
                description: item.description,
                price: item.price.toString(),
                categoryId: item.categoryId,
                type: item.type,
                isStartingPrice: item.isStartingPrice,
                duration: item.duration || "",
                isActive: item.isActive ?? true
            });
            setPreviewUrl(item.imageUrl || null);
            setImageFile(null);
        }
    }, [open, item]);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageFile(file);
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };


    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setLoading(true);

        try {

            await updateItem(
                item.id,
                item.storeId,
                {
                    name: formData.name,
                    description: formData.description,
                    price: parseFloat(formData.price) || 0,
                    categoryId: formData.categoryId,
                    type: formData.type,
                    isStartingPrice: formData.isStartingPrice,
                    duration: formData.duration || undefined,
                    isActive: formData.isActive,
                    imageUrl: item.imageUrl,
                },
                imageFile,
                !previewUrl && !!item.imageUrl
            );

            toast.success("Produit mis à jour");
            onOpenChange(false);
        } catch (error) {
            console.error("Erreur mise à jour:", error);
            toast.error("Erreur lors de la mise à jour");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="font-heading">Modifier l&#39;article</DialogTitle>
                    <DialogDescription>
                        Mise à jour des informations de la prestation ou du produit.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Type</Label>
                            <Select
                                value={formData.type}
                                onValueChange={(v: "product" | "service") => setFormData({...formData, type: v})}
                            >
                                <SelectTrigger className="rounded-xl"><SelectValue/></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="service">Service</SelectItem>
                                    <SelectItem value="product">Produit</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Catégorie</Label>
                            <Select
                                value={formData.categoryId}
                                onValueChange={(v) => setFormData({...formData, categoryId: v})}
                            >
                                <SelectTrigger className="rounded-xl"><SelectValue/></SelectTrigger>
                                <SelectContent>
                                    {categories.map(cat => (
                                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-name">Nom</Label>
                        <Input id="edit-name" value={formData.name}
                               onChange={(e) => setFormData({...formData, name: e.target.value})} required
                               className="rounded-xl"/>
                    </div>

                    <div className="grid grid-cols-2 gap-4 items-end">
                        <div className="space-y-2">
                            <Label htmlFor="edit-price">Prix (€)</Label>
                            <Input id="edit-price" type="number" step="0.01" value={formData.price}
                                   onChange={(e) => setFormData({...formData, price: e.target.value})} required
                                   className="rounded-xl"/>
                        </div>
                        <div className="flex items-center space-x-2 pb-3">
                            <Checkbox
                                id="edit-starting"
                                checked={formData.isStartingPrice}
                                onCheckedChange={(checked) => setFormData({
                                    ...formData,
                                    isStartingPrice: checked === true
                                })}
                            />
                            <label htmlFor="edit-starting" className="text-xs font-medium cursor-pointer">
                                Prix &#34;À partir de&#34;
                            </label>
                        </div>
                    </div>

                    <div
                        className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                        <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                                <Label className="text-base font-medium">En stock / Disponible</Label>
                                {!canManageAvailability && <Lock className="h-3 w-3 text-slate-400"/>}
                            </div>
                            <p className="text-xs text-slate-500">
                                {canManageAvailability
                                    ? "Masquer ce produit du catalogue sans le supprimer."
                                    : "Passez au plan Starter pour gérer les ruptures de stock."}
                            </p>
                        </div>

                        {canManageAvailability ? (
                            <Switch
                                checked={formData.isActive}
                                onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                            />
                        ) : (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div onClick={(e) => e.preventDefault()}>
                                            <Switch checked={true} disabled className="opacity-50"/>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Fonctionnalité réservée aux membres Starter & Pro</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>Image</Label>
                        {previewUrl ? (
                            <div className="relative w-full h-48 rounded-2xl overflow-hidden border bg-slate-50 group">
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover"/>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={removeImage}
                                >
                                    <X className="h-4 w-4"/>
                                </Button>
                            </div>
                        ) : (
                            <div
                                className="w-full h-48 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <ImageIcon className="h-10 w-10 text-slate-300 mb-2"/>
                                <span className="text-xs text-slate-500">Ajouter une image</span>
                            </div>
                        )}
                        <Input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-desc">Description</Label>
                        <Textarea id="edit-desc" value={formData.description}
                                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                                  className="rounded-xl"/>
                    </div>

                    <Button type="submit" className="w-full bg-indigo-600 rounded-xl h-12 font-bold" disabled={loading}>
                        {loading ? <Spinner className="h-4 w-4"/> : "Enregistrer les modifications"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}