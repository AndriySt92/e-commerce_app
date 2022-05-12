import { model, Schema, Types, Document } from 'mongoose'


export interface IReviewSchema extends Document {
    name: string
    rating: number
    comment: string
    user: Types.ObjectId;
  }

export interface IProductSchema {
    name: string
    image?: string
    description: string
    reviews?: IReviewSchema
    rating: number
    numReviews: number
    price: number
    countInStock: Number
  }
  
const ReviewSchema = new Schema<IReviewSchema>(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true, toJSON: { virtuals: true } },
);

const ProductSchema = new Schema<IProductSchema>(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    reviews: [ReviewSchema],
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true, toJSON: { virtuals: true } },
);

export const Product = model<IProductSchema>("Product", ProductSchema);

 