import {createStore} from "zustand";
import {Store, Category, Item} from "@/types/store";
import {subscribeToStore} from "@/lib/firebase/store";
import {subscribeToCategories} from "@/lib/firebase/categories";
import {subscribeToItems} from "@/lib/firebase/items";

export interface CatalogState {
    store: Store | null;
    categories: Category[];
    items: Item[];
    isLoading: boolean;
}

export interface CatalogActions {
    subscribe: (storeId: string) => () => void;
    reset: () => void;
}

export type CatalogStore = CatalogState & CatalogActions;

export const createCatalogStore = () => {
    return createStore<CatalogStore>((set) => ({
        store: null,
        categories: [],
        items: [],
        isLoading: true,

        subscribe: (storeId: string) => {
            const loadedFlags = {store: false, categories: false, items: false};

            const checkLoaded = () => {
                if (loadedFlags.store && loadedFlags.categories && loadedFlags.items) {
                    set({isLoading: false});
                }
            };

            const unsubStore = subscribeToStore(storeId, (store) => {
                set({store});
                loadedFlags.store = true;
                checkLoaded();
            });

            const unsubCategories = subscribeToCategories(storeId, (categories) => {
                set({categories});
                loadedFlags.categories = true;
                checkLoaded();
            });

            const unsubItems = subscribeToItems(storeId, (items) => {
                set({items});
                loadedFlags.items = true;
                checkLoaded();
            });

            return () => {
                unsubStore();
                unsubCategories();
                unsubItems();
            };
        },

        reset: () => {
            set({store: null, categories: [], items: [], isLoading: true});
        },
    }));
};