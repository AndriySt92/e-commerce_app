import { model, Schema, Document} from 'mongoose'
import { IBoxContents, IProductFeatures, IProductParams } from '../types/productTypes'

interface IProductSchema extends Document {
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
}

const ProductSchema = new Schema<IProductSchema>(
  {
    product: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    mainImg: {
      type: String,
      require: true,
    },
    images: [String],
    availableColors: [String],
    desc: {
      type: String,
      required: true,
    },
    reviews: [{ type: Schema.Types.ObjectId, ref: 'review' }],
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
    },
    isInStock: {
      type: Boolean,
      default: true,
    },
    productFeatures: [
      {
        img: {
          type: String,
          require: true,
        },
        title: {
          type: String,
          require: true,
        },
        subtitle: {
          type: String,
          require: true,
        },
        desc: {
          type: String,
          require: true,
        },
      },
    ],
    sound: [
      {
        title: {
          type: String,
          require: true,
        },
        desc: [String],
      },
    ],
    design: [
      {
        title: {
          type: String,
          require: true,
        },
        desc: [String],
      },
    ],
    power: [
      {
        title: {
          type: String,
          require: true,
        },
        desc: [String],
      },
    ],
    boxContents: {
      img: {
        type: String,
        require: true,
      },
      items: [String],
    },
  },
  { timestamps: true, toJSON: { virtuals: true } },
)

export const Product = model<IProductSchema>('Product', ProductSchema)
