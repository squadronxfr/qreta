interface StoreHeaderProps {
    storeName: string
    logoUrl?: string
    address?: string
    phone?: string
}

export default function StoreHeader({storeName, logoUrl, address, phone}: StoreHeaderProps) {
    return (
        <div className="bg-white shadow-sm">
            <div className="container mx-auto px-4 py-6">
                <div className="flex items-center gap-4">
                    {logoUrl && (
                        <img
                            src={logoUrl}
                            alt={storeName}
                            className="w-16 h-16 rounded-full object-cover"
                        />
                    )}
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{storeName}</h1>
                        {address && (
                            <p className="text-sm text-gray-600 mt-1">📍 {address}</p>
                        )}
                        {phone && (
                            <a
                                href={`tel:${phone}`}
                                className="text-sm text-blue-600 mt-1 inline-block"
                            >
                                📞 {phone}
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}