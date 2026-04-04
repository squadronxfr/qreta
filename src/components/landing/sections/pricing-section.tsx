"use client";

import {motion} from "framer-motion";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Check} from "lucide-react";
import Link from "next/link";
import {SUBSCRIPTION_PLANS} from "@/config/subscription";

const stagger = {
    hidden: {opacity: 0},
    show: {opacity: 1, transition: {staggerChildren: 0.15}},
};

const fadeUp = {
    hidden: {opacity: 0, y: 30},
    show: {opacity: 1, y: 0, transition: {duration: 0.7, ease: [0.25, 0.4, 0.25, 1] as const}},
};

export const PricingSection = () => (
    <section id="pricing" className="py-28 bg-[#fafafa] border-t border-slate-100">
        <div className="container mx-auto px-6">
            <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{once: true, margin: "-100px"}}
                variants={stagger}
                className="text-center mb-20"
            >
                <motion.h2 variants={fadeUp}
                           className="text-4xl md:text-5xl font-bold mb-5 tracking-tight text-slate-900">
                    Un investissement ridicule.{" "}
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-violet-600">
    Une image pro.
</span>
                </motion.h2>
                <motion.p variants={fadeUp} className="text-slate-500 text-lg max-w-2xl mx-auto">
                    Des forfaits clairs pour accompagner votre activité, sans aucun frais caché.
                </motion.p>
            </motion.div>

            <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{once: true, margin: "-50px"}}
                variants={stagger}
                className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-start"
            >
                {Object.values(SUBSCRIPTION_PLANS).map((plan) => {
                    const isHighlighted = plan.key === "starter";
                    return (
                        <motion.div
                            key={plan.key}
                            variants={fadeUp}
                            whileHover={{y: -6}}
                            className={`relative ${isHighlighted ? "md:-translate-y-6 z-10" : ""}`}
                        >
                            {isHighlighted && (
                                <div
                                    className="absolute -inset-px bg-linear-to-b from-indigo-500 via-violet-500 to-indigo-600 rounded-[1.6rem] opacity-90"/>
                            )}
                            <Card
                                className={`h-full relative overflow-hidden ${isHighlighted ? "bg-[#0c0b16] text-white border-none shadow-2xl shadow-indigo-500/20" : "border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow"}`}>
                                {isHighlighted && (
                                    <>
                                        <div
                                            className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl"/>
                                        <div className="absolute top-0 inset-x-0 -mt-px flex justify-center">
                <span
                    className="bg-linear-to-r from-indigo-500 to-violet-500 text-white text-[10px] font-bold px-4 py-1 rounded-b-lg uppercase tracking-widest">
                    Recommandé
                    </span>
                                        </div>
                                    </>
                                )}
                                <CardHeader className={`pb-6 ${isHighlighted ? "pt-10" : ""}`}>
                                    <CardTitle
                                        className={`text-lg ${isHighlighted ? "text-indigo-300 font-bold" : "text-slate-500 font-semibold"}`}>
                                        {plan.name}
                                    </CardTitle>
                                    <div className="mt-4 flex items-baseline gap-1">
            <span className={`text-5xl font-bold ${isHighlighted ? "text-white" : "text-slate-900"}`}>
            {plan.price}€
            </span>
                                        <span
                                            className={isHighlighted ? "text-slate-400" : "text-slate-500"}>/mois TTC</span>
                                    </div>
                                    <CardDescription
                                        className={`mt-2 min-h-10 ${isHighlighted ? "text-slate-400" : "text-slate-500"}`}>
                                        {plan.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pb-6">
                                    <ul className="space-y-3.5 text-sm">
                                        {plan.features.map((feature, idx) => (
                                            <li key={idx}
                                                className={`flex gap-3 ${isHighlighted ? "text-slate-300" : "text-slate-600"}`}>
                                                <div
                                                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${isHighlighted ? "bg-indigo-500/20 text-indigo-400" : "bg-slate-100 text-slate-500"}`}>
                                                    <Check className="h-3 w-3"/>
                                                </div>
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                                <CardFooter className="mt-auto">
                                    <Button
                                        className={`w-full h-12 rounded-xl font-semibold transition-all ${isHighlighted ? "bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40" : "bg-slate-900 hover:bg-slate-800 text-white"}`}
                                        asChild
                                    >
                                        <Link href="/signup">
                                            {plan.price === 0 ? "Commencer gratuitement" : "Essayer ce plan"}
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
    </section>
);