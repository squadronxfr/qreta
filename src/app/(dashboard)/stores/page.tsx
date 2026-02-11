"use client";

import {useStoreStore} from "@/providers/store-store-provider";
import {CreateStoreDialog} from "@/components/stores/create-store-dialog";
import {Spinner} from "@/components/ui/spinner";
import {Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Store as StoreIcon, ExternalLink, Package} from "lucide-react";
import Link from "next/link";

export default function StoresPage() {
    const stores = useStoreStore((s) => s.stores);
    const countsMap = useStoreStore((s) => s.countsMap);
    const isLoading = useStoreStore((s) => s.isLoading);

    return (
        <div className="container mx-auto py-10 px-4 max-w-6xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                <div>
                    <h1 className="text-3xl font-bold font-heading tracking-tight text-slate-900">Mes Boutiques</h1>
                    <p className="text-slate-500 mt-1">Gérez vos catalogues et vos paramètres.</p>
                </div>
                <CreateStoreDialog storeCount={stores.length}/>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-48">
                    <Spinner className="h-10 w-10 text-indigo-600"/>
                </div>
            ) : stores.length === 0 ? (
                <div
                    className="flex flex-col items-center justify-center py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl text-center px-4">
                    <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                        <StoreIcon className="h-8 w-8 text-indigo-600"/>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Aucune boutique</h3>
                    <p className="text-slate-500 max-w-sm mb-6">
                        Vous n&#39;avez pas encore créé de boutique. Lancez-vous pour commencer à vendre ou présenter
                        vos services.
                    </p>
                    <CreateStoreDialog storeCount={0}/>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stores.map((store) => {
                        const counts = countsMap[store.id];
                        return (
                            <Link key={store.id} href={`/stores/${store.id}`} className="group block h-full">
                                <Card
                                    className="h-full border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-200 rounded-2xl overflow-hidden flex flex-col">
                                    <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4">
                                        <div className="flex justify-between items-start">
                                            <div
                                                className="h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shrink-0 overflow-hidden">
                                                {store.logoUrl ? (
                                                    <img
                                                        src={store.logoUrl}
                                                        alt={store.name}
                                                        className="h-full w-full object-cover rounded-xl"
                                                    />
                                                ) : (
                                                    <span className="font-bold text-lg">
                                                        {store.name.substring(0, 1).toUpperCase()}
                                                    </span>
                                                )}
                                            </div>
                                            <Badge
                                                variant={store.isActive ? "default" : "secondary"}
                                                className={
                                                    store.isActive
                                                        ? "bg-green-100 text-green-700 hover:bg-green-200 border-none"
                                                        : "bg-slate-100 text-slate-500 border-none"
                                                }
                                            >
                                                {store.isActive ? "En ligne" : "Hors ligne"}
                                            </Badge>
                                        </div>
                                        <CardTitle
                                            className="text-lg mt-3 group-hover:text-indigo-600 transition-colors">
                                            {store.name}
                                        </CardTitle>
                                        {store.description && (
                                            <CardDescription className="line-clamp-2">
                                                {store.description}
                                            </CardDescription>
                                        )}
                                    </CardHeader>

                                    <CardContent className="pt-4 flex-1">
                                        <div className="flex items-center gap-4 text-sm text-slate-500">
                                            <div className="flex items-center gap-1.5">
                                                <Package className="h-3.5 w-3.5"/>
                                                <span>{counts?.services ?? 0} service{(counts?.services ?? 0) > 1 ? "s" : ""}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Package className="h-3.5 w-3.5"/>
                                                <span>{counts?.products ?? 0} produit{(counts?.products ?? 0) > 1 ? "s" : ""}</span>
                                            </div>
                                        </div>
                                    </CardContent>

                                    <CardFooter className="border-t border-slate-100 pt-3">
                                        <p className="text-xs text-slate-400 flex-1">/{store.slug}</p>
                                        <Button variant="ghost" size="sm"
                                                className="text-slate-400 group-hover:text-indigo-600">
                                            <ExternalLink className="h-4 w-4"/>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}