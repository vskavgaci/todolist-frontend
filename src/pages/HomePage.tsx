import { useAuth } from '../lib/hooks/useAuth'

export default function HomePage() {
  const { session, signOut } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Todo List</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {session?.user.email}
            </span>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-gray-600">
          Todo list functionality will be implemented in F3
        </p>
      </div>
    </div>
  )
}
