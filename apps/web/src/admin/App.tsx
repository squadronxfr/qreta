import { Routes, Route, Navigate } from 'react-router-dom'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { auth } from '@/config/firebase'
import { useState, useEffect } from 'react'
import Login from './auth/Login'
import Dashboard from './pages/Dashboard'

export default function AdminApp() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/admin/dashboard" /> : <Login />}
      />
      <Route
        path="/dashboard"
        element={user ? <Dashboard /> : <Navigate to="/admin/login" />}
      />
      <Route
        path="/"
        element={<Navigate to="/admin/login" />}
      />
    </Routes>
  )
}
