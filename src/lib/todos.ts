import { api } from './api'

export interface Todo {
  id: string
  title: string
  completed: boolean
  position: number
  userId: string
  createdAt: string
  updatedAt: string
}

export const todosApi = {
  async getAll(): Promise<Todo[]> {
    return api.get('/api/todos')
  },

  async create(title: string): Promise<Todo> {
    return api.post('/api/todos', { title })
  },

  async update(
    id: string,
    data: { title?: string; completed?: boolean }
  ): Promise<Todo> {
    return api.patch(`/api/todos/${id}`, data)
  },

  async delete(id: string): Promise<void> {
    return api.delete(`/api/todos/${id}`)
  },

  async reorder(id: string, position: number): Promise<Todo> {
    return api.patch(`/api/todos/${id}/reorder`, { position })
  },
}
