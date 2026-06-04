import { Navigate } from 'react-router-dom'
import { Package } from 'lucide-react'
import { RegisterForm } from '../components/auth/RegisterForm'
import { useAuth } from '../context/AuthContext'

export const RegisterPage = () => {
  const { isAuthenticated, isLoading } = useAuth()

  if (!isLoading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-600 rounded-2xl mb-4 shadow-lg">
            <Package className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Express</h1>
          <p className="text-gray-500 mt-1 text-sm">Create your store account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Create an account</h2>
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}
