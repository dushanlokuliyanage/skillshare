import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Loader2, CheckCircle, XCircle, Package } from 'lucide-react'
import { authService } from '../services/authService'

type Status = 'loading' | 'success' | 'error'

export const VerifyEmailPage = () => {
  const { token } = useParams<{ token: string }>()
  const [status, setStatus] = useState<Status>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('Invalid verification link')
      return
    }

    authService
      .verifyEmail(token)
      .then(({ message }) => {
        setMessage(message)
        setStatus('success')
      })
      .catch((err) => {
        const msg =
          err?.response?.data?.message || 'Verification failed. The link may have expired.'
        setMessage(msg)
        setStatus('error')
      })
  }, [token])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-600 rounded-2xl mb-4 shadow-lg">
            <Package className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Express</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-gray-900">Verifying your email...</h2>
              <p className="text-sm text-gray-500 mt-2">Please wait a moment</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-7 h-7 text-emerald-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Email Verified!</h2>
              <p className="text-sm text-gray-500 mb-6">{message}</p>
              <Link
                to="/login"
                className="inline-block px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
              >
                Sign In Now
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-7 h-7 text-red-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Verification Failed</h2>
              <p className="text-sm text-gray-500 mb-6">{message}</p>
              <Link
                to="/register"
                className="inline-block px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
              >
                Register Again
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
