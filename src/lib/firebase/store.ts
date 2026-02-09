import {db} from "@/lib/firebase/config";
import {collection, addDoc, query, where, getDocs, Timestamp} from "firebase/firestore";

interface CreateStoreData {
    name: string;
    description: string;
}

const generateSlug = (text: string) => {
    return text
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
};

export async function createStore(userId: string, data: CreateStoreData) {
    const baseSlug = generateSlug(data.name);
    let uniqueSlug = baseSlug;
    let counter = 1;

    while (true) {
        const q = query(collection(db, "stores"), where("slug", "==", uniqueSlug));
        const snapshot = await getDocs(q);
        if (snapshot.empty) break;
        uniqueSlug = `${baseSlug}-${counter}`;
        counter++;
    }

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
}