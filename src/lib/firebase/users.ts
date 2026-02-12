import {db, storage} from "@/lib/firebase/config";
import {
    collection,
    doc,
    query,
    orderBy,
    limit,
    startAfter,
    getDocs,
    updateDoc,
    where,
    writeBatch,
    QueryDocumentSnapshot,
    DocumentData,
    Timestamp,
} from "firebase/firestore";
import {ref, deleteObject} from "firebase/storage";
import {deleteUser, User} from "firebase/auth";
import {UserDoc, SubscriptionPlan, SubscriptionStatus} from "@/types/user";
import {Store} from "@/types/store";

export interface AdminUserView extends UserDoc {
    stores: Store[];
}

export interface PaginatedUsersResult {
    users: AdminUserView[];
    lastDoc: QueryDocumentSnapshot<DocumentData> | null;
    hasMore: boolean;
}

const PAGE_SIZE = 20;

export const fetchUsersPaginated = async (
    cursor?: QueryDocumentSnapshot<DocumentData> | null
): Promise<PaginatedUsersResult> => {
    const queryConstraints = [];
    queryConstraints.push(orderBy("createdAt", "desc"));

    if (cursor) {
        queryConstraints.push(startAfter(cursor));
    }
    queryConstraints.push(limit(PAGE_SIZE + 1));

    const usersSnap = await getDocs(query(collection(db, "users"), ...queryConstraints));
    const hasMore = usersSnap.docs.length > PAGE_SIZE;
    const userDocs = hasMore ? usersSnap.docs.slice(0, PAGE_SIZE) : usersSnap.docs;
    const lastDoc = userDocs[userDocs.length - 1] || null;

    const usersList = userDocs.map((d) => d.data() as unknown as UserDoc);

    const userIds = usersList.map((u) => u.uid);
    const stores: Store[] = [];

    if (userIds.length > 0) {
        for (let i = 0; i < userIds.length; i += 30) {
            const batch = userIds.slice(i, i + 30);
            const storesSnap = await getDocs(
                query(collection(db, "stores"), where("userId", "in", batch))
            );
            stores.push(...storesSnap.docs.map((d) => ({id: d.id, ...d.data()} as Store)));
        }
    }

    const users: AdminUserView[] = usersList.map((user) => ({
        ...user,
        stores: stores.filter((s) => s.userId === user.uid),
    }));

    return {users, lastDoc, hasMore};
};

export const updateUserSubscriptionAdmin = async (
    userId: string,
    plan: SubscriptionPlan,
    status: SubscriptionStatus
): Promise<void> => {
    await updateDoc(doc(db, "users", userId), {
        "subscription.plan": plan,
        "subscription.status": status,
        updatedAt: Timestamp.now(),
    });
};

export const toggleUserBlock = async (
    userId: string,
    isCurrentlyBlocked: boolean
): Promise<void> => {
    await updateDoc(doc(db, "users", userId), {
        isBlocked: !isCurrentlyBlocked,
        updatedAt: Timestamp.now(),
    });
};

/**
 * Supprime complètement un utilisateur et toutes ses données :
 * 1. Ses boutiques (stores)
 * 2. Les catégories de ses boutiques (categories)
 * 3. Les items de ses boutiques (items) + images Storage
 * 4. Son avatar (Storage)
 * 5. Son document utilisateur (users/{uid})
 * 6. Son compte d'authentification (Auth)
 */
export const deleteAccount = async (user: User) => {
    const storesQuery = query(collection(db, "stores"), where("userId", "==", user.uid));
    const storesSnapshot = await getDocs(storesQuery);

    const storeIds = storesSnapshot.docs.map((d) => d.id);

    if (storeIds.length > 0) {
        for (const storeId of storeIds) {
            const categoriesQuery = query(collection(db, "categories"), where("storeId", "==", storeId));
            const categoriesSnapshot = await getDocs(categoriesQuery);

            const itemsQuery = query(collection(db, "items"), where("storeId", "==", storeId));
            const itemsSnapshot = await getDocs(itemsQuery);

            const batch = writeBatch(db);

            categoriesSnapshot.forEach((doc) => {
                batch.delete(doc.ref);
            });

            for (const itemDoc of itemsSnapshot.docs) {
                const itemData = itemDoc.data();
                if (itemData.imageUrl) {
                    try {
                        const imageRef = ref(storage, itemData.imageUrl);
                        await deleteObject(imageRef);
                    } catch (error) {
                        console.error("Failed to delete item image:", error);
                    }
                }
                batch.delete(itemDoc.ref);
            }

            await batch.commit();
        }
    }

    const finalBatch = writeBatch(db);

    storesSnapshot.forEach((doc) => {
        finalBatch.delete(doc.ref);
    });

    const userRef = doc(db, "users", user.uid);
    finalBatch.delete(userRef);

    await finalBatch.commit();

    if (user.photoURL) {
        try {
            const avatarRef = ref(storage, user.photoURL);
            await deleteObject(avatarRef);
        } catch (error) {
            console.error("Failed to delete avatar:", error);
        }
    }

    await deleteUser(user);
};