"use client";

import {motion} from "framer-motion";
import {Button} from "@/components/ui/button";
import {Check} from "lucide-react";
import Link from "next/link";

const stagger = {
    hidden: {opacity: 0},
    show: {opacity: 1, transition: {staggerChildren: 0.15}},
};

const fadeUp = {
    hidden: {opacity: 0, y: 30},
    show: {opacity: 1, y: 0, transition: {duration: 0.7, ease: [0.25, 0.4, 0.25, 1] as const}},
};

const ctaItems = [
    {label: "Prêt en 2 minutes"},
    {label: "Visibilité en ligne"},
    {label: "Aucun engagement"},
];

export const CtaSection = () => (
    <section className="py-28 bg-[#06050e] text-white overflow-hidden relative isolate">
        <div className="absolute inset-0 overflow-hidden">
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-125 bg-linear-to-br from-indigo-600/20 via-violet-500/10 to-transparent rounded-full blur-[120px]"/>
            <div
                className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-indigo-500/20 to-transparent"/>
        </div>
        <div className="container mx-auto px-6 text-center relative z-10">
            <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{once: true}}
                variants={stagger}
            >
                <motion.h2 variants={fadeUp}
                           className="text-4xl md:text-6xl font-bold mb-8 tracking-tight leading-tight">
                    Votre catalogue peut être <br className="hidden md:block"/>
                    en ligne{" "}
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-violet-400">
                        dans 2 minutes.
                    </span>
                </motion.h2>
                <motion.p variants={fadeUp} className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
                    Rejoignez les indépendants qui ont modernisé leur activité avec Qreta.
                </motion.p>
                <motion.div variants={fadeUp}>
                    <Button
                        size="lg"
                        className="h-16 px-14 text-lg rounded-full bg-white text-slate-900 hover:bg-indigo-50 hover:scale-[1.03] transition-all duration-300 font-bold shadow-[0_0_60px_-12px_rgba(255,255,255,0.2)]"
                        asChild
                    >
                        <Link href="/signup">Créer mon compte gratuit</Link>
                    </Button>
                </motion.div>
                <motion.div variants={fadeUp}
                            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8">
                    {ctaItems.map((item) => (
                        <div key={item.label} className="flex items-center gap-3 text-sm text-slate-400">
                            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                                <Check className="h-4 w-4 text-indigo-400"/>
                            </div>
                            <span>{item.label}</span>
                        </div>
                    ))}
                </motion.div>
            </motion.div>
        </div>
    </section>
);