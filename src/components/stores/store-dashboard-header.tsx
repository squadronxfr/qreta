"use client";

import {Store} from "@/types/store";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Eye, ChevronLeft, Store as StoreIcon} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface StoreDashboardHeaderProps {
    store: Store;
}

export function StoreDashboardHeader({store}: StoreDashboardHeaderProps) {
    return (
        <>
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
                            <Image
                                src={store.logoUrl}
                                alt={store.name}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <StoreIcon className="h-9 w-9"/>
                        )}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold font-heading text-slate-900">{store.name}</h1>
                        <p className="text-sm text-slate-500 mt-0.5">/{store.slug}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Badge
                        variant={store.isActive ? "default" : "secondary"}
                        className={
                            store.isActive
                                ? "bg-green-100 text-green-700 border-none"
                                : "bg-slate-100 text-slate-500 border-none"
                        }
                    >
                        {store.isActive ? "En ligne" : "Hors ligne"}
                    </Badge>
                    {store.isActive && (
                        <Link href={`/${store.slug}`} target="_blank">
                            <Button variant="outline" size="sm" className="gap-2 rounded-xl">
                                <Eye className="h-4 w-4"/>
                                Voir le catalogue
                            </Button>
                        </Link>
                    )}
                </div>
            </header>
        </>
    );
}