import { Link } from 'react-router-dom'

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <h1 className="text-3xl font-bold text-center">Register</h1>
        <p className="text-center text-gray-600">
          Registration form will be implemented in F2
        </p>
        <div className="text-center">
          <Link to="/login" className="text-blue-600 hover:underline">
            Already have an account? Login
          </Link>
        </div>
      </div>
    </div>
  )
}
