import {createStore} from "zustand";
import {
    onAuthStateChanged,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
    User,
    updateProfile as firebaseUpdateProfile,
    updatePassword as firebaseUpdatePassword,
    EmailAuthProvider,
    reauthenticateWithCredential,

} from "firebase/auth";
import {doc, onSnapshot, Unsubscribe, updateDoc, setDoc, Timestamp} from "firebase/firestore";
import {ref, uploadBytes, getDownloadURL} from "firebase/storage";
import {auth, db, storage} from "@/lib/firebase/config";
import {UserDoc} from "@/types/user";
import {deleteAccount} from "@/lib/firebase/users";

export interface AuthState {
    user: User | null;
    userData: UserDoc | null;
    loading: boolean;
}

export interface AuthActions {
    initialize: () => () => void;
    googleSignIn: () => Promise<void>;
    logout: () => Promise<void>;
    updateUserProfile: (data: {
        firstname: string;
        lastname: string;
        avatarFile?: File | null;
        removeAvatar?: boolean;
    }) => Promise<void>;
    changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
    deleteUserAccount: () => Promise<void>;
}

export type AuthStore = AuthState & AuthActions;

export const createAuthStore = () => {
    return createStore<AuthStore>((set, get) => {
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

            updateUserProfile: async ({firstname, lastname, avatarFile, removeAvatar}) => {
                const {user, userData} = get();
                if (!user) throw new Error("Not authenticated");

                let newPhotoURL = user.photoURL;

                if (avatarFile) {
                    const storageRef = ref(storage, `users/${user.uid}/avatar_${Date.now()}`);
                    const snap = await uploadBytes(storageRef, avatarFile);
                    newPhotoURL = await getDownloadURL(snap.ref);
                } else if (removeAvatar && user.photoURL) {
                    newPhotoURL = "";
                }

                const newDisplayName = `${firstname} ${lastname}`.trim();

                if (newDisplayName !== user.displayName || newPhotoURL !== user.photoURL) {
                    await firebaseUpdateProfile(user, {
                        displayName: newDisplayName,
                        photoURL: newPhotoURL || "",
                    });

                    const userRef = doc(db, "users", user.uid);

                    const updatePayload = {
                        firstname,
                        lastname,
                        photoUrl: newPhotoURL || "",
                        email: user.email || "",
                        updatedAt: Timestamp.now(),
                    };

                    if (!userData) {
                        await setDoc(userRef, {
                            uid: user.uid,
                            role: "store_owner",
                            subscription: {plan: "free", status: "active", currentPeriodEnd: Timestamp.now()},
                            createdAt: Timestamp.now(),
                            ...updatePayload,
                        });
                    } else {
                        await updateDoc(userRef, updatePayload);
                    }
                }
            },

            changePassword: async (currentPassword: string, newPassword: string) => {
                const {user} = get();
                if (!user || !user.email) throw new Error("Not authenticated");

                const credential = EmailAuthProvider.credential(user.email, currentPassword);
                await reauthenticateWithCredential(user, credential);
                await firebaseUpdatePassword(user, newPassword);
            },

            deleteUserAccount: async () => {
                const {user} = get();
                if (!user) throw new Error("Not authenticated");

                await deleteAccount(user);
                await signOut(auth);
                set({user: null, userData: null});
            },
        };
    });
};