interface ProductCardProps {
    name: string
    description?: string
    price: number
    imageUrl?: string
    stock: number
}

export default function ProductCard({name, description, price, imageUrl, stock}: ProductCardProps) {
    return (
        <div className="card bg-base-100 shadow-md">
            {imageUrl && (
                <figure>
                    <img
                        src={imageUrl}
                        alt={name}
                        className="w-full h-48 object-cover"
                    />
                </figure>
            )}
            <div className="card-body">
                <h3 className="card-title text-lg">{name}</h3>
                {description && (
                    <p className="text-sm text-gray-600">{description}</p>
                )}
                <div className="flex justify-between items-center mt-2">
                    <span className="text-xl font-bold text-primary">{price}€</span>
                    <span className={`badge ${stock > 0 ? 'badge-success' : 'badge-error'}`}>
            {stock > 0 ? `Stock: ${stock}` : 'Rupture'}
          </span>
                </div>
            </div>
        </div>
    )
}