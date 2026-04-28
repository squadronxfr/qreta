"use client";

import {motion} from "framer-motion";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Check, ArrowRight, Sparkles, ArrowUpRight} from "lucide-react";

const stagger = {
    hidden: {opacity: 0},
    show: {opacity: 1, transition: {staggerChildren: 0.15}},
};

const fadeUp = {
    hidden: {opacity: 0, y: 30},
    show: {opacity: 1, y: 0, transition: {duration: 0.7, ease: [0.25, 0.4, 0.25, 1] as const}},
};

const scaleIn = {
    hidden: {opacity: 0, scale: 0.9},
    show: {opacity: 1, scale: 1, transition: {duration: 0.6, ease: [0.25, 0.4, 0.25, 1] as const}},
};

export const HeroSection = () => {
    return (
        <section className="relative pt-36 pb-24 overflow-hidden bg-white">
            <div className="absolute inset-0 overflow-hidden">
                <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-225 h-125 bg-linear-to-b from-indigo-100/60 via-violet-50/30 to-transparent rounded-full blur-[100px]"/>
                <div
                    className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-slate-200 to-transparent"/>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={stagger}
                    className="text-center max-w-5xl mx-auto"
                >
                    <motion.div variants={fadeUp}>
                        <Badge
                            className="mb-8 px-5 py-2 text-sm border border-indigo-200 bg-indigo-0 text-indigo-700 rounded-full hover:bg-indigo-100/80">
                            <Sparkles className="w-3.5 h-3.5 mr-2 text-indigo-500"/>
                            La solution des indépendants
                        </Badge>
                    </motion.div>

                    <motion.h1
                        variants={fadeUp}
                        className="font-heading text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight mb-8 leading-[1.05] text-slate-900"
                    >
                        Votre catalogue en ligne{" "}
                        <span
                            className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 via-violet-600 to-indigo-500">
                            en moins de 2 minutes.
                        </span>
                    </motion.h1>

                    <motion.p
                        variants={fadeUp}
                        className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed"
                    >
                        Simple, rapide et sans prise de tête. Créez votre catalogue en quelques clics,
                        générez votre QR code, et mettez en valeur votre savoir-faire.
                    </motion.p>

                    <motion.div variants={fadeUp}
                                className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button
                            size="lg"
                            className="h-14 px-10 text-base rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5"
                            asChild
                        >
                            <Link href="/signup">
                                Créer mon catalogue gratuit
                                <ArrowRight className="h-4 w-4"/>
                            </Link>
                        </Button>
                        <Button
                            size="lg"
                            variant="ghost"
                            className="h-14 px-10 text-base rounded-full text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200"
                            asChild
                        >
                            <Link href="https://qreta.fr/los-barberos-santos" target="_blank" rel="noopener noreferrer">
                                Voir un exemple <ArrowUpRight className="h-4 w-4"/>
                            </Link>
                        </Button>
                    </motion.div>

                    <motion.div
                        variants={fadeUp}
                        className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-slate-400"
                    >
                        {[
                            "Sans carte bancaire",
                            "Prêt en 2 minutes",
                            "Annulable à tout moment",
                        ].map((label, idx) => (
                            <div key={label} className="flex items-center gap-2">
                                {idx > 0 && <div className="hidden sm:block w-1 h-1 rounded-full bg-slate-300"/>}
                                <Check className="h-4 w-4 text-indigo-500"/>
                                <span>{label}</span>
                            </div>
                        ))}
                    </motion.div>

                    <motion.div variants={scaleIn} className="mt-16 relative max-w-4xl mx-auto">
                        <div
                            className="absolute -inset-4 bg-linear-to-b from-indigo-100/40 via-violet-50/20 to-transparent rounded-[2rem] blur-2xl"/>
                        <div
                            className="relative bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
                            <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-100">
                                <div className="w-3 h-3 rounded-full bg-slate-200"/>
                                <div className="w-3 h-3 rounded-full bg-slate-200"/>
                                <div className="w-3 h-3 rounded-full bg-slate-200"/>
                                <div
                                    className="ml-3 flex-1 h-8 bg-slate-50 border border-slate-100 rounded-lg flex items-center px-4">
                                    <span className="text-xs text-slate-400">qreta.fr/le-nom-de-mon-catalogue</span>
                                </div>
                            </div>

                            <div className="relative h-20 bg-linear-to-r from-slate-800 to-slate-700 overflow-hidden">
                                <div
                                    className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvc3ZnPg==')] opacity-50"/>
                                <div className="absolute bottom-3 left-5 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white/20 border-2 border-white/40"/>
                                    <div>
                                        <div className="h-3 bg-white/80 rounded w-32 mb-1"/>
                                        <div className="h-2 bg-white/40 rounded w-20"/>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5">
                                <div
                                    className="h-9 bg-slate-50 border border-slate-100 rounded-lg mb-4 flex items-center px-3">
                                    <div className="w-4 h-4 rounded-full border-2 border-slate-200 mr-2"/>
                                    <span className="text-xs text-slate-300">Rechercher...</span>
                                </div>

                                <div className="flex gap-2 mb-5 overflow-hidden">
                                    {["Services Coiffure", "Taille & Rasage", "Soins Visage", "Produits"].map((cat, i) => (
                                        <div
                                            key={cat}
                                            className={`px-3 py-1.5 rounded-full text-[10px] font-medium whitespace-nowrap ${i === 0 ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500"}`}
                                        >
                                            {cat}
                                        </div>
                                    ))}
                                </div>

                                <div className="mb-3">
                                    <div className="h-3 bg-slate-800 rounded w-28 mb-3"/>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        {name: "Coupe Signature", price: "50€"},
                                        {name: "Coupe Enfant", price: "20€"},
                                        {name: "Rasage Traditionnel", price: "45€"},
                                        {name: "Soin Visage", price: "A partir de 15€"},
                                    ].map((product) => (
                                        <div key={product.name}
                                             className="flex gap-3 p-3 border border-slate-100 rounded-xl">
                                            <div className="w-10 h-10 bg-slate-100 rounded-lg shrink-0"/>
                                            <div className="flex-1 min-w-0">
                                                <div
                                                    className="text-[11px] font-semibold text-slate-700 truncate text-start">{product.name}</div>
                                                <div className="h-1.5 bg-slate-100 rounded w-3/4 mt-1"/>
                                                <div
                                                    className="text-[11px] font-bold text-slate-900 mt-1.5 text-end">{product.price}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};