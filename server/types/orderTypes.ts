import { Schema } from 'mongoose'
import { IShippingAddress } from './userTypes'

export interface IOrderItem {
    name: string
    qty: number
    image: string
    price: number
    product: Schema.Types.ObjectId,
  }

  export interface ICreateOrder {
    orderItems: IOrderItem[]
    shippingAddress: IShippingAddress
    paymentMethod: string
    totalPrice: string
  }
  
  export interface IOrder {
    _id: Schema.Types.ObjectId
    orderItems: IOrderItem[]
    shippingAddress: IShippingAddress
    paymentMethod: string
    totalPrice: number
    user: Schema.Types.ObjectId
    isPaid: boolean
    isDelivered: boolean
    createdAt?: Date
  }