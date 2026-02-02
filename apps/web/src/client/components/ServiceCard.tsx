interface ServiceCardProps {
    name: string
    description?: string
    price: number
    duration?: number
    imageUrl?: string
}

export default function ServiceCard({name, description, price, duration, imageUrl}: ServiceCardProps) {
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
                    {duration && (
                        <span className="text-sm text-gray-500">⏱️ {duration} min</span>
                    )}
                </div>
            </div>
        </div>
    )
}