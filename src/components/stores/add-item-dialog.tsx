"use client";

import {useState, SyntheticEvent, ChangeEvent, useRef} from "react";
import {db, storage} from "@/lib/firebase/config";
import {collection, addDoc, serverTimestamp} from "firebase/firestore";
import {ref, uploadBytes, getDownloadURL} from "firebase/storage";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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
import {Plus, ImageIcon, Loader2} from "lucide-react";
import {Category} from "@/types/store";

interface AddItemDialogProps {
    storeId: string;
    categories: Category[];
}

export function AddItemDialog({storeId, categories}: AddItemDialogProps) {
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        categoryId: "",
        type: "service" as "product" | "service",
        isStartingPrice: false,
        duration: ""
    });

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();
        if (!formData.categoryId) return;

        setLoading(true);
        try {
            let imageUrl = "";

            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
                const storageRef = ref(storage, `stores/${storeId}/items/${fileName}`);

                const snapshot = await uploadBytes(storageRef, imageFile);
                imageUrl = await getDownloadURL(snapshot.ref);
            }

            await addDoc(collection(db, "items"), {
                ...formData,
                price: parseFloat(formData.price) || 0,
                imageUrl,
                storeId,
                isActive: true,
                order: Date.now(),
                createdAt: serverTimestamp()
            });

            setFormData({
                name: "",
                description: "",
                price: "",
                categoryId: "",
                type: "service",
                isStartingPrice: false,
                duration: ""
            });

            setImageFile(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
            setOpen(false);
        } catch (error: unknown) {
            console.error("Erreur lors de l'ajout de l'article:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 rounded-lg">
                    <Plus className="mr-2 h-4 w-4"/> Nouveau Produit / Service
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="font-heading">Nouveau Produit / Service</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-5 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Type</Label>
                            <Select onValueChange={(v: "product" | "service") => setFormData({...formData, type: v})}
                                    defaultValue="service">
                                <SelectTrigger className="rounded-xl"><SelectValue/></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="service">Service</SelectItem>
                                    <SelectItem value="product">Produit</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Catégorie</Label>
                            <Select onValueChange={(v) => setFormData({...formData, categoryId: v})}>
                                <SelectTrigger className="rounded-xl"><SelectValue
                                    placeholder="Choisir..."/></SelectTrigger>
                                <SelectContent>
                                    {categories.map(cat => (
                                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="item-name">Nom</Label>
                        <Input
                            id="item-name"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="rounded-xl"
                            placeholder="Ex: Taille de barbe, Kit entretien..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 items-end">
                        <div className="space-y-2">
                            <Label htmlFor="item-price">Prix (€)</Label>
                            <Input
                                id="item-price"
                                type="number"
                                step="0.01"
                                required
                                value={formData.price}
                                onChange={(e) => setFormData({...formData, price: e.target.value})}
                                className="rounded-xl"
                            />
                        </div>
                        <div className="flex items-center space-x-2 pb-3">
                            <Checkbox
                                id="is-starting-price"
                                checked={formData.isStartingPrice}
                                onCheckedChange={(checked) => setFormData({
                                    ...formData,
                                    isStartingPrice: checked === true
                                })}
                            />
                            <label htmlFor="is-starting-price" className="text-xs font-medium cursor-pointer">Prix &quot;À
                                partir de&quot;</label>
                        </div>
                    </div>

                    {formData.type === "service" && (
                        <div className="space-y-2">
                            <Label htmlFor="item-duration">Dur&eacute;e (Optionnel)</Label>
                            <Input
                                id="item-duration"
                                placeholder="Ex: 30 min, 1h..."
                                value={formData.duration}
                                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                                className="rounded-xl"
                            />
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="item-image">Photo de l&apos;article</Label>
                        <div className="flex items-center gap-4">
                            <Input
                                id="item-image"
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="text-xs rounded-xl"
                            />
                            {imageFile && <ImageIcon className="text-indigo-500 h-5 w-5"/>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="item-desc">Description</Label>
                        <Textarea
                            id="item-desc"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            className="rounded-xl min-h-[100px]"
                            placeholder="Décrivez votre produit ou prestation..."
                        />
                    </div>

                    <Button type="submit" className="w-full bg-indigo-600 rounded-xl h-12 font-bold" disabled={loading}>
                        {loading ? <><Loader2
                            className="mr-2 h-4 w-4 animate-spin"/> Traitement...</> : "Enregistrer l'article"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}