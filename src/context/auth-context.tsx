"use client";

import {createContext, useContext, useEffect, useState, ReactNode} from "react";
import {onAuthStateChanged, User} from "firebase/auth";
import {auth, db} from "@/lib/firebase/config";
import {doc, getDoc, Timestamp} from "firebase/firestore";

export interface UserDoc {
    email: string;
    role: "superadmin" | "store_owner";
    createdAt: Timestamp;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    userData: UserDoc | null;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    userData: null,
});

export const AuthProvider = ({children}: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<UserDoc | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);
                const userDocRef = doc(db, "users", firebaseUser.uid);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    setUserData(userDocSnap.data() as UserDoc);
                }
            } else {
                setUser(null);
                setUserData(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{user, loading, userData}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);