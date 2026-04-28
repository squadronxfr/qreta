import {TERMS_OF_SERVICE} from "@/config/legal";
import {Metadata} from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Conditions Générales d'Utilisation | Qreta",
    description: "Consultez les conditions générales d'utilisation de la plateforme Qreta.",
};

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-slate-50 py-20 px-4">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12">
                {/* Sommaire Latéral - Sticky */}
                <aside className="hidden md:block w-64 shrink-0">
                    <div className="sticky top-24 space-y-2">
                        <p className="text-xs font-bold uppercase text-slate-400 mb-4 tracking-widest font-sans">
                            Articles
                        </p>
                        {TERMS_OF_SERVICE.sections.map((s) => (
                            <Link
                                key={s.id}
                                href={`#${s.id}`}
                                className="block text-sm text-slate-500 hover:text-blue-600 transition-colors py-1"
                            >
                                {s.title}
                            </Link>
                        ))}
                    </div>
                </aside>

                {/* Contenu Principal */}
                <div className="flex-1 bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200">
                    <header className="mb-12">
                        <h1 className="text-3xl font-black text-slate-900 mb-2">
                            {TERMS_OF_SERVICE.title}
                        </h1>
                        <p className="text-sm text-slate-400">
                            En vigueur au {TERMS_OF_SERVICE.lastUpdated}
                        </p>
                    </header>

                    <div className="space-y-16">
                        {TERMS_OF_SERVICE.sections.map((section) => (
                            <section key={section.id} id={section.id} className="scroll-mt-24">
                                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                                    {/* Petit badge pour le numéro d'article si présent */}
                                    <span
                                        className="shrink-0 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">
                    {section.id === "preambule" ? "0" : section.title.match(/\d+/)?.[0] || "•"}
                  </span>
                                    {section.title}
                                </h2>

                                <div className="text-slate-600 leading-relaxed space-y-4 font-normal">
                                    {Array.isArray(section.content) ? (
                                        <ul className="list-disc pl-5 space-y-3">
                                            {section.content.map((item, i) => (
                                                <li key={i} className="pl-2">{item}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>{section.content}</p>
                                    )}
                                </div>
                            </section>
                        ))}
                    </div>

                    <footer className="mt-16 pt-8 border-t text-center text-slate-400 text-sm">
                        <p>© {new Date().getFullYear()} Qreta - Tous droits réservés.</p>
                    </footer>
                </div>
            </div>
        </main>
    );
}