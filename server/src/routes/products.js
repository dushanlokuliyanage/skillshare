import { Router } from 'express'
import { body } from 'express-validator'
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = Router()

router.use(protect)

const productValidation = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('sku').trim().notEmpty().withMessage('SKU is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
  body('minStockLevel').isInt({ min: 0 }).withMessage('Minimum stock level must be non-negative'),
]

router.get('/', getProducts)
router.post('/', productValidation, createProduct)
router.put('/:id', productValidation, updateProduct)
router.delete('/:id', deleteProduct)

export default router
