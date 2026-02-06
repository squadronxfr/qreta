"use client";

import {useEffect, useState, useCallback} from "react";
import {useAuth} from "@/context/auth-context";
import {useRouter} from "next/navigation";
import {db} from "@/lib/firebase/config";
import {collection, getDocs, query, orderBy} from "firebase/firestore";
import {UserDoc} from "@/types/user";
import {Store} from "@/types/store";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {
    Search, Shield, Store as StoreIcon, ArrowRight, AlertTriangle
} from "lucide-react";
import Link from "next/link";
import {AdminUserActions} from "@/components/admin/admin-user-actions";

interface AdminUserView extends UserDoc {
    stores: Store[];
}

export default function SuperAdminPage() {
    const {userData, loading} = useAuth();
    const router = useRouter();
    const [users, setUsers] = useState<AdminUserView[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [search, setSearch] = useState("");
    const [error, setError] = useState<string | null>(null);

    const refreshUsers = useCallback(async () => {
        if (!userData || userData.role !== 'superadmin') return;

        try {
            const usersSnap = await getDocs(query(collection(db, "users"), orderBy("createdAt", "desc")));
            const usersList = usersSnap.docs.map(d => d.data() as unknown as UserDoc);

            const storesSnap = await getDocs(collection(db, "stores"));
            const storesList = storesSnap.docs.map(d => ({id: d.id, ...d.data()} as Store));

            const fullData = usersList.map(user => ({
                ...user,
                stores: storesList.filter(store => store.userId === user.uid)
            }));

            setUsers(fullData);
        } catch (err: any) {
            console.error("Erreur refresh admin:", err);
            setError(err.message);
        } finally {
            setIsLoadingData(false);
        }
    }, [userData]);

    useEffect(() => {
        if (!loading && userData) {
            refreshUsers();
        }
    }, [userData, loading, refreshUsers]);


    if (loading || isLoadingData) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <p className="text-sm text-slate-500 font-medium">Chargement du panneau Admin...</p>
            </div>
        </div>
    );

    if (userData?.role !== 'superadmin') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
                <div className="bg-red-100 p-4 rounded-full mb-4">
                    <Shield className="h-10 w-10 text-red-600"/>
                </div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Accès Refusé</h1>
                <Button onClick={() => router.push('/stores')}>Retourner au tableau de bord</Button>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-center">
                <div className="inline-block p-4 bg-red-50 rounded-xl border border-red-200 mb-4">
                    <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2"/>
                    <h3 className="font-bold text-red-900">Erreur Technique</h3>
                    <p className="text-red-700 text-sm mt-1">{error}</p>
                </div>
            </div>
        );
    }

    const filteredUsers = users.filter(u =>
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        (u.lastname && u.lastname.toLowerCase().includes(search.toLowerCase())) ||
        (u.firstname && u.firstname.toLowerCase().includes(search.toLowerCase())) ||
        u.stores.some(s => s.name.toLowerCase().includes(search.toLowerCase()))
    );

    const getBadgeVariant = (plan?: string) => {
        switch (plan) {
            case 'pro':
                return 'default';
            case 'starter':
                return 'secondary';
            case 'free':
                return 'outline';
            default:
                return 'secondary';
        }
    };

    return (
        <div className="container mx-auto py-10 px-4 max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold font-heading text-slate-900 flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 rounded-xl text-indigo-600">
                            <Shield className="h-6 w-6"/>
                        </div>
                        Administration
                    </h1>
                    <p className="text-slate-500 mt-1 ml-1">Vue globale sur {users.length} utilisateurs.</p>
                </div>

                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"/>
                    <Input
                        placeholder="Rechercher..."
                        className="pl-10 bg-white shadow-sm border-slate-200 rounded-xl"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden bg-white">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">Liste des Clients</CardTitle>
                        <Badge variant="outline" className="bg-white">
                            {filteredUsers.length} résultats
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="w-[250px] pl-6">Client</TableHead>
                                <TableHead>Abonnement</TableHead>
                                <TableHead className="w-[350px]">Boutiques</TableHead>
                                <TableHead>Inscription</TableHead>
                                <TableHead className="text-right pr-6">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.map((user) => (
                                <TableRow key={user.uid}
                                          className={`group hover:bg-slate-50/50 transition-colors ${user.isBlocked ? "bg-red-50/50 hover:bg-red-50" : ""}`}>
                                    <TableCell className="pl-6">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="h-9 w-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold border border-indigo-100 relative">
                                                {(user.firstname?.[0] || user.email[0]).toUpperCase()}
                                                {user.isBlocked && <div
                                                    className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></div>}
                                            </div>
                                            <div className="flex flex-col">
                                                <span
                                                    className={`font-bold capitalize ${user.isBlocked ? "text-red-600 line-through" : "text-slate-900"}`}>
                                                    {user.firstname || ""} {user.lastname || "Utilisateur"}
                                                </span>
                                                <span className="text-xs text-slate-500">{user.email}</span>
                                                {user.role === 'superadmin' && (
                                                    <span
                                                        className="text-[10px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded w-fit mt-0.5">Admin</span>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex flex-col items-start gap-1">
                                            <Badge variant={getBadgeVariant(user.subscription?.plan)}
                                                   className="capitalize shadow-none">
                                                {user.subscription?.plan || "Inconnu"}
                                            </Badge>
                                            <span
                                                className="text-[10px] text-slate-400 capitalize flex items-center gap-1">
                                                <div
                                                    className={`h-1.5 w-1.5 rounded-full ${user.subscription?.status === 'active' ? 'bg-green-500' : 'bg-orange-400'}`}/>
                                                {user.subscription?.status || "-"}
                                            </span>
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex flex-col gap-2">
                                            {user.stores && user.stores.length > 0 ? (
                                                user.stores.map(store => (
                                                    <div key={store.id}
                                                         className="flex items-center justify-between p-2 rounded-lg border border-slate-100 bg-white shadow-sm group-hover:border-indigo-100 transition-colors">
                                                        <div className="flex items-center gap-2 overflow-hidden">
                                                            <div
                                                                className="h-6 w-6 rounded bg-slate-100 flex items-center justify-center flex-shrink-0">
                                                                <StoreIcon className="h-3.5 w-3.5 text-slate-500"/>
                                                            </div>
                                                            <span
                                                                className="text-sm font-medium truncate text-slate-700">{store.name}</span>
                                                        </div>
                                                        <Button variant="ghost" size="sm"
                                                                className="h-6 px-2 text-[10px] text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                                                                asChild>
                                                            <Link href={`/stores/${store.id}`}>Gérer <ArrowRight
                                                                className="ml-1 h-3 w-3"/></Link>
                                                        </Button>
                                                    </div>
                                                ))
                                            ) : <span
                                                className="text-xs text-slate-400 italic pl-1">Aucune boutique</span>}
                                        </div>
                                    </TableCell>

                                    <TableCell className="text-xs text-slate-500 font-mono">
                                        {user.createdAt ? new Date(user.createdAt.seconds * 1000).toLocaleDateString() : "-"}
                                    </TableCell>

                                    <TableCell className="text-right pr-6">
                                        <AdminUserActions user={user} onUpdate={refreshUsers}/>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}