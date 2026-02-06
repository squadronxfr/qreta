import {Timestamp} from "firebase/firestore";

export interface Store {
    id: string;
    name: string;
    ownerId: string;
    slug: string;
    createdAt: Timestamp;
}