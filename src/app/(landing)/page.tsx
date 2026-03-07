"use client";

import {useState} from "react";
import {Navbar} from "@/components/landing/navbar";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {Spotlight} from "@/components/react-bits/spotlight";
import {motion, AnimatePresence} from "framer-motion";
import Link from "next/link";
import {SUBSCRIPTION_PLANS} from "@/config/subscription";
import {
    Check,
    ArrowRight,
    QrCode,
    Sparkles,
    Smartphone,
    Layers,
    RefreshCcw,
    Store,
    ChevronDown,
    LayoutDashboard,
    Share2,
    Zap,
    Globe,
    ArrowUpRight,
} from "lucide-react";
import {faqs} from "@/config/faqs";

const stagger = {
    hidden: {opacity: 0},
    show: {
        opacity: 1,
        transition: {staggerChildren: 0.15},
    },
};

const fadeUp = {
    hidden: {opacity: 0, y: 30},
    show: {opacity: 1, y: 0, transition: {duration: 0.7, ease: [0.25, 0.4, 0.25, 1] as const}},
};

const scaleIn = {
    hidden: {opacity: 0, scale: 0.9},
    show: {opacity: 1, scale: 1, transition: {duration: 0.6, ease: [0.25, 0.4, 0.25, 1] as const}},
};

export default function LandingPage() {
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

    return (
        <div
            className="min-h-screen bg-[#fafafa] text-slate-900 font-sans antialiased selection:bg-indigo-200/60 selection:text-indigo-900">
            <Navbar/>

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
                                asChild>
                                <Link href="https://qreta.fr/los-barberos-santos"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                >
                                    Voir un exemple <ArrowUpRight className="h-4 w-4"/>
                                </Link>
                            </Button>

                        </motion.div>

                        <motion.div
                            variants={fadeUp}
                            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-slate-400"
                        >
                            <div className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-indigo-500"/>
                                <span>Sans carte bancaire</span>
                            </div>
                            <div className="hidden sm:block w-1 h-1 rounded-full bg-slate-300"/>
                            <div className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-indigo-500"/>
                                <span>Prêt en 2 minutes</span>
                            </div>
                            <div className="hidden sm:block w-1 h-1 rounded-full bg-slate-300"/>
                            <div className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-indigo-500"/>
                                <span>Annulable à tout moment</span>
                            </div>
                        </motion.div>

                        <motion.div
                            variants={scaleIn}
                            className="mt-16 relative max-w-4xl mx-auto"
                        >
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

                                <div
                                    className="relative h-20 bg-linear-to-r from-slate-800 to-slate-700 overflow-hidden">
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
                                                className={`px-3 py-1.5 rounded-full text-[10px] font-medium whitespace-nowrap ${
                                                    i === 0
                                                        ? "bg-slate-900 text-white"
                                                        : "bg-slate-100 text-slate-500"
                                                }`}
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
                            Créez votre catalogue digital en quelques clics, sans compétences techniques ni prise de
                            tête.
                        </motion.p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{once: true, margin: "-50px"}}
                        variants={stagger}
                        className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
                    >
                        {[
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
                        ].map((step, idx) => (
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
                            <span
                                className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-violet-400">
                Rien de plus.
              </span>
                        </motion.h2>
                        <motion.p variants={fadeUp} className="text-lg text-slate-400">
                            Un outil pensé pour les indépendants, avec toutes les fonctionnalités essentielles pour
                            créer et gérer votre catalogue digital
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
                                    Produits ou prestations ? Affichez tout au même endroit. Vos clients parcourent vos
                                    offres comme un menu digital interactif, clair et structuré.
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
                                    <div className="flex items-start gap-4">
                                        <div
                                            className="w-10 h-10 bg-indigo-500/15 rounded-lg flex items-center justify-center text-indigo-400 shrink-0">
                                            <QrCode className="h-5 w-5"/>
                                        </div>
                                        <div>
                                            <h4 className="font-bold mb-1">QR Code intégré</h4>
                                            <p className="text-slate-400 text-sm">Générez un QR code unique à imprimer
                                                sur votre vitrine, vos cartes ou vos flyers.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div
                                            className="w-10 h-10 bg-indigo-500/15 rounded-lg flex items-center justify-center text-indigo-400 shrink-0">
                                            <Globe className="h-5 w-5"/>
                                        </div>
                                        <div>
                                            <h4 className="font-bold mb-1">Zéro téléchargement</h4>
                                            <p className="text-slate-400 text-sm">Vos clients consultent votre vitrine
                                                depuis n&apos;importe quel navigateur, sans installer
                                                d&apos;application.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div
                                            className="w-10 h-10 bg-indigo-500/15 rounded-lg flex items-center justify-center text-indigo-400 shrink-0">
                                            <Smartphone className="h-5 w-5"/>
                                        </div>
                                        <div>
                                            <h4 className="font-bold mb-1">Optimisé mobile</h4>
                                            <p className="text-slate-400 text-sm">Un rendu parfait sur smartphone, là où
                                                vos clients découvrent vos offres en premier.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

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
                                                        className={`px-3 py-1.5 rounded-full text-[9px] font-medium ${
                                                            i === 0
                                                                ? "bg-indigo-500/20 text-indigo-300"
                                                                : "bg-white/5 text-slate-500"
                                                        }`}
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
                                                        <div
                                                            className="text-[10px] text-indigo-300 font-semibold self-center">
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
                                    className="mb-6 bg-white text-indigo-600  px-4 py-1.5 text-sm font-semibold tracking-widest uppercase">
                                    Professionnalisme
                                </Badge>
                            </motion.div>
                            <motion.h2 variants={fadeUp}
                                       className="text-4xl md:text-5xl font-bold mb-8 leading-tight text-slate-900 tracking-tight">
                                L&apos;image que votre travail{" "}
                                <span
                                    className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-violet-600">
                  mérite.
                </span>
                            </motion.h2>
                            <motion.p variants={fadeUp} className="text-lg text-slate-500 mb-10 leading-relaxed">
                                Oubliez les PDF illisibles ou les tarifs donnés à l&apos;oral. Offrez à vos clients un
                                catalogue en ligne élégant qui rassure et met en valeur votre professionnalisme.
                            </motion.p>

                            <motion.div variants={stagger} className="space-y-4">
                                {[
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
                                ].map((item, idx) => (
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
                            <span
                                className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-violet-600">
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
                                        className={`h-full relative overflow-hidden ${
                                            isHighlighted
                                                ? "bg-[#0c0b16] text-white border-none shadow-2xl shadow-indigo-500/20"
                                                : "border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow"
                                        }`}
                                    >
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
                                                className={`text-lg ${
                                                    isHighlighted ? "text-indigo-300 font-bold" : "text-slate-500 font-semibold"
                                                }`}
                                            >
                                                {plan.name}
                                            </CardTitle>
                                            <div className="mt-4 flex items-baseline gap-1">
                        <span className={`text-5xl font-bold ${isHighlighted ? "text-white" : "text-slate-900"}`}>
                          {plan.price}€
                        </span>
                                                <span className={isHighlighted ? "text-slate-400" : "text-slate-500"}>/mois TTC</span>
                                            </div>
                                            <CardDescription
                                                className={`mt-2 min-h-10 ${isHighlighted ? "text-slate-400" : "text-slate-500"}`}>
                                                {plan.description}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="pb-6">
                                            <ul className="space-y-3.5 text-sm">
                                                {plan.features.map((feature, idx) => (
                                                    <li
                                                        key={idx}
                                                        className={`flex gap-3 ${
                                                            isHighlighted ? "text-slate-300" : "text-slate-600"
                                                        }`}
                                                    >
                                                        <div
                                                            className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                                                                isHighlighted
                                                                    ? "bg-indigo-500/20 text-indigo-400"
                                                                    : "bg-slate-100 text-slate-500"
                                                            }`}
                                                        >
                                                            <Check className="h-3 w-3"/>
                                                        </div>
                                                        <span>{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                        <CardFooter className="mt-auto">
                                            <Button
                                                className={`w-full h-12 rounded-xl font-semibold transition-all ${
                                                    isHighlighted
                                                        ? "bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40"
                                                        : "bg-slate-900 hover:bg-slate-800 text-white"
                                                }`}
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

            <section className="py-28 bg-white border-t border-slate-100">
                <div className="container mx-auto px-6 max-w-3xl">
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{once: true}}
                        variants={stagger}
                        className="text-center mb-16"
                    >
                        <motion.h2 variants={fadeUp} className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">
                            Questions Fréquentes
                        </motion.h2>
                        <motion.p variants={fadeUp} className="text-slate-500">
                            Tout ce que vous devez savoir avant de vous lancer.
                        </motion.p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{once: true}}
                        variants={stagger}
                        className="space-y-3"
                    >
                        {faqs.map((faq, idx) => (
                            <motion.div
                                key={idx}
                                variants={fadeUp}
                                className={`border rounded-2xl overflow-hidden transition-all ${
                                    openFaqIndex === idx
                                        ? "border-indigo-200 bg-indigo-50/30 shadow-sm"
                                        : "border-slate-200 bg-white hover:border-slate-300"
                                }`}
                            >
                                <button
                                    onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                                    className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                                >
                                    <span className="font-semibold text-slate-900 pr-4">{faq.question}</span>
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                                            openFaqIndex === idx
                                                ? "bg-indigo-100 text-indigo-600 rotate-180"
                                                : "bg-slate-100 text-slate-400"
                                        }`}
                                    >
                                        <ChevronDown className="h-4 w-4"/>
                                    </div>
                                </button>
                                <AnimatePresence>
                                    {openFaqIndex === idx && (
                                        <motion.div
                                            initial={{height: 0, opacity: 0}}
                                            animate={{height: "auto", opacity: 1}}
                                            exit={{height: 0, opacity: 0}}
                                            transition={{duration: 0.3, ease: "easeInOut"}}
                                        >
                                            <div className="px-6 pb-5 text-slate-600 leading-relaxed">{faq.answer}</div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

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
                            <span
                                className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-violet-400">
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
                        <motion.div
                            variants={fadeUp}
                            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8"
                        >
                            {[
                                {icon: Check, label: "Prêt en 2 minutes"},
                                {icon: Check, label: "Visibilité en ligne"},
                                {icon: Check, label: "Aucun engagement"},
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 text-sm text-slate-400">
                                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                                        <item.icon className="h-4 w-4 text-indigo-400"/>
                                    </div>
                                    <span>{item.label}</span>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            <footer className="py-16 bg-[#06050e] text-slate-400 border-t border-white/5">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        <div className="md:col-span-2">
                            <div className="text-2xl font-bold text-white mb-4">
                                Qreta<span className="text-indigo-500">.</span>
                            </div>
                            <p className="text-slate-500 max-w-sm leading-relaxed text-sm">
                                La solution la plus simple pour créer votre catalogue en ligne et partager vos offres
                                avec vos clients.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Produit</h4>
                            <div className="space-y-3">
                                <Link href="/#features"
                                      className="block text-sm hover:text-indigo-400 transition-colors">Fonctionnalités</Link>
                                <Link href="/#pricing"
                                      className="block text-sm hover:text-indigo-400 transition-colors">Tarifs</Link>
                                <Link href="/signup" className="block text-sm hover:text-indigo-400 transition-colors">Créer
                                    un compte</Link>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Légal</h4>
                            <div className="space-y-3">
                                <Link href="/terms" className="block text-sm hover:text-indigo-400 transition-colors">Conditions
                                    d&apos;utilisation</Link>
                                <Link href="/privacy"
                                      className="block text-sm hover:text-indigo-400 transition-colors">Confidentialité</Link>
                                <a href="mailto:hello@qreta.io"
                                   className="block text-sm hover:text-indigo-400 transition-colors">Support</a>
                            </div>
                        </div>
                    </div>
                    <div
                        className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                        <span className="text-sm text-slate-600"> © {new Date().getFullYear()} Qreta.</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}