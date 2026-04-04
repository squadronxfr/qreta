"use client";

import dynamic from "next/dynamic";
import {useState, useEffect} from "react";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {Menu, X, ArrowRight} from "lucide-react";

const MotionDiv = dynamic(() =>
        import("framer-motion").then(m => m.motion.div),
    {ssr: false}
);

const AnimatePresence = dynamic(() =>
        import("framer-motion").then(m => m.AnimatePresence),
    {ssr: false}
);

const navLinks = [
    {name: "Fonctionnalités", href: "/#features"},
    {name: "Avantages", href: "/#benefits"},
    {name: "Tarifs", href: "/#pricing"},
];

export const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [mobileMenuOpen]);

    return (
        <nav
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${
                isScrolled
                    ? "bg-white/90 backdrop-blur-xl border-b border-slate-200 py-3 shadow-sm"
                    : "bg-transparent border-b border-transparent py-5"
            }`}
        >
            <div className="container mx-auto px-6 flex justify-between items-center">
                <Link href="/" className="z-50">
                    <span className="font-heading text-2xl font-bold tracking-tight text-slate-900">
                        Qreta<span className="text-indigo-600">.</span>
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                        <Link
                            href="/login"
                            className="text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors"
                        >
                            Connexion
                        </Link>
                        <Button asChild size="lg"
                                className="rounded-full bg-slate-900 hover:bg-slate-800 text-white px-5 h-9">
                            <Link href="/signup">
                                Créer mon catalogue
                                <ArrowRight className="h-3.5 w-3.5"/>
                            </Link>
                        </Button>
                    </div>
                </div>

                <button
                    className="md:hidden z-50 w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
                >
                    {mobileMenuOpen ? <X className="h-5 w-5"/> : <Menu className="h-5 w-5"/>}
                </button>
            </div>

            <AnimatePresence>
                {mobileMenuOpen && (
                    <MotionDiv
                        initial={{opacity: 0, y: -20}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: -20}}
                        transition={{duration: 0.2, ease: "easeOut"}}
                        className="fixed inset-0 bg-white z-40 flex flex-col items-center justify-center gap-8"
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-2xl font-heading font-bold text-slate-900 hover:text-indigo-600 transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="flex flex-col items-center gap-4 pt-4 border-t border-slate-100 w-48">
                            <Link
                                href="/login"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors"
                            >
                                Connexion
                            </Link>
                            <Button asChild className="rounded-full bg-slate-900 hover:bg-slate-800 text-white w-full">
                                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                                    Créer mon catalogue
                                    <ArrowRight className="h-4 w-4"/>
                                </Link>
                            </Button>
                        </div>
                    </MotionDiv>
                )}
            </AnimatePresence>
        </nav>
    );
};