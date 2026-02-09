"use client";

import {useState, useEffect, use, useMemo} from "react";
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
import {Input} from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Eye,
    LayoutGrid,
    Package,
    Wrench,
    ChevronLeft,
    Store as StoreIcon,
    Search,
    Filter,
    Clock,
    Layers
} from "lucide-react";
import Link from "next/link";
import {cn} from "@/lib/utils";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function StoreDashboardPage({params}: PageProps) {
    const {id} = use(params);
    const [store, setStore] = useState<Store | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");

    const [editingItemId, setEditingItemId] = useState<string | null>(null);
    const editingItem = items.find((i) => i.id === editingItemId);

    useEffect(() => {
        const storeRef = doc(db, "stores", id);
        const unsubStore = onSnapshot(storeRef, (docSnap) => {
            if (docSnap.exists()) {
                setStore({id: docSnap.id, ...docSnap.data()} as Store);
            }
        });

        const qCat = query(collection(db, "categories"), where("storeId", "==", id));
        const unsubCat = onSnapshot(qCat, (snap) => {
            const catList = snap.docs.map((d) => ({id: d.id, ...d.data()})) as Category[];
            setCategories(catList.sort((a, b) => a.order - b.order));
        });

        const qItems = query(collection(db, "items"), where("storeId", "==", id));
        const unsubItems = onSnapshot(qItems, (snap) => {
            setItems(snap.docs.map((d) => ({id: d.id, ...d.data()})) as Item[]);
            setLoading(false);
        });

        return () => {
            unsubStore();
            unsubCat();
            unsubItems();
        };
    }, [id]);

    const filteredItems = useMemo(() => {
        return items.filter((item) => {
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus =
                statusFilter === "all"
                    ? true
                    : statusFilter === "active"
                        ? item.isActive !== false
                        : item.isActive === false;

            const matchesCategory =
                categoryFilter === "all"
                    ? true
                    : item.categoryId === categoryFilter;

            return matchesSearch && matchesStatus && matchesCategory;
        });
    }, [items, searchQuery, statusFilter, categoryFilter]);

    if (loading) return <div className="p-10 text-center font-medium text-slate-500 animate-pulse">Chargement de la
        boutique...</div>;
    if (!store) return <div className="p-10 text-center">Boutique introuvable.</div>;

    return (
        <div className="container mx-auto py-6 px-4 max-w-7xl">
            <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                <Link
                    href="/stores"
                    className="flex items-center gap-1 hover:text-indigo-600 transition-colors font-medium"
                >
                    <ChevronLeft className="h-4 w-4"/>
                    Mes Boutiques
                </Link>
                <span className="text-slate-300">/</span>
                <span className="font-semibold text-slate-900">{store.name}</span>
            </nav>

            <header
                className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 bg-white p-6 rounded-3xl border shadow-sm">
                <div className="flex items-center gap-5">
                    <div
                        className="h-20 w-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shrink-0 overflow-hidden relative border-4 border-white">
                        {store.logoUrl ? (
                            <img src={store.logoUrl} alt={store.name} className="h-full w-full object-cover"/>
                        ) : (
                            <StoreIcon className="h-8 w-8 opacity-80"/>
                        )}
                    </div>
                    <div>
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold font-heading tracking-tight text-slate-900">{store.name}</h1>
                            <Badge
                                variant="outline"
                                className={cn(
                                    "border-none px-2.5 py-0.5 rounded-full font-medium text-xs flex items-center gap-1.5",
                                    store.isActive ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                                )}
                            >
                                <div
                                    className={cn("h-2 w-2 rounded-full", store.isActive ? "bg-green-500" : "bg-slate-400")}/>
                                {store.isActive ? "En ligne" : "Hors ligne"}
                            </Badge>
                        </div>
                        <p className="text-sm text-slate-500 font-mono bg-slate-50 px-2 py-1 rounded inline-block">
                            ID: <span className="text-slate-700 font-semibold">{store.slug}</span>
                        </p>
                    </div>
                </div>
                <Button variant="default" className="rounded-xl shadow-md bg-slate-900 hover:bg-slate-800 text-white"
                        asChild>
                    <Link href={`/${store.slug}`} target="_blank">
                        <Eye className="mr-2 h-4 w-4"/> Voir la boutique
                    </Link>
                </Button>
            </header>

            <Tabs defaultValue="inventory" className="space-y-8">
                <TabsList className="rounded-xl bg-slate-100 p-1 inline-flex">
                    <TabsTrigger value="inventory"
                                 className="rounded-lg px-8 py-2 cursor-pointer font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        Catalogue
                    </TabsTrigger>
                    <TabsTrigger value="settings"
                                 className="rounded-lg px-8 py-2 cursor-pointer font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        Paramètres
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="inventory" className="space-y-8">
                    <div
                        className="sticky top-4 z-20 bg-white/80 backdrop-blur-md p-4 rounded-2xl border shadow-sm flex flex-col md:flex-row justify-between gap-4 items-center transition-all">
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                            <div className="relative flex-1 w-full max-w-sm">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"/>
                                <Input
                                    placeholder="Rechercher..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                                />
                            </div>

                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                    <SelectTrigger
                                        className="w-full sm:w-[180px] rounded-xl bg-slate-50 border-slate-200">
                                        <div className="flex items-center gap-2 truncate">
                                            <Layers className="h-3.5 w-3.5 text-slate-500"/>
                                            <SelectValue placeholder="Catégorie"/>
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Toutes catégories</SelectItem>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
                                    <SelectTrigger
                                        className="w-full sm:w-[140px] rounded-xl bg-slate-50 border-slate-200">
                                        <div className="flex items-center gap-2">
                                            <Filter className="h-3.5 w-3.5 text-slate-500"/>
                                            <SelectValue placeholder="Statut"/>
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tout voir</SelectItem>
                                        <SelectItem value="active">Actifs</SelectItem>
                                        <SelectItem value="inactive">Masqués</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex gap-2 w-full md:w-auto">
                            <AddCategoryDialog storeId={id}/>
                            <AddItemDialog storeId={id} categories={categories}/>
                        </div>
                    </div>

                    <div className="space-y-12">
                        {categories.length === 0 ? (
                            <div
                                className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                                <div
                                    className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-4">
                                    <LayoutGrid className="h-8 w-8 text-indigo-300"/>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">Catalogue vide</h3>
                                <p className="text-slate-500 mb-6 max-w-xs mx-auto">Commencez par ajouter une catégorie
                                    pour structurer votre carte.</p>
                                <AddCategoryDialog storeId={id}/>
                            </div>
                        ) : (
                            categories.map((cat) => {
                                if (categoryFilter !== "all" && cat.id !== categoryFilter) return null;

                                const categoryItems = filteredItems.filter((item) => item.categoryId === cat.id);

                                if (categoryItems.length === 0 && (searchQuery || statusFilter !== "all")) return null;

                                return (
                                    <section key={cat.id} className="space-y-4">
                                        <div className="flex items-center justify-between group">
                                            <div className="flex items-center gap-3">
                                                <h3 className="font-bold text-xl font-heading text-slate-800">{cat.name}</h3>
                                                <span
                                                    className="bg-slate-100 text-slate-500 text-xs px-2 py-0.5 rounded-full font-medium">
                                    {items.filter(i => i.categoryId === cat.id).length}
                                </span>
                                            </div>
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                <CategoryActions category={cat}/>
                                            </div>
                                        </div>

                                        {categoryItems.length === 0 ? (
                                            <div
                                                className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-sm italic">
                                                Cette catégorie est vide.
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                                {categoryItems.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        onClick={() => setEditingItemId(item.id)}
                                                        className={cn(
                                                            "group relative flex gap-4 p-3 bg-white border border-slate-200 rounded-2xl transition-all cursor-pointer hover:shadow-md hover:border-indigo-200",
                                                            item.isActive === false && "opacity-75 bg-slate-50"
                                                        )}
                                                    >
                                                        <div
                                                            className="h-24 w-24 shrink-0 rounded-xl bg-slate-100 overflow-hidden relative border border-slate-100">
                                                            {item.imageUrl ? (
                                                                <img src={item.imageUrl} alt={item.name}
                                                                     className="h-full w-full object-cover transition-transform group-hover:scale-105"/>
                                                            ) : (
                                                                <div
                                                                    className="h-full w-full flex items-center justify-center text-slate-300">
                                                                    {item.type === "product" ?
                                                                        <Package className="h-8 w-8"/> :
                                                                        <Wrench className="h-8 w-8"/>}
                                                                </div>
                                                            )}
                                                            {item.isActive === false && (
                                                                <div
                                                                    className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
                                                                    <Badge variant="secondary"
                                                                           className="bg-slate-900/10 text-slate-700 text-[10px] backdrop-blur-sm">Masqué</Badge>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div
                                                            className="flex-1 min-w-0 flex flex-col justify-between py-1">
                                                            <div>
                                                                <div className="flex justify-between items-start gap-2">
                                                                    <h4 className="font-bold text-slate-900 truncate pr-6 group-hover:text-indigo-600 transition-colors">{item.name}</h4>
                                                                </div>
                                                                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                                                                    {item.description ||
                                                                        <span className="italic opacity-50">Aucune description</span>}
                                                                </p>
                                                            </div>

                                                            <div className="flex items-end justify-between mt-2">
                                                                <div className="flex flex-col">
                                                                    {item.isStartingPrice && <span
                                                                        className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">À partir de</span>}
                                                                    <span
                                                                        className="text-lg font-bold text-indigo-600">{item.price}€</span>
                                                                </div>

                                                                <div className="flex gap-2">
                                                                    {item.duration && (
                                                                        <Badge variant="outline"
                                                                               className="text-[10px] h-5 px-1.5 gap-1 text-slate-500 border-slate-200">
                                                                            <Clock className="h-3 w-3"/> {item.duration}
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div
                                                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100">
                                                            <div
                                                                className="bg-white rounded-lg shadow-sm border border-slate-200 p-1">
                                                                <ItemActions item={item}
                                                                             onEdit={() => setEditingItemId(item.id)}/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </section>
                                );
                            })
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="settings">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="lg:col-span-2">
                            <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm">
                                <StoreSettingsForm store={store}/>
                            </div>
                        </div>
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