"use client";

import {motion} from "framer-motion";
import {Badge} from "@/components/ui/badge";
import {Layers, RefreshCcw, Store, QrCode, Globe, Smartphone} from "lucide-react";

const stagger = {
    hidden: {opacity: 0},
    show: {opacity: 1, transition: {staggerChildren: 0.15}},
};

const fadeUp = {
    hidden: {opacity: 0, y: 30},
    show: {opacity: 1, y: 0, transition: {duration: 0.7, ease: [0.25, 0.4, 0.25, 1] as const}},
};

export const FeaturesSection = () => (
    <section id="features" className="py-28 bg-[#06050e] text-white overflow-hidden">
        <div className="container mx-auto px-6">
            <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{once: true, margin: "-100px"}}
                variants={stagger}
                className="text-center max-w-3xl mx-auto mb-16"
            >
                <motion.div variants={fadeUp}>
                    <Badge
                        className="mb-6 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/15 border border-indigo-500/20 px-4 py-1.5 text-xs font-semibold tracking-widest uppercase">
                        Fonctionnalités
                    </Badge>
                </motion.div>
                <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-bold mb-5 tracking-tight">
                    Tout ce qu&apos;il faut.{" "}
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-violet-400">
                        Rien de plus.
                    </span>
                </motion.h2>
                <motion.p variants={fadeUp} className="text-lg text-slate-400">
                    Un outil pensé pour les indépendants, avec toutes les fonctionnalités essentielles pour créer et
                    gérer votre catalogue digital
                </motion.p>
            </motion.div>

            <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{once: true, margin: "-50px"}}
                variants={stagger}
                className="grid grid-cols-1 md:grid-cols-6 gap-4 max-w-6xl mx-auto"
            >
                <motion.div
                    variants={fadeUp}
                    whileHover={{y: -4}}
                    className="md:col-span-4 bg-linear-to-br from-indigo-600/8 to-violet-600/4 border border-white/6 rounded-3xl p-10 relative overflow-hidden group"
                >
                    <div
                        className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-all duration-500"/>
                    <div className="relative z-10">
                        <div
                            className="w-12 h-12 bg-indigo-500/15 rounded-xl flex items-center justify-center mb-6 text-indigo-400 group-hover:bg-indigo-500/25 transition-colors">
                            <Layers className="h-6 w-6"/>
                        </div>
                        <h3 className="text-2xl font-bold mb-3">Hybride</h3>
                        <p className="text-slate-400 leading-relaxed max-w-lg">
                            Produits ou prestations ? Affichez tout au même endroit. Vos clients parcourent vos offres
                            comme un menu digital interactif, clair et structuré.
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    variants={fadeUp}
                    whileHover={{y: -4}}
                    className="md:col-span-2 bg-white/3 border border-white/6 rounded-3xl p-8 group hover:border-indigo-500/20 transition-all"
                >
                    <div
                        className="w-12 h-12 bg-indigo-500/15 rounded-xl flex items-center justify-center mb-6 text-indigo-400">
                        <RefreshCcw className="h-6 w-6"/>
                    </div>
                    <h3 className="text-xl font-bold mb-3">Mise à jour en direct</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        Modifiez depuis votre téléphone et votre catalogue se met à jour instantanément.
                    </p>
                </motion.div>

                <motion.div
                    variants={fadeUp}
                    whileHover={{y: -4}}
                    className="md:col-span-2 bg-white/3 border border-white/6 rounded-3xl p-8 group hover:border-indigo-500/20 transition-all"
                >
                    <div
                        className="w-12 h-12 bg-indigo-500/15 rounded-xl flex items-center justify-center mb-6 text-indigo-400">
                        <Store className="h-6 w-6"/>
                    </div>
                    <h3 className="text-xl font-bold mb-3">Multi-activités</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        Créez et gérez autant de catalogues que nécessaire depuis une seule interface.
                    </p>
                </motion.div>

                <motion.div
                    variants={fadeUp}
                    whileHover={{y: -4}}
                    className="md:col-span-4 bg-white/3 border border-white/6 rounded-3xl p-8 flex flex-col sm:flex-row gap-8 items-start group hover:border-indigo-500/20 transition-all"
                >
                    <div className="flex gap-6 flex-1">
                        <div className="space-y-6">
                            {[
                                {
                                    icon: QrCode,
                                    title: "QR Code intégré",
                                    desc: "Générez un QR code unique à imprimer sur votre vitrine, vos cartes ou vos flyers."
                                },
                                {
                                    icon: Globe,
                                    title: "Zéro téléchargement",
                                    desc: "Vos clients consultent votre vitrine depuis n'importe quel navigateur, sans installer d'application."
                                },
                                {
                                    icon: Smartphone,
                                    title: "Optimisé mobile",
                                    desc: "Un rendu parfait sur smartphone, là où vos clients découvrent vos offres en premier."
                                },
                            ].map(({icon: Icon, title, desc}) => (
                                <div key={title} className="flex items-start gap-4">
                                    <div
                                        className="w-10 h-10 bg-indigo-500/15 rounded-lg flex items-center justify-center text-indigo-400 shrink-0">
                                        <Icon className="h-5 w-5"/>
                                    </div>
                                    <div>
                                        <h4 className="font-bold mb-1">{title}</h4>
                                        <p className="text-slate-400 text-sm">{desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    </section>
);