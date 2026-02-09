import {notFound} from "next/navigation";
import {db} from "@/lib/firebase/config";
import {collection, query, where, getDocs, doc, getDoc} from "firebase/firestore";
import {PublicStoreView} from "@/components/store-front/public-view";
import {Store, Category, Item} from "@/types/store";
import {Metadata} from "next";
import {PlanKey} from "@/config/subscription";

export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
    const {slug} = await params;
    const q = query(collection(db, "stores"), where("slug", "==", slug));
    const snap = await getDocs(q);
    if (snap.empty) return {title: "Boutique introuvable - Qreta"};
    const store = snap.docs[0].data() as Store;
    return {
        title: `${store.name} | Catalogue`,
        description: store.description || `Découvrez le catalogue de ${store.name} sur Qreta.`,
        openGraph: {
            title: store.name,
            description: store.description || "",
            images: store.bannerUrl ? [store.bannerUrl] : [],
        }
    };
}

export default async function PublicStorePage({params}: PageProps) {
    const {slug} = await params;

    const qStore = query(collection(db, "stores"), where("slug", "==", slug));
    const storeSnap = await getDocs(qStore);

    if (storeSnap.empty) {
        notFound();
    }

    const storeDoc = storeSnap.docs[0];
    const storeData = storeDoc.data() as Store;

    if (!storeData.isActive) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
                <div className="h-16 w-16 bg-slate-200 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl">🔒</span>
                </div>
                <h1 className="text-xl font-bold text-slate-900 mb-2">Boutique indisponible</h1>
                <p className="text-slate-500 max-w-md">
                    Ce catalogue est actuellement privé ou en maintenance.
                    Revenez plus tard !
                </p>
            </div>
        );
    }

    let isPro = false;
    if (storeData.userId) {
        try {
            const userDocRef = doc(db, "users", storeData.userId);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                const plan = (userData.subscription?.plan as PlanKey) || "free";
                isPro = plan === "pro";
            }
        } catch (e) {
            console.error("Erreur récupération user plan", e);
        }
    }

    const qCats = query(collection(db, "categories"), where("storeId", "==", storeDoc.id));
    const catsSnapPromise = getDocs(qCats);

    const qItems = query(collection(db, "items"), where("storeId", "==", storeDoc.id));
    const itemsSnapPromise = getDocs(qItems);

    const [catsSnap, itemsSnap] = await Promise.all([catsSnapPromise, itemsSnapPromise]);

    const categories = catsSnap.docs
        .map(d => ({id: d.id, ...d.data()} as Category))
        .filter(c => c.isActive)
        .sort((a, b) => a.order - b.order);

    const items = itemsSnap.docs
        .map(d => ({id: d.id, ...d.data()} as Item))
        .filter(i => i.isActive)
        .sort((a, b) => a.order - b.order);

    const serializedStore = JSON.parse(JSON.stringify({...storeData, id: storeDoc.id}));
    const serializedCats = JSON.parse(JSON.stringify(categories));
    const serializedItems = JSON.parse(JSON.stringify(items));

    return (
        <PublicStoreView
            store={serializedStore}
            categories={serializedCats}
            items={serializedItems}
            isPro={isPro}
        />
    );
}