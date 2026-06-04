import { useEffect, useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import type { Product } from '../../types'
import type { ProductPayload } from '../../services/productService'

interface Props {
  initialValues?: Product
  onSubmit: (data: ProductPayload) => Promise<void>
  onCancel: () => void
  isLoading: boolean
}

const empty: ProductPayload = {
  name: '',
  description: '',
  sku: '',
  category: '',
  price: 0,
  quantity: 0,
  minStockLevel: 10,
}

export const ProductForm = ({ initialValues, onSubmit, onCancel, isLoading }: Props) => {
  const [form, setForm] = useState<ProductPayload>(empty)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initialValues) {
      setForm({
        name: initialValues.name,
        description: initialValues.description,
        sku: initialValues.sku,
        category: initialValues.category,
        price: initialValues.price,
        quantity: initialValues.quantity,
        minStockLevel: initialValues.minStockLevel,
      })
    }
  }, [initialValues])

  const set = (field: keyof ProductPayload, value: string | number) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await onSubmit(form)
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
            'Something went wrong'
      setError(msg)
    }
  }

  const inputCls =
    'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition'

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {initialValues ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                className={inputCls}
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="e.g. Wireless Keyboard"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SKU <span className="text-red-500">*</span>
              </label>
              <input
                className={inputCls}
                value={form.sku}
                onChange={(e) => set('sku', e.target.value.toUpperCase())}
                placeholder="e.g. WK-001"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <input
                className={inputCls}
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
                placeholder="e.g. Electronics"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price ($) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                className={inputCls}
                value={form.price}
                onChange={(e) => set('price', parseFloat(e.target.value) || 0)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="1"
                className={inputCls}
                value={form.quantity}
                onChange={(e) => set('quantity', parseInt(e.target.value) || 0)}
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Stock Level <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="1"
                className={inputCls}
                value={form.minStockLevel}
                onChange={(e) => set('minStockLevel', parseInt(e.target.value) || 0)}
                required
              />
              <p className="text-xs text-gray-400 mt-1">
                You'll get an email alert when stock reaches this level
              </p>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                className={`${inputCls} resize-none`}
                rows={3}
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                placeholder="Optional product description..."
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {initialValues ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
