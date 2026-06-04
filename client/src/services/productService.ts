import api from './api'
import type { Product, ProductFilters } from '../types'

export interface ProductPayload {
  name: string
  description?: string
  sku: string
  category: string
  price: number
  quantity: number
  minStockLevel: number
}

export const productService = {
  getProducts: async (filters?: Partial<ProductFilters>): Promise<{ products: Product[] }> => {
    const params = new URLSearchParams()
    if (filters?.search) params.set('search', filters.search)
    if (filters?.category) params.set('category', filters.category)
    const res = await api.get(`/products?${params.toString()}`)
    return res.data
  },

  createProduct: async (data: ProductPayload): Promise<{ product: Product; message: string }> => {
    const res = await api.post('/products', data)
    return res.data
  },

  updateProduct: async (
    id: string,
    data: Partial<ProductPayload>
  ): Promise<{ product: Product; message: string }> => {
    const res = await api.put(`/products/${id}`, data)
    return res.data
  },

  deleteProduct: async (id: string): Promise<{ message: string }> => {
    const res = await api.delete(`/products/${id}`)
    return res.data
  },
}
