import mongoose from 'mongoose'
import { model, Schema } from 'mongoose'
import { IShippingAddress } from '../types/userTypes'

export interface IUserSchema {
  firstName: string
  lastName: string
  phone: string
  email: string
  password: string
  orders: Schema.Types.ObjectId[]
  shippingAddress?: IShippingAddress
  isAdmin?: boolean
}

const UserSchema = new Schema<IUserSchema>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    phone: {
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
    orders: [{ type: Schema.Types.ObjectId, ref: 'Orders' }],
    shippingAddress: {
      address: { type: String },
      city: { type: String },
      postalCode: { type: String },
      country: { type: String },
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true, toJSON: { virtuals: true } },
)

export const User = mongoose.models.User || model<IUserSchema>('User', UserSchema)
