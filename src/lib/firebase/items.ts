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
    serverTimestamp,
    Unsubscribe,
} from "firebase/firestore";
import {Item} from "@/types/store";
import {uploadFile, deleteFile} from "@/lib/firebase/storage";

interface CreateItemData {
    storeId: string;
    categoryId: string;
    name: string;
    description: string;
    price: number;
    type: "product" | "service";
    isStartingPrice: boolean;
    duration?: string;
}

export const createItem = async (
    data: CreateItemData,
    imageFile?: File | null
): Promise<string> => {
    let imageUrl = "";

    if (imageFile) {
        const ext = imageFile.name.split(".").pop();
        const path = `items/${data.storeId}/${Date.now()}.${ext}`;
        imageUrl = await uploadFile(path, imageFile);
    }

    const docRef = await addDoc(collection(db, "items"), {
        ...data,
        imageUrl,
        order: Date.now(),
        isActive: true,
        createdAt: serverTimestamp(),
    });

    return docRef.id;
};

export const updateItem = async (
    itemId: string,
    storeId: string,
    data: Partial<Omit<Item, "id" | "storeId" | "createdAt">>,
    imageFile?: File | null,
    shouldRemoveImage?: boolean
): Promise<void> => {
    const updates: Record<string, unknown> = {...data};

    if (shouldRemoveImage && data.imageUrl) {
        await deleteFile(data.imageUrl);
        updates.imageUrl = "";
    }

    if (imageFile) {
        const ext = imageFile.name.split(".").pop();
        const path = `items/${storeId}/${Date.now()}.${ext}`;
        updates.imageUrl = await uploadFile(path, imageFile);
    }

    await updateDoc(doc(db, "items", itemId), updates);
};

export const deleteItem = async (item: Pick<Item, "id" | "imageUrl">): Promise<void> => {
    if (item.imageUrl) {
        await deleteFile(item.imageUrl);
    }
    await deleteDoc(doc(db, "items", item.id));
};

export const subscribeToItems = (
    storeId: string,
    callback: (items: Item[]) => void
): Unsubscribe => {
    const q = query(
        collection(db, "items"),
        where("storeId", "==", storeId)
    );

    return onSnapshot(q, (snap) => {
        const items = snap.docs.map((d) => ({id: d.id, ...d.data()}) as Item);
        callback(items);
    });
};