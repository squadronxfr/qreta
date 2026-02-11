"use client";

import {useState, SyntheticEvent, useRef, ChangeEvent, useEffect} from "react";
import {useAuthStore} from "@/providers/auth-store-provider";
import {useBilling} from "@/hooks/use-billing";
import {useRouter} from "next/navigation";
import {
    updateProfile,
    updatePassword,
    EmailAuthProvider,
    reauthenticateWithCredential
} from "firebase/auth";
import {doc, setDoc, updateDoc} from "firebase/firestore";
import {ref, uploadBytes, getDownloadURL} from "firebase/storage";
import {db, storage} from "@/lib/firebase/config";
import {deleteAccount} from "@/lib/firebase/users";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Badge} from "@/components/ui/badge";
import {
    Save, User, Lock, Check,
    Camera, Trash2, Sparkles, AlertTriangle, ArrowUpCircle, ExternalLink,
    Mail
} from "lucide-react";
import {Spinner} from "@/components/ui/spinner";
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

export function ProfileForm() {
    const user = useAuthStore((s) => s.user);
    const userData = useAuthStore((s) => s.userData);
    const logout = useAuthStore((s) => s.logout);
    const {handlePortal, isProcessing} = useBilling();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.photoURL || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (userData) {
            setFirstname(userData.firstname || "");
            setLastname(userData.lastname || "");
        } else if (user?.displayName) {
            const parts = user.displayName.split(" ");
            setFirstname(parts[0] || "");
            setLastname(parts.slice(1).join(" ") || "");
        }
    }, [userData, user]);

    useEffect(() => {
        if (success) {
            toast.success("Profil mis à jour avec succès.");
        }
    }, [success]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const getInitials = () => {
        const f = firstname ? firstname[0].toUpperCase() : "";
        const l = lastname ? lastname[0].toUpperCase() : "";
        return (f + l) || "U";
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleDeleteAccount = async () => {
        try {
            if (!user) return;

            await deleteAccount(user);

            await logout();
            toast.success("Votre compte a été supprimé.");

        } catch (err: unknown) {
            console.error("Erreur suppression:", err);
            if (err && typeof err === "object" && "code" in err && (err as {
                code: string
            }).code === 'auth/requires-recent-login') {
                setError("Par sécurité, veuillez vous déconnecter et vous reconnecter avant de supprimer votre compte.");
            } else {
                setError("Erreur critique lors de la suppression.");
            }
        }
    };

    const handleUpdateProfile = async (e: SyntheticEvent) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            if (newPassword || currentPassword || confirmPassword) {
                if (!currentPassword) {
                    setError("Veuillez entrer votre mot de passe actuel.");
                    setLoading(false);
                    return;
                }
                if (newPassword.length < 6) {
                    setError("Le nouveau mot de passe doit faire 6 caractères minimum.");
                    setLoading(false);
                    return;
                }
                if (newPassword !== confirmPassword) {
                    setError("Les nouveaux mots de passe ne correspondent pas.");
                    setLoading(false);
                    return;
                }

                if (user.email) {
                    const credential = EmailAuthProvider.credential(user.email, currentPassword);
                    await reauthenticateWithCredential(user, credential);
                    await updatePassword(user, newPassword);

                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                }
            }

            let newPhotoURL = user.photoURL;
            if (avatarFile) {
                const storageRef = ref(storage, `users/${user.uid}/avatar_${Date.now()}`);
                const snap = await uploadBytes(storageRef, avatarFile);
                newPhotoURL = await getDownloadURL(snap.ref);
            } else if (avatarPreview === null && user.photoURL) {
                newPhotoURL = "";
            }

            const newDisplayName = `${firstname} ${lastname}`.trim();

            if (newDisplayName !== user.displayName || newPhotoURL !== user.photoURL) {
                await updateProfile(user, {
                    displayName: newDisplayName,
                    photoURL: newPhotoURL || ""
                });

                const userRef = doc(db, "users", user.uid);

                const updatePayload = {
                    firstname,
                    lastname,
                    photoUrl: newPhotoURL || undefined,
                    email: user.email || "",
                    updatedAt: new Date() as unknown as import("firebase/firestore").Timestamp
                };

                if (!userData) {
                    await setDoc(userRef, {
                        uid: user.uid,
                        role: "store_owner",
                        subscription: {plan: "free", status: "active", currentPeriodEnd: new Date()},
                        createdAt: new Date(),
                        ...updatePayload
                    });
                } else {
                    await updateDoc(userRef, updatePayload);
                }
            }

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);

        } catch (err: unknown) {
            let message = "Une erreur est survenue.";
            if (err && typeof err === "object" && "code" in err) {
                const code = (err as { code: string }).code;
                if (code === "auth/wrong-password" || code === "auth/invalid-credential") {
                    message = "Le mot de passe actuel est incorrect.";
                } else if (code === "auth/requires-recent-login") {
                    message = "Par sécurité, veuillez vous reconnecter avant de modifier ces informations.";
                }
            } else if (err instanceof Error) {
                message = err.message;
            }
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            <div className="lg:col-span-4 space-y-6">
                <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                    <CardHeader className="text-center pb-2 pt-8">
                        <div className="mx-auto relative group w-32 h-32 mb-4">
                            <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                                <AvatarImage src={avatarPreview || ""} className="object-cover"/>
                                <AvatarFallback className="text-3xl bg-indigo-100 text-indigo-600 font-bold">
                                    {getInitials()}
                                </AvatarFallback>
                            </Avatar>

                            <div
                                className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Camera className="text-white h-8 w-8"/>
                            </div>

                            {avatarPreview && (
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="absolute bottom-0 right-0 rounded-full h-8 w-8 shadow-sm border-2 border-white"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setAvatarFile(null);
                                        setAvatarPreview(null);
                                    }}
                                >
                                    <Trash2 className="h-4 w-4"/>
                                </Button>
                            )}

                            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange}
                                   className="hidden"/>
                        </div>
                        <CardTitle className="text-xl capitalize">
                            {firstname} {lastname}
                        </CardTitle>
                        <CardDescription className="text-xs">{user?.email}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-6 flex justify-center">
                        <Badge variant="outline" className="capitalize px-3 py-1 bg-slate-50">
                            {userData?.role === "superadmin" ? "Administrateur" : "Commerçant"}
                        </Badge>
                    </CardContent>
                </Card>

                <Card className="border-indigo-100 bg-indigo-50/30 shadow-sm rounded-2xl overflow-hidden">
                    <CardHeader className="pb-3 border-b border-indigo-100/50">
                        <CardTitle className="text-base flex items-center gap-2 text-indigo-950">
                            <Sparkles className="h-4 w-4 text-indigo-600"/> Mon Abonnement
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-500">Plan actuel</span>
                            <Badge className="bg-indigo-600 hover:bg-indigo-700 capitalize px-3">
                                {userData?.subscription?.plan || "Gratuit"}
                            </Badge>
                        </div>

                        <div className="text-xs text-slate-400">
                            Statut : <span
                            className={`font-medium ${userData?.subscription?.status === "active" ? "text-green-600" : "text-orange-600"} capitalize`}>
                                {userData?.subscription?.status === "active" ? "Actif" :
                                    userData?.subscription?.status === "trialing" ? "Essai" :
                                        userData?.subscription?.status === "canceled" ? "Annulé" :
                                            userData?.subscription?.status || "Gratuit"}
                            </span>
                        </div>

                        <div className="pt-2 flex flex-col gap-2">
                            <Button
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-md"
                                onClick={() => handlePortal()}
                                disabled={!!isProcessing}
                            >
                                {isProcessing === "portal_main" ? (
                                    <Spinner className="mr-2 h-4 w-4 animate-spin"/>
                                ) : (
                                    <ExternalLink className="mr-2 h-4 w-4"/>
                                )}
                                Gérer mon abonnement
                            </Button>

                            {userData?.subscription?.plan !== "pro" && (
                                <Button
                                    variant="outline"
                                    className="w-full border-indigo-200 text-indigo-700 hover:bg-indigo-50 rounded-xl"
                                    onClick={() => userData?.subscription?.plan === "starter"
                                        ? handlePortal("price_1Sxtex9mcp2EBniBDOFUCQEr")
                                        : router.push("/billing")
                                    }
                                    disabled={!!isProcessing}
                                >
                                    {isProcessing === "portal_upgrade" ? (
                                        <Spinner className="mr-2 h-4 w-4 animate-spin"/>
                                    ) : (
                                        <ArrowUpCircle className="mr-2 h-4 w-4"/>
                                    )}
                                    {userData?.subscription?.plan === "starter" ? "Passer au plan Pro" : "Voir les offres"}
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

            </div>

            <div className="lg:col-span-8 space-y-6">
                <form onSubmit={handleUpdateProfile} className="space-y-6">

                    <Card className="border-slate-200 shadow-sm rounded-2xl">
                        <CardHeader className="pb-4 border-b border-slate-100">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <User className="h-5 w-5 text-indigo-600"/> Informations Personnelles
                            </CardTitle>
                            <CardDescription>Mettez à jour votre identité.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="firstname">Prénom</Label>
                                    <Input
                                        id="firstname"
                                        value={firstname}
                                        onChange={(e) => setFirstname(e.target.value)}
                                        className="rounded-xl"
                                        placeholder="Ex: Jean"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastname">Nom</Label>
                                    <Input
                                        id="lastname"
                                        value={lastname}
                                        onChange={(e) => setLastname(e.target.value)}
                                        className="rounded-xl"
                                        placeholder="Ex: Dupont"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <div className="relative">
                                        <Mail
                                            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"/>
                                        <Input
                                            id="email"
                                            value={user?.email || ""}
                                            disabled
                                            className="pl-9 bg-slate-50 text-slate-500 rounded-xl cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {user?.providerData?.[0]?.providerId === "password" && (
                        <Card className="border-slate-200 shadow-sm rounded-2xl">
                            <CardHeader className="pb-4 border-b border-slate-100">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Lock className="h-5 w-5 text-indigo-600"/> Sécurité
                                </CardTitle>
                                <CardDescription>Modifiez votre mot de passe.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-6">

                                <div className="space-y-2">
                                    <Label htmlFor="current-password">Mot de passe actuel <span
                                        className="text-red-500">*</span></Label>
                                    <Input
                                        id="current-password"
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="rounded-xl"
                                        placeholder="Requis pour valider les changements"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="new-password">Nouveau mot de passe</Label>
                                        <Input
                                            id="new-password"
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="rounded-xl"
                                            placeholder="6 caractères minimum"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirm-password">Confirmer le nouveau</Label>
                                        <Input
                                            id="confirm-password"
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="rounded-xl"
                                            placeholder="Répétez le nouveau"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            className={`rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100 shadow-md px-6 ${
                                success
                                    ? "bg-green-600 hover:bg-green-700 shadow-green-200 text-white"
                                    : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 text-white"
                            }`}
                            disabled={loading}
                        >
                            {loading ? (
                                <Spinner className="h-4 w-4 animate-spin"/>
                            ) : success ? (
                                <Check className="h-4 w-4"/>
                            ) : (
                                <Save className="h-4 w-4"/>
                            )}
                            {loading ? "Enregistrement..." : success ? "Enregistré !" : "Enregistrer les modifications"}
                        </Button>
                    </div>
                </form>

                <Card className="border-red-100 bg-red-50/30 shadow-none rounded-2xl mt-8">
                    <CardHeader>
                        <CardTitle className="text-red-600 flex items-center gap-2 text-base">
                            <AlertTriangle className="h-5 w-5"/> Zone de danger
                        </CardTitle>
                        <CardDescription>Actions irréversibles.</CardDescription>
                    </CardHeader>
                    <CardContent
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <p className="text-sm text-slate-600">
                            La suppression de votre compte est définitive. Toutes vos boutiques et données seront
                            effacées.
                        </p>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" className="rounded-xl whitespace-nowrap">Supprimer mon
                                    compte</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="rounded-2xl">
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Cette action est irréversible. Toutes vos données seront perdues définitivement.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel className="rounded-xl cursor-pointer">Annuler</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDeleteAccount}
                                        className="bg-red-600 hover:bg-red-700 rounded-xl cursor-pointer"
                                    >
                                        Confirmer la suppression
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </CardContent>
                </Card>
            </div>

        </div>
    );
}