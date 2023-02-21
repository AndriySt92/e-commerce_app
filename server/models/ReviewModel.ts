import { model, Schema, Types, Document } from 'mongoose'

export interface IReviewSchema extends Document {
    username: string
    rating: number
    comment: string
    user: Types.ObjectId
  }

const ReviewSchema = new Schema<IReviewSchema>(
    {
      username: { type: String, required: true },
      rating: { type: Number, required: true },
      comment: { type: String, required: true },
      user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User',
      },
    },
    { timestamps: true, toJSON: { virtuals: true } },
  )

  export const Review = model<IReviewSchema>('Review', ReviewSchema)
