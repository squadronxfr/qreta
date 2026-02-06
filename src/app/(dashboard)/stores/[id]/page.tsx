"use client";

import {useState, useEffect, use} from "react";
import {db} from "@/lib/firebase/config";
import {doc, collection, query, where, onSnapshot} from "firebase/firestore";
import {Store, Category, Item} from "@/types/store";
import {AddCategoryDialog} from "@/components/stores/add-category-dialog";
import {AddItemDialog} from "@/components/stores/add-item-dialog";
import {EditItemDialog} from "@/components/stores/edit-item-dialog";
import {CategoryActions} from "@/components/stores/category-actions";
import {ItemActions} from "@/components/stores/item-actions";
import {StoreSettingsForm} from "@/components/stores/store-settings-form";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {
    Eye,
    LayoutGrid,
    Package,
    Wrench,
    ChevronLeft,
    Store as StoreIcon
} from "lucide-react";
import Link from "next/link";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function StoreDashboardPage({params}: PageProps) {
    const {id} = use(params);
    const [store, setStore] = useState<Store | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [editingItemId, setEditingItemId] = useState<string | null>(null);
    const editingItem = items.find(i => i.id === editingItemId);

    useEffect(() => {
        const storeRef = doc(db, "stores", id);
        const unsubStore = onSnapshot(storeRef, (docSnap) => {
            if (docSnap.exists()) {
                setStore({id: docSnap.id, ...docSnap.data()} as Store);
            }
        });

        const qCat = query(collection(db, "categories"), where("storeId", "==", id));
        const unsubCat = onSnapshot(qCat, (snap) => {
            const catList = snap.docs.map(d => ({id: d.id, ...d.data()})) as Category[];
            setCategories(catList.sort((a, b) => a.order - b.order));
        });

        const qItems = query(collection(db, "items"), where("storeId", "==", id));
        const unsubItems = onSnapshot(qItems, (snap) => {
            setItems(snap.docs.map(d => ({id: d.id, ...d.data()})) as Item[]);
            setLoading(false);
        });

        return () => {
            unsubStore();
            unsubCat();
            unsubItems();
        };
    }, [id]);

    if (loading) return <div className="p-10 text-center font-medium">Chargement...</div>;
    if (!store) return <div className="p-10 text-center">Boutique introuvable.</div>;

    return (
        <div className="container mx-auto py-6 px-4 max-w-6xl">
            <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
                <Link href="/stores" className="flex items-center gap-1 hover:text-indigo-600 transition-colors">
                    <ChevronLeft className="h-4 w-4"/>
                    Mes Boutiques
                </Link>
                <span className="text-slate-300">/</span>
                <span className="font-medium text-slate-900">{store.name}</span>
            </nav>

            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div className="flex items-center gap-4">
                    <div
                        className="h-16 w-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
                        {store.logoUrl ? (
                            <img src={store.logoUrl} alt={store.name}
                                 className="h-full w-full object-cover rounded-2xl"/>
                        ) : (
                            <StoreIcon className="h-8 w-8"/>
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-3xl font-bold font-heading tracking-tight">{store.name}</h1>
                            <Badge
                                variant={store.isActive ? "default" : "secondary"}
                                className={`border-none ${store.isActive ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-slate-100 text-slate-500"}`}
                            >
                                {store.isActive ? "En ligne" : "Hors ligne"}
                            </Badge>
                        </div>
                        <p className="text-sm text-slate-500">ID: {store.slug}</p>
                    </div>
                </div>
                <Button variant="outline" className="rounded-xl" asChild>
                    <Link href={`/${store.slug}`} target="_blank">
                        <Eye className="mr-2 h-4 w-4"/> Catalogue Public
                    </Link>
                </Button>
            </header>

            <Tabs defaultValue="inventory" className="space-y-8">
                <TabsList className="rounded-xl bg-slate-100 p-1">
                    <TabsTrigger value="inventory"
                                 className="rounded-lg px-8 py-2 cursor-pointer">Catalogue</TabsTrigger>
                    <TabsTrigger value="settings"
                                 className="rounded-lg px-8 py-2 cursor-pointer">Paramètres</TabsTrigger>
                </TabsList>

                <TabsContent value="inventory" className="space-y-12">
                    <div className="flex flex-col md:flex-row justify-between gap-4 bg-slate-50 p-6 rounded-3xl border">
                        <div className="flex items-center gap-3">
                            <LayoutGrid className="h-5 w-5 text-indigo-600"/>
                            <h2 className="text-lg font-bold font-heading">Gestion des articles</h2>
                        </div>
                        <div className="flex gap-2">
                            <AddCategoryDialog storeId={id}/>
                            <AddItemDialog storeId={id} categories={categories}/>
                        </div>
                    </div>

                    <div className="space-y-10">
                        {categories.map((cat) => {
                            const categoryItems = items.filter(item => item.categoryId === cat.id);
                            return (
                                <section key={cat.id} className="space-y-4">
                                    <div className="flex items-center justify-between border-b pb-2">
                                        <h3 className="font-bold text-xl font-heading">{cat.name}</h3>
                                        <CategoryActions category={cat}/>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                        {categoryItems.map((item) => (
                                            <div
                                                key={item.id}
                                                onClick={() => setEditingItemId(item.id)}
                                                className="group relative p-4 border rounded-[1.5rem] bg-white shadow-sm hover:border-indigo-100 transition-all flex gap-4 items-center cursor-pointer active:scale-[0.98]"
                                            >
                                                <div
                                                    className="h-20 w-20 rounded-2xl bg-slate-50 overflow-hidden flex-shrink-0 border">
                                                    {item.imageUrl ? (
                                                        <img src={item.imageUrl} alt={item.name}
                                                             className="h-full w-full object-cover"/>
                                                    ) : (
                                                        <div
                                                            className="h-full w-full flex items-center justify-center text-slate-300">
                                                            {item.type === "product" ? <Package className="h-7 w-7"/> :
                                                                <Wrench className="h-7 w-7"/>}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold truncate">{item.name}</h4>
                                                    <p className="text-md font-bold text-indigo-600">
                                                        {item.isStartingPrice &&
                                                            <span className="text-[10px] mr-1">Dès</span>}
                                                        {item.price}€
                                                    </p>
                                                </div>
                                                <div className="absolute top-3 right-3">
                                                    <ItemActions item={item} onEdit={() => setEditingItemId(item.id)}/>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            );
                        })}
                    </div>
                </TabsContent>

                <TabsContent value="settings">
                    <div className="p-8 border rounded-[2.5rem] bg-white shadow-sm">
                        <StoreSettingsForm store={store}/>
                    </div>
                </TabsContent>
            </Tabs>

            {editingItem && (
                <EditItemDialog
                    item={editingItem}
                    categories={categories}
                    open={!!editingItem}
                    onOpenChange={(isOpen) => {
                        if (!isOpen) setEditingItemId(null);
                    }}
                />
            )}
        </div>
    );
}