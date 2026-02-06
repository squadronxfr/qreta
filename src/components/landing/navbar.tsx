"use client";

import {useState, useEffect} from "react";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {Menu, X, ArrowRight} from "lucide-react";

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState<boolean>(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        {name: "Fonctionnalités", href: "#features"},
        {name: "Avantages", href: "#benefits"},
        {name: "Tarifs", href: "#pricing"},
    ];

    return (
        <nav
            className={`fixed top-0 w-full z-50 transition-all duration-300 border-b border-transparent ${isScrolled ? "bg-white/90 backdrop-blur-xl border-slate-200 py-3 shadow-sm" : "bg-transparent py-5"}`}>
            <div className="container mx-auto px-6 flex justify-between items-center">
                <Link href="/" className="z-50">
          <span className="font-heading text-3xl font-bold tracking-tight text-slate-900">
            Qreta<span className="text-indigo-600">.</span>
          </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-10">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
                        >
                            {link.name}
                        </a>
                    ))}
                    <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
                        <Link href="/login" className="text-sm font-semibold text-slate-900 hover:text-indigo-600">
                            Connexion
                        </Link>
                        <Button asChild className="rounded-full bg-slate-900 hover:bg-slate-800 text-white px-6">
                            <Link href="/login">Essai gratuit <ArrowRight className="ml-2 h-4 w-4"/></Link>
                        </Button>
                    </div>
                </div>

                {/* Mobile Toggle */}
                <button className="md:hidden z-50" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <X/> : <Menu/>}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-white z-40 flex flex-col items-center justify-center gap-8 animate-in slide-in-from-top-10 duration-200">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-2xl font-heading font-bold text-slate-900"
                        >
                            {link.name}
                        </a>
                    ))}
                    <Button asChild size="lg" className="mt-4 rounded-full w-48">
                        <Link href="/login">Commencer</Link>
                    </Button>
                </div>
            )}
        </nav>
    );
}