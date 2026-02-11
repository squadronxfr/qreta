import {createStore} from "zustand";
import {
    onAuthStateChanged,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
    User,
} from "firebase/auth";
import {doc, onSnapshot, Unsubscribe} from "firebase/firestore";
import {auth, db} from "@/lib/firebase/config";
import {UserDoc} from "@/types/user";

export interface AuthState {
    user: User | null;
    userData: UserDoc | null;
    loading: boolean;
}

export interface AuthActions {
    initialize: () => () => void;
    googleSignIn: () => Promise<void>;
    logout: () => Promise<void>;
}

export type AuthStore = AuthState & AuthActions;

export const createAuthStore = () => {
    return createStore<AuthStore>((set) => {
        let unsubFirestore: Unsubscribe | null = null;

        return {
            user: null,
            userData: null,
            loading: true,

            initialize: () => {
                const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
                    set({user: currentUser});

                    if (unsubFirestore) {
                        unsubFirestore();
                        unsubFirestore = null;
                    }

                    if (!currentUser) {
                        set({userData: null, loading: false});
                        return;
                    }

                    set({loading: true});

                    unsubFirestore = onSnapshot(
                        doc(db, "users", currentUser.uid),
                        (docSnap) => {
                            set({
                                userData: docSnap.exists()
                                    ? (docSnap.data() as UserDoc)
                                    : null,
                                loading: false,
                            });
                        },
                        () => {
                            set({userData: null, loading: false});
                        }
                    );
                });

                return () => {
                    unsubAuth();
                    if (unsubFirestore) unsubFirestore();
                };
            },

            googleSignIn: async () => {
                const provider = new GoogleAuthProvider();
                await signInWithPopup(auth, provider);
            },

            logout: async () => {
                await signOut(auth);
                set({user: null, userData: null});
            },
        };
    });
};