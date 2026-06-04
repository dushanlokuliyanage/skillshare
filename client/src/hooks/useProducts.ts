import { useCallback, useEffect, useMemo, useState } from 'react'
import type { DashboardStats, Product, ProductFilters } from '../types'
import { productService, type ProductPayload } from '../services/productService'

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<ProductFilters>({ search: '', category: '' })

  const fetchProducts = useCallback(async (activeFilters?: Partial<ProductFilters>) => {
    setIsLoading(true)
    setError(null)
    try {
      const { products } = await productService.getProducts(activeFilters)
      setProducts(products)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load products'
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts(filters)
  }, [filters, fetchProducts])

  const addProduct = async (data: ProductPayload) => {
    const { product } = await productService.createProduct(data)
    setProducts((prev) => [product, ...prev])
    return product
  }

  const editProduct = async (id: string, data: Partial<ProductPayload>) => {
    const { product } = await productService.updateProduct(id, data)
    setProducts((prev) => prev.map((p) => (p._id === id ? product : p)))
    return product
  }

  const removeProduct = async (id: string) => {
    await productService.deleteProduct(id)
    setProducts((prev) => prev.filter((p) => p._id !== id))
  }

  const stats: DashboardStats = useMemo(
    () => ({
      totalProducts: products.length,
      lowStockCount: products.filter((p) => p.quantity <= p.minStockLevel).length,
      totalValue: products.reduce((sum, p) => sum + p.price * p.quantity, 0),
    }),
    [products]
  )

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category))].sort(),
    [products]
  )

  return {
    products,
    isLoading,
    error,
    filters,
    setFilters,
    fetchProducts,
    addProduct,
    editProduct,
    removeProduct,
    stats,
    categories,
  }
}
