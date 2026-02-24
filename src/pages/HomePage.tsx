import { useAuth } from '../lib/hooks/useAuth'
import { useTodos } from '../lib/hooks/useTodos'
import AddTodoForm from '../components/AddTodoForm'
import TodoItem from '../components/TodoItem'

export default function HomePage() {
  const { session, signOut } = useAuth()
  const { todos, isLoading, createTodo, updateTodo, deleteTodo, isCreating } =
    useTodos()

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
        <AddTodoForm onAdd={createTodo} isAdding={isCreating} />

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 bg-gray-200 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : todos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No todos yet!</p>
            <p className="text-gray-400 text-sm mt-2">
              Add your first todo above to get started
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onUpdate={async (id, data) => {
                  await updateTodo({ id, data })
                }}
                onDelete={deleteTodo}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
