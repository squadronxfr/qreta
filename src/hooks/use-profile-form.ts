"use client";

import {useState, useRef, useEffect, ChangeEvent, SyntheticEvent} from "react";
import {useAuthStore} from "@/providers/auth-store-provider";
import {toast} from "sonner";

export const useProfileForm = () => {
    const user = useAuthStore((s) => s.user);
    const userData = useAuthStore((s) => s.userData);
    const updateUserProfile = useAuthStore((s) => s.updateUserProfile);
    const changePassword = useAuthStore((s) => s.changePassword);

    const [isLoading, setIsLoading] = useState(false);
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
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
        setAvatarPreview(user?.photoURL || null);
    }, [userData, user]);

    const getInitials = () => {
        const f = firstname ? firstname[0].toUpperCase() : "";
        const l = lastname ? lastname[0].toUpperCase() : "";
        return (f + l) || "U";
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
    };

    const handleRemoveAvatar = () => {
        setAvatarFile(null);
        setAvatarPreview(null);
    };

    const handleSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsLoading(true);
        try {
            if (newPassword || currentPassword || confirmPassword) {
                if (!currentPassword) {
                    toast.error("Veuillez entrer votre mot de passe actuel.");
                    return;
                }
                if (newPassword.length < 6) {
                    toast.error("Le nouveau mot de passe doit contenir au moins 6 caractères.");
                    return;
                }
                if (newPassword !== confirmPassword) {
                    toast.error("Les mots de passe ne correspondent pas.");
                    return;
                }
                await changePassword(currentPassword, newPassword);
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            }

            await updateUserProfile({
                firstname,
                lastname,
                avatarFile,
                removeAvatar: avatarPreview === null && !!user.photoURL,
            });

            setAvatarFile(null);
            toast.success("Profil mis à jour avec succès.");
        } catch (err: unknown) {
            let message = "Une erreur est survenue.";
            if (err && typeof err === "object" && "code" in err) {
                const code = (err as {code: string}).code;
                if (code === "auth/wrong-password" || code === "auth/invalid-credential") {
                    message = "Le mot de passe actuel est incorrect.";
                } else if (code === "auth/requires-recent-login") {
                    message = "Par sécurité, veuillez vous reconnecter avant de modifier ces informations.";
                }
            } else if (err instanceof Error) {
                message = err.message;
            }
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return {
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
    };
};
