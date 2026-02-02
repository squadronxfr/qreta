import {useState, useEffect} from 'react'
import {doc, collection, getDocs, getDoc} from 'firebase/firestore'
import {db} from '@/config/firebase'

interface Store {
    id: string
    storeName: string
    firstName: string
    lastName: string
    email: string
    phone?: string
    address?: string
    logoUrl?: string
    isActive: boolean
}

interface Category {
    id: string
    name: string
    order: number
    isActive: boolean
}

interface Service {
    id: string
    name: string
    description?: string
    price: number
    duration?: number
    imageUrl?: string
    categoryId?: string
    isActive: boolean
    order: number
}

interface Product {
    id: string
    name: string
    description?: string
    price: number
    imageUrl?: string
    categoryId?: string
    stock: number
    isActive: boolean
    order: number
}

export function useStoreData(storeId: string) {
    const [store, setStore] = useState<Store | null>(null)
    const [categories, setCategories] = useState<Category[]>([])
    const [services, setServices] = useState<Service[]>([])
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function loadStoreData() {
            try {
                setLoading(true)

                // Charger le store
                const storeDoc = await getDoc(doc(db, 'stores', storeId))
                if (!storeDoc.exists()) {
                    setError('Store not found')
                    setLoading(false)
                    return
                }

                setStore({id: storeDoc.id, ...storeDoc.data()} as Store)

                // Charger les catégories
                const categoriesSnap = await getDocs(
                    collection(db, 'stores', storeId, 'categories')
                )
                const categoriesData = categoriesSnap.docs
                    .map(doc => ({id: doc.id, ...doc.data()} as Category))
                    .filter(cat => cat.isActive)
                    .sort((a, b) => a.order - b.order)
                setCategories(categoriesData)

                // Charger les services
                const servicesSnap = await getDocs(
                    collection(db, 'stores', storeId, 'services')
                )
                const servicesData = servicesSnap.docs
                    .map(doc => ({id: doc.id, ...doc.data()} as Service))
                    .filter(service => service.isActive)
                    .sort((a, b) => a.order - b.order)
                setServices(servicesData)

                // Charger les produits
                const productsSnap = await getDocs(
                    collection(db, 'stores', storeId, 'products')
                )
                const productsData = productsSnap.docs
                    .map(doc => ({id: doc.id, ...doc.data()} as Product))
                    .filter(product => product.isActive)
                    .sort((a, b) => a.order - b.order)
                setProducts(productsData)

                setLoading(false)
            } catch (err) {
                console.error('Error loading store data:', err)
                setError('Failed to load store data')
                setLoading(false)
            }
        }

        if (storeId) {
            loadStoreData()
        }
    }, [storeId])

    return {store, categories, services, products, loading, error}
}