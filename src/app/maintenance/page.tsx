import Image from "next/image";
import {SplitText} from "@/components/ui/split-text";

export default function MaintenancePage() {
    return (
        <main
            className="relative min-h-screen w-full flex flex-col items-center justify-center bg-slate-950 text-slate-50 p-6 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,#1e293b,transparent)]"/>

            <div className="relative z-10 flex flex-col items-center text-center max-w-2xl">
                <div className="mb-8 animate-pulse">
                    <Image
                        src="/vercel.png"
                        alt="Qreta Logo"
                        width={80}
                        height={80}
                        priority
                    />
                </div>

                <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
                    <SplitText text="Qreta se refait une beauté"/>
                </h1>

                <p className="text-slate-400 text-lg md:text-xl mb-8 leading-relaxed italic">
                    Nous effectuons actuellement une maintenance pour améliorer votre expérience.
                    Revenez d'ici quelques instants.
                </p>

                <div className="flex gap-4">
                    <div className="h-1 w-12 bg-indigo-500 rounded-full animate-bounce"/>
                    <div className="h-1 w-12 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"/>
                    <div className="h-1 w-12 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"/>
                </div>
            </div>

            <footer className="absolute bottom-8 text-slate-500 text-sm">
                © {new Date().getFullYear()} Qreta — Merci de votre patience.
            </footer>
        </main>
    );
}