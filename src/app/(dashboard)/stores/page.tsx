"use client";

import {useEffect, useState} from "react";
import {db} from "@/lib/firebase/config";
import {collection, query, where, onSnapshot} from "firebase/firestore";
import {useAuth} from "@/context/auth-context";
import {Store} from "@/types/store";
import {CreateStoreDialog} from "@/components/stores/create-store-dialog";
import {Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Store as StoreIcon, ExternalLink} from "lucide-react";
import Link from "next/link";

export default function StoresPage() {
    const {user} = useAuth();
    const [stores, setStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!user) return;

        const q = query(collection(db, "stores"), where("userId", "==", user.uid));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const storesList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Store[];

            setStores(storesList);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    return (
        <div className="container mx-auto py-10 px-4 max-w-6xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                <div>
                    <h1 className="text-3xl font-bold font-heading tracking-tight text-slate-900">Mes Boutiques</h1>
                    <p className="text-slate-500 mt-1">Gérez vos catalogues et vos paramètres.</p>
                </div>
                <CreateStoreDialog storeCount={stores.length}/>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-48 rounded-2xl bg-slate-100 animate-pulse"/>
                    ))}
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
                        vos
                        services.
                    </p>
                    <CreateStoreDialog storeCount={stores.length}/>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stores.map((store) => (
                        <Link key={store.id} href={`/stores/${store.id}`} className="group block h-full">
                            <Card
                                className="h-full border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-200 rounded-2xl overflow-hidden flex flex-col">
                                <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                                    <div className="flex justify-between items-start">
                                        <div
                                            className="h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shrink-0">
                                            {store.logoUrl ? (
                                                <img src={store.logoUrl} alt={store.name}
                                                     className="h-full w-full object-cover rounded-xl"/>
                                            ) : (
                                                <span
                                                    className="font-bold text-lg">{store.name.substring(0, 1).toUpperCase()}</span>
                                            )}
                                        </div>
                                        <Badge variant={store.isActive ? "default" : "secondary"}
                                               className={store.isActive ? "bg-green-100 text-green-700 hover:bg-green-200 border-none" : "bg-slate-100 text-slate-500 border-none"}>
                                            {store.isActive ? "En ligne" : "Hors ligne"}
                                        </Badge>
                                    </div>
                                    <CardTitle className="mt-4 text-xl font-heading">{store.name}</CardTitle>
                                    <CardDescription className="line-clamp-2 min-h-[2.5em]">
                                        {store.description || "Aucune description"}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-4 flex-grow">
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <span
                                            className="bg-slate-100 px-2 py-1 rounded text-xs font-mono text-slate-600">/{store.slug}</span>
                                    </div>
                                </CardContent>
                                <CardFooter className="pt-0 pb-4 border-t border-slate-50 bg-white mt-auto">
                                    <Button variant="ghost"
                                            className="w-full mt-4 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 justify-between group-hover:pl-6 transition-all">
                                        Gérer la boutique <ExternalLink className="h-4 w-4 ml-2"/>
                                    </Button>
                                </CardFooter>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}