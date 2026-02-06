"use client";

import {createContext, useContext, useEffect, useState, ReactNode} from "react";
import {
    onAuthStateChanged,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
    User
} from "firebase/auth";
import {doc, onSnapshot} from "firebase/firestore";
import {auth, db} from "@/lib/firebase/config";
import {UserDoc} from "@/types/user"; // Import de ton type personnalisé

interface AuthContextType {
    user: User | null;
    userData: UserDoc | null;
    loading: boolean;
    googleSignIn: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<UserDoc | null>(null);
    const [loading, setLoading] = useState(true);

    const googleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
    };

    const logout = async () => {
        await signOut(auth);
        setUserData(null);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (!currentUser) {
                setUserData(null);
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!user) return;

        setLoading(true);
        const userRef = doc(db, "users", user.uid);

        const unsubscribeFirestore = onSnapshot(userRef, (docSnap) => {
            if (docSnap.exists()) {
                setUserData(docSnap.data() as UserDoc);
            } else {
                setUserData(null);
            }
            setLoading(false);
        }, (error) => {
            console.error("Erreur récupération profil:", error);
            setLoading(false);
        });

        return () => unsubscribeFirestore();
    }, [user]);

    return (
        <AuthContext.Provider value={{user, userData, loading, googleSignIn, logout}}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}