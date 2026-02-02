import {useParams} from 'react-router-dom'
import {useStoreData} from '../hooks/useStoreData'
import StoreHeader from '../components/StoreHeader'
import ServiceCard from '../components/ServiceCard'
import ProductCard from '../components/ProductCard'

export default function Catalog() {
    const {storeId} = useParams<{ storeId: string }>()
    const {store, categories, services, products, loading, error} = useStoreData(storeId!)

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        )
    }

    if (error || !store) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-error mb-2">Store not found</h1>
                    <p className="text-gray-600">This store does not exist or is not active.</p>
                </div>
            </div>
        )
    }

    if (!store.isActive) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-warning mb-2">Store temporarily closed</h1>
                    <p className="text-gray-600">This store is currently inactive.</p>
                </div>
            </div>
        )
    }

    // Grouper services par catégorie
    const servicesByCategory = categories.map(category => ({
        category,
        items: services.filter(service => service.categoryId === category.id)
    }))

    // Services sans catégorie
    const uncategorizedServices = services.filter(service => !service.categoryId)

    // Grouper produits par catégorie
    const productsByCategory = categories.map(category => ({
        category,
        items: products.filter(product => product.categoryId === category.id)
    }))

    // Produits sans catégorie
    const uncategorizedProducts = products.filter(product => !product.categoryId)

    return (
        <div className="min-h-screen bg-base-200">
            <StoreHeader
                storeName={store.storeName}
                logoUrl={store.logoUrl}
                address={store.address}
                phone={store.phone}
            />

            <div className="container mx-auto px-4 py-8">
                {/* Section Services */}
                {services.length > 0 && (
                    <section className="mb-12">
                        <h2 className="text-3xl font-bold mb-6">Services</h2>

                        {/* Services par catégorie */}
                        {servicesByCategory.map(({category, items}) =>
                                items.length > 0 && (
                                    <div key={category.id} className="mb-8">
                                        <h3 className="text-2xl font-semibold mb-4">{category.name}</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {items.map(service => (
                                                <ServiceCard
                                                    key={service.id}
                                                    name={service.name}
                                                    description={service.description}
                                                    price={service.price}
                                                    duration={service.duration}
                                                    imageUrl={service.imageUrl}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )
                        )}

                        {/* Services sans catégorie */}
                        {uncategorizedServices.length > 0 && (
                            <div className="mb-8">
                                <h3 className="text-2xl font-semibold mb-4">Other Services</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {uncategorizedServices.map(service => (
                                        <ServiceCard
                                            key={service.id}
                                            name={service.name}
                                            description={service.description}
                                            price={service.price}
                                            duration={service.duration}
                                            imageUrl={service.imageUrl}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>
                )}

                {/* Section Produits */}
                {products.length > 0 && (
                    <section>
                        <h2 className="text-3xl font-bold mb-6">Products</h2>

                        {/* Produits par catégorie */}
                        {productsByCategory.map(({category, items}) =>
                                items.length > 0 && (
                                    <div key={category.id} className="mb-8">
                                        <h3 className="text-2xl font-semibold mb-4">{category.name}</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {items.map(product => (
                                                <ProductCard
                                                    key={product.id}
                                                    name={product.name}
                                                    description={product.description}
                                                    price={product.price}
                                                    imageUrl={product.imageUrl}
                                                    stock={product.stock}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )
                        )}

                        {/* Produits sans catégorie */}
                        {uncategorizedProducts.length > 0 && (
                            <div className="mb-8">
                                <h3 className="text-2xl font-semibold mb-4">Other Products</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {uncategorizedProducts.map(product => (
                                        <ProductCard
                                            key={product.id}
                                            name={product.name}
                                            description={product.description}
                                            price={product.price}
                                            imageUrl={product.imageUrl}
                                            stock={product.stock}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>
                )}

                {/* Message si aucun contenu */}
                {services.length === 0 && products.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-xl text-gray-600">No services or products available yet.</p>
                    </div>
                )}
            </div>
        </div>
    )
}