import {AuthProvider} from "@/context/auth-context";
import "./globals.css";
import {Inter, Outfit} from "next/font/google";

const inter = Inter({subsets: ["latin"], variable: "--font-inter"});
const outfit = Outfit({subsets: ["latin"], variable: "--font-outfit"});

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="fr" suppressHydrationWarning className="scroll-smooth">
        <body className={`${inter.variable} ${outfit.variable} font-sans antialiased`} suppressHydrationWarning>
        <AuthProvider>
            {children}
        </AuthProvider>
        </body>
        </html>
    );
}