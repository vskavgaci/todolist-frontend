import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useAuth } from '../lib/hooks/useAuth'
import { useTodos } from '../lib/hooks/useTodos'
import AddTodoForm from '../components/AddTodoForm'
import SortableTodoItem from '../components/SortableTodoItem'
import { Todo } from '../lib/todos'

export default function HomePage() {
  const { session, signOut } = useAuth()
  const {
    todos: serverTodos,
    isLoading,
    createTodo,
    updateTodo,
    deleteTodo,
    reorderTodo,
    isCreating,
  } = useTodos()

  const [localTodos, setLocalTodos] = useState<Todo[]>([])

  // Use local state for optimistic drag reordering, fallback to server
  const todos = localTodos.length > 0 ? localTodos : serverTodos

  // Update local state when server state changes
  if (serverTodos !== localTodos && localTodos.length === 0) {
    setLocalTodos(serverTodos)
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required before drag starts
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250, // 250ms touch before drag starts
        tolerance: 5,
      },
    })
  )

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) {
      return
    }

    const oldIndex = todos.findIndex((t) => t.id === active.id)
    const newIndex = todos.findIndex((t) => t.id === over.id)

    if (oldIndex === -1 || newIndex === -1) return

    // Optimistically reorder locally
    const reorderedTodos = arrayMove(todos, oldIndex, newIndex)
    setLocalTodos(reorderedTodos)

    // Calculate new position
    let newPosition: number

    if (newIndex === 0) {
      // Moving to the beginning
      newPosition = reorderedTodos[1]
        ? reorderedTodos[1].position / 2
        : 1024
    } else if (newIndex === reorderedTodos.length - 1) {
      // Moving to the end
      newPosition = reorderedTodos[newIndex - 1].position + 1024
    } else {
      // Moving between two items
      const prevPos = reorderedTodos[newIndex - 1].position
      const nextPos = reorderedTodos[newIndex + 1].position
      newPosition = (prevPos + nextPos) / 2
    }

    try {
      await reorderTodo({
        id: active.id as string,
        position: newPosition,
      })
      // Clear local state to use server data
      setLocalTodos([])
    } catch (error) {
      // Revert on error
      setLocalTodos(serverTodos)
      console.error('Reorder failed:', error)
    }
  }

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
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={todos.map((t) => t.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {todos.map((todo) => (
                  <SortableTodoItem
                    key={todo.id}
                    todo={todo}
                    onUpdate={async (id, data) => {
                      await updateTodo({ id, data })
                    }}
                    onDelete={deleteTodo}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  )
}
