"use client";

import {motion} from "framer-motion";
import {Badge} from "@/components/ui/badge";
import {Zap, Layers, Globe, QrCode, Store} from "lucide-react";

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

const benefitItems = [
    {
        icon: Zap,
        title: "Des fiches claires",
        desc: "Chaque offre est présentée proprement avec son visuel, son prix et sa description sur une interface moderne.",
    },
    {
        icon: Layers,
        title: "Tarifs transparents",
        desc: "Affichez vos forfaits et options en détail pour éviter tout malentendu avec vos clients.",
    },
    {
        icon: Globe,
        title: "100% Accessible",
        desc: "Votre catalogue se consulte directement depuis n'importe quel navigateur smartphone, sans application à télécharger.",
    },
];

export const BenefitsSection = () => (
    <section id="benefits" className="py-28 bg-white overflow-hidden">
        <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-20 items-center max-w-6xl mx-auto">
                <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{once: true, margin: "-100px"}}
                    variants={stagger}
                    className="order-2 lg:order-1"
                >
                    <div className="relative flex justify-center">
                        <motion.div variants={scaleIn} className="relative">
                            <div
                                className="absolute -inset-8 bg-linear-to-b from-indigo-100/50 to-violet-100/30 rounded-[3rem] blur-2xl"/>
                            <div
                                className="relative w-70 bg-[#0a0a12] rounded-[3rem] p-3 shadow-2xl border border-slate-800/50">
                                <div
                                    className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-[#0a0a12] rounded-b-2xl z-20"/>
                                <div
                                    className="bg-[#111019] rounded-[2.2rem] overflow-hidden pt-10 pb-6 px-5 min-h-120 flex flex-col">
                                    <div className="text-center mb-6">
                                        <div
                                            className="w-10 h-10 bg-indigo-500/20 rounded-xl mx-auto mb-3 flex items-center justify-center">
                                            <Store className="h-5 w-5 text-indigo-400"/>
                                        </div>
                                        <div className="h-3 bg-white/15 rounded w-24 mx-auto mb-1.5"/>
                                        <div className="h-2 bg-white/8 rounded w-16 mx-auto"/>
                                    </div>
                                    <div className="flex gap-2 mb-5">
                                        {["Tout", "Produits", "Services"].map((tab, i) => (
                                            <div
                                                key={tab}
                                                className={`px-3 py-1.5 rounded-full text-[9px] font-medium ${i === 0 ? "bg-indigo-500/20 text-indigo-300" : "bg-white/5 text-slate-500"}`}
                                            >
                                                {tab}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="space-y-3 flex-1">
                                        {[1, 2, 3].map((item) => (
                                            <div key={item} className="flex gap-3 bg-white/4 rounded-xl p-3">
                                                <div
                                                    className="w-12 h-12 bg-linear-to-br from-indigo-500/10 to-violet-500/10 rounded-lg shrink-0"/>
                                                <div className="flex-1 space-y-1.5 py-0.5">
                                                    <div className="h-2.5 bg-white/12 rounded w-3/4"/>
                                                    <div className="h-2 bg-white/6 rounded w-1/2"/>
                                                </div>
                                                <div className="text-[10px] text-indigo-300 font-semibold self-center">
                                                    {item * 15},90€
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div
                                        className="mt-5 pt-4 border-t border-white/5 flex items-center justify-center gap-2">
                                        <QrCode className="h-4 w-4 text-slate-500"/>
                                        <span className="text-[10px] text-slate-500">Partagé via QR Code</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{once: true, margin: "-100px"}}
                    variants={stagger}
                    className="order-1 lg:order-2"
                >
                    <motion.div variants={fadeUp}>
                        <Badge
                            className="mb-6 bg-white text-indigo-600 px-4 py-1.5 text-sm font-semibold tracking-widest uppercase">
                            Professionnalisme
                        </Badge>
                    </motion.div>
                    <motion.h2 variants={fadeUp}
                               className="text-4xl md:text-5xl font-bold mb-8 leading-tight text-slate-900 tracking-tight">
                        L&apos;image que votre travail{" "}
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-violet-600">
                            mérite.
                        </span>
                    </motion.h2>
                    <motion.p variants={fadeUp} className="text-lg text-slate-500 mb-10 leading-relaxed">
                        Oubliez les PDF illisibles ou les tarifs donnés à l&apos;oral. Offrez à vos clients un catalogue
                        en ligne élégant qui rassure et met en valeur votre professionnalisme.
                    </motion.p>
                    <motion.div variants={stagger} className="space-y-4">
                        {benefitItems.map((item, idx) => (
                            <motion.div
                                key={idx}
                                variants={fadeUp}
                                className="flex items-start gap-4 p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all"
                            >
                                <div
                                    className="mt-0.5 w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                    <item.icon className="h-5 w-5"/>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
                                    <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </div>
    </section>
);