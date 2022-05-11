import mongoose from 'mongoose'
import { model,  Schema } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUserSchema {
  _id?: string
  name: string
  email: string
  password: string
  isAdmin?: boolean
  createdAt?: Date
}

const UserSchema = new Schema<IUserSchema>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true, toJSON: { virtuals: true } },
)

// Login
UserSchema.methods.matchPassword = async function (enterPassword: string) {
  return await bcrypt.compare(enterPassword, this.password)
}

// Register
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

export const User = mongoose.models.User || model<IUserSchema>("User", UserSchema);


