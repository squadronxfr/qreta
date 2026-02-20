"use client";

import {useMemo} from "react";
import {useAdminStore} from "@/providers/admin-store-provider";
import {ProtectedAdmin} from "@/components/dashboard/protected-admin";
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
    const users = useAdminStore((s) => s.users);
    const isLoading = useAdminStore((s) => s.isLoading);
    const isLoadingMore = useAdminStore((s) => s.isLoadingMore);
    const hasMore = useAdminStore((s) => s.hasMore);
    const error = useAdminStore((s) => s.error);
    const searchQuery = useAdminStore((s) => s.searchQuery);
    const setSearchQuery = useAdminStore((s) => s.setSearchQuery);
    const loadMoreUsers = useAdminStore((s) => s.loadMoreUsers);
    const refresh = useAdminStore((s) => s.refresh);

    const filteredUsers = useMemo(() => {
        if (!searchQuery.trim()) return users;

        const query = searchQuery.toLowerCase();
        return users.filter((u) =>
            u.email?.toLowerCase().includes(query) ||
            u.firstname?.toLowerCase().includes(query) ||
            u.lastname?.toLowerCase().includes(query) ||
            u.uid.toLowerCase().includes(query)
        );
    }, [users, searchQuery]);

    return (
        <ProtectedAdmin>
            <div className="container mx-auto py-10 px-4 max-w-7xl">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <Shield className="h-8 w-8 text-purple-600"/>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 font-heading">Administration</h1>
                            <p className="text-slate-500 text-sm">Gestion des utilisateurs et boutiques</p>
                        </div>
                    </div>
                </div>

                {error && (
                    <Card className="mb-6 border-red-200 bg-red-50 rounded-2xl">
                        <CardContent className="p-4 flex items-center gap-3">
                            <AlertTriangle className="h-5 w-5 text-red-600"/>
                            <p className="text-red-700 font-medium">{error}</p>
                        </CardContent>
                    </Card>
                )}

                <Card className="border-slate-200 shadow-sm rounded-2xl">
                    <CardHeader className="border-b border-slate-100 p-6">
                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <Shield className="h-5 w-5 text-indigo-600"/>
                                Utilisateurs ({filteredUsers.length})
                            </CardTitle>
                            <div className="relative w-full sm:w-72">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"/>
                                <Input
                                    placeholder="Rechercher par email, nom..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 rounded-xl bg-slate-50 border-slate-200"
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {isLoading ? (
                            <div className="flex items-center justify-center p-10">
                                <Spinner className="h-8 w-8 text-indigo-600"/>
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="text-center p-10 text-slate-400">
                                <p className="font-medium">Aucun utilisateur trouvé</p>
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-slate-50 hover:bg-slate-50">
                                                <TableHead className="font-bold text-slate-700">Email</TableHead>
                                                <TableHead className="font-bold text-slate-700">Nom</TableHead>
                                                <TableHead className="font-bold text-slate-700">Plan</TableHead>
                                                <TableHead className="font-bold text-slate-700">Boutiques</TableHead>
                                                <TableHead
                                                    className="text-right font-bold text-slate-700">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredUsers.map((user) => (
                                                <TableRow key={user.uid} className="hover:bg-slate-50">
                                                    <TableCell>
                                                        <div className="flex flex-col">
                                                            <span
                                                                className="font-medium text-slate-900">{user.email}</span>
                                                            <span
                                                                className="text-xs text-slate-400 font-mono">{user.uid}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            {user.firstname && user.lastname ? (
                                                                <span className="text-slate-700">
                                                                {user.firstname} {user.lastname}
                                                            </span>
                                                            ) : (
                                                                <span
                                                                    className="text-slate-400 italic">Non renseigné</span>
                                                            )}
                                                            {user.isBlocked && (
                                                                <Badge variant="destructive"
                                                                       className="text-xs">Bloqué</Badge>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant={
                                                                user.subscription?.plan === "pro"
                                                                    ? "default"
                                                                    : user.subscription?.plan === "starter"
                                                                        ? "secondary"
                                                                        : "outline"
                                                            }
                                                            className="uppercase"
                                                        >
                                                            {user.subscription?.plan || "free"}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        {user.stores.length > 0 ? (
                                                            <div className="flex items-center gap-2">
                                                                <StoreIcon className="h-4 w-4 text-indigo-600"/>
                                                                <span
                                                                    className="font-medium">{user.stores.length}</span>
                                                                {user.stores.slice(0, 2).map((store) => (
                                                                    <Link
                                                                        key={store.id}
                                                                        href={`/${store.slug}`}
                                                                        target="_blank"
                                                                        className="text-xs text-indigo-600 hover:underline"
                                                                    >
                                                                        {store.name}
                                                                    </Link>
                                                                ))}
                                                                {user.stores.length > 2 && (
                                                                    <span className="text-xs text-slate-400">
                                                                    +{user.stores.length - 2}
                                                                </span>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <span className="text-slate-400 text-sm">Aucune</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <AdminUserActions user={user} onUpdate={refresh}/>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>

                                {hasMore && (
                                    <div className="p-6 border-t border-slate-100 flex justify-center">
                                        <Button
                                            onClick={loadMoreUsers}
                                            disabled={isLoadingMore}
                                            variant="outline"
                                            className="rounded-xl"
                                        >
                                            {isLoadingMore ? (
                                                <>
                                                    <Spinner className="mr-2 h-4 w-4"/>
                                                    Chargement...
                                                </>
                                            ) : (
                                                <>
                                                    Charger plus
                                                    <ArrowRight className="ml-2 h-4 w-4"/>
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </ProtectedAdmin>
    );
}