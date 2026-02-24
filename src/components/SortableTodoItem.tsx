import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Todo } from '../lib/todos'
import TodoItem from './TodoItem'

interface SortableTodoItemProps {
  todo: Todo
  onUpdate: (id: string, data: { title?: string; completed?: boolean }) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export default function SortableTodoItem({
  todo,
  onUpdate,
  onDelete,
}: SortableTodoItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style}>
      <div className="relative">
        <div
          {...attributes}
          {...listeners}
          className="absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8h16M4 16h16"
            />
          </svg>
        </div>
        <div className="pl-8">
          <TodoItem todo={todo} onUpdate={onUpdate} onDelete={onDelete} />
        </div>
      </div>
    </div>
  )
}
