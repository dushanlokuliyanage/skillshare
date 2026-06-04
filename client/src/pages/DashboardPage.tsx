import { Link } from 'react-router-dom'
import { Package, AlertTriangle, DollarSign, TrendingUp, ArrowRight } from 'lucide-react'
import { useProducts } from '../hooks/useProducts'
import { StockBadge } from '../components/inventory/StockBadge'
import { useAuth } from '../context/AuthContext'

export const DashboardPage = () => {
  const { user } = useAuth()
  const { products, stats, isLoading } = useProducts()

  const lowStockProducts = products.filter((p) => p.quantity <= p.minStockLevel)

  const statCards = [
    {
      label: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-indigo-500',
      bg: 'bg-indigo-50',
      text: 'text-indigo-700',
    },
    {
      label: 'Low Stock Items',
      value: stats.lowStockCount,
      icon: AlertTriangle,
      color: 'bg-amber-500',
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      highlight: stats.lowStockCount > 0,
    },
    {
      label: 'Total Inventory Value',
      value: `$${stats.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: 'bg-emerald-500',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name?.split(' ')[0]}!
        </h1>
        <p className="text-gray-500 mt-1">Here's an overview of your inventory</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={`bg-white rounded-xl border shadow-sm p-6 ${
              card.highlight ? 'border-amber-300 ring-1 ring-amber-200' : 'border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-500">{card.label}</span>
              <div className={`${card.bg} p-2 rounded-lg`}>
                <card.icon className={`w-5 h-5 ${card.text}`} />
              </div>
            </div>
            {isLoading ? (
              <div className="h-8 w-24 bg-gray-100 rounded animate-pulse" />
            ) : (
              <p className="text-3xl font-bold text-gray-900">{card.value}</p>
            )}
            {card.highlight && (
              <p className="text-xs text-amber-600 mt-1 font-medium">Needs attention</p>
            )}
          </div>
        ))}
      </div>

      {/* Low stock section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-gray-400" />
            <h2 className="font-semibold text-gray-900">Low Stock Alerts</h2>
            {lowStockProducts.length > 0 && (
              <span className="ml-1 bg-amber-100 text-amber-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                {lowStockProducts.length}
              </span>
            )}
          </div>
          <Link
            to="/inventory"
            className="flex items-center gap-1 text-sm text-indigo-600 font-medium hover:underline"
          >
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : lowStockProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <Package className="w-10 h-10 mb-3 opacity-40" />
            <p className="text-sm font-medium">All products are well-stocked</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {lowStockProducts.map((product) => (
              <div
                key={product._id}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Package className="w-4 h-4 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-400">
                      {product.sku} · {product.category}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{product.quantity} units</p>
                    <p className="text-xs text-gray-400">min: {product.minStockLevel}</p>
                  </div>
                  <StockBadge quantity={product.quantity} minStockLevel={product.minStockLevel} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
