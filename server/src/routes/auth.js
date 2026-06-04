import { Router } from 'express'
import { body } from 'express-validator'
import { register, verifyEmail, login, getMe } from '../controllers/authController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = Router()

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  ],
  register
)

router.get('/verify/:token', verifyEmail)

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  login
)

router.get('/me', protect, getMe)

export default router
