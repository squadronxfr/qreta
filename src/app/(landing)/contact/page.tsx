"use client";

import {useState, SyntheticEvent} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {
    ArrowLeft,
    ArrowRight,
    CheckCircle,
    Mail,
    MessageSquare,
    Phone,
    Building2,
    Clock,
    HelpCircle,
    ShieldCheck,
    AlertTriangle,
    Zap,
    Minus,
} from "lucide-react";
import {Spinner} from "@/components/ui/spinner";
import Link from "next/link";

const SUBJECTS = [
    "Problème technique",
    "Question sur mon abonnement",
    "Demande de fonctionnalité",
    "Signaler un bug",
    "Demande de partenariat",
    "Question générale",
    "Autre",
];

const MAX_MESSAGE = 2000;
const MIN_MESSAGE = 20;

export default function ContactPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [company, setCompany] = useState("");
    const [subject, setSubject] = useState("");
    const [priority, setPriority] = useState("normal");
    const [message, setMessage] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const messageLength = message.length;
    const messageProgress = Math.min((messageLength / MIN_MESSAGE) * 100, 100);

    const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        if (!subject) {
            setError("Veuillez sélectionner un sujet.");
            return;
        }
        if (messageLength < MIN_MESSAGE) {
            setError(`Votre message doit contenir au moins ${MIN_MESSAGE} caractères.`);
            return;
        }
        if (messageLength > MAX_MESSAGE) {
            setError(`Votre message ne peut pas dépasser ${MAX_MESSAGE} caractères.`);
            return;
        }

        setIsLoading(true);

        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            setIsSuccess(true);
        } catch {
            setError("Une erreur est survenue. Veuillez réessayer.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-indigo-100/30 rounded-full blur-[120px]"/>
                <div
                    className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-violet-100/20 rounded-full blur-[100px]"/>
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-4 py-10">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors mb-10"
                >
                    <ArrowLeft className="h-4 w-4"/>
                    Retour à l&apos;accueil
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
                    {/* Left panel */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <Link href="/">
                                <span className="font-heading text-3xl font-bold tracking-tight text-slate-900">
                                    Qreta<span className="text-indigo-600">.</span>
                                </span>
                            </Link>
                            <h1 className="text-3xl font-bold text-slate-900 mt-5 mb-3 leading-tight">
                                Comment pouvons-nous vous aider ?
                            </h1>
                            <p className="text-slate-500 text-base leading-relaxed">
                                Notre équipe est disponible pour répondre à toutes vos questions.
                                Nous nous engageons à vous répondre rapidement.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <div
                                className="flex items-start gap-4 p-4 rounded-2xl border border-slate-100 bg-white shadow-xs">
                                <div
                                    className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                                    <Clock className="h-5 w-5 text-indigo-600"/>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">Temps de réponse</p>
                                    <p className="text-sm text-slate-500">Généralement sous 24 à 48h ouvrées</p>
                                </div>
                            </div>

                            <div
                                className="flex items-start gap-4 p-4 rounded-2xl border border-slate-100 bg-white shadow-xs">
                                <div
                                    className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                                    <Mail className="h-5 w-5 text-indigo-600"/>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">Support par email</p>
                                    <p className="text-sm text-slate-500">support@qreta.fr</p>
                                </div>
                            </div>

                            <div
                                className="flex items-start gap-4 p-4 rounded-2xl border border-slate-100 bg-white shadow-xs">
                                <div
                                    className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                                    <ShieldCheck className="h-5 w-5 text-indigo-600"/>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">Données protégées</p>
                                    <p className="text-sm text-slate-500">Vos informations restent confidentielles</p>
                                </div>
                            </div>

                            <div
                                className="flex items-start gap-4 p-4 rounded-2xl border border-slate-100 bg-white shadow-xs">
                                <div
                                    className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                                    <HelpCircle className="h-5 w-5 text-indigo-600"/>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">Centre d&apos;aide</p>
                                    <p className="text-sm text-slate-500">Consultez notre FAQ avant d&apos;écrire</p>
                                </div>
                            </div>
                        </div>

                        <p className="text-center text-sm text-slate-500">
                            Vous avez déjà un compte ?{" "}
                            <Link href="/login"
                                  className="text-indigo-600 hover:text-indigo-500 font-medium transition-colors">
                                Se connecter
                            </Link>
                        </p>
                    </div>

                    {/* Right panel */}
                    <div className="lg:col-span-3">
                        {isSuccess ? (
                            <div className="bg-white border border-slate-200 rounded-3xl p-10 shadow-sm text-center">
                                <div className="flex justify-center mb-6">
                                    <div
                                        className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center">
                                        <CheckCircle className="h-10 w-10 text-indigo-600"/>
                                    </div>
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-3">Message envoyé !</h2>
                                <p className="text-slate-500 mb-2">
                                    Merci pour votre message, <span
                                    className="font-semibold text-slate-700">{name}</span>.
                                </p>
                                <p className="text-slate-500 text-sm mb-8">
                                    Nous vous répondrons à{" "}
                                    <span className="font-medium text-indigo-600">{email}</span>{" "}
                                    dans les plus brefs délais. Un email de confirmation vous a été envoyé.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    <Button
                                        variant="outline"
                                        className="h-11 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50"
                                        onClick={() => {
                                            setName("");
                                            setEmail("");
                                            setPhone("");
                                            setCompany("");
                                            setSubject("");
                                            setPriority("normal");
                                            setMessage("");
                                            setIsSuccess(false);
                                        }}
                                    >
                                        Envoyer un autre message
                                    </Button>
                                    <Link href="/">
                                        <Button
                                            className="h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-md shadow-indigo-500/20">
                                            Retour à l&apos;accueil <ArrowRight className="ml-2 h-4 w-4"/>
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                                <div className="mb-7">
                                    <h2 className="text-xl font-bold text-slate-900">Envoyer un message</h2>
                                    <p className="text-sm text-slate-500 mt-1">Tous les champs marqués <span
                                        className="text-red-500">*</span> sont obligatoires</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Identité */}
                                    <div>
                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Vos
                                            coordonnées</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                                                    Nom complet <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    id="name"
                                                    type="text"
                                                    placeholder="Jean Dupont"
                                                    value={name}
                                                    onChange={(e) => {
                                                        setName(e.target.value);
                                                        setError(null);
                                                    }}
                                                    required
                                                    className="h-11 rounded-xl border-slate-200 bg-slate-50/50 focus:border-indigo-300 focus:ring-indigo-200"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                                                    Adresse email <span className="text-red-500">*</span>
                                                </Label>
                                                <div className="relative">
                                                    <Mail
                                                        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none"/>
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        placeholder="jean@exemple.com"
                                                        value={email}
                                                        onChange={(e) => {
                                                            setEmail(e.target.value);
                                                            setError(null);
                                                        }}
                                                        required
                                                        className="h-11 rounded-xl border-slate-200 bg-slate-50/50 focus:border-indigo-300 focus:ring-indigo-200 pl-9"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="phone" className="text-sm font-medium text-slate-700">
                                                    Téléphone <span
                                                    className="text-slate-400 font-normal text-xs">(optionnel)</span>
                                                </Label>
                                                <div className="relative">
                                                    <Phone
                                                        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none"/>
                                                    <Input
                                                        id="phone"
                                                        type="tel"
                                                        placeholder="+33 6 00 00 00 00"
                                                        value={phone}
                                                        onChange={(e) => setPhone(e.target.value)}
                                                        className="h-11 rounded-xl border-slate-200 bg-slate-50/50 focus:border-indigo-300 focus:ring-indigo-200 pl-9"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="company" className="text-sm font-medium text-slate-700">
                                                    Entreprise <span
                                                    className="text-slate-400 font-normal text-xs">(optionnel)</span>
                                                </Label>
                                                <div className="relative">
                                                    <Building2
                                                        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none"/>
                                                    <Input
                                                        id="company"
                                                        type="text"
                                                        placeholder="Ma société"
                                                        value={company}
                                                        onChange={(e) => setCompany(e.target.value)}
                                                        className="h-11 rounded-xl border-slate-200 bg-slate-50/50 focus:border-indigo-300 focus:ring-indigo-200 pl-9"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sujet */}
                                    <div>
                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Votre
                                            demande</p>
                                        <div className="space-y-2">
                                            <Label htmlFor="subject" className="text-sm font-medium text-slate-700">
                                                <span className="inline-flex items-center gap-1.5">
                                                    <MessageSquare className="h-3.5 w-3.5 text-slate-400"/>
                                                    Sujet <span className="text-red-500">*</span>
                                                </span>
                                            </Label>
                                            <div className="relative">
                                                <select
                                                    id="subject"
                                                    value={subject}
                                                    onChange={(e) => {
                                                        setSubject(e.target.value);
                                                        setError(null);
                                                    }}
                                                    className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-sm text-slate-900 appearance-none focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200 transition-[color,box-shadow]"
                                                >
                                                    <option value="" disabled>Sélectionnez un sujet</option>
                                                    {SUBJECTS.map((s) => (
                                                        <option key={s} value={s}>{s}</option>
                                                    ))}
                                                </select>
                                                <div
                                                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                                                    <svg className="h-4 w-4 text-slate-400" fill="none"
                                                         viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                              strokeWidth={2} d="M19 9l-7 7-7-7"/>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Message */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="message" className="text-sm font-medium text-slate-700">
                                                Message <span className="text-red-500">*</span>
                                            </Label>
                                            <span
                                                className={`text-xs ${messageLength > MAX_MESSAGE ? "text-red-500" : messageLength >= MIN_MESSAGE ? "text-emerald-500" : "text-slate-400"}`}>
                                                {messageLength} / {MAX_MESSAGE}
                                            </span>
                                        </div>
                                        <Textarea
                                            id="message"
                                            placeholder="Décrivez votre demande en détail. Plus vous êtes précis, plus nous pourrons vous aider efficacement..."
                                            value={message}
                                            onChange={(e) => {
                                                setMessage(e.target.value);
                                                setError(null);
                                            }}
                                            required
                                            rows={6}
                                            className="rounded-xl border-slate-200 bg-slate-50/50 focus:border-indigo-300 focus:ring-indigo-200 resize-none"
                                        />
                                        {/* Progress bar */}
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all ${messageLength >= MIN_MESSAGE ? "bg-emerald-400" : "bg-indigo-400"}`}
                                                    style={{width: `${messageProgress}%`}}
                                                />
                                            </div>
                                            <span
                                                className="text-[10px] text-slate-400 whitespace-nowrap">min. {MIN_MESSAGE} car.</span>
                                        </div>
                                    </div>

                                    {error && (
                                        <Alert variant="destructive"
                                               className="bg-red-50 text-red-900 border-red-200 rounded-xl">
                                            <AlertDescription>{error}</AlertDescription>
                                        </Alert>
                                    )}

                                    <Button
                                        type="submit"
                                        className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-all shadow-md shadow-indigo-500/20 text-base"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <><Spinner className="mr-2 h-4 w-4"/> Envoi en cours...</>
                                        ) : (
                                            <>Envoyer le message <ArrowRight className="ml-2 h-4 w-4"/></>
                                        )}
                                    </Button>

                                    <p className="text-center text-xs text-slate-400">
                                        En envoyant ce message, vous acceptez que nous traitions vos données pour vous
                                        répondre.
                                    </p>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
