import {Timestamp} from "firebase/firestore";

export type SubscriptionPlan = "starter" | "pro" | "agency";
export type SubscriptionStatus = "active" | "past_due" | "canceled" | "trialing";

export interface UserDoc {
    uid: string;
    email: string;
    role: "superadmin" | "store_owner";
    subscription: {
        plan: SubscriptionPlan;
        status: SubscriptionStatus;
        currentPeriodEnd: Timestamp;
        stripeCustomerId?: string;
    };
    createdAt: Timestamp;
    updatedAt: Timestamp;
}