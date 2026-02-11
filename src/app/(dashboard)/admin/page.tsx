"use client";

import {useEffect, useState, useCallback} from "react";
import {useAuthStore} from "@/providers/auth-store-provider";
import {useRouter} from "next/navigation";
import {fetchUsersPaginated, AdminUserView} from "@/lib/firebase/users";
import {QueryDocumentSnapshot, DocumentData} from "firebase/firestore";
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
import {Spinner} from "@/components/ui/spinner";
import Link from "next/link";
import {AdminUserActions} from "@/components/admin/admin-user-actions";

export default function SuperAdminPage() {
    const userData = useAuthStore((s) => s.userData);
    const loading = useAuthStore((s) => s.loading);
    const router = useRouter();

    const [users, setUsers] = useState<AdminUserView[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [search, setSearch] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [cursor, setCursor] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
    const [hasMore, setHasMore] = useState(false);

    const loadUsers = useCallback(async (isInitial: boolean) => {
        if (!userData || userData.role !== "superadmin") return;

        if (isInitial) {
            setIsLoadingData(true);
        } else {
            setIsLoadingMore(true);
        }

        try {
            const result = await fetchUsersPaginated(isInitial ? null : cursor);

            if (isInitial) {
                setUsers(result.users);
            } else {
                setUsers((prev) => [...prev, ...result.users]);
            }

            setCursor(result.lastDoc);
            setHasMore(result.hasMore);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Erreur inconnue");
        } finally {
            setIsLoadingData(false);
            setIsLoadingMore(false);
        }
    }, [userData, cursor]);

    useEffect(() => {
        if (!loading && userData) {
            loadUsers(true);
        }
    }, [userData, loading]);

    const handleRefresh = () => {
        setCursor(null);
        setHasMore(false);
        loadUsers(true);
    };

    if (loading || isLoadingData) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="flex flex-col items-center gap-4">
                <Spinner className="h-8 w-8 text-indigo-600"/>
                <p className="text-sm text-slate-500 font-medium">Chargement du panneau Admin...</p>
            </div>
        </div>
    );

    if (userData?.role !== "superadmin") {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
                <div className="bg-red-100 p-4 rounded-full mb-4">
                    <Shield className="h-10 w-10 text-red-600"/>
                </div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Accès Refusé</h1>
                <Button onClick={() => router.push("/stores")}>Retourner au tableau de bord</Button>
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

    const filteredUsers = users.filter((u) =>
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.lastname?.toLowerCase().includes(search.toLowerCase()) ||
        u.firstname?.toLowerCase().includes(search.toLowerCase()) ||
        u.stores.some((s) => s.name.toLowerCase().includes(search.toLowerCase()))
    );

    const getBadgeVariant = (plan?: string) => {
        switch (plan) {
            case "pro":
                return "bg-indigo-100 text-indigo-700";
            case "starter":
                return "bg-blue-100 text-blue-700";
            default:
                return "bg-slate-100 text-slate-600";
        }
    };

    return (
        <div className="container mx-auto py-10 px-4 max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold font-heading tracking-tight text-slate-900">Administration</h1>
                    <p className="text-slate-500 mt-1">{users.length} utilisateur{users.length > 1 ? "s" : ""} chargé{users.length > 1 ? "s" : ""}</p>
                </div>
                <Button variant="outline" onClick={handleRefresh} className="rounded-xl">
                    Actualiser
                </Button>
            </div>

            <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <CardTitle className="text-lg font-heading">Utilisateurs</CardTitle>
                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"/>
                            <Input
                                placeholder="Rechercher..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10 rounded-xl bg-white"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/50">
                                <TableHead className="pl-6">Utilisateur</TableHead>
                                <TableHead>Rôle</TableHead>
                                <TableHead>Plan</TableHead>
                                <TableHead>Boutiques</TableHead>
                                <TableHead>Inscription</TableHead>
                                <TableHead className="text-right pr-6">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.map((user) => (
                                <TableRow key={user.uid} className="hover:bg-slate-50/50">
                                    <TableCell className="pl-6">
                                        <div>
                                            <p className="font-medium text-slate-900">
                                                {user.firstname} {user.lastname}
                                                {user.isBlocked && (
                                                    <Badge variant="destructive"
                                                           className="ml-2 text-[10px]">Bloqué</Badge>
                                                )}
                                            </p>
                                            <p className="text-xs text-slate-500">{user.email}</p>
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <Badge variant="outline" className="capitalize text-xs">
                                            {user.role === "superadmin" ? (
                                                <><Shield className="h-3 w-3 mr-1"/> Admin</>
                                            ) : "Owner"}
                                        </Badge>
                                    </TableCell>

                                    <TableCell>
                                        <Badge
                                            className={`${getBadgeVariant(user.subscription?.plan)} capitalize border-none text-xs`}>
                                            {user.subscription?.plan || "free"}
                                        </Badge>
                                    </TableCell>

                                    <TableCell>
                                        {user.stores.length > 0 ? (
                                            <div className="flex flex-col gap-1">
                                                {user.stores.map((store) => (
                                                    <Link
                                                        key={store.id}
                                                        href={`/stores/${store.id}`}
                                                        className="flex items-center gap-1.5 text-xs text-indigo-600 hover:underline"
                                                    >
                                                        <StoreIcon className="h-3 w-3"/>
                                                        {store.name}
                                                        <ArrowRight className="h-3 w-3"/>
                                                    </Link>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-xs text-slate-400">Aucune</span>
                                        )}
                                    </TableCell>

                                    <TableCell className="text-xs text-slate-500">
                                        {user.createdAt?.seconds
                                            ? new Date(user.createdAt.seconds * 1000).toLocaleDateString()
                                            : "-"}
                                    </TableCell>

                                    <TableCell className="text-right pr-6">
                                        <AdminUserActions user={user} onUpdate={handleRefresh}/>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {hasMore && (
                        <div className="flex justify-center py-6 border-t border-slate-100">
                            <Button
                                variant="outline"
                                onClick={() => loadUsers(false)}
                                disabled={isLoadingMore}
                                className="rounded-xl"
                            >
                                {isLoadingMore ? (
                                    <><Spinner className="mr-2 h-4 w-4 animate-spin"/> Chargement...</>
                                ) : (
                                    "Charger plus"
                                )}
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}