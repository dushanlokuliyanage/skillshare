import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { validationResult } from 'express-validator'
import User from '../models/User.js'
import { sendVerificationEmail } from '../services/emailService.js'

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' })

export const register = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.mapped() })
    }

    const { name, email, password } = req.body

    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' })
    }

    const verificationToken = crypto.randomBytes(32).toString('hex')
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000)

    const user = await User.create({
      name,
      email,
      password,
      verificationToken,
      verificationTokenExpiry,
    })

    sendVerificationEmail(email, name, verificationToken).catch((err) =>
      console.error('Failed to send verification email:', err.message)
    )

    res.status(201).json({
      message: 'Registration successful! Please check your email to verify your account.',
    })
  } catch (err) {
    next(err)
  }
}

export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: Date.now() },
    })

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification link' })
    }

    user.isVerified = true
    user.verificationToken = undefined
    user.verificationTokenExpiry = undefined
    await user.save()

    res.status(200).json({ message: 'Email verified successfully. You can now log in.' })
  } catch (err) {
    next(err)
  }
}

export const login = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.mapped() })
    }

    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: 'Please verify your email before logging in' })
    }

    const token = signToken(user._id)

    res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
      },
    })
  } catch (err) {
    next(err)
  }
}

export const getMe = async (req, res) => {
  res.status(200).json({ user: req.user })
}
