import { Schema } from 'mongoose'

export interface IProductParams {
  title: string
  desc: string[]
}

export interface IProductFeatures {
  img: string
  title: string
  subtitle: string
  desc: string
}

export interface IBoxContents {
  img: string
  items: string[]
}

export interface IProduct {
  _id: Schema.Types.ObjectId
  product: string
  type: string
  name: string
  title: string
  mainImg: string
  availableColors: string[]
  images: string[]
  sound: IProductParams[]
  design: IProductParams[]
  power: IProductParams[]
  desc: string
  productFeatures: IProductFeatures[]
  boxContents: IBoxContents[]
  reviews: Schema.Types.ObjectId[]
  rating: number
  numReviews: number
  price: number
  isInStock: boolean
  createdAt?: Date
}
