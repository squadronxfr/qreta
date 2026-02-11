import {createStore} from "zustand";
import {Store, Item} from "@/types/store";
import {subscribeToUserStores} from "@/lib/firebase/store";
import {collection, query, where, onSnapshot, Unsubscribe} from "firebase/firestore";
import {db} from "@/lib/firebase/config";

interface StoreCounts {
    products: number;
    services: number;
}

export interface StoreState {
    stores: Store[];
    countsMap: Record<string, StoreCounts>;
    isLoading: boolean;
}

export interface StoreActions {
    subscribe: (userId: string) => () => void;
    reset: () => void;
}

export type StoreStore = StoreState & StoreActions;

export const createStoreStore = () => {
    return createStore<StoreStore>((set) => ({
        stores: [],
        countsMap: {},
        isLoading: true,

        subscribe: (userId: string) => {
            let unsubItems: Unsubscribe | null = null;

            const unsubStores = subscribeToUserStores(userId, (stores) => {
                set({stores, isLoading: false});

                if (unsubItems) unsubItems();

                const storeIds = stores.map((s) => s.id);
                if (storeIds.length === 0) {
                    set({countsMap: {}});
                    return;
                }

                const q = query(
                    collection(db, "items"),
                    where("storeId", "in", storeIds.slice(0, 30))
                );

                unsubItems = onSnapshot(q, (snap) => {
                    const map: Record<string, StoreCounts> = {};

                    for (const storeId of storeIds) {
                        map[storeId] = {products: 0, services: 0};
                    }

                    for (const d of snap.docs) {
                        const item = d.data() as Item;
                        if (!map[item.storeId]) continue;
                        if (item.type === "product") {
                            map[item.storeId].products++;
                        } else {
                            map[item.storeId].services++;
                        }
                    }

                    set({countsMap: map});
                });
            });

            return () => {
                unsubStores();
                if (unsubItems) unsubItems();
            };
        },

        reset: () => {
            set({stores: [], countsMap: {}, isLoading: true});
        },
    }));
};