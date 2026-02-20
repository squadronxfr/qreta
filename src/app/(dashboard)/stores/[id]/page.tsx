"use client";

import {use} from "react";
import {useCatalogStore} from "@/providers/catalog-store-provider";
import {Spinner} from "@/components/ui/spinner";
import {StoreDashboardHeader} from "@/components/stores/store-dashboard-header";
import {StoreCatalogContent} from "@/components/stores/store-catalog-content";
import {StoreSettingsForm} from "@/components/stores/store-settings-form";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function StoreDashboardPage({params}: PageProps) {
    const {id} = use(params);
    const store = useCatalogStore((s) => s.store);
    const categories = useCatalogStore((s) => s.categories);
    const items = useCatalogStore((s) => s.items);
    const isLoading = useCatalogStore((s) => s.isLoading);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-10 font-medium text-slate-500">
                <Spinner className="h-8 w-8 text-indigo-600 mb-2" />
                Chargement de la boutique...
            </div>
        );
    }

    if (!store) {
        return <div className="p-10 text-center">Boutique introuvable.</div>;
    }

    return (
        <div className="container mx-auto py-6 px-4 max-w-7xl">
            <StoreDashboardHeader store={store}/>

            <Tabs defaultValue="inventory" className="space-y-8">
                <TabsList className="rounded-xl bg-slate-100 p-1 inline-flex">
                    <TabsTrigger
                        value="inventory"
                        className="rounded-lg px-8 py-2 cursor-pointer font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                        Catalogue
                    </TabsTrigger>
                    <TabsTrigger
                        value="settings"
                        className="rounded-lg px-8 py-2 cursor-pointer font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                        Paramètres
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="inventory">
                    <StoreCatalogContent storeId={id} categories={categories} items={items}/>
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
        </div>
    );
}