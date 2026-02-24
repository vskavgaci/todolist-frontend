import { FormEvent, useState } from 'react'

interface AddTodoFormProps {
  onAdd: (title: string) => Promise<unknown>
  isAdding: boolean
}

export default function AddTodoForm({ onAdd, isAdding }: AddTodoFormProps) {
  const [title, setTitle] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!title.trim()) return

    await onAdd(title.trim())
    setTitle('')
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4 sm:mb-6">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          disabled={isAdding}
          className="flex-1 px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 text-base"
        />
        <button
          type="submit"
          disabled={isAdding || !title.trim()}
          className="px-4 sm:px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
        >
          {isAdding ? 'Adding...' : 'Add Todo'}
        </button>
      </div>
    </form>
  )
}
