"use client";

import {useState} from "react";
import {UserDoc, SubscriptionPlan, SubscriptionStatus} from "@/types/user";
import {db} from "@/lib/firebase/config";
import {doc, updateDoc} from "firebase/firestore";
import {
    MoreHorizontal, User, ExternalLink, ShieldAlert,
    CreditCard, Check, Loader2, Copy
} from "lucide-react";
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

interface AdminUserActionsProps {
    user: UserDoc;
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
        alert("ID copié !");
    };

    const handleOpenStripe = () => {
        if (user.subscription?.stripeCustomerId) {
            window.open(`https://dashboard.stripe.com/search?query=${user.subscription.stripeCustomerId}`, '_blank');
        } else {
            alert("Aucun ID Stripe associé.");
        }
    };

    const handleUpdateSubscription = async () => {
        setLoading(true);
        try {
            const ref = doc(db, "users", user.uid);
            await updateDoc(ref, {
                "subscription.plan": newPlan,
                "subscription.status": newStatus,
                updatedAt: new Date()
            });
            setShowSubDialog(false);
            onUpdate();
        } catch (error) {
            console.error("Erreur update sub:", error);
            alert("Erreur lors de la mise à jour");
        } finally {
            setLoading(false);
        }
    };

    const handleToggleBlock = async () => {
        setLoading(true);
        try {
            const ref = doc(db, "users", user.uid);
            await updateDoc(ref, {
                isBlocked: !user.isBlocked,
                updatedAt: new Date()
            });
            setShowBlockDialog(false);
            onUpdate();
        } catch (error) {
            console.error("Erreur block:", error);
            alert("Erreur lors du blocage");
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
                        {user.isBlocked ? (
                            <><Check className="mr-2 h-4 w-4"/> Débloquer l&apos;accès</>
                        ) : (
                            <><ShieldAlert className="mr-2 h-4 w-4"/> Bloquer l&apos;accès</>
                        )}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Détails du client</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border">
                            <div
                                className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg">
                                {(user.firstname?.[0] || user.email[0]).toUpperCase()}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 capitalize">{user.firstname} {user.lastname}</h4>
                                <p className="text-sm text-slate-500">{user.email}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label className="text-xs text-slate-400 uppercase">Rôle</Label>
                                <div className="font-medium capitalize">{user.role}</div>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs text-slate-400 uppercase">Statut</Label>
                                <div>
                                    {user.isBlocked
                                        ? <Badge variant="destructive">Bloqué</Badge>
                                        : <Badge variant="outline"
                                                 className="text-green-600 bg-green-50 border-green-200">Actif</Badge>
                                    }
                                </div>
                            </div>
                            <div className="space-y-1 col-span-2">
                                <Label className="text-xs text-slate-400 uppercase">ID Utilisateur</Label>
                                <div className="flex items-center gap-2">
                                    <code className="bg-slate-100 px-2 py-1 rounded text-xs font-mono flex-1 truncate">
                                        {user.uid}
                                    </code>
                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopyId}>
                                        <Copy className="h-3 w-3"/>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={showSubDialog} onOpenChange={setShowSubDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Modifier l&apos;abonnement</DialogTitle>
                        <DialogDescription>
                            Modifie directement la base de donn&eacute;es.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Plan</Label>
                            <Select value={newPlan} onValueChange={(v: SubscriptionPlan) => setNewPlan(v)}>
                                <SelectTrigger>
                                    <SelectValue/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="free">Gratuit (Free)</SelectItem>
                                    <SelectItem value="starter">Starter</SelectItem>
                                    <SelectItem value="pro">Pro</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Statut</Label>
                            <Select value={newStatus} onValueChange={(v: SubscriptionStatus) => setNewStatus(v)}>
                                <SelectTrigger>
                                    <SelectValue/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Actif</SelectItem>
                                    <SelectItem value="trialing">Essai (Trial)</SelectItem>
                                    <SelectItem value="past_due">Impayé (Past Due)</SelectItem>
                                    <SelectItem value="canceled">Annulé</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowSubDialog(false)}>Annuler</Button>
                        <Button onClick={handleUpdateSubscription} disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                            Sauvegarder
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showBlockDialog} onOpenChange={setShowBlockDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className={user.isBlocked ? "text-green-600" : "text-red-600"}>
                            {user.isBlocked ? "Débloquer" : "Bloquer l'accès"}
                        </DialogTitle>
                        <DialogDescription>
                            {user.isBlocked
                                ? "L'utilisateur pourra de nouveau se connecter."
                                : "L'utilisateur sera déconnecté."
                            }
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowBlockDialog(false)}>Annuler</Button>
                        <Button
                            variant={user.isBlocked ? "default" : "destructive"}
                            onClick={handleToggleBlock}
                            disabled={loading}
                        >
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                            {user.isBlocked ? "Réactiver" : "Bloquer"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}