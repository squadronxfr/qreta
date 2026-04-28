import {Navbar} from "@/components/landing/navbar";
import {FaqAccordion} from "@/components/landing/faq";
import {HeroSection} from "@/components/landing/sections/hero-section";
import {DynamicSections} from "@/components/landing/sections/dynamic-sections";
import Link from "next/link";

export default function LandingPage() {
    return (
        <div
            className="min-h-screen bg-[#fafafa] text-slate-900 font-sans antialiased selection:bg-indigo-200/60 selection:text-indigo-900">
            <Navbar/>
            <HeroSection/>
            <DynamicSections/>

            <section className="py-28 bg-white border-t border-slate-100">
                <div className="container mx-auto px-6 max-w-3xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">
                            Questions Fréquentes
                        </h2>
                        <p className="text-slate-500">
                            Tout ce que vous devez savoir avant de vous lancer.
                        </p>
                    </div>
                    <FaqAccordion/>
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
                                <Link href="/terms" target="_blank" rel="noopener noreferrer"
                                      className="block text-sm transition-colors hover:text-indigo-400">
                                    Conditions générales d&apos;utilisation
                                </Link>
                                <Link href="/privacy" target="_blank" rel="noopener noreferrer"
                                      className="block text-sm hover:text-indigo-400 transition-colors">
                                    Politique de confidentialité
                                </Link>
                                <Link href="/contact" className="block text-sm hover:text-indigo-400 transition-colors">
                                    Support
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div
                        className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                        <span className="text-sm text-slate-600">© {new Date().getFullYear()} Qreta.</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}