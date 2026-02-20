import {ProfileForm} from "@/components/account/profile-form";
import {Separator} from "@/components/ui/separator";

export default function AccountPage() {
    return (
        <div className="container max-w-6xl mx-auto py-10 px-4">
            <div className="space-y-1 mb-8">
                <h1 className="text-3xl font-bold font-heading text-slate-900">Mon Compte</h1>
                <p className="text-slate-500">Gérez vos paramètres personnels et vos préférences.</p>
            </div>

            <Separator className="mb-8"/>

            <ProfileForm/>
        </div>
    );
}