import {Timestamp} from "firebase/firestore";

export type SubscriptionPlan = "free" | "starter" | "pro";
export type SubscriptionStatus = "active" | "past_due" | "canceled" | "trialing" | "incomplete";

export interface UserDoc {
    uid: string;
    email: string;
    lastname?: string;
    firstname?: string;
    photoUrl?: string;
    role: "superadmin" | "store_owner";
    isBlocked?: boolean;
    subscription: {
        plan: SubscriptionPlan;
        status: SubscriptionStatus;
        currentPeriodEnd: Timestamp;
        stripeCustomerId?: string;
    };
    createdAt: Timestamp;
    updatedAt: Timestamp;
}