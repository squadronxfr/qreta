"use client";

import {Navbar} from "@/components/landing/navbar";
import {Button} from "@/components/ui/button";
import {motion} from "framer-motion";
import {Spotlight} from "@/components/react-bits/spotlight";
import {
    Check,
    ArrowRight,
    QrCode,
    Store,
    Briefcase,
    Globe,
    Sparkles,
    Layers,
    Hammer
} from "lucide-react";
import Link from "next/link";
import {Badge} from "@/components/ui/badge";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";

export default function LandingPage() {
    const fadeInUp = {
        initial: {opacity: 0, y: 40},
        whileInView: {opacity: 1, y: 0},
        viewport: {once: true},
        transition: {
            duration: 0.8,
            ease: [0.25, 0.4, 0.25, 1]
        }
    };

    return (
        <div
            className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
            <Navbar/>

            {/* --- HERO SECTION --- */}
            <section className="relative pt-40 pb-32 overflow-hidden">
                <div
                    className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
                    <div
                        className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-indigo-400 opacity-20 blur-[100px]"></div>
                </div>

                <div className="container mx-auto px-6 text-center relative z-10">
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{once: true}}
                        variants={{
                            hidden: {opacity: 0, y: 20},
                            show: {opacity: 1, y: 0, transition: {duration: 0.6}}
                        }}
                    >
                        <motion.div variants={fadeInUp}>
                            <Badge variant="outline"
                                   className="mb-8 px-4 py-1.5 text-sm border-indigo-200 bg-white text-indigo-700 rounded-full shadow-sm backdrop-blur-sm">
                                <Sparkles className="w-3 h-3 mr-2 fill-indigo-500"/>
                                Artisans • Commerçants • Prestataires
                            </Badge>
                        </motion.div>

                        <motion.h1 variants={fadeInUp}
                                   className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-[1.05]">
                            Vendez votre talent <br/>
                            <span
                                className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 animate-gradient">
                sans aucune limite.
              </span>
                        </motion.h1>

                        <motion.p variants={fadeInUp}
                                  className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
                            Que vous proposiez des produits, des services ou des interventions.
                            Digitalisez votre catalogue et partagez-le instantanément.
                            <span className="block mt-2 text-slate-900 font-medium">Du plombier au fleuriste, une vitrine pour tous.</span>
                        </motion.p>

                        <motion.div variants={fadeInUp}
                                    className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                            <Button size="lg"
                                    className="h-14 px-10 text-lg rounded-full bg-slate-900 hover:bg-slate-800 shadow-2xl hover:shadow-indigo-500/20 transition-all hover:-translate-y-1"
                                    asChild>
                                <Link href="/login">Créer mon catalogue gratuit</Link>
                            </Button>
                            <Button size="lg" variant="ghost"
                                    className="h-14 px-10 text-lg rounded-full text-slate-600 hover:bg-slate-50 hover:text-indigo-600">
                                Voir la démo <ArrowRight className="ml-2 h-5 w-5"/>
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* --- BENTO GRID FEATURES  --- */}
            <section id="features" className="py-32 bg-slate-50 border-y border-slate-200">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6 text-slate-900">
                            Un outil, mille métiers.
                        </h2>
                        <p className="text-lg text-slate-600">
                            La flexibilité est notre force. Qreta est conçu pour s&#39;adapter à la structure unique de
                            votre activité.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">

                        {/* Carte 1 : HYBRIDE (Le point fort) */}
                        <motion.div
                            whileHover={{y: -5}}
                            className="md:col-span-2 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group"
                        >
                            <div
                                className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Briefcase className="h-64 w-64 text-indigo-900"/>
                            </div>
                            <div className="relative z-10">
                                <div
                                    className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 text-indigo-600">
                                    <Layers className="h-7 w-7"/>
                                </div>
                                <h3 className="font-heading text-2xl font-bold mb-4">L&#39;Hybride Parfait : Services &
                                    Produits</h3>
                                <p className="text-slate-600 text-lg leading-relaxed max-w-xl">
                                    Ne choisissez plus. Un plombier peut afficher ses <strong>forfaits
                                    d&#39;intervention</strong> ET son catalogue de <strong>robinetterie</strong>.
                                    Un coiffeur présente ses <strong>coupes</strong> ET ses <strong>shampoings</strong>.
                                    Tout est au même endroit.
                                </p>
                            </div>
                        </motion.div>

                        {/* Carte 2 : VISIBILITÉ */}
                        <motion.div
                            whileHover={{y: -5}}
                            className="bg-slate-900 p-10 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden group"
                        >
                            <div
                                className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500 blur-[80px] rounded-full"></div>
                            <div
                                className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
                                <Globe className="h-7 w-7 text-white"/>
                            </div>
                            <h3 className="font-heading text-2xl font-bold mb-4">Votre carte de visite 2.0</h3>
                            <p className="text-slate-300 leading-relaxed">
                                Plus efficace qu&#39;un site web complexe, plus complet qu&#39;une carte de visite.
                                Votre lien
                                qreta est votre nouveau portfolio.
                            </p>
                        </motion.div>

                        {/* Carte 3 : Multi-activités */}
                        <motion.div
                            whileHover={{y: -5}}
                            className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm"
                        >
                            <div
                                className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 text-indigo-600">
                                <Store className="h-7 w-7"/>
                            </div>
                            <h3 className="font-heading text-2xl font-bold mb-4">Gestion Centralisée</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Vous avez un atelier et une boutique ? Une activité de service et de la vente ? Pilotez
                                tout depuis une interface unique.
                            </p>
                        </motion.div>

                        {/* Carte 4 : SIMPLICITÉ */}
                        <motion.div
                            whileHover={{y: -5}}
                            className="md:col-span-2 bg-gradient-to-br from-indigo-50 to-white p-10 rounded-[2.5rem] border border-indigo-100 shadow-sm relative overflow-hidden"
                        >
                            <div className="flex flex-col md:flex-row items-center gap-10">
                                <div className="flex-1">
                                    <div
                                        className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mb-6 text-amber-600">
                                        <Hammer className="h-7 w-7"/>
                                    </div>
                                    <h3 className="font-heading text-2xl font-bold mb-4">Fait pour ceux qui font.</h3>
                                    <p className="text-slate-600 text-lg leading-relaxed">
                                        Vous êtes expert dans votre métier, pas en informatique.
                                        Nous avons créé l&#39;interface la plus simple du marché. Ajoutez une photo, un
                                        prix, un titre. C&#39;est en ligne.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </section>

            {/* --- SPOTLIGHT EXPERIENCE --- */}
            <section id="benefits" className="py-32 overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div className="order-2 lg:order-1 relative">
                            <div
                                className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-[3rem] blur-lg opacity-30"></div>
                            <Spotlight
                                className="group bg-slate-950 rounded-[2.5rem] p-12 relative overflow-hidden text-center border border-slate-800 shadow-2xl z-10">

                                <div
                                    className="bg-white rounded-3xl p-6 inline-block mb-10 shadow-[0_0_50px_-12px_rgba(255,255,255,0.3)]">
                                    <QrCode className="h-48 w-48 text-slate-900"/>
                                </div>

                                <h3 className="text-white font-heading text-3xl font-bold mb-3">Le réflexe client</h3>
                                <p className="text-slate-400 text-lg">Un scan, et tout votre univers apparaît</p>
                            </Spotlight>
                        </div>

                        <div className="order-1 lg:order-2">
                            <Badge
                                className="mb-8 bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-none px-4 py-1.5 text-sm font-bold tracking-wide uppercase">
                                Professionnel
                            </Badge>
                            <h2 className="font-heading text-5xl md:text-6xl font-bold mb-8 leading-tight text-slate-900">
                                Valorisez ce que vous vendez.
                            </h2>
                            <p className="text-xl text-slate-600 mb-10 leading-relaxed font-light">
                                Un beau catalogue inspire confiance. Que ce soit pour une réparation à domicile ou un
                                produit artisanal, la présentation fait la différence sur le devis final.
                            </p>

                            <div className="space-y-6">
                                {[
                                    {
                                        title: "Pour les Services",
                                        desc: "Affichez vos tarifs horaires, forfaits et options."
                                    },
                                    {title: "Pour les Produits", desc: "Photos HD, descriptions techniques et stock."},
                                    {
                                        title: "Mise à jour Réelle",
                                        desc: "Changez vos disponibilités ou prix instantanément."
                                    },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-4">
                                        <div
                                            className="mt-1 w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                                            <Check className="h-3.5 w-3.5"/>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900">{item.title}</h4>
                                            <p className="text-slate-500 text-sm">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- PRICING SECTION --- */}
            <section id="pricing" className="py-32 bg-slate-50 border-t border-slate-200">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="font-heading text-4xl font-bold mb-4">Investissement rentabilisé.</h2>
                        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                            Des forfaits clairs pour accompagner votre activité, quelle que soit sa taille.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">

                        {/* PLAN STARTER */}
                        <Card className="border-slate-200 shadow-sm bg-white/50 backdrop-blur-sm">
                            <CardHeader className="pb-8">
                                <CardTitle className="font-heading text-xl text-slate-600">Starter</CardTitle>
                                <div className="mt-4 flex items-baseline gap-1">
                                    <span className="text-4xl font-bold text-slate-900">0€</span>
                                    <span className="text-slate-500">/mois</span>
                                </div>
                                <CardDescription className="mt-2">Pour les auto-entrepreneurs.</CardDescription>
                            </CardHeader>
                            <CardContent className="pb-8">
                                <ul className="space-y-4 text-sm text-slate-600">
                                    <li className="flex gap-3"><Check className="h-4 w-4 text-slate-900"/> 1 Activité
                                    </li>
                                    <li className="flex gap-3"><Check className="h-4 w-4 text-slate-900"/> 15 Références
                                        max
                                    </li>
                                    <li className="flex gap-3"><Check className="h-4 w-4 text-slate-900"/> QR Code
                                        standard
                                    </li>
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button variant="outline"
                                        className="w-full h-12 rounded-xl font-semibold border-slate-200" asChild>
                                    <Link href="/login">Créer mon compte</Link>
                                </Button>
                            </CardFooter>
                        </Card>

                        {/* PLAN PRO (Hero) */}
                        <div className="relative transform md:-translate-y-8 z-10">
                            <div
                                className="absolute -inset-[1px] bg-gradient-to-b from-indigo-500 to-purple-600 rounded-[24px]"/>
                            <Card className="border-none shadow-2xl relative bg-white h-full">
                                <div className="absolute top-0 inset-x-0 -mt-3 flex justify-center">
                  <span
                      className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-lg">
                    Recommandé
                  </span>
                                </div>
                                <CardHeader className="pb-8 pt-10">
                                    <CardTitle className="font-heading text-xl text-indigo-600 font-bold">Pro &
                                        Artisan</CardTitle>
                                    <div className="mt-4 flex items-baseline gap-1">
                                        <span className="text-5xl font-bold text-slate-900">29€</span>
                                        <span className="text-slate-500">/mois</span>
                                    </div>
                                    <CardDescription className="mt-2">Pour développer votre affaire.</CardDescription>
                                </CardHeader>
                                <CardContent className="pb-8">
                                    <ul className="space-y-4 text-sm text-slate-600">
                                        <li className="flex gap-3 font-bold text-slate-900"><Check
                                            className="h-4 w-4 text-indigo-600"/> Tout en illimité
                                        </li>
                                        <li className="flex gap-3 font-bold text-slate-900"><Check
                                            className="h-4 w-4 text-indigo-600"/> Services & Produits
                                        </li>
                                        <li className="flex gap-3"><Check className="h-4 w-4 text-indigo-600"/> QR Code
                                            avec votre Logo
                                        </li>
                                        <li className="flex gap-3"><Check
                                            className="h-4 w-4 text-indigo-600"/> Analytics de consultation
                                        </li>
                                        <li className="flex gap-3"><Check className="h-4 w-4 text-indigo-600"/> Support
                                            dédié
                                        </li>
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 h-14 text-md font-bold shadow-lg shadow-indigo-200"
                                        asChild>
                                        <Link href="/login">Essayer 14 jours (Gratuit)</Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>

                        {/* PLAN AGENCY */}
                        <Card className="border-slate-200 shadow-sm bg-white/50 backdrop-blur-sm">
                            <CardHeader className="pb-8">
                                <CardTitle className="font-heading text-xl text-slate-600">Réseau</CardTitle>
                                <div className="mt-4 flex items-baseline gap-1">
                                    <span className="text-4xl font-bold text-slate-900">Sur devis</span>
                                </div>
                                <CardDescription className="mt-2">Franchises & Groupements.</CardDescription>
                            </CardHeader>
                            <CardContent className="pb-8">
                                <ul className="space-y-4 text-sm text-slate-600">
                                    <li className="flex gap-3"><Check className="h-4 w-4 text-slate-900"/> Multi-comptes
                                    </li>
                                    <li className="flex gap-3"><Check className="h-4 w-4 text-slate-900"/> API &
                                        Intégrations
                                    </li>
                                    <li className="flex gap-3"><Check className="h-4 w-4 text-slate-900"/> Formation
                                        équipe
                                    </li>
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button variant="outline"
                                        className="w-full h-12 rounded-xl font-semibold border-slate-200">
                                    Contacter l&#39;équipe
                                </Button>
                            </CardFooter>
                        </Card>

                    </div>
                </div>
            </section>

            {/* --- FINAL CTA --- */}
            <section className="py-24 bg-slate-950 text-white overflow-hidden relative isolate">
                <div
                    className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-indigo-600/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"/>
                <div
                    className="absolute bottom-0 left-0 -z-10 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"/>

                <div className="container mx-auto px-6 text-center">
                    <h2 className="font-heading text-4xl md:text-6xl font-bold mb-8 tracking-tight">
                        Prêt à digitaliser votre activité ?
                    </h2>
                    <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto font-light">
                        Rejoignez les indépendants qui ont modernisé leur image avec qreta.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button size="lg"
                                className="h-16 px-12 text-xl rounded-full bg-white text-slate-950 hover:bg-indigo-50 hover:scale-105 transition-all font-bold"
                                asChild>
                            <Link href="/login">Créer mon catalogue maintenant</Link>
                        </Button>
                    </div>
                    <p className="mt-8 text-sm text-slate-600 font-medium uppercase tracking-widest">
                        30 secondes d&#39;installation • Annulable à tout moment
                    </p>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="py-12 bg-slate-950 text-slate-400 border-t border-slate-900/50">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="font-heading text-2xl font-bold text-white">
                        qreta<span className="text-indigo-500">.</span>
                    </div>
                    <div className="text-sm font-medium">
                        © 2026 qreta Inc. Fait avec passion pour tous les pros.
                    </div>
                    <div className="flex gap-8 text-sm font-medium">
                        <a href="#" className="hover:text-indigo-400 transition-colors">Légal</a>
                        <a href="#" className="hover:text-indigo-400 transition-colors">Confidentialité</a>
                        <a href="mailto:hello@qreta.io" className="hover:text-indigo-400 transition-colors">Support</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}