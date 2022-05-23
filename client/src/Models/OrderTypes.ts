import { IUser } from "./UserTypes"

export interface IOrderItems {
  _id?: string
  name: string
  qty: number
  image: string
  price: number
  product: string
}

export interface IShippingAddress {
  address: string
  city: string
  postalCode: string
  country: string
}

export interface IPaymentResult {
  id: string
  status: string
  update_time: string
  email_address: string
}

export interface IOrderRequestData {
    orderItems: Array<IOrderItems>
    shippingAddress: IShippingAddress
    itemsPrice: number
    totalPrice: number
    taxPrice: number
    shippingPrice: number  
}

export interface IOrder extends IOrderRequestData{
    _id: string
    user: IUser
    isPaid: boolean
    paidAt: number
    isDelivered: boolean
    deliveredAt: number
  }
