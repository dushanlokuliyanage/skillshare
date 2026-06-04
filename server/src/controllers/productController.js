import { validationResult } from 'express-validator'
import Product from '../models/Product.js'
import { sendLowStockAlert } from '../services/emailService.js'

const triggerLowStockAlert = (product) => {
  if (product.quantity <= product.minStockLevel) {
    sendLowStockAlert(product).catch((err) =>
      console.error('Failed to send low-stock alert:', err.message)
    )
  }
}

export const getProducts = async (req, res, next) => {
  try {
    const { search, category } = req.query
    const filter = { createdBy: req.user._id }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ]
    }

    if (category) {
      filter.category = { $regex: `^${category}$`, $options: 'i' }
    }

    const products = await Product.find(filter).sort({ createdAt: -1 })
    res.status(200).json({ products })
  } catch (err) {
    next(err)
  }
}

export const createProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.mapped() })
    }

    const { name, description, sku, category, price, quantity, minStockLevel } = req.body

    const product = await Product.create({
      name,
      description,
      sku,
      category,
      price,
      quantity,
      minStockLevel,
      createdBy: req.user._id,
    })

    triggerLowStockAlert(product)

    res.status(201).json({ product, message: 'Product created successfully' })
  } catch (err) {
    next(err)
  }
}

export const updateProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.mapped() })
    }

    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      { $set: req.body },
      { new: true, runValidators: true }
    )

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    triggerLowStockAlert(product)

    res.status(200).json({ product, message: 'Product updated successfully' })
  } catch (err) {
    next(err)
  }
}

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    })

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    res.status(200).json({ message: 'Product deleted successfully' })
  } catch (err) {
    next(err)
  }
}
