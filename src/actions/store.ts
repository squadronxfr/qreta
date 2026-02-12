"use server";

import {adminDb} from "@/lib/firebase/admin";
import {SUBSCRIPTION_PLANS, PlanKey} from "@/config/subscription";
import {generateSlug} from "@/lib/utils/slug";
import {Timestamp} from "firebase-admin/firestore";
import {revalidatePath} from "next/cache";

export type ActionResponse = {
    success: boolean;
    storeId?: string;
    error?: string;
};

export async function createStoreAction(userId: string, name: string, description: string): Promise<ActionResponse> {
    try {
        if (!userId || !name) return {success: false, error: "Données incomplètes"};

        const userDoc = await adminDb.collection("users").doc(userId).get();
        if (!userDoc.exists) return {success: false, error: "Utilisateur introuvable"};

        const userData = userDoc.data();
        const planKey = (userData?.subscription?.plan as PlanKey) || "free";
        const plan = SUBSCRIPTION_PLANS[planKey];

        const storesQuery = await adminDb.collection("stores").where("userId", "==", userId).get();
        const currentStoreCount = storesQuery.size;

        if (currentStoreCount >= plan.quota) {
            return {
                success: false,
                error: `Votre plan ${plan.name} est limité à ${plan.quota} boutique(s).`
            };
        }

        let slug = generateSlug(name);
        let isUnique = false;
        let counter = 0;

        while (!isUnique) {
            const checkSlug = counter === 0 ? slug : `${slug}-${counter}`;
            const slugQuery = await adminDb.collection("stores").where("slug", "==", checkSlug).get();
            if (slugQuery.empty) {
                slug = checkSlug;
                isUnique = true;
            } else {
                counter++;
            }
        }

        const newStoreRef = await adminDb.collection("stores").add({
            name,
            description,
            slug,
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

        revalidatePath("/stores");

        return {success: true, storeId: newStoreRef.id};

    } catch (error) {
        console.error(error);
        return {success: false, error: "Erreur serveur interne"};
    }
}