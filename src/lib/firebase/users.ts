import {db} from "@/lib/firebase/config";
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
 * Supprime complètement un utilisateur :
 * 1. Ses boutiques (stores)
 * 2. Son document utilisateur (users/{uid})
 * 3. Son compte d'authentification (Auth)
 */
export const deleteAccount = async (user: User) => {
    const storesQuery = query(collection(db, "stores"), where("userId", "==", user.uid));
    const storesSnapshot = await getDocs(storesQuery);

    const batch = writeBatch(db);

    storesSnapshot.forEach((doc) => {
        batch.delete(doc.ref);
    });

    const userRef = doc(db, "users", user.uid);
    batch.delete(userRef);

    await batch.commit();

    await deleteUser(user);
};