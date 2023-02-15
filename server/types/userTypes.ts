import { Schema } from 'mongoose'
import { JwtPayload } from 'jsonwebtoken';

// Auth types
export interface ILogin {
    email: string
    password: string
}

export interface IRegister extends ILogin {
    firstName: string,
    lastName: string,
    phone: string,
}

// User types
export interface IShippingAddress {
    address: string
    city: string
    postalCode: string
    country: string
  }

export interface IUser {
    _id: string
    email: string
    firstName: string,
    lastName: string,
    phone: string,
    shippingAddress?: IShippingAddress
    orders?: Schema.Types.ObjectId[]
    token: JwtPayload | string
    createdAt: Date 
}