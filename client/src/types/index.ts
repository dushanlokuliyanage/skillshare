export interface User {
  _id: string
  name: string
  email: string
  isVerified: boolean
  createdAt: string
}

export interface Product {
  _id: string
  name: string
  description: string
  sku: string
  category: string
  price: number
  quantity: number
  minStockLevel: number
  createdBy: string
  createdAt: string
  updatedAt: string
}

export type StockStatus = 'ok' | 'warning' | 'critical'

export interface DashboardStats {
  totalProducts: number
  lowStockCount: number
  totalValue: number
}

export interface ProductFilters {
  search: string
  category: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface ApiError {
  message: string
  errors?: Record<string, { msg: string }>
}
