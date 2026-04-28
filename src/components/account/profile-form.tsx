"use client";

import {SyntheticEvent} from "react";
import {useProfileForm} from "@/hooks/use-profile-form";
import {useDeleteAccount} from "@/hooks/use-delete-account";
import {useBilling} from "@/hooks/use-billing";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Badge} from "@/components/ui/badge";
import {
    Save, User, Lock,
    Camera, Trash2, Sparkles, AlertTriangle, ArrowUpCircle, ExternalLink,
    Mail
} from "lucide-react";
import {Spinner} from "@/components/ui/spinner";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function ProfileForm() {
    const router = useRouter();
    const {handlePortal, isProcessing} = useBilling();

    const {
        user,
        userData,
        isLoading,
        firstname,
        setFirstname,
        lastname,
        setLastname,
        currentPassword,
        setCurrentPassword,
        newPassword,
        setNewPassword,
        confirmPassword,
        setConfirmPassword,
        avatarPreview,
        fileInputRef,
        getInitials,
        handleFileChange,
        handleRemoveAvatar,
        handleSubmit,
    } = useProfileForm();

    const {
        showDialog,
        setShowDialog,
        deletePassword,
        setDeletePassword,
        isDeleting,
        handleDelete,
    } = useDeleteAccount();

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
                                        handleRemoveAvatar();
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
                            Statut :{" "}
                            <span
                                className={`font-medium capitalize ${
                                    userData?.subscription?.cancelAtPeriodEnd
                                        ? "text-orange-600"
                                        : userData?.subscription?.status === "active"
                                            ? "text-green-600"
                                            : "text-orange-600"
                                }`}>
        {userData?.subscription?.cancelAtPeriodEnd
            ? "En cours d'annulation"
            : userData?.subscription?.status === "active"
                ? "Actif"
                : userData?.subscription?.status === "trialing"
                    ? "Essai"
                    : userData?.subscription?.status === "canceled"
                        ? "Annulé"
                        : userData?.subscription?.status || "Gratuit"}
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
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="lg:col-span-8 space-y-6">
                <form onSubmit={(e: SyntheticEvent) => handleSubmit(e)} className="space-y-6">
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
                                    <Label htmlFor="current-password">
                                        Mot de passe actuel <span className="text-red-500">*</span>
                                    </Label>
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
                            className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 shadow-md px-6"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Spinner className="h-4 w-4 animate-spin"/>
                            ) : (
                                <Save className="h-4 w-4"/>
                            )}
                            {isLoading ? "Enregistrement..." : "Enregistrer les modifications"}
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
                            La suppression de votre compte est définitive. Tous vos catalogues et données seront
                            effacées.
                        </p>
                        <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" className="rounded-xl whitespace-nowrap">
                                    Supprimer mon compte
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="rounded-2xl">
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Cette action est irréversible. Toutes vos données seront perdues définitivement.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <div className="py-4">
                                    <Label htmlFor="delete-password" className="text-sm font-medium">
                                        Confirmez avec votre mot de passe
                                    </Label>
                                    <Input
                                        id="delete-password"
                                        type="password"
                                        value={deletePassword}
                                        onChange={(e) => setDeletePassword(e.target.value)}
                                        placeholder="Entrez votre mot de passe"
                                        className="mt-2 rounded-xl"
                                    />
                                </div>
                                <AlertDialogFooter>
                                    <AlertDialogCancel className="rounded-xl cursor-pointer">Annuler</AlertDialogCancel>
                                    <Button
                                        onClick={handleDelete}
                                        disabled={isDeleting}
                                        className="bg-red-600 hover:bg-red-700 rounded-xl cursor-pointer"
                                    >
                                        {isDeleting ? (
                                            <>
                                                <Spinner className="mr-2 h-4 w-4"/>
                                                Suppression...
                                            </>
                                        ) : (
                                            "Confirmer la suppression"
                                        )}
                                    </Button>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}