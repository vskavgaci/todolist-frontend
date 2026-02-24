import { Link } from 'react-router-dom'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <h1 className="text-3xl font-bold text-center">Login</h1>
        <p className="text-center text-gray-600">
          Login form will be implemented in F2
        </p>
        <div className="text-center">
          <Link to="/register" className="text-blue-600 hover:underline">
            Don't have an account? Register
          </Link>
        </div>
      </div>
    </div>
  )
}
