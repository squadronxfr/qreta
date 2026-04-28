import {db, storage} from "@/lib/firebase/config";
import {
    collection,
    doc,
    updateDoc,
    query,
    where,
    getDoc,
    getDocs,
    onSnapshot,
    Timestamp,
    Unsubscribe,
    writeBatch,
} from "firebase/firestore";
import {Store} from "@/types/store";
import {deleteObject, ref} from "firebase/storage";

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
    const storeRef = doc(db, "stores", storeId);
    const storeSnap = await getDoc(storeRef);

    const [categoriesSnap, itemsSnap] = await Promise.all([
        getDocs(query(collection(db, "categories"), where("storeId", "==", storeId))),
        getDocs(query(collection(db, "items"), where("storeId", "==", storeId))),
    ]);

    for (const itemDoc of itemsSnap.docs) {
        const imageUrl = itemDoc.data().imageUrl as string | undefined;
        if (imageUrl) {
            await deleteObject(ref(storage, imageUrl)).catch(() => null);
        }
    }

    if (storeSnap.exists()) {
        const data = storeSnap.data() as Partial<Store>;
        if (data.logoUrl) await deleteObject(ref(storage, data.logoUrl)).catch(() => null);
        if (data.bannerUrl) await deleteObject(ref(storage, data.bannerUrl)).catch(() => null);
    }

    const docsToDelete = [...itemsSnap.docs, ...categoriesSnap.docs];
    const BATCH_LIMIT = 450;
    let batch = writeBatch(db);
    let count = 0;

    for (const docSnap of docsToDelete) {
        batch.delete(docSnap.ref);
        count++;
        if (count >= BATCH_LIMIT) {
            await batch.commit();
            batch = writeBatch(db);
            count = 0;
        }
    }

    batch.delete(storeRef);
    await batch.commit();
};

export const subscribeToUserStores = (
    userId: string,
    callback: (stores: Store[]) => void,
    onError?: () => void
): Unsubscribe => {
    const q = query(collection(db, "stores"), where("userId", "==", userId));
    return onSnapshot(q, (snapshot) => {
        const stores = snapshot.docs.map((d) => ({id: d.id, ...d.data()})) as Store[];
        callback(stores);
    }, onError);
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