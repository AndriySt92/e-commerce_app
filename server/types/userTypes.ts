import { Schema } from 'mongoose'
import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';

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
    isAdmin?: Boolean
    token: JwtPayload | string
    createdAt: Date 
}

export interface IGetUserAuthInfoRequest extends Request {
    user: IUser
  }