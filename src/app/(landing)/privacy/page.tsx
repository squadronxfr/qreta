import {PRIVACY_POLICY} from "@/config/legal";
import {Metadata} from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Politique de Confidentialité | Qreta",
    description: "Consultez notre politique de confidentialité pour comprendre comment nous protégeons vos données.",
};

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-slate-50 py-20 px-4">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12">
                <aside className="hidden md:block w-64 shrink-0">
                    <div className="sticky top-24 space-y-2">
                        <p className="text-xs font-bold uppercase text-slate-400 mb-4 tracking-widest font-sans">Sections</p>
                        {PRIVACY_POLICY.sections.map((s) => (
                            <Link key={s.id} href={`#${s.id}`}
                                  className="block text-sm text-slate-500 hover:text-blue-600 transition-colors py-1">
                                {s.title.split('.')[1] || s.title}
                            </Link>
                        ))}
                    </div>
                </aside>

                <div className="flex-1 bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200">
                    <h1 className="text-3xl font-black text-slate-900 mb-2">{PRIVACY_POLICY.title}</h1>
                    <p className="text-sm text-slate-400 mb-8 tracking-tight">Version mise à jour
                        le {PRIVACY_POLICY.lastUpdated}</p>

                    <p className="text-slate-600 mb-12 leading-relaxed text-lg border-l-4 border-slate-900 pl-6 py-2 bg-slate-50 rounded-r-lg">
                        {PRIVACY_POLICY.introduction}
                    </p>

                    <div className="space-y-16">
                        {PRIVACY_POLICY.sections.map((section) => (
                            <section key={section.id} id={section.id} className="scroll-mt-24">
                                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                  <span
                      className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs">
                    {section.title.split('.')[0]}
                  </span>
                                    {section.title.includes('.') ? section.title.split('.')[1] : section.title}
                                </h2>
                                <div className="text-slate-600 leading-relaxed space-y-4 font-normal">
                                    {Array.isArray(section.content) ? (
                                        <ul className="list-disc pl-5 space-y-3">
                                            {section.content.map((item, i) => <li key={i}>{item}</li>)}
                                        </ul>
                                    ) : (
                                        <p>{section.content}</p>
                                    )}
                                </div>
                            </section>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}