import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { todosApi, Todo } from '../todos'

export function useTodos() {
  const queryClient = useQueryClient()

  const { data: todos = [], isLoading } = useQuery({
    queryKey: ['todos'],
    queryFn: () => todosApi.getAll(),
  })

  const createMutation = useMutation({
    mutationFn: (title: string) => todosApi.create(title),
    onMutate: async (title) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['todos'] })

      // Snapshot previous value
      const previousTodos = queryClient.getQueryData<Todo[]>(['todos'])

      // Optimistically update
      if (previousTodos) {
        const optimisticTodo: Todo = {
          id: `temp-${Date.now()}`,
          title,
          completed: false,
          position:
            previousTodos.length > 0
              ? Math.max(...previousTodos.map((t) => t.position)) + 1
              : 0,
          userId: 'temp',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        queryClient.setQueryData<Todo[]>(['todos'], [
          ...previousTodos,
          optimisticTodo,
        ])
      }

      return { previousTodos }
    },
    onError: (_err, _newTodo, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { title?: string } }) =>
      todosApi.update(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] })

      const previousTodos = queryClient.getQueryData<Todo[]>(['todos'])

      if (previousTodos) {
        queryClient.setQueryData<Todo[]>(
          ['todos'],
          previousTodos.map((todo) =>
            todo.id === id ? { ...todo, ...data } : todo
          )
        )
      }

      return { previousTodos }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => todosApi.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] })

      const previousTodos = queryClient.getQueryData<Todo[]>(['todos'])

      if (previousTodos) {
        queryClient.setQueryData<Todo[]>(
          ['todos'],
          previousTodos.filter((todo) => todo.id !== id)
        )
      }

      return { previousTodos }
    },
    onError: (_err, _id, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })

  const reorderMutation = useMutation({
    mutationFn: ({ id, position }: { id: string; position: number }) =>
      todosApi.reorder(id, position),
    onMutate: async ({ id, position }) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] })

      const previousTodos = queryClient.getQueryData<Todo[]>(['todos'])

      if (previousTodos) {
        queryClient.setQueryData<Todo[]>(
          ['todos'],
          previousTodos.map((todo) =>
            todo.id === id ? { ...todo, position } : todo
          )
        )
      }

      return { previousTodos }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })

  return {
    todos,
    isLoading,
    createTodo: createMutation.mutateAsync,
    updateTodo: updateMutation.mutateAsync,
    deleteTodo: deleteMutation.mutateAsync,
    reorderTodo: reorderMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}
