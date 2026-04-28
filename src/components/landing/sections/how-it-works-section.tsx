"use client";

import {motion} from "framer-motion";
import {Badge} from "@/components/ui/badge";
import {LayoutDashboard, Smartphone, Share2} from "lucide-react";

const stagger = {
    hidden: {opacity: 0},
    show: {opacity: 1, transition: {staggerChildren: 0.15}},
};

const fadeUp = {
    hidden: {opacity: 0, y: 30},
    show: {opacity: 1, y: 0, transition: {duration: 0.7, ease: [0.25, 0.4, 0.25, 1] as const}},
};

const steps = [
    {
        icon: LayoutDashboard,
        num: "1",
        title: "Créez votre espace",
        desc: "Inscrivez-vous en un clic et ajoutez le nom de votre activité.",
    },
    {
        icon: Smartphone,
        num: "2",
        title: "Ajoutez vos offres",
        desc: "Produits physiques ou prestations, ajoutez-les avec vos prix.",
    },
    {
        icon: Share2,
        num: "3",
        title: "Partagez partout",
        desc: "Imprimez votre QR Code ou partagez votre lien sur vos réseaux sociaux.",
    },
];

export const HowItWorksSection = () => (
    <section className="py-28 bg-white border-t border-b border-slate-100">
        <div className="container mx-auto px-6">
            <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{once: true, margin: "-100px"}}
                variants={stagger}
                className="text-center max-w-3xl mx-auto mb-20"
            >
                <motion.div variants={fadeUp}>
                    <Badge
                        className="mb-6 bg-white text-indigo-600 px-4 py-1.5 text-sm font-semibold tracking-widest uppercase">
                        Comment ça marche
                    </Badge>
                </motion.div>
                <motion.h2 variants={fadeUp}
                           className="text-4xl md:text-5xl font-bold mb-5 text-slate-900 tracking-tight">
                    Prêt en 3 étapes
                </motion.h2>
                <motion.p variants={fadeUp} className="text-lg text-slate-500">
                    Créez votre catalogue digital en quelques clics, sans compétences techniques ni prise de tête.
                </motion.p>
            </motion.div>

            <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{once: true, margin: "-50px"}}
                variants={stagger}
                className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
            >
                {steps.map((step, idx) => (
                    <motion.div
                        key={idx}
                        variants={fadeUp}
                        className="flex flex-col items-center text-center p-8 rounded-2xl border border-slate-100 bg-slate-50/50 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all group"
                    >
                        <div
                            className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white mb-5 group-hover:bg-indigo-600 transition-colors duration-300">
                            <step.icon className="h-6 w-6"/>
                        </div>
                        <span
                            className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 group-hover:text-indigo-600 transition-colors">
                            Étape {step.num}
                        </span>
                        <h3 className="text-lg font-bold mb-2 text-slate-900">{step.title}</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    </section>
);