import { useState, useRef, useEffect } from 'react'
import { Todo } from '../lib/todos'

interface TodoItemProps {
  todo: Todo
  onUpdate: (id: string, data: { title?: string; completed?: boolean }) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export default function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)
  const [isDeleting, setIsDeleting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleSave = async () => {
    if (editTitle.trim() && editTitle !== todo.title) {
      await onUpdate(todo.id, { title: editTitle.trim() })
    } else {
      setEditTitle(todo.title)
    }
    setIsEditing(false)
  }

  const handleToggle = async () => {
    await onUpdate(todo.id, { completed: !todo.completed })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      setEditTitle(todo.title)
      setIsEditing(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      setIsDeleting(true)
      try {
        await onDelete(todo.id)
      } catch (error) {
        setIsDeleting(false)
      }
    }
  }

  return (
    <div
      className={`group flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow ${
        isDeleting ? 'opacity-50' : ''
      }`}
    >
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggle}
        disabled={isDeleting}
        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 cursor-pointer disabled:cursor-not-allowed"
      />

      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="flex-1 px-2 py-1 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isDeleting}
        />
      ) : (
        <div
          className="flex-1 cursor-pointer"
          onClick={() => setIsEditing(true)}
        >
          <p
            className={`${
              todo.completed
                ? 'line-through text-gray-400'
                : 'text-gray-900'
            }`}
          >
            {todo.title}
          </p>
        </div>
      )}

      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-700 px-3 py-1 text-sm font-medium transition-opacity disabled:cursor-not-allowed"
      >
        Delete
      </button>
    </div>
  )
}
