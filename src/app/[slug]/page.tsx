import {notFound} from "next/navigation";
import {adminDb} from "@/lib/firebase/admin";
import {PublicStoreView} from "@/components/store-front/public-view";
import {Store, Category, Item, SerializedStore, SerializedItem} from "@/types/store";
import {Metadata} from "next";
import {PlanKey} from "@/config/subscription";

interface PageProps {
    params: Promise<{ slug: string }>;
}

async function getStoreBySlug(slug: string) {
    const snap = await adminDb.collection("stores").where("slug", "==", slug).get();
    if (snap.empty) return null;
    return {doc: snap.docs[0], data: snap.docs[0].data() as Store};
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
    const {slug} = await params;
    const result = await getStoreBySlug(slug);
    if (!result) return {title: "Catalogue introuvable - Qreta"};

    const store = result.data;
    return {
        title: `${store.name} | Catalogue`,
        description: store.description || `Découvrez le catalogue de ${store.name} sur Qreta.`,
        openGraph: {
            title: store.name,
            description: store.description || "",
            images: store.bannerUrl ? [store.bannerUrl] : [],
        },
    };
}

export default async function PublicStorePage({params}: PageProps) {
    const {slug} = await params;
    const result = await getStoreBySlug(slug);

    if (!result) notFound();

    const {doc: storeDoc, data: storeData} = result;

    if (!storeData.isActive) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
                <div className="h-16 w-16 bg-slate-200 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl">🔒</span>
                </div>
                <h1 className="text-xl font-bold text-slate-900 mb-2">Catalogue indisponible</h1>
                <p className="text-slate-500 max-w-md">
                    Ce catalogue est actuellement privé ou en maintenance. Revenez plus tard !
                </p>
            </div>
        );
    }

    let isPro = false;
    if (storeData.userId) {
        const userSnap = await adminDb.collection("users").doc(storeData.userId).get().catch(() => null);
        if (userSnap?.exists) {
            const plan = (userSnap.data()?.subscription?.plan as PlanKey) || "free";
            isPro = plan === "pro";
        }
    }

    const [catsSnap, itemsSnap] = await Promise.all([
        adminDb.collection("categories").where("storeId", "==", storeDoc.id).get(),
        adminDb.collection("items").where("storeId", "==", storeDoc.id).get(),
    ]);

    const categories = catsSnap.docs
        .map((d) => ({id: d.id, ...d.data()} as Category))
        .filter((c) => c.isActive)
        .sort((a, b) => a.order - b.order);

    const items = itemsSnap.docs
        .map((d) => ({id: d.id, ...d.data()} as Item))
        .filter((i) => i.isActive)
        .sort((a, b) => a.order - b.order);

    const serializedStore = JSON.parse(JSON.stringify({...storeData, id: storeDoc.id})) as SerializedStore;
    const serializedCats = JSON.parse(JSON.stringify(categories)) as Category[];
    const serializedItems = JSON.parse(JSON.stringify(items)) as SerializedItem[];

    return (
        <PublicStoreView
            store={serializedStore}
            categories={serializedCats}
            items={serializedItems}
            isPro={isPro}
        />
    );
}