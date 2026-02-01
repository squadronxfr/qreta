import { useParams } from 'react-router-dom'

export default function ClientApp() {
  const { merchantId } = useParams()

  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-4">Catalogue</h1>
        <p className="text-lg">Commerçant ID: {merchantId}</p>
        <p className="mt-4">Catalogue à venir...</p>
      </div>
    </div>
  )
}