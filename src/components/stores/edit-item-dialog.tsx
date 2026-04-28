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
import {Badge} from "@/components/ui/badge";
import {ImageIcon, X, Lock, Tag, EyeOff, PackageX} from "lucide-react";
import {Spinner} from "@/components/ui/spinner";
import {toast} from "sonner";
import Image from "next/image";

interface EditItemDialogProps {
    item: Item;
    categories: Category[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const parseDurationValue = (value: unknown): number | null => {
    if (typeof value === "number" && Number.isFinite(value) && value > 0) return value;
    if (typeof value === "string") {
        const parsed = parseInt(value, 10);
        return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
    }
    return null;
};

export function EditItemDialog({item, categories, open, onOpenChange}: EditItemDialogProps) {
    const userData = useAuthStore((s) => s.userData);
    const [loading, setLoading] = useState<boolean>(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const userPlanKey = (userData?.subscription?.plan as PlanKey) || "free";
    const canManageAvailability = userPlanKey !== "free";
    const canManagePromotion = userPlanKey !== "free";

    const initialDuration = parseDurationValue(item.duration);

    const [formData, setFormData] = useState({
        name: item.name,
        description: item.description,
        price: item.price.toString(),
        categoryId: item.categoryId,
        type: item.type,
        isStartingPrice: item.isStartingPrice,
        hasDuration: item.type === "service" && initialDuration !== null,
        duration: initialDuration,
        isActive: item.isActive ?? true,
        isAvailable: item.isAvailable ?? true,
        isOnPromotion: item.isOnPromotion ?? false,
        discountPercentage: item.discountPercentage ?? 10,
    });

    useEffect(() => {
        if (open) {
            const nextDuration = parseDurationValue(item.duration);
            setFormData({
                name: item.name,
                description: item.description,
                price: item.price.toString(),
                categoryId: item.categoryId,
                type: item.type,
                isStartingPrice: item.isStartingPrice,
                hasDuration: item.type === "service" && nextDuration !== null,
                duration: nextDuration,
                isActive: item.isActive ?? true,
                isAvailable: item.isAvailable ?? true,
                isOnPromotion: item.isOnPromotion ?? false,
                discountPercentage: item.discountPercentage ?? 10,
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

    const discountedPrice = (() => {
        const base = parseFloat(formData.price);
        if (!formData.isOnPromotion || !formData.discountPercentage || isNaN(base)) return null;
        return (base * (1 - formData.discountPercentage / 100)).toFixed(2);
    })();

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (formData.type === "service" && formData.hasDuration && formData.duration === null) {
                toast.error("Veuillez renseigner une durée valide en minutes.");
                setLoading(false);
                return;
            }

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
                    duration: formData.type === "service" && formData.hasDuration ? formData.duration : null,
                    isActive: canManageAvailability ? formData.isActive : (item.isActive ?? true),
                    isAvailable: canManageAvailability ? formData.isAvailable : (item.isAvailable ?? true),
                    isOnPromotion: canManagePromotion ? formData.isOnPromotion : (item.isOnPromotion ?? false),
                    discountPercentage: canManagePromotion ? formData.discountPercentage : (item.discountPercentage ?? 0),
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
                                onValueChange={(v: "product" | "service") => setFormData({
                                    ...formData,
                                    type: v,
                                    hasDuration: v === "service" ? formData.hasDuration : false,
                                    duration: v === "service" ? formData.duration : null
                                })}
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
                                Prix &ldquo;à partir de&rdquo;
                            </label>
                        </div>
                    </div>

                    {formData.type === "service" && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
                                <div className="space-y-0.5">
                                    <Label htmlFor="edit-enable-duration">Ajouter une durée</Label>
                                    <p className="text-xs text-slate-500">Optionnel pour les services.</p>
                                </div>
                                <Switch
                                    id="edit-enable-duration"
                                    checked={formData.hasDuration}
                                    onCheckedChange={(checked) => setFormData({
                                        ...formData,
                                        hasDuration: checked,
                                        duration: checked ? formData.duration : null
                                    })}
                                />
                            </div>

                            {formData.hasDuration && (
                                <div className="space-y-2">
                                    <Label htmlFor="edit-duration">Durée en minutes</Label>
                                    <Input
                                        id="edit-duration"
                                        type="number"
                                        min={1}
                                        placeholder="Ex: 30 pour 30 minutes"
                                        value={formData.duration ?? ""}
                                        onChange={(e) => {
                                            const parsed = parseInt(e.target.value, 10);
                                            setFormData({
                                                ...formData,
                                                duration: Number.isFinite(parsed) && parsed > 0 ? parsed : null
                                            });
                                        }}
                                        className="rounded-xl"
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    <div
                        className={`p-4 rounded-xl border transition-colors ${formData.isOnPromotion && canManagePromotion ? "bg-orange-50 border-orange-200" : "bg-slate-50 border-slate-100"}`}>
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                                <Label className="text-base font-medium flex items-center gap-1.5">
                                    <Tag className="h-4 w-4 text-orange-500"/> Promotion
                                </Label>
                                {!canManagePromotion && <Lock className="h-3 w-3 text-slate-400"/>}
                            </div>
                            {canManagePromotion ? (
                                <Switch
                                    checked={formData.isOnPromotion}
                                    onCheckedChange={(checked) => setFormData({...formData, isOnPromotion: checked})}
                                />
                            ) : (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div onClick={(e) => e.preventDefault()}>
                                                <Switch checked={false} disabled className="opacity-50"/>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Fonctionnalité réservée au plan Pro</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}
                        </div>
                        <p className="text-xs text-slate-500 mb-3">
                            Affichez un prix barré et une remise sur la carte produit.
                        </p>
                        {!canManagePromotion && (
                            <div
                                className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-lg px-3 py-2">
                                <Lock className="h-3.5 w-3.5 text-indigo-400 shrink-0"/>
                                <p className="text-xs text-indigo-600 font-medium">Fonctionnalité Pro</p>
                            </div>
                        )}
                        {canManagePromotion && formData.isOnPromotion && (
                            <div className="space-y-3 pt-1">
                                <div className="space-y-1.5">
                                    <Label htmlFor="edit-discount" className="text-sm">Remise (%)</Label>
                                    <div className="flex items-center gap-3">
                                        <Input
                                            id="edit-discount"
                                            type="number"
                                            min={1}
                                            max={99}
                                            value={formData.discountPercentage}
                                            onChange={(e) => {
                                                const parsed = parseInt(e.target.value, 10);
                                                setFormData({
                                                    ...formData,
                                                    discountPercentage: Number.isFinite(parsed) ? Math.min(99, Math.max(1, parsed)) : 10,
                                                });
                                            }}
                                            className="rounded-xl w-24 bg-white"
                                        />
                                        <Badge className="bg-orange-100 text-orange-700 border-none text-sm px-3">
                                            -{formData.discountPercentage}%
                                        </Badge>
                                    </div>
                                </div>
                                {discountedPrice && (
                                    <div className="flex items-center gap-3 pt-1">
                                        <span
                                            className="text-sm text-slate-400 line-through">{parseFloat(formData.price).toFixed(2)} €</span>
                                        <span className="text-base font-bold text-orange-600">{discountedPrice} €</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>


                    <div
                        className={`p-4 rounded-xl border transition-colors ${!formData.isAvailable && canManageAvailability ? "bg-slate-100 border-slate-300" : "bg-slate-50 border-slate-100"}`}>
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                                <Label className="text-base font-medium flex items-center gap-1.5">
                                    <PackageX className="h-4 w-4 text-slate-400"/> Disponible
                                </Label>
                                {!canManageAvailability && <Lock className="h-3 w-3 text-slate-400"/>}
                            </div>
                            {canManageAvailability ? (
                                <Switch
                                    checked={formData.isAvailable}
                                    onCheckedChange={(checked) => setFormData({...formData, isAvailable: checked})}
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
                                            <p>Fonctionnalité réservée au plan Pro</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}
                        </div>
                        <p className="text-xs text-slate-500">
                            Si désactivé, l&apos;article apparaît grisé avec la mention &quot;Indisponible&quot;.
                        </p>
                        {!canManageAvailability && (
                            <div
                                className="mt-3 flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-lg px-3 py-2">
                                <Lock className="h-3.5 w-3.5 text-indigo-400 shrink-0"/>
                                <p className="text-xs text-indigo-600 font-medium">Fonctionnalité Pro</p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>Image</Label>
                        {previewUrl ? (
                            <div className="relative w-full h-48 rounded-2xl overflow-hidden border bg-slate-50 group">
                                <Image src={previewUrl} alt="Preview" fill sizes="(max-width: 768px) 100vw, 448px"
                                       className="object-cover"/>
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
                    <div
                        className={`p-4 rounded-xl border transition-colors ${!formData.isActive && canManageAvailability ? "bg-slate-100 border-slate-300" : "bg-slate-50 border-slate-100"}`}>
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                                <Label className="text-base font-medium flex items-center gap-1.5">
                                    <EyeOff className="h-4 w-4 text-slate-400"/> Visible dans le catalogue
                                </Label>
                                {!canManageAvailability && <Lock className="h-3 w-3 text-slate-400"/>}
                            </div>
                            {canManageAvailability ? (
                                <Switch
                                    checked={formData.isActive}
                                    onCheckedChange={(checked) => setFormData({
                                        ...formData,
                                        isActive: checked,
                                        isAvailable: checked
                                    })}
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
                                            <p>Fonctionnalité réservée au plan Pro</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}
                        </div>
                        <p className="text-xs text-slate-500">
                            Si désactivé, l&apos;article est masqué du catalogue sans être supprimé
                        </p>
                        {!canManageAvailability && (
                            <div
                                className="mt-3 flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-lg px-3 py-2">
                                <Lock className="h-3.5 w-3.5 text-indigo-400 shrink-0"/>
                                <p className="text-xs text-indigo-600 font-medium">Fonctionnalité Pro</p>
                            </div>
                        )}
                    </div>

                    <Button type="submit" className="w-full bg-indigo-600 rounded-xl h-12 font-bold" disabled={loading}>
                        {loading ? <Spinner className="h-4 w-4"/> : "Enregistrer les modifications"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}