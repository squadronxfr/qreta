"use client";

import {useAuth} from "@/context/auth-context";
import {auth} from "@/lib/firebase/config";
import {signOut} from "firebase/auth";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {LogOut, User, LayoutDashboard, CreditCard, ShieldCheck} from "lucide-react";

export function DashboardHeader() {
    const {user, userData} = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await signOut(auth);
        router.push("/login");
    };

    const getInitials = () => {
        if (userData?.firstname && userData?.lastname) {
            return (userData.firstname[0] + userData.lastname[0]).toUpperCase();
        }
        return user?.email?.substring(0, 2).toUpperCase() || "U";
    };

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/stores"
                          className="font-heading text-2xl font-bold tracking-tight text-slate-900 cursor-pointer">
                        Qreta<span className="text-indigo-600">.</span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-6">
                        <Link href="/stores"
                              className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-2 cursor-pointer">
                            <LayoutDashboard className="h-4 w-4"/>
                            Tableau de bord
                        </Link>

                        {userData?.role === 'superadmin' && (
                            <Link href="/admin"
                                  className="text-sm font-bold text-purple-600 bg-purple-50 px-3 py-1.5 rounded-full hover:bg-purple-100 transition-colors flex items-center gap-2 cursor-pointer border border-purple-200">
                                <ShieldCheck className="h-4 w-4"/>
                                Administration
                            </Link>
                        )}
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost"
                                    className="relative h-10 w-10 rounded-full border border-slate-200 p-0 overflow-hidden cursor-pointer shadow-sm hover:bg-slate-50 transition-colors">
                                <Avatar className="h-10 w-10 rounded-full cursor-pointer">
                                    <AvatarImage src={userData?.photoUrl || user?.photoURL || ""}
                                                 className="object-cover"/>
                                    <AvatarFallback className="bg-indigo-50 text-indigo-600 font-bold cursor-pointer">
                                        {getInitials()}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="w-56 mt-2 rounded-xl shadow-xl border-slate-100 p-1"
                                             align="end">
                            <DropdownMenuLabel className="font-normal px-2 py-2">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-bold leading-none text-slate-900 capitalize">
                                        {userData?.firstname} {userData?.lastname}
                                    </p>
                                    <p className="text-xs leading-none text-slate-500">{user?.email}</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator/>

                            <DropdownMenuItem asChild>
                                <Link href="/account" className="cursor-pointer flex items-center w-full">
                                    <User className="mr-2 h-4 w-4"/>
                                    Mon Profil
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem asChild>
                                <Link href="/billing" className="cursor-pointer flex items-center w-full">
                                    <CreditCard className="mr-2 h-4 w-4"/>
                                    Facturation
                                </Link>
                            </DropdownMenuItem>

                            {/* Optionnel : Paramètres globaux */}
                            {/* <DropdownMenuItem className="cursor-pointer flex items-center w-full">
                                <Settings className="mr-2 h-4 w-4"/>
                                Paramètres
                            </DropdownMenuItem> */}

                            <DropdownMenuSeparator/>

                            <DropdownMenuItem
                                onClick={handleLogout}
                                className="cursor-pointer flex items-center gap-2 px-3 py-2.5 rounded-lg text-red-600 focus:bg-red-50 focus:text-red-600 transition-colors"
                            >
                                <LogOut className="h-4 w-4"/>
                                <span className="font-medium">Se déconnecter</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}