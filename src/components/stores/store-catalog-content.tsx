"use client";

import {useState, useMemo} from "react";
import {Category, Item} from "@/types/store";
import {AddCategoryDialog} from "@/components/stores/add-category-dialog";
import {AddItemDialog} from "@/components/stores/add-item-dialog";
import {EditItemDialog} from "@/components/stores/edit-item-dialog";
import {CategoryActions} from "@/components/stores/category-actions";
import {ItemActions} from "@/components/stores/item-actions";
import {Badge} from "@/components/ui/badge";
import {Input} from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {Search, Filter, Clock, LayoutGrid, Layers, ImageIcon} from "lucide-react";
import Image from "next/image";
import {cn} from "@/lib/utils";

interface StoreCatalogContentProps {
    storeId: string;
    categories: Category[];
    items: Item[];
}

export function StoreCatalogContent({storeId, categories, items}: StoreCatalogContentProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [editingItemId, setEditingItemId] = useState<string | null>(null);

    const editingItem = items.find((i) => i.id === editingItemId);

    const filteredItems = useMemo(() => {
        return items.filter((item) => {
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus =
                statusFilter === "all"
                    ? true
                    : statusFilter === "active"
                        ? item.isActive
                        : !item.isActive;
            const matchesCategory =
                categoryFilter === "all" ? true : item.categoryId === categoryFilter;
            return matchesSearch && matchesStatus && matchesCategory;
        });
    }, [items, searchQuery, statusFilter, categoryFilter]);

    return (
        <div className="space-y-8">
            <div
                className="sticky top-4 z-20 bg-white/80 backdrop-blur-md p-4 rounded-2xl border shadow-sm flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
                <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"/>
                        <Input
                            placeholder="Rechercher un article..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 rounded-xl bg-slate-50 border-slate-200"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-full sm:w-40 rounded-xl bg-slate-50 border-slate-200">
                                <div className="flex items-center gap-2">
                                    <Layers className="h-3.5 w-3.5 text-slate-500"/>
                                    <SelectValue placeholder="Catégorie"/>
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Toutes</SelectItem>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={statusFilter}
                                onValueChange={(v: "all" | "active" | "inactive") => setStatusFilter(v)}>
                            <SelectTrigger className="w-full sm:w-35 rounded-xl bg-slate-50 border-slate-200">
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
                    <AddCategoryDialog storeId={storeId}/>
                    <AddItemDialog storeId={storeId} categories={categories}/>
                </div>
            </div>

            <div className="space-y-12">
                {categories.length === 0 ? (
                    <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                        <div
                            className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-4">
                            <LayoutGrid className="h-8 w-8 text-indigo-300"/>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Catalogue vide</h3>
                        <p className="text-slate-500 mb-6 max-w-xs mx-auto">
                            Commencez par ajouter une catégorie pour structurer votre catalogue.
                        </p>
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
                                            {items.filter((i) => i.categoryId === cat.id).length}
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
                                                    !item.isActive && "opacity-75 bg-slate-50"
                                                )}
                                            >
                                                <div
                                                    className="h-24 w-24 shrink-0 rounded-xl bg-slate-100 overflow-hidden relative border border-slate-100">
                                                    {item.imageUrl ? (
                                                        <Image
                                                            src={item.imageUrl}
                                                            alt={item.name}
                                                            fill
                                                            className="object-cover transition-transform group-hover:scale-105"
                                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                        />
                                                    ) : (
                                                        <div
                                                            className="h-full w-full flex items-center justify-center text-slate-300">
                                                            <ImageIcon
                                                                className="h-6 w-6 md:h-8 md:w-8 text-slate-300/50"/>
                                                        </div>
                                                    )}
                                                    {!item.isActive && (
                                                        <div
                                                            className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
                                                            <Badge variant="secondary"
                                                                   className="text-[10px] bg-slate-200/90">
                                                                Masqué
                                                            </Badge>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex-1 min-w-0 flex flex-col justify-between">
                                                    <div>
                                                        <p className="font-semibold text-sm text-slate-900 truncate">{item.name}</p>
                                                        {item.description && (
                                                            <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{item.description}</p>
                                                        )}
                                                    </div>
                                                    <div className="flex items-end justify-between mt-2">
                                                        <div className="flex flex-col">
                                                            {item.isStartingPrice && (
                                                                <span
                                                                    className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">
                                                                    À partir de
                                                                </span>
                                                            )}
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