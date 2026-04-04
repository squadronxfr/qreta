"use client";

import {useState} from "react";
import {motion, AnimatePresence} from "framer-motion";
import {ChevronDown} from "lucide-react";
import {faqs} from "@/config/faqs";

const fadeUp = {
    hidden: {opacity: 0, y: 30},
    show: {opacity: 1, y: 0, transition: {duration: 0.7, ease: [0.25, 0.4, 0.25, 1] as const}},
};

export const FaqAccordion = () => {
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

    return (
        <div className="space-y-3">
            {faqs.map((faq, idx) => (
                <motion.div
                    key={idx}
                    variants={fadeUp}
                    className={`border rounded-2xl overflow-hidden transition-all ${
                        openFaqIndex === idx
                            ? "border-indigo-200 bg-indigo-50/30 shadow-sm"
                            : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                >
                    <button
                        onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                        className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                    >
                        <span className="font-semibold text-slate-900 pr-4">{faq.question}</span>
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                                openFaqIndex === idx
                                    ? "bg-indigo-100 text-indigo-600 rotate-180"
                                    : "bg-slate-100 text-slate-400"
                            }`}
                        >
                            <ChevronDown className="h-4 w-4"/>
                        </div>
                    </button>
                    <AnimatePresence>
                        {openFaqIndex === idx && (
                            <motion.div
                                initial={{height: 0, opacity: 0}}
                                animate={{height: "auto", opacity: 1}}
                                exit={{height: 0, opacity: 0}}
                                transition={{duration: 0.3, ease: "easeInOut"}}
                            >
                                <div className="px-6 pb-5 text-slate-600 leading-relaxed">{faq.answer}</div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            ))}
        </div>
    );
};