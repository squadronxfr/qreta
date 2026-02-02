import {buildCollection, buildProperty} from "@firecms/core"

export const storeCollection = buildCollection({
    id: "stores",
    path: "stores",
    name: "Stores",
    singularName: "Store",
    icon: "Store",
    permissions: () => ({
        read: true,
        edit: true,
        create: true,
        delete: true
    }),
    properties: {
        shopName: buildProperty({
            dataType: "string",
            name: "Store Name",
            validation: {required: true}
        }),
        firstName: buildProperty({
            dataType: "string",
            name: "First Name",
            validation: {required: true}
        }),
        lastName: buildProperty({
            dataType: "string",
            name: "Last Name",
            validation: {required: true}
        }),
        email: buildProperty({
            dataType: "string",
            name: "Email",
            validation: {required: true},
            email: true
        }),
        phone: buildProperty({
            dataType: "string",
            name: "Phone"
        }),
        address: buildProperty({
            dataType: "string",
            name: "Address",
            multiline: true
        }),
        logoUrl: buildProperty({
            dataType: "string",
            name: "Logo",
            storage: {
                storagePath: "stores/logos",
                acceptedFiles: ["image/*"],
                maxSize: 5242880
            }
        }),
        isActive: buildProperty({
            dataType: "boolean",
            name: "Active",
            defaultValue: true
        }),
        subscription: buildProperty({
            dataType: "string",
            name: "Subscription",
            enumValues: {
                free: "Free",
                premium: "Premium",
                partner: "Partner"
            },
            defaultValue: "free"
        }),
        subscriptionStatus: buildProperty({
            dataType: "string",
            name: "Subscription Status",
            enumValues: {
                active: "Active",
                past_due: "Past Due",
                canceled: "Canceled"
            },
            defaultValue: "active"
        }),
        freeForever: buildProperty({
            dataType: "boolean",
            name: "Free Forever",
            description: "For friends and partners",
            defaultValue: false
        }),
        subscriptionEndDate: buildProperty({
            dataType: "date",
            name: "Subscription End Date"
        }),
        createdAt: buildProperty({
            dataType: "date",
            name: "Created At",
            autoValue: "on_create"
        })
    }
})