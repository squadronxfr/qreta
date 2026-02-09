"use client";

import {useState, useEffect} from "react";
import {Store, Category, Item} from "@/types/store";
import {motion, AnimatePresence} from "framer-motion";
import {
    Phone, Instagram, Globe, MapPin, Clock,
    Search, X, ChevronRight, ImageIcon
} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Input} from "@/components/ui/input";
import {Dialog, DialogContent, DialogTitle} from "@/components/ui/dialog";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import {cn} from "@/lib/utils";
import Link from "next/link";

interface PublicViewProps {
    store: Store;
    categories: Category[];
    items: Item[];
}

export function PublicStoreView({store, categories, items}: PublicViewProps) {
    const [activeCategory, setActiveCategory] = useState<string>(categories[0]?.id || "");
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 100);

            const sections = categories.map(cat => document.getElementById(`cat-${cat.id}`));
            const scrollPosition = window.scrollY + 200;

            for (const section of sections) {
                if (section && section.offsetTop <= scrollPosition && (section.offsetTop + section.offsetHeight) > scrollPosition) {
                    setActiveCategory(section.id.replace('cat-', ''));
                }
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [categories]);

    const filteredItems = items.filter(item =>
        item.isActive &&
        (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const scrollToCategory = (catId: string) => {
        const element = document.getElementById(`cat-${catId}`);
        if (element) {
            const headerOffset = 140;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({top: offsetPosition, behavior: "smooth"});
            setActiveCategory(catId);
        }
    };

    const primaryColor = store.primaryColor || "#4F46E5";

    return (
        <div className="min-h-screen bg-slate-50 selection:bg-black/10"
             style={{"--primary": primaryColor} as React.CSSProperties}>

            <div className="relative w-full h-[35vh] md:h-[40vh] overflow-hidden bg-slate-900">
                {store.bannerUrl ? (
                    <motion.img
                        initial={{scale: 1.1}}
                        animate={{scale: 1}}
                        transition={{duration: 1.5}}
                        src={store.bannerUrl}
                        alt="Cover"
                        className="w-full h-full object-cover opacity-80"
                    />
                ) : (
                    <div className="w-full h-full bg-linear-to-br from-slate-800 to-slate-900"/>
                )}
                <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-900/40 to-transparent"/>

                <div className="absolute bottom-0 left-0 w-full p-6 pb-6 md:pb-12 container mx-auto max-w-5xl">
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        className="flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-end"
                    >
                        {/* Logo légèrement réduit */}
                        <div
                            className="h-16 w-16 md:h-24 md:w-24 rounded-2xl md:rounded-3xl border-4 border-white/10 bg-white shadow-2xl overflow-hidden flex-shrink-0 backdrop-blur-sm">
                            {store.logoUrl ? (
                                <img src={store.logoUrl} className="w-full h-full object-cover" alt="Logo"/>
                            ) : (
                                <div
                                    className="w-full h-full flex items-center justify-center text-2xl md:text-4xl font-bold text-slate-300 bg-slate-100">
                                    {store.name[0]}
                                </div>
                            )}
                        </div>
                        <div className="flex-1 text-white space-y-1 mb-0.5 w-full">
                            <h1 className="text-2xl md:text-4xl font-bold tracking-tight font-heading leading-tight">{store.name}</h1>
                            {store.description && (
                                <p className="text-slate-200 max-w-xl line-clamp-1 md:line-clamp-2 text-sm md:text-base leading-relaxed opacity-90">
                                    {store.description}
                                </p>
                            )}
                            <div className="flex flex-wrap gap-2 pt-1">
                                {store.address && (
                                    <div
                                        className="flex items-center gap-1.5 text-[10px] md:text-xs font-medium text-slate-200 bg-white/10 px-2 py-1 md:px-3 md:py-1.5 rounded-full backdrop-blur-md border border-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                                        onClick={() => window.open(`http://googleusercontent.com/maps.google.com/search/${encodeURIComponent(store.address!)}`, '_blank')}>
                                        <MapPin className="h-3 w-3"/> <span
                                        className="truncate max-w-[200px]">{store.address}</span>
                                    </div>
                                )}
                                <div className="flex gap-2">
                                    {store.phone && <a href={`tel:${store.phone}`}
                                                       className="p-1 md:p-1.5 bg-white/10 rounded-full hover:bg-white/20 transition-colors text-white border border-white/5"><Phone
                                        className="h-3 w-3 md:h-3.5 md:w-3.5"/></a>}
                                    {store.instagram &&
                                        <a href={`https://instagram.com/${store.instagram.replace('@', '')}`}
                                           target="_blank"
                                           className="p-1 md:p-1.5 bg-white/10 rounded-full hover:bg-white/20 transition-colors text-white border border-white/5"><Instagram
                                            className="h-3 w-3 md:h-3.5 md:w-3.5"/></a>}
                                    {store.website && <a href={store.website} target="_blank"
                                                         className="p-1 md:p-1.5 bg-white/10 rounded-full hover:bg-white/20 transition-colors text-white border border-white/5"><Globe
                                        className="h-3 w-3 md:h-3.5 md:w-3.5"/></a>}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className={cn(
                "sticky top-0 z-40 bg-slate-50/90 backdrop-blur-xl border-b border-slate-200/60 transition-all duration-300",
                scrolled ? "shadow-sm py-2" : "py-3 md:py-4"
            )}>
                <div className="container max-w-5xl mx-auto px-4">
                    <div className="flex flex-col gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"/>
                            <Input
                                placeholder="Rechercher..."
                                className="pl-9 bg-white border-slate-200 rounded-xl shadow-sm focus-visible:ring-indigo-500/20 h-10 text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <ScrollArea className="w-full whitespace-nowrap pb-1">
                            <div className="flex space-x-2">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => scrollToCategory(cat.id)}
                                        className={cn(
                                            "px-4 py-1.5 rounded-full text-xs md:text-sm font-bold transition-all duration-300 border",
                                            activeCategory === cat.id
                                                ? "bg-[var(--primary)] text-white border-transparent shadow-md transform scale-105"
                                                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                        )}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                            <ScrollBar orientation="horizontal" className="invisible"/>
                        </ScrollArea>
                    </div>
                </div>
            </div>

            <main className="container max-w-5xl mx-auto px-4 py-6 md:py-8 pb-12 space-y-8 md:space-y-10">
                {categories.map((category) => {
                    const categoryItems = filteredItems.filter(item => item.categoryId === category.id && item.isActive);
                    if (categoryItems.length === 0) return null;

                    return (
                        <section key={category.id} id={`cat-${category.id}`} className="scroll-mt-32">
                            <div className="flex items-center gap-4 mb-4 md:mb-6">
                                <h2 className="text-lg md:text-xl font-bold font-heading text-slate-900">{category.name}</h2>
                                <div className="h-[1px] flex-1 bg-slate-200 mt-1"/>
                                <span
                                    className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-full">{categoryItems.length}</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                                {categoryItems.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{opacity: 0, y: 20}}
                                        whileInView={{opacity: 1, y: 0}}
                                        viewport={{once: true, margin: "-50px"}}
                                        transition={{duration: 0.4, delay: index * 0.05}}
                                        onClick={() => setSelectedItem(item)}
                                        className="group relative bg-white p-2.5 md:p-3 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-indigo-100 transition-all cursor-pointer flex gap-3 md:gap-4 overflow-hidden"
                                    >
                                        <div
                                            className="h-20 w-20 md:h-24 md:w-24 flex-shrink-0 rounded-xl overflow-hidden bg-slate-50 relative border border-slate-100">
                                            {item.imageUrl ? (
                                                <img src={item.imageUrl} alt={item.name}
                                                     className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                                            ) : (
                                                <div
                                                    className="h-full w-full flex items-center justify-center bg-slate-50">
                                                    <ImageIcon className="h-6 w-6 md:h-8 md:w-8 text-slate-300/50"/>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 flex flex-col justify-between py-0.5">
                                            <div>
                                                <div className="flex justify-between items-start gap-2">
                                                    <h3 className="font-bold text-slate-900 text-sm line-clamp-2 leading-tight group-hover:text-[var(--primary)] transition-colors">
                                                        {item.name}
                                                    </h3>
                                                </div>
                                                {item.description && (
                                                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                                                        {item.description}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex items-end justify-between mt-2">
                                                <div className="flex flex-col">
                                                    {item.duration && (
                                                        <span
                                                            className="text-[10px] text-slate-400 flex items-center gap-1 mb-0.5">
                                                            <Clock className="h-3 w-3"/> {item.duration}
                                                        </span>
                                                    )}
                                                    <div className="flex items-baseline gap-1">
                                                        {item.isStartingPrice && <span
                                                            className="text-[10px] text-slate-400 font-medium uppercase">Dès</span>}
                                                        <span
                                                            className="text-base font-bold text-slate-900">{item.price}€</span>
                                                    </div>
                                                </div>
                                                <div
                                                    className="h-7 w-7 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[var(--primary)] group-hover:text-white transition-all">
                                                    <ChevronRight className="h-4 w-4"/>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </section>
                    );
                })}

                {filteredItems.length === 0 && (
                    <div className="text-center py-20">
                        <div
                            className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="h-8 w-8 text-slate-300"/>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Aucun résultat</h3>
                        <p className="text-slate-500">Essayez une autre recherche.</p>
                    </div>
                )}
            </main>

            <AnimatePresence>
                {selectedItem && (
                    <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
                        <DialogContent
                            className="max-w-md p-0 overflow-hidden rounded-3xl border-none [&>button]:hidden">

                            <DialogTitle className="sr-only">
                                Détails de {selectedItem.name}
                            </DialogTitle>

                            <div className="relative h-64 w-full bg-slate-50">
                                {selectedItem.imageUrl ? (
                                    <img src={selectedItem.imageUrl} alt={selectedItem.name}
                                         className="h-full w-full object-cover"/>
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center">
                                        <ImageIcon className="h-16 w-16 text-slate-200"/>
                                    </div>
                                )}
                                <Button
                                    size="icon"
                                    variant="secondary"
                                    className="absolute top-4 right-4 rounded-full bg-white/80 backdrop-blur-md hover:bg-white shadow-sm"
                                    onClick={() => setSelectedItem(null)}
                                >
                                    <X className="h-4 w-4"/>
                                </Button>
                            </div>

                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-2xl font-bold font-heading text-slate-900 mb-1">{selectedItem.name}</h3>
                                        {selectedItem.duration && (
                                            <Badge variant="secondary"
                                                   className="font-normal text-xs bg-slate-100 text-slate-500 hover:bg-slate-100">
                                                Durée : {selectedItem.duration}
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        {selectedItem.isStartingPrice &&
                                            <div className="text-xs text-slate-400 uppercase font-bold">À partir
                                                de</div>}
                                        <div
                                            className="text-2xl font-bold text-[var(--primary)]">{selectedItem.price}€
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className="prose prose-sm text-slate-600 mb-8 max-h-[40vh] overflow-y-auto pr-2 scrollbar-thin">
                                    <p>{selectedItem.description || "Aucune description détaillée disponible pour cet article."}</p>
                                </div>

                                <Button
                                    className="w-full h-12 rounded-xl text-base font-bold bg-[var(--primary)] hover:opacity-90 shadow-lg shadow-indigo-500/20"
                                    onClick={() => setSelectedItem(null)}>
                                    Fermer
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </AnimatePresence>

            <footer className="bg-white border-t border-slate-100 py-8 pb-12 mt-8">
                <div className="container max-w-5xl mx-auto px-4">
                    <div className="flex flex-col items-center justify-center text-center gap-6 md:gap-8">

                        <Link href="/"
                              className="group flex flex-col items-center gap-3 transition-transform hover:-translate-y-1 duration-300">
                            <div
                                className="h-12 w-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200 rotate-3 group-hover:rotate-0 transition-all">
                                Q.
                            </div>
                            <div className="font-heading text-2xl font-bold text-slate-900 tracking-tight">
                                Qreta<span className="text-indigo-600">.</span>
                            </div>
                        </Link>

                        <div className="space-y-2 max-w-sm mx-auto">
                            <p className="text-slate-600 text-sm font-medium">
                                L&#39;expérience digitale simplifiée pour les commerçants.
                            </p>
                            <p className="text-slate-400 text-xs leading-relaxed">
                                Ce catalogue a été généré automatiquement avec la technologie Qreta.
                                Simple, rapide et élégant.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 items-center mt-2">
                            <Button variant="outline" size="sm"
                                    className="rounded-full px-6 border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50 transition-all"
                                    asChild>
                                <Link href="/">
                                    En savoir plus
                                </Link>
                            </Button>
                            <Button size="sm"
                                    className="rounded-full px-6 bg-slate-900 text-white hover:bg-slate-800 shadow-md"
                                    asChild>
                                <Link href="/signup">
                                    Créer mon catalogue gratuitement
                                </Link>
                            </Button>
                        </div>

                        <div
                            className="mt-2 border-t border-slate-50 w-full max-w-xs flex flex-col gap-2 justify-center items-center">
                            <p className="text-[10px] text-slate-300 uppercase tracking-widest font-semibold">
                                © {new Date().getFullYear()} Qreta Inc.
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}