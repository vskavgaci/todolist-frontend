import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../auth'

export function useAuth() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { data: session, isLoading } = useQuery({
    queryKey: ['session'],
    queryFn: () => authApi.getSession(),
    retry: false,
  })

  const signInMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.signIn(email, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] })
      navigate('/')
    },
  })

  const signUpMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.signUp(email, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] })
      navigate('/')
    },
  })

  const signOutMutation = useMutation({
    mutationFn: () => authApi.signOut(),
    onSuccess: () => {
      queryClient.setQueryData(['session'], null)
      navigate('/login')
    },
  })

  return {
    session,
    isLoading,
    isAuthenticated: !!session,
    signIn: signInMutation.mutateAsync,
    signUp: signUpMutation.mutateAsync,
    signOut: signOutMutation.mutateAsync,
    isSigningIn: signInMutation.isPending,
    isSigningUp: signUpMutation.isPending,
    signInError: signInMutation.error as Error | null,
    signUpError: signUpMutation.error as Error | null,
  }
}
