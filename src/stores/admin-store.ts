import {createStore} from "zustand";
import {fetchUsersPaginated, AdminUserView} from "@/lib/firebase/users";
import {QueryDocumentSnapshot, DocumentData} from "firebase/firestore";

export interface AdminState {
    users: AdminUserView[];
    isLoading: boolean;
    isLoadingMore: boolean;
    cursor: QueryDocumentSnapshot<DocumentData> | null;
    hasMore: boolean;
    error: string | null;
    searchQuery: string;
}

export interface AdminActions {
    loadUsers: (isInitial?: boolean) => Promise<void>;
    loadMoreUsers: () => Promise<void>;
    refresh: () => Promise<void>;
    setSearchQuery: (query: string) => void;
    reset: () => void;
}

export type AdminStore = AdminState & AdminActions;

export const createAdminStore = () => {
    return createStore<AdminStore>((set, get) => ({
        users: [],
        isLoading: false,
        isLoadingMore: false,
        cursor: null,
        hasMore: false,
        error: null,
        searchQuery: "",

        loadUsers: async (isInitial = true) => {
            const state = get();

            if (isInitial) {
                set({isLoading: true, error: null});
            } else {
                set({isLoadingMore: true});
            }

            try {
                const result = await fetchUsersPaginated(isInitial ? null : state.cursor);

                if (isInitial) {
                    set({
                        users: result.users,
                        cursor: result.lastDoc,
                        hasMore: result.hasMore,
                        isLoading: false,
                    });
                } else {
                    set({
                        users: [...state.users, ...result.users],
                        cursor: result.lastDoc,
                        hasMore: result.hasMore,
                        isLoadingMore: false,
                    });
                }
            } catch (err) {
                set({
                    error: err instanceof Error ? err.message : "Erreur de chargement",
                    isLoading: false,
                    isLoadingMore: false,
                });
            }
        },

        loadMoreUsers: async () => {
            const state = get();
            if (!state.hasMore || state.isLoadingMore) return;
            await state.loadUsers(false);
        },

        refresh: async () => {
            await get().loadUsers(true);
        },

        setSearchQuery: (query: string) => {
            set({searchQuery: query});
        },

        reset: () => {
            set({
                users: [],
                isLoading: false,
                isLoadingMore: false,
                cursor: null,
                hasMore: false,
                error: null,
                searchQuery: "",
            });
        },
    }));
};