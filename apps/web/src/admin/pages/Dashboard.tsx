import { auth, db } from '@/config/firebase'
import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'

export default function Dashboard() {
  const navigate = useNavigate()
  const [userRole, setUserRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserRole = async () => {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid))
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role)
        }
      }
      setLoading(false)
    }

    fetchUserRole()
  }, [])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      navigate('/admin/login')
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="navbar bg-base-100 shadow-lg">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">Qreta Dashboard</a>
        </div>
        <div className="flex-none gap-2">
          <div className="badge badge-primary">{userRole}</div>
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
                {auth.currentUser?.email?.[0].toUpperCase()}
              </div>
            </label>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
              <li><a onClick={handleLogout}>Déconnexion</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-8">
        <div className="stats shadow w-full">
          <div className="stat">
            <div className="stat-title">Connecté en tant que</div>
            <div className="stat-value text-2xl">{auth.currentUser?.email}</div>
            <div className="stat-desc">Role: {userRole}</div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Bienvenue sur Qreta 🎉</h2>
          <p className="text-lg">
            Prochaine étape : Intégration FireCMS pour gérer les commerçants, services et produits.
          </p>
        </div>
      </div>
    </div>
  )
}