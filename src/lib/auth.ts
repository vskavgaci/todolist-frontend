import { api } from './api'

export interface User {
  id: string
  email: string
  name: string
  createdAt: string
}

export interface Session {
  user: User
  session: {
    id: string
    userId: string
    expiresAt: string
  }
}

export interface AuthResponse {
  user: User
  session: Session
}

export const authApi = {
  async signUp(email: string, password: string): Promise<AuthResponse> {
    return api.post('/api/auth/sign-up/email', {
      email,
      password,
      name: email.split('@')[0], // Use email prefix as default name
    })
  },

  async signIn(email: string, password: string): Promise<AuthResponse> {
    return api.post('/api/auth/sign-in/email', {
      email,
      password,
    })
  },

  async signOut(): Promise<void> {
    return api.post('/api/auth/sign-out')
  },

  async getSession(): Promise<Session | null> {
    try {
      return await api.get('/api/auth/get-session')
    } catch {
      return null
    }
  },
}
