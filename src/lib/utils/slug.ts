import {collection, query, where, getDocs} from "firebase/firestore";
import {db} from "@/lib/firebase/config";

export const generateSlug = (text: string): string => {
    return text
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
};

export const checkSlugAvailability = async (
    baseSlug: string,
    excludeStoreId?: string
): Promise<string> => {
    let uniqueSlug = baseSlug;
    let counter = 1;

    while (true) {
        const q = query(
            collection(db, "stores"),
            where("slug", "==", uniqueSlug)
        );
        const snapshot = await getDocs(q);

        const isAvailable =
            snapshot.empty ||
            (!!excludeStoreId &&
                snapshot.docs.length === 1 &&
                snapshot.docs[0].id === excludeStoreId);

        if (isAvailable) return uniqueSlug;

        uniqueSlug = `${baseSlug}-${counter}`;
        counter++;
    }
};