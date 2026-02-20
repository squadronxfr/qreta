import "./globals.css";
import {ReactNode} from "react";
import {Inter, Outfit} from "next/font/google";
import {Toaster} from "@/components/ui/sonner";

const inter = Inter({subsets: ["latin"], variable: "--font-inter"});
const outfit = Outfit({subsets: ["latin"], variable: "--font-outfit"});

export default function RootLayout({children}: { children: ReactNode }) {
    return (
        <html lang="fr" suppressHydrationWarning className="scroll-smooth">
        <body className={`${inter.variable} ${outfit.variable} font-sans antialiased`} suppressHydrationWarning>
        {children}
        <Toaster/>
        </body>
        </html>
    );
}