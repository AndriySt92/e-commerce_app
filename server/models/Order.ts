import { model, Schema, Types, Document } from 'mongoose'

interface IOrderItems {
  name: string
  qty: number
  image: string
  price: number
  product: Types.ObjectId
}

interface IShippingAddress {
  address: string
  city: string
  postalCode: string
  country: string
}

interface IPaymentResult {
  id: string
  status: string
  update_time: string
  email_address: string
}

interface IOrderSchema extends Document {
  user: Types.ObjectId
  orderItems: Array<IOrderItems>
  shippingAddress: IShippingAddress
  paymentMethod: string
  paymentResult: IPaymentResult
  taxPrice: number
  shippingPrice: number
  totalPrice: number
  isPaid: boolean
  paidAt: number
  isDelivered: boolean
  deliveredAt: number
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
          ref: "Product",
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
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
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
    paidAt: {
      type: Number,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

export const Order = model<IOrderSchema>('Order', orderSchema)


