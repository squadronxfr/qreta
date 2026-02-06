import {Timestamp} from "firebase/firestore";

export interface Store {
    id: string;
    ownerId: string;
    name: string;
    slug: string;
    description?: string;
    logoUrl?: string;
    bannerUrl?: string;
    primaryColor?: string;
    address?: string;
    phone?: string;
    instagram?: string;
    website?: string;
    isActive: boolean;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface Category {
    id: string;
    storeId: string;
    name: string;
    order: number;
    isActive: boolean;
}

export interface Item {
    id: string;
    storeId: string;
    categoryId: string;
    name: string;
    description: string;
    price: number;
    isStartingPrice: boolean;
    duration?: string;
    type: "product" | "service";
    imageUrl?: string;
    order: number;
    isActive: boolean;
    createdAt: Timestamp;
}