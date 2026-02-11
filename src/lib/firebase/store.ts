import {db} from "@/lib/firebase/config";
import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    onSnapshot,
    Timestamp,
    Unsubscribe,
} from "firebase/firestore";
import {Store} from "@/types/store";
import {generateSlug, checkSlugAvailability} from "@/lib/utils/slug";

interface CreateStoreData {
    name: string;
    description: string;
}

export const createStore = async (userId: string, data: CreateStoreData): Promise<string> => {
    const baseSlug = generateSlug(data.name);
    const uniqueSlug = await checkSlugAvailability(baseSlug);

    const docRef = await addDoc(collection(db, "stores"), {
        ...data,
        slug: uniqueSlug,
        userId,
        isActive: false,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        logoUrl: "",
        bannerUrl: "",
        phone: "",
        instagram: "",
        address: "",
        website: "",
        primaryColor: "#4F46E5",
    });

    return docRef.id;
};

export const updateStore = async (
    storeId: string,
    data: Partial<Omit<Store, "id" | "userId" | "createdAt">>
): Promise<void> => {
    await updateDoc(doc(db, "stores", storeId), {
        ...data,
        updatedAt: Timestamp.now(),
    });
};

export const deleteStore = async (storeId: string): Promise<void> => {
    await deleteDoc(doc(db, "stores", storeId));
};

export const subscribeToUserStores = (
    userId: string,
    callback: (stores: Store[]) => void
): Unsubscribe => {
    const q = query(collection(db, "stores"), where("userId", "==", userId));

    return onSnapshot(q, (snapshot) => {
        const stores = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
        })) as Store[];
        callback(stores);
    });
};

export const subscribeToStore = (
    storeId: string,
    callback: (store: Store | null) => void
): Unsubscribe => {
    return onSnapshot(doc(db, "stores", storeId), (docSnap) => {
        if (docSnap.exists()) {
            callback({id: docSnap.id, ...docSnap.data()} as Store);
        } else {
            callback(null);
        }
    });
};