"use client";

import {useState} from "react";
import {UserDoc, SubscriptionPlan, SubscriptionStatus} from "@/types/user";
import {Store} from "@/types/store";
import {updateUserSubscriptionAdmin, toggleUserBlock} from "@/lib/firebase/users";
import {
    MoreHorizontal, User, ExternalLink, ShieldAlert,
    CreditCard, Check, Copy
} from "lucide-react";
import {Spinner} from "@/components/ui/spinner";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {Label} from "@/components/ui/label";
import {toast} from "sonner";

interface AdminUserActionsProps {
    user: UserDoc & { stores: Store[] };
    onUpdate: () => void;
}

export function AdminUserActions({user, onUpdate}: AdminUserActionsProps) {
    const [loading, setLoading] = useState(false);

    const [showProfileDialog, setShowProfileDialog] = useState(false);
    const [showSubDialog, setShowSubDialog] = useState(false);
    const [showBlockDialog, setShowBlockDialog] = useState(false);

    const [newPlan, setNewPlan] = useState<SubscriptionPlan>(user.subscription?.plan || "free");
    const [newStatus, setNewStatus] = useState<SubscriptionStatus>(user.subscription?.status || "active");

    const handleCopyId = () => {
        navigator.clipboard.writeText(user.uid);
        toast.success("ID copié !");
    };

    const handleOpenStripe = () => {
        if (user.subscription?.stripeCustomerId) {
            window.open(`https://dashboard.stripe.com/search?query=${user.subscription.stripeCustomerId}`, "_blank");
        } else {
            toast.error("Aucun ID Stripe associé.");
        }
    };

    const handleUpdateSubscription = async () => {
        setLoading(true);
        try {
            await updateUserSubscriptionAdmin(user.uid, newPlan, newStatus);
            setShowSubDialog(false);
            toast.success("Abonnement mis à jour.");
            onUpdate();
        } catch {
            toast.error("Erreur lors de la mise à jour.");
        } finally {
            setLoading(false);
        }
    };

    const handleToggleBlock = async () => {
        setLoading(true);
        try {
            await toggleUserBlock(user.uid, !!user.isBlocked);
            setShowBlockDialog(false);
            toast.success(user.isBlocked ? "Utilisateur débloqué." : "Utilisateur bloqué.");
            onUpdate();
        } catch {
            toast.error("Erreur lors du blocage.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                        <MoreHorizontal className="h-4 w-4"/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Actions Client</DropdownMenuLabel>
                    <DropdownMenuSeparator/>

                    <DropdownMenuItem onClick={() => setShowProfileDialog(true)} className="cursor-pointer">
                        <User className="mr-2 h-4 w-4"/> Détails profil
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={handleOpenStripe} className="cursor-pointer">
                        <ExternalLink className="mr-2 h-4 w-4"/> Ouvrir dans Stripe
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => setShowSubDialog(true)} className="cursor-pointer">
                        <CreditCard className="mr-2 h-4 w-4"/> Modifier abonnement
                    </DropdownMenuItem>

                    <DropdownMenuSeparator/>

                    <DropdownMenuItem
                        onClick={() => setShowBlockDialog(true)}
                        className={`cursor-pointer focus:bg-red-50 ${user.isBlocked ? "text-green-600 focus:text-green-700" : "text-red-600 focus:text-red-700"}`}
                    >
                        <ShieldAlert className="mr-2 h-4 w-4"/>
                        {user.isBlocked ? "Débloquer" : "Bloquer"}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
                <DialogContent className="rounded-2xl">
                    <DialogHeader>
                        <DialogTitle>Profil de {user.firstname} {user.lastname}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-slate-500">Email</span>
                            <span className="font-medium">{user.email}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">UID</span>
                            <div className="flex items-center gap-2">
                                <code
                                    className="text-xs bg-slate-100 px-2 py-1 rounded">{user.uid.slice(0, 12)}...</code>
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopyId}>
                                    <Copy className="h-3 w-3"/>
                                </Button>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Rôle</span>
                            <Badge variant="outline" className="capitalize">{user.role}</Badge>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Plan</span>
                            <Badge className="capitalize">{user.subscription?.plan || "free"}</Badge>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Statut abonnement</span>
                            <span className="capitalize">{user.subscription?.status || "N/A"}</span>
                        </div>
                        {user.subscription?.stripeCustomerId && (
                            <div className="flex justify-between">
                                <span className="text-slate-500">Stripe ID</span>
                                <code className="text-xs bg-slate-100 px-2 py-1 rounded">
                                    {user.subscription.stripeCustomerId}
                                </code>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={showSubDialog} onOpenChange={setShowSubDialog}>
                <DialogContent className="rounded-2xl">
                    <DialogHeader>
                        <DialogTitle>Modifier l&apos;abonnement</DialogTitle>
                        <DialogDescription>
                            Modifier manuellement le plan de {user.firstname} {user.lastname}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Plan</Label>
                            <Select value={newPlan} onValueChange={(v: SubscriptionPlan) => setNewPlan(v)}>
                                <SelectTrigger className="rounded-xl">
                                    <SelectValue/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="free">Free</SelectItem>
                                    <SelectItem value="starter">Starter</SelectItem>
                                    <SelectItem value="pro">Pro</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Statut</Label>
                            <Select value={newStatus} onValueChange={(v: SubscriptionStatus) => setNewStatus(v)}>
                                <SelectTrigger className="rounded-xl">
                                    <SelectValue/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="trialing">Trialing</SelectItem>
                                    <SelectItem value="past_due">Past Due</SelectItem>
                                    <SelectItem value="canceled">Canceled</SelectItem>
                                    <SelectItem value="unpaid">Unpaid</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowSubDialog(false)}
                                className="rounded-xl cursor-pointer">
                            Annuler
                        </Button>
                        <Button onClick={handleUpdateSubscription} disabled={loading}
                                className="bg-indigo-600 rounded-xl cursor-pointer">
                            {loading ? <Spinner className="h-4 w-4 animate-spin"/> : <Check className="mr-2 h-4 w-4"/>}
                            Appliquer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showBlockDialog} onOpenChange={setShowBlockDialog}>
                <DialogContent className="rounded-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            {user.isBlocked ? "Débloquer" : "Bloquer"} {user.firstname} {user.lastname} ?
                        </DialogTitle>
                        <DialogDescription>
                            {user.isBlocked
                                ? "L'utilisateur pourra de nouveau accéder à son compte."
                                : "L'utilisateur ne pourra plus accéder à son compte."}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowBlockDialog(false)}
                                className="rounded-xl cursor-pointer">
                            Annuler
                        </Button>
                        <Button
                            onClick={handleToggleBlock}
                            disabled={loading}
                            className={`rounded-xl cursor-pointer ${user.isBlocked ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
                        >
                            {loading ? <Spinner
                                className="h-4 w-4 animate-spin"/> : (user.isBlocked ? "Débloquer" : "Bloquer")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}