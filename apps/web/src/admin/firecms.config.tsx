import {buildCollection, buildProperty} from "@firecms/core"

// Sous-collection: Categories
const categoriesCollection = buildCollection({
    id: "categories",
    path: "categories",
    name: "Categories",
    singularName: "Category",
    icon: "Category",
    permissions: () => ({
        read: true,
        edit: true,
        create: true,
        delete: true
    }),
    properties: {
        name: buildProperty({
            dataType: "string",
            name: "Name",
            validation: {required: true}
        }),
        order: buildProperty({
            dataType: "number",
            name: "Display Order",
            description: "Order in which categories are displayed",
            defaultValue: 0
        }),
        isActive: buildProperty({
            dataType: "boolean",
            name: "Active",
            defaultValue: true
        })
    }
})

// Sous-collection: Services
const servicesCollection = buildCollection({
    id: "services",
    path: "services",
    name: "Services",
    singularName: "Service",
    icon: "MiscellaneousServices",
    permissions: () => ({
        read: true,
        edit: true,
        create: true,
        delete: true
    }),
    properties: {
        name: buildProperty({
            dataType: "string",
            name: "Name",
            validation: {required: true}
        }),
        description: buildProperty({
            dataType: "string",
            name: "Description",
            multiline: true
        }),
        price: buildProperty({
            dataType: "number",
            name: "Price (€)",
            validation: {required: true, min: 0}
        }),
        duration: buildProperty({
            dataType: "number",
            name: "Duration (minutes)",
            validation: {min: 0}
        }),
        imageUrl: buildProperty({
            dataType: "string",
            name: "Image",
            storage: {
                storagePath: "services/images",
                acceptedFiles: ["image/*"],
                maxSize: 5242880,
                storeUrl: true
            }
        }),
        categoryId: buildProperty({
            dataType: "string",
            name: "Category ID",
            description: "Reference to category"
        }),
        isActive: buildProperty({
            dataType: "boolean",
            name: "Active",
            defaultValue: true
        }),
        order: buildProperty({
            dataType: "number",
            name: "Display Order",
            defaultValue: 0
        })
    }
})

// Sous-collection: Products
const productsCollection = buildCollection({
    id: "products",
    path: "products",
    name: "Products",
    singularName: "Product",
    icon: "Inventory",
    permissions: () => ({
        read: true,
        edit: true,
        create: true,
        delete: true
    }),
    properties: {
        name: buildProperty({
            dataType: "string",
            name: "Name",
            validation: {required: true}
        }),
        description: buildProperty({
            dataType: "string",
            name: "Description",
            multiline: true
        }),
        price: buildProperty({
            dataType: "number",
            name: "Price (€)",
            validation: {required: true, min: 0}
        }),
        imageUrl: buildProperty({
            dataType: "string",
            name: "Image",
            storage: {
                storagePath: "products/images",
                acceptedFiles: ["image/*"],
                maxSize: 5242880,
                storeUrl: true
            }
        }),
        categoryId: buildProperty({
            dataType: "string",
            name: "Category ID",
            description: "Reference to category"
        }),
        stock: buildProperty({
            dataType: "number",
            name: "Stock",
            validation: {min: 0},
            defaultValue: 0
        }),
        isActive: buildProperty({
            dataType: "boolean",
            name: "Active",
            defaultValue: true
        }),
        order: buildProperty({
            dataType: "number",
            name: "Display Order",
            defaultValue: 0
        })
    }
})

// Collection principale: Stores avec sous-collections
export const storesCollection = buildCollection({
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
        storeName: buildProperty({
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
                maxSize: 5242880,
                storeUrl: true
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
    },
    subcollections: [
        categoriesCollection,
        servicesCollection,
        productsCollection
    ]
})