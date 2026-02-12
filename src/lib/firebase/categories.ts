import {db, storage} from "@/lib/firebase/config";
import {
    collection,
    doc,
    addDoc,
    updateDoc,
    query,
    where,
    getDocs,
    onSnapshot,
    Unsubscribe,
    writeBatch,
} from "firebase/firestore";
import {Category} from "@/types/store";
import {deleteObject, ref} from "firebase/storage";

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
    const itemsSnap = await getDocs(
        query(collection(db, "items"), where("categoryId", "==", categoryId))
    );

    for (const itemDoc of itemsSnap.docs) {
        const imageUrl = itemDoc.data().imageUrl as string | undefined;
        if (imageUrl) {
            await deleteObject(ref(storage, imageUrl)).catch(() => null);
        }
    }

    const docsToDelete = [...itemsSnap.docs];
    const categoryRef = doc(db, "categories", categoryId);

    const BATCH_LIMIT = 450;
    let batch = writeBatch(db);
    let count = 0;

    for (const itemDoc of docsToDelete) {
        batch.delete(itemDoc.ref);
        count++;
        if (count >= BATCH_LIMIT) {
            await batch.commit();
            batch = writeBatch(db);
            count = 0;
        }
    }

    batch.delete(categoryRef);
    count++;

    if (count > 0) {
        await batch.commit();
    }
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
