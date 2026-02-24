import { FormEvent, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../lib/hooks/useAuth'
import FormInput from '../components/FormInput'

export default function LoginPage() {
  const { signIn, isSigningIn, signInError, isAuthenticated } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    try {
      await signIn({ email, password })
    } catch (error) {
      // Error is handled by useAuth hook
      console.error('Login failed:', error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-center text-gray-900">
            Sign in to your account
          </h1>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {signInError && (
            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
              {signInError.message}
            </div>
          )}

          <div className="space-y-4">
            <FormInput
              id="email"
              type="email"
              label="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              autoComplete="email"
              disabled={isSigningIn}
            />

            <FormInput
              id="password"
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              autoComplete="current-password"
              disabled={isSigningIn}
            />
          </div>

          <button
            type="submit"
            disabled={isSigningIn}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {isSigningIn ? 'Signing in...' : 'Sign in'}
          </button>

          <div className="text-center">
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              Don't have an account? Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
