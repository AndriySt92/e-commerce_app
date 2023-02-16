import { model, Schema, Document } from 'mongoose'
import { IOrderItem } from '../types/orderTypes'
import { IShippingAddress } from '../types/userTypes'

interface IOrderSchema extends Document {
  user: Schema.Types.ObjectId,
  orderItems: IOrderItem[]
  shippingAddress: IShippingAddress
  paymentMethod: string
  totalPrice: number
  isPaid: boolean
  isDelivered: boolean
}

const orderSchema = new Schema<IOrderSchema>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: {
          type: Schema.Types.ObjectId,
          required: true,

        },
      },
    ],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
      default: "Paypal",
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Order = model<IOrderSchema>('Order', orderSchema)