// import mongoose from 'mongoose'
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
// import bcrypt from 'bcryptjs'

const { Schema } = mongoose

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: false,
      minlength: 6,
    },
    userType: {
      type: String,
      enum: ['startup', 'Service Provider', null],
      default: null,
    },
    name: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
    },
    invoiceType: {
      type: String,
      enum: ['self', 'cumma'],
      default: 'self',
    },
    authProvider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },
    authProviderId: {
      type: String,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    googleProfile: {
      id: String,
      name: String,
      email: String,
      image: String,
    },
    resetOTP: {
      type: String,
      select: false,
    },
    resetOTPExpiry: {
      type: Date,
      select: false,
    },
    resetOTPCreatedAt: {
      type: Date,
      select: false,
    },
    resetToken: {
      type: String,
      select: false, // Security: Don't return this in queries by default
    },
    resetTokenExpiry: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
    collection: 'Users',
  }
)

// 🔐 Pre-save hook to hash password if modified
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next()

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// 🔐 Compare entered password with hashed one
UserSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false
  return await bcrypt.compare(candidatePassword, this.password)
}

// 🔐 OTP validity check
UserSchema.methods.isOTPValid = function (otp) {
  return this.resetOTP === otp && !this.isOTPExpired()
}

// 🔐 OTP expiry check (5 minutes logic)
UserSchema.methods.isOTPExpired = function () {
  if (!this.resetOTPCreatedAt) return true

  const now = new Date()
  const createdAt = new Date(this.resetOTPCreatedAt)
  const diffInMinutes = (now.getTime() - createdAt.getTime()) / (1000 * 60)

  return diffInMinutes > 5
}

// 🧹 MongoDB TTL index (optional)
// UserSchema.index({ resetOTPCreatedAt: 1 }, { expireAfterSeconds: 300 })

// ⛔ Prevent OverwriteModelError during hot reloads
const User = mongoose.models.Users || mongoose.model('Users', UserSchema)

module.exports = User;
