import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useProducts } from '../hooks/useProducts'
import { ProductList } from '../components/inventory/ProductList'
import { ProductForm } from '../components/inventory/ProductForm'
import type { Product } from '../types'
import type { ProductPayload } from '../services/productService'

export const InventoryPage = () => {
  const {
    products,
    isLoading,
    filters,
    setFilters,
    categories,
    addProduct,
    editProduct,
    removeProduct,
  } = useProducts()

  const [showForm, setShowForm] = useState(false)
  const [editTarget, setEditTarget] = useState<Product | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const handleAdd = () => {
    setEditTarget(null)
    setShowForm(true)
  }

  const handleEdit = (product: Product) => {
    setEditTarget(product)
    setShowForm(true)
  }

  const handleSubmit = async (data: ProductPayload) => {
    setIsSaving(true)
    try {
      if (editTarget) {
        await editProduct(editTarget._id, data)
      } else {
        await addProduct(data)
      }
      setShowForm(false)
      setEditTarget(null)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (product: Product) => {
    await removeProduct(product._id)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
          <p className="text-gray-500 mt-1">
            {products.length} product{products.length !== 1 ? 's' : ''} in total
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      <ProductList
        products={products}
        isLoading={isLoading}
        filters={filters}
        categories={categories}
        onFilterChange={(partial) => setFilters((prev) => ({ ...prev, ...partial }))}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {showForm && (
        <ProductForm
          initialValues={editTarget ?? undefined}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false)
            setEditTarget(null)
          }}
          isLoading={isSaving}
        />
      )}
    </div>
  )
}
