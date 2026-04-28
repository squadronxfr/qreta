import "./globals.css";
import {ReactNode} from "react";
import {Inter, Outfit} from "next/font/google";
import {Toaster} from "@/components/ui/sonner";
import {SpeedInsights} from "@vercel/speed-insights/next"
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: {
        default: "Qreta — Votre catalogue en ligne en 2 minutes",
        template: "%s | Qreta",
    },
    description: "Créez votre catalogue digital, générez votre QR code et partagez vos offres avec vos clients. Simple, rapide, sans prise de tête.",
    metadataBase: new URL("https://qreta.fr"),
    openGraph: {
        title: "Qreta — Votre catalogue en ligne en 2 minutes",
        description: "Créez votre catalogue digital et partagez vos offres avec vos clients.",
        url: "https://qreta.fr",
        siteName: "Qreta",
        locale: "fr_FR",
        type: "website",
    },
};

const inter = Inter({subsets: ["latin"], variable: "--font-inter"});
const outfit = Outfit({subsets: ["latin"], variable: "--font-outfit"});

export default function RootLayout({children}: { children: ReactNode }) {
    return (
        <html lang="fr" suppressHydrationWarning className="scroll-smooth">
        <body className={`${inter.variable} ${outfit.variable} font-sans antialiased`} suppressHydrationWarning>
        <SpeedInsights/>
        {children}
        <Toaster/>
        </body>
        </html>
    );
}