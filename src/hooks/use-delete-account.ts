"use client";

import {useState} from "react";
import {useAuthStore} from "@/providers/auth-store-provider";
import {useBilling} from "@/hooks/use-billing";
import {EmailAuthProvider, reauthenticateWithCredential} from "firebase/auth";
import {useRouter} from "next/navigation";
import {toast} from "sonner";

export const useDeleteAccount = () => {
    const user = useAuthStore((s) => s.user);
    const deleteUserAccount = useAuthStore((s) => s.deleteUserAccount);
    const logout = useAuthStore((s) => s.logout);
    const {isSubscribed, cancelAtPeriodEnd} = useBilling();
    const router = useRouter();

    const [showDialog, setShowDialog] = useState(false);
    const [deletePassword, setDeletePassword] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    const hasActiveSubscription = isSubscribed && !cancelAtPeriodEnd;

    const handleDelete = async () => {
        if (!user || !user.email) return;

        if (hasActiveSubscription) {
            toast.error("Annulez d'abord votre abonnement depuis la page Facturation.");
            setShowDialog(false);
            return;
        }

        if (!deletePassword) {
            toast.error("Veuillez entrer votre mot de passe pour confirmer.");
            return;
        }

        setIsDeleting(true);
        try {
            const credential = EmailAuthProvider.credential(user.email, deletePassword);
            await reauthenticateWithCredential(user, credential);
            await deleteUserAccount();
            await logout();
            toast.success("Votre compte a été supprimé.");
            router.push("/");
        } catch (err: unknown) {
            if (err && typeof err === "object" && "code" in err) {
                const code = (err as { code: string }).code;
                if (code === "auth/wrong-password" || code === "auth/invalid-credential") {
                    toast.error("Mot de passe incorrect.");
                } else {
                    toast.error("Erreur lors de la suppression du compte.");
                }
            } else {
                toast.error("Erreur critique lors de la suppression.");
            }
        } finally {
            setIsDeleting(false);
            setDeletePassword("");
            setShowDialog(false);
        }
    };

    return {
        showDialog,
        setShowDialog,
        deletePassword,
        setDeletePassword,
        isDeleting,
        handleDelete,
        hasActiveSubscription,
    };
};