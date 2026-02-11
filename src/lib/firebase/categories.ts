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
    Unsubscribe,
} from "firebase/firestore";
import {Category} from "@/types/store";

export const createCategory = async (
    storeId: string,
    name: string
): Promise<string> => {
    const docRef = await addDoc(collection(db, "categories"), {
        name: name.trim(),
        storeId,
        order: Date.now(),
        isActive: true,
    });
    return docRef.id;
};

export const updateCategory = async (
    categoryId: string,
    data: Partial<Omit<Category, "id" | "storeId">>
): Promise<void> => {
    await updateDoc(doc(db, "categories", categoryId), data);
};

export const deleteCategory = async (categoryId: string): Promise<void> => {
    await deleteDoc(doc(db, "categories", categoryId));
};

export const subscribeToCategories = (
    storeId: string,
    callback: (categories: Category[]) => void
): Unsubscribe => {
    const q = query(
        collection(db, "categories"),
        where("storeId", "==", storeId)
    );

    return onSnapshot(q, (snap) => {
        const categories = snap.docs
            .map((d) => ({id: d.id, ...d.data()}) as Category)
            .sort((a, b) => a.order - b.order);
        callback(categories);
    });
};