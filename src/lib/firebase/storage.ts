import {ref, uploadBytes, getDownloadURL, deleteObject} from "firebase/storage";
import {storage} from "@/lib/firebase/config";

export const uploadFile = async (path: string, file: File): Promise<string> => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
};

export const deleteFile = async (url: string): Promise<void> => {
    try {
        const fileRef = ref(storage, url);
        await deleteObject(fileRef);
    } catch {
        console.error("Failed to delete file at URL:", url);
    }
};