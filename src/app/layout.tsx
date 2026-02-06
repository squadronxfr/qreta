import {ReactNode} from "react";
import {AuthProvider} from "@/context/auth-context";
import "./globals.css";
import {Inter} from "next/font/google";

const inter = Inter({subsets: ["latin"]});

export default function RootLayout({
                                       children,
                                   }: {
    children: ReactNode;
}) {
    return (
        <html lang="fr" suppressHydrationWarning>
        <body className={inter.className} suppressHydrationWarning>
        <AuthProvider>
            {children}
        </AuthProvider>
        </body>
        </html>
    );
}