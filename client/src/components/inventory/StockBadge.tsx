import type { StockStatus } from '../../types'

interface Props {
  quantity: number
  minStockLevel: number
}

const getStatus = (quantity: number, minStockLevel: number): StockStatus => {
  if (quantity === 0) return 'critical'
  if (quantity <= minStockLevel) return 'warning'
  return 'ok'
}

const styles: Record<StockStatus, string> = {
  ok: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-100 text-amber-700 border-amber-200',
  critical: 'bg-red-100 text-red-700 border-red-200',
}

const labels: Record<StockStatus, string> = {
  ok: 'In Stock',
  warning: 'Low Stock',
  critical: 'Out of Stock',
}

export const StockBadge = ({ quantity, minStockLevel }: Props) => {
  const status = getStatus(quantity, minStockLevel)
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}
    >
      {labels[status]}
    </span>
  )
}
