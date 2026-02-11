"use client";

import {useState, SyntheticEvent, ChangeEvent, useRef, useEffect, MouseEvent} from "react";
import {useRouter} from "next/navigation";
import {db, storage} from "@/lib/firebase/config";
import {doc, updateDoc, deleteDoc} from "firebase/firestore";
import {ref, uploadBytes, getDownloadURL, deleteObject} from "firebase/storage";
import {Store} from "@/types/store";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {Switch} from "@/components/ui/switch";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Separator} from "@/components/ui/separator";
import {generateSlug, checkSlugAvailability} from "@/lib/utils/slug";
import {
    Save, Upload, Image as ImageIcon, Download,
    QrCode, Check, Copy, X, ExternalLink, MapPin,
    Phone, Instagram, Globe, Link as LinkIcon, AlertTriangle, Trash2
} from "lucide-react";
import {Spinner} from "@/components/ui/spinner";
import QRCode from "react-qr-code";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {toast} from "sonner";

interface StoreSettingsFormProps {
    store: Store;
}

export function StoreSettingsForm({store}: StoreSettingsFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const [domain, setDomain] = useState<string>("");

    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    const [formData, setFormData] = useState<Store>({
        ...store,
        description: store.description ?? "",
        phone: store.phone ?? "",
        instagram: store.instagram ?? "",
        address: store.address ?? "",
        website: store.website ?? "",
        primaryColor: store.primaryColor ?? "#4F46E5",
        logoUrl: store.logoUrl ?? undefined,
        bannerUrl: store.bannerUrl ?? undefined
    });

    useEffect(() => {
        if (typeof window !== "undefined") {
            setDomain(window.location.host);
        }
    }, []);

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            ...store,
            description: store.description ?? "",
            phone: store.phone ?? "",
            instagram: store.instagram ?? "",
            address: store.address ?? "",
            website: store.website ?? "",
            primaryColor: store.primaryColor ?? "#4F46E5",
            logoUrl: store.logoUrl ?? undefined,
            bannerUrl: store.bannerUrl ?? undefined
        }));
        if (store.logoUrl) setLogoPreview(store.logoUrl);
        if (store.bannerUrl) setBannerPreview(store.bannerUrl);
    }, [store]);

    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | undefined>(store.logoUrl);
    const [bannerPreview, setBannerPreview] = useState<string | undefined>(store.bannerUrl);
    const [shouldRemoveLogo, setShouldRemoveLogo] = useState(false);
    const [shouldRemoveBanner, setShouldRemoveBanner] = useState(false);
    const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

    const logoInputRef = useRef<HTMLInputElement>(null);
    const bannerInputRef = useRef<HTMLInputElement>(null);
    const qrRef = useRef<HTMLDivElement>(null);


    const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;

        setFormData(prev => ({...prev, name: newName}));
        setSuccess(false);

        if (!isSlugManuallyEdited) {
            if (debounceRef.current) clearTimeout(debounceRef.current);

            debounceRef.current = setTimeout(async () => {
                const baseSlug = generateSlug(newName);
                if (baseSlug) {
                    const finalSlug = await checkSlugAvailability(baseSlug, store.id);
                    setFormData(prev => ({...prev, slug: finalSlug}));
                }
            }, 500);
        }
    };

    const handleSlugChange = (e: ChangeEvent<HTMLInputElement>) => {
        setIsSlugManuallyEdited(true);
        setFormData(prev => ({...prev, slug: generateSlug(e.target.value)}));
    };


    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {id, value} = e.target;
        if (id === "name") return;
        setFormData((prev) => ({...prev, [id]: value}));
        setSuccess(false);
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>, type: 'logo' | 'banner') => {
        setSuccess(false);
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (type === 'logo') {
                setLogoFile(file);
                setLogoPreview(URL.createObjectURL(file));
                setShouldRemoveLogo(false);
            } else {
                setBannerFile(file);
                setBannerPreview(URL.createObjectURL(file));
                setShouldRemoveBanner(false);
            }
        }
    };

    const removeLogo = (e: MouseEvent) => {
        e.stopPropagation();
        setLogoFile(null);
        setLogoPreview(undefined);
        setShouldRemoveLogo(true);
        if (logoInputRef.current) logoInputRef.current.value = "";
        setSuccess(false);
    };

    const removeBanner = (e: MouseEvent) => {
        e.stopPropagation();
        setBannerFile(null);
        setBannerPreview(undefined);
        setShouldRemoveBanner(true);
        if (bannerInputRef.current) bannerInputRef.current.value = "";
        setSuccess(false);
    };

    const [copied, setCopied] = useState(false);

    const catalogUrl = typeof window !== "undefined" ? `${window.location.origin}/${store.slug}` : "";

    const handleCopyLink = () => {
        navigator.clipboard.writeText(catalogUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const downloadQRCode = () => {
        const svg = document.getElementById("store-qrcode");
        if (!svg) return;
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);
            const pngFile = canvas.toDataURL("image/png");
            const downloadLink = document.createElement("a");
            downloadLink.download = `${store.slug}-qrcode.png`;
            downloadLink.href = pngFile;
            downloadLink.click();
        };
        img.src = "data:image/svg+xml;base64," + btoa(svgData);
    };

    const handleDeleteStore = async () => {
        setLoading(true);
        try {
            if (store.logoUrl) await deleteObject(ref(storage, store.logoUrl)).catch(() => null);
            if (store.bannerUrl) await deleteObject(ref(storage, store.bannerUrl)).catch(() => null);

            await deleteDoc(doc(db, "stores", store.id));
            router.push("/stores");
            router.refresh();
        } catch (error) {
            console.error("Error deleting store:", error);
            setLoading(false);
        }
    };

    const handleSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);

        try {
            let logoUrl = store.logoUrl;
            let bannerUrl = store.bannerUrl;

            if (shouldRemoveLogo) {
                if (store.logoUrl) await deleteObject(ref(storage, store.logoUrl)).catch(() => null);
                logoUrl = undefined;
            } else if (logoFile) {
                const logoRef = ref(storage, `stores/${store.id}/branding/logo_${Date.now()}`);
                const snap = await uploadBytes(logoRef, logoFile);
                const newUrl = await getDownloadURL(snap.ref);
                logoUrl = newUrl;
                if (store.logoUrl && store.logoUrl !== newUrl) {
                    await deleteObject(ref(storage, store.logoUrl)).catch(() => null);
                }
            }

            if (shouldRemoveBanner) {
                if (store.bannerUrl) await deleteObject(ref(storage, store.bannerUrl)).catch(() => null);
                bannerUrl = undefined;
            } else if (bannerFile) {
                const bannerRef = ref(storage, `stores/${store.id}/branding/banner_${Date.now()}`);
                const snap = await uploadBytes(bannerRef, bannerFile);
                const newUrl = await getDownloadURL(snap.ref);
                bannerUrl = newUrl;
                if (store.bannerUrl && store.bannerUrl !== newUrl) {
                    await deleteObject(ref(storage, store.bannerUrl)).catch(() => null);
                }
            }

            const storeRef = doc(db, "stores", store.id);

            const payload = {
                name: formData.name,
                slug: formData.slug,
                isActive: formData.isActive,
                description: formData.description || "",
                phone: formData.phone || "",
                instagram: formData.instagram || "",
                address: formData.address || "",
                website: formData.website || "",
                primaryColor: formData.primaryColor || "#4F46E5",
                logoUrl: logoUrl || "",
                bannerUrl: bannerUrl || "",
                updatedAt: new Date(),
            };

            await updateDoc(storeRef, payload);

            setLogoFile(null);
            setBannerFile(null);
            setShouldRemoveLogo(false);
            setShouldRemoveBanner(false);
            toast.success("Les paramètres de la boutique ont été mis à jour avec succès !");
            setSuccess(true);

            setTimeout(() => setSuccess(false), 2000);

        } catch (error: unknown) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* --- BLOC 1 : FORMULAIRES PRINCIPAUX (Reste à gauche sur Desktop, Premier sur Mobile) --- */}
                <div className="lg:col-span-8 space-y-8">
                    <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                        {/* ... Contenu Identité & Visibilité (inchangé) ... */}
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg font-heading">Identité & Visibilité</CardTitle>
                                    <CardDescription>Gérez les informations principales de votre
                                        boutique.</CardDescription>
                                </div>
                                <div
                                    className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
                                    <Switch
                                        id="store-active"
                                        checked={formData.isActive}
                                        onCheckedChange={(checked) => {
                                            setFormData({...formData, isActive: checked});
                                            setSuccess(false);
                                        }}
                                    />
                                    <Label className="text-sm cursor-pointer font-medium" htmlFor="store-active">
                                        {formData.isActive ? "Catalogue Public" : "Catalogue Privé"}
                                    </Label>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nom de l&#39;établissement</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={handleNameChange}
                                        className="rounded-xl"
                                        placeholder="Ex: Le Barbier de Paris"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="slug" className="flex justify-between items-center">
                                        Lien personnalisé
                                        <div
                                            className="flex items-center gap-1 text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                                            <AlertTriangle className="h-3 w-3"/>
                                            Modifier l&#39;URL invalide vos anciens QR Codes
                                        </div>
                                    </Label>
                                    <div className="flex items-center">
                                    <span
                                        className="bg-slate-50 border border-r-0 border-slate-200 rounded-l-xl px-3 py-2 text-sm text-slate-500 font-medium h-10 flex items-center select-none">
                                        {domain}/
                                    </span>
                                        <Input
                                            id="slug"
                                            value={formData.slug}
                                            onChange={handleSlugChange}
                                            className="rounded-l-none rounded-r-xl bg-slate-50 focus:bg-white text-slate-900 font-medium"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description (Bio)</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="rounded-xl min-h-25 resize-none"
                                    placeholder="Dites-en plus sur votre activité..."
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                        {/* ... Contenu Visuel & Branding (inchangé) ... */}
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                            <CardTitle className="text-lg font-heading">Visuel & Branding</CardTitle>
                            <CardDescription>Personnalisez l&#39;apparence de votre catalogue.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8 pt-6">
                            <div className="grid grid-cols-1 gap-8">
                                <div className="flex flex-col sm:flex-row gap-6 items-start">
                                    <div className="space-y-2 flex-1 w-full">
                                        <Label className="flex items-center gap-2">Logo <span
                                            className="text-xs text-slate-400 font-normal">(Carré recommandé)</span></Label>
                                        <div
                                            className={`relative h-40 w-40 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center bg-slate-50 overflow-hidden cursor-pointer hover:bg-slate-100 hover:border-indigo-300 transition-all group ${!logoPreview ? 'border-slate-300' : 'border-indigo-100'}`}
                                            onClick={() => logoInputRef.current?.click()}
                                        >
                                            {logoPreview ? (
                                                <>
                                                    <img src={logoPreview} alt="Logo"
                                                         className="w-full h-full object-cover"/>
                                                    <div
                                                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <p className="text-white font-medium text-xs flex items-center gap-1">
                                                            <Upload className="h-3 w-3"/> Changer</p>
                                                    </div>
                                                    <Button type="button" variant="destructive" size="icon"
                                                            className="absolute top-2 right-2 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                                            onClick={removeLogo}><X className="h-3.5 w-3.5"/></Button>
                                                </>
                                            ) : (
                                                <><ImageIcon className="h-8 w-8 text-slate-300 mb-2"/><span
                                                    className="text-xs text-slate-500 font-medium">Ajouter un logo</span></>
                                            )}
                                            <input ref={logoInputRef} type="file" accept="image/*"
                                                   onChange={(e) => handleFileChange(e, 'logo')} className="hidden"/>
                                        </div>
                                    </div>
                                </div>
                                <Separator/>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">Bannière <span
                                        className="text-xs text-slate-400 font-normal">(Paysage recommandé)</span></Label>
                                    <div
                                        className={`relative h-48 w-full rounded-2xl border-2 border-dashed flex flex-col items-center justify-center bg-slate-50 overflow-hidden cursor-pointer hover:bg-slate-100 hover:border-indigo-300 transition-all group ${!bannerPreview ? 'border-slate-300' : 'border-indigo-100'}`}
                                        onClick={() => bannerInputRef.current?.click()}
                                    >
                                        {bannerPreview ? (
                                            <>
                                                <img src={bannerPreview} alt="Banner"
                                                     className="w-full h-full object-cover"/>
                                                <div
                                                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <p className="text-white font-medium text-xs flex items-center gap-1">
                                                        <Upload className="h-3 w-3"/> Changer la bannière</p>
                                                </div>
                                                <Button type="button" variant="destructive" size="icon"
                                                        className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                                        onClick={removeBanner}><X className="h-4 w-4"/></Button>
                                            </>
                                        ) : (
                                            <><ImageIcon className="h-10 w-10 text-slate-300 mb-2"/><span
                                                className="text-xs text-slate-500 font-medium">Ajouter une bannière</span></>
                                        )}
                                        <input ref={bannerInputRef} type="file" accept="image/*"
                                               onChange={(e) => handleFileChange(e, 'banner')} className="hidden"/>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                        {/* ... Contenu Coordonnées (inchangé) ... */}
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                            <CardTitle className="text-lg font-heading">Coordonnées</CardTitle>
                            <CardDescription>Aidez vos clients à vous contacter.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="flex items-center gap-2"><Phone
                                        className="h-3.5 w-3.5"/> Téléphone</Label>
                                    <Input id="phone" value={formData.phone} onChange={handleInputChange}
                                           className="rounded-xl" placeholder="06 12 34 56 78"/>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="instagram" className="flex items-center gap-2"><Instagram
                                        className="h-3.5 w-3.5"/> Instagram</Label>
                                    <Input id="instagram" value={formData.instagram} onChange={handleInputChange}
                                           placeholder="@votrecommerce" className="rounded-xl"/>
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <Label htmlFor="address" className="flex items-center gap-2"><MapPin
                                        className="h-3.5 w-3.5"/> Adresse</Label>
                                    <Input id="address" value={formData.address} onChange={handleInputChange}
                                           className="rounded-xl" placeholder="10 rue de la Paix, 75000 Paris"/>
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <Label htmlFor="website" className="flex items-center gap-2"><Globe
                                        className="h-3.5 w-3.5"/> Site Web</Label>
                                    <Input id="website" value={formData.website} onChange={handleInputChange}
                                           placeholder="https://www.monsite.com" className="rounded-xl"/>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end pt-4">
                        <Button
                            type="submit"
                            disabled={loading || success}
                            className={`rounded-xl px-8 h-12 text-base font-bold shadow-md transition-all w-full md:w-auto ${
                                success
                                    ? "bg-green-600 hover:bg-green-700 shadow-green-200 text-white"
                                    : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 text-white"
                            }`}
                        >
                            {loading ? (
                                <><Spinner className="mr-2 h-4 w-4"/> Sauvegarde en cours...</>
                            ) : success ? (
                                <><Check className="mr-2 h-4 w-4"/> Enregistré avec succès !</>
                            ) : (
                                <><Save className="mr-2 h-4 w-4"/> Enregistrer les modifications</>
                            )}
                        </Button>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-indigo-100 bg-indigo-50/50 shadow-sm rounded-2xl sticky top-24">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-heading text-indigo-950 flex items-center gap-2">
                                <QrCode className="h-5 w-5 text-indigo-600"/> Accès Rapide
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div
                                className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm flex justify-center"
                                ref={qrRef}>
                                <QRCode
                                    id="store-qrcode"
                                    value={catalogUrl}
                                    size={200}
                                    style={{height: "auto", maxWidth: "100%", width: "100%"}}
                                    viewBox={`0 0 256 256`}
                                />
                            </div>

                            <div className="space-y-3">
                                <Button variant="outline"
                                        className="w-full rounded-xl bg-white border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800"
                                        onClick={downloadQRCode}>
                                    <Download className="mr-2 h-4 w-4"/> Télécharger PNG
                                </Button>

                                <Button
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-indigo-200 shadow-md"
                                    asChild>
                                    <a href={catalogUrl} target="_blank" rel="noreferrer">
                                        <ExternalLink className="mr-2 h-4 w-4"/> Voir le catalogue live
                                    </a>
                                </Button>
                            </div>

                            <div className="pt-2">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lien public</span>
                                    {copied &&
                                        <span className="text-[10px] text-green-600 font-medium animate-in fade-in">Copié !</span>}
                                </div>

                                <div
                                    className="flex items-center gap-2 p-1 bg-white border border-slate-200 rounded-xl shadow-sm group hover:border-indigo-300 transition-colors">
                                    <div className="flex-1 px-3 overflow-hidden flex items-center gap-1">
                                        <LinkIcon className="h-3 w-3 text-slate-400 shrink-0"/>
                                        <p className="text-xs font-mono text-slate-600 truncate select-all">
                                            {domain}/{store.slug}
                                        </p>
                                    </div>
                                    <Button
                                        type="button"
                                        size="icon"
                                        variant="ghost"
                                        className="h-8 w-8 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                                        onClick={handleCopyLink}
                                    >
                                        {copied ? <Check className="h-4 w-4"/> : <Copy className="h-4 w-4"/>}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* --- BLOC 3 : DANGER ZONE (Revient à gauche sur Desktop, Dernier sur Mobile) --- */}
                {/* J'ai sorti ce bloc du premier div lg:col-span-8 pour le mettre ici à la fin */}
                <div className="lg:col-span-8">
                    <Card className="border-red-100 bg-red-50/30 shadow-sm rounded-2xl mb-10">
                        {/* ... Contenu Danger Zone (inchangé) ... */}
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg font-heading text-red-700 flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5"/> Zone de danger
                            </CardTitle>
                            <CardDescription className="text-red-600/80">
                                La suppression de la boutique est définitive et irréversible.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <p className="text-sm text-red-700">
                                    Toutes les données (produits, catégories, images) seront perdues.
                                </p>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" className="w-full sm:w-auto rounded-xl">
                                            <Trash2 className="mr-2 h-4 w-4"/>
                                            Supprimer la boutique
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Cette action est irréversible. Elle supprimera définitivement votre
                                                boutique <strong>{store.name}</strong> et toutes les données associées.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel className="rounded-xl">Annuler</AlertDialogCancel>
                                            <AlertDialogAction onClick={handleDeleteStore}
                                                               className="bg-red-600 hover:bg-red-700 rounded-xl"
                                                               disabled={loading}>
                                                {loading ? (
                                                    <><Spinner className="mr-2 h-4 w-4"/> Suppression...</>
                                                ) : (
                                                    "Oui, supprimer"
                                                )}
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </form>
        </div>
    );
}