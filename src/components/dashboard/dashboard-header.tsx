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
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {LogOut, User, Settings, LayoutDashboard} from "lucide-react";

export function DashboardHeader() {
    const {user, userData} = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await signOut(auth);
        router.push("/login");
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
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            {/* Ajout de cursor-pointer ici sur le bouton de l'avatar */}
                            <Button variant="ghost"
                                    className="relative h-10 w-10 rounded-full border border-slate-200 p-0 overflow-hidden cursor-pointer shadow-sm hover:bg-slate-50 transition-colors">
                                <Avatar className="h-10 w-10 rounded-full cursor-pointer">
                                    <AvatarFallback className="bg-indigo-50 text-indigo-600 font-bold cursor-pointer">
                                        {user?.email?.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="w-56 mt-2 rounded-xl shadow-xl border-slate-100 p-1"
                                             align="end">
                            <DropdownMenuLabel className="font-normal px-2 py-2">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-bold leading-none text-slate-900">
                                        {userData?.role === 'superadmin' ? 'Administrateur' : 'Commerçant'}
                                    </p>
                                    <p className="text-xs leading-none text-slate-500">{user?.email}</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator/>

                            <DropdownMenuItem
                                className="cursor-pointer flex items-center gap-2 px-3 py-2.5 rounded-lg text-slate-600 focus:bg-indigo-50 focus:text-indigo-600 transition-colors">
                                <User className="h-4 w-4"/>
                                <span className="font-medium">Mon Profil</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                className="cursor-pointer flex items-center gap-2 px-3 py-2.5 rounded-lg text-slate-600 focus:bg-indigo-50 focus:text-indigo-600 transition-colors">
                                <Settings className="h-4 w-4"/>
                                <span className="font-medium">Paramètres</span>
                            </DropdownMenuItem>

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