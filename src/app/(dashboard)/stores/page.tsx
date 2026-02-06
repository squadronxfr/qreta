"use client";

import {useEffect, useState} from "react";
import {db} from "@/lib/firebase/config";
import {collection, query, where, onSnapshot} from "firebase/firestore";
import {useAuth} from "@/context/auth-context";
import {Store} from "@/types/store";
import {CreateStoreDialog} from "@/components/stores/create-store-dialog";
import {Card, CardHeader, CardTitle, CardDescription} from "@/components/ui/card";
import Link from "next/link";

export default function StoresPage() {
    const {user} = useAuth();
    const [stores, setStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!user) return;

        // Real-time listener for user's stores
        const q = query(collection(db, "stores"), where("ownerId", "==", user.uid));

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
        <div className="container mx-auto py-10 px-4">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Mes Boutiques</h1>
                    <p className="text-muted-foreground">Sélectionnez une boutique pour gérer son catalogue.</p>
                </div>
                <CreateStoreDialog/>
            </div>

            {loading ? (
                <p>Chargement de vos boutiques...</p>
            ) : stores.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed rounded-lg">
                    <p className="text-slate-500">Vous n&#39;avez pas encore de boutique.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stores.map((store) => (
                        <Link key={store.id} href={`/stores/${store.id}`}>
                            <Card className="hover:border-primary cursor-pointer transition-colors">
                                <CardHeader>
                                    <CardTitle>{store.name}</CardTitle>
                                    <CardDescription>
                                        ID: {store.id}
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}