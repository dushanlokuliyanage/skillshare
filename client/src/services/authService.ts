import api from './api'
import type { AuthResponse, User } from '../types'

export const authService = {
  register: async (name: string, email: string, password: string): Promise<{ message: string }> => {
    const res = await api.post('/auth/register', { name, email, password })
    return res.data
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const res = await api.post('/auth/login', { email, password })
    return res.data
  },

  verifyEmail: async (token: string): Promise<{ message: string }> => {
    const res = await api.get(`/auth/verify/${token}`)
    return res.data
  },

  getMe: async (): Promise<{ user: User }> => {
    const res = await api.get('/auth/me')
    return res.data
  },
}
