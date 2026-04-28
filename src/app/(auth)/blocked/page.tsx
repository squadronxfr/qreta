import {ShieldAlert} from "lucide-react";

export default function BlockedPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6 text-center">
            <div className="bg-red-100 p-4 rounded-full mb-6">
                <ShieldAlert className="h-10 w-10 text-red-600"/>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Compte suspendu</h1>
            <p className="text-slate-500 max-w-sm">
                Votre compte a été suspendu. Pour toute question, contactez le support à{" "}
                <a href="mailto:support@qreta.fr" className="text-indigo-600 hover:underline">
                    support@qreta.fr
                </a>
            </p>
        </div>
    );
}