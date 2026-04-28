"use server";

import {adminDb} from "@/lib/firebase/admin";
import {getAuth} from "firebase-admin/auth";
import {SUBSCRIPTION_PLANS, PlanKey} from "@/config/subscription";
import {generateSlug} from "@/lib/utils/slug";
import {FieldValue} from "firebase-admin/firestore";
import {revalidatePath} from "next/cache";

export type ActionResponse = {
    success: boolean;
    storeId?: string;
    error?: string;
};

export async function createStoreAction(
    idToken: string,
    name: string,
    description: string
): Promise<ActionResponse> {
    try {
        if (!idToken || !name) return {success: false, error: "Données incomplètes"};

        let userId: string;
        try {
            const decoded = await getAuth().verifyIdToken(idToken);
            userId = decoded.uid;
        } catch {
            return {success: false, error: "Non autorisé"};
        }

        const userDoc = await adminDb.collection("users").doc(userId).get();
        if (!userDoc.exists) return {success: false, error: "Utilisateur introuvable"};

        const userData = userDoc.data();
        const planKey = (userData?.subscription?.plan as PlanKey) || "free";
        const plan = SUBSCRIPTION_PLANS[planKey];

        const storesQuery = await adminDb.collection("stores").where("userId", "==", userId).get();
        if (storesQuery.size >= plan.quota) {
            return {
                success: false,
                error: `Votre plan ${plan.name} est limité à ${plan.quota} catalogue(s).`,
            };
        }

        let slug = generateSlug(name);
        let isUnique = false;
        let counter = 0;
        const MAX_SLUG_ATTEMPTS = 10;

        while (!isUnique && counter <= MAX_SLUG_ATTEMPTS) {
            const checkSlug = counter === 0 ? slug : `${slug}-${counter}`;
            const slugQuery = await adminDb.collection("stores").where("slug", "==", checkSlug).get();
            if (slugQuery.empty) {
                slug = checkSlug;
                isUnique = true;
            } else {
                counter++;
            }
        }

        if (!isUnique) return {success: false, error: "Impossible de générer un slug unique."};

        const newStoreRef = await adminDb.collection("stores").add({
            name,
            description,
            slug,
            userId,
            isActive: false,
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
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
    } catch {
        return {success: false, error: "Erreur serveur interne"};
    }
}