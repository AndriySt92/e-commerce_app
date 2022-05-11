import express from 'express'
import { User } from './models/User'
import { users } from './data/users'
import { ProductModel } from './models/Product'
import { products } from './data/product'
import asyncHandler from 'express-async-handler'

const ImportData = express.Router()

ImportData.post(
  '/user',
  asyncHandler(async (_, res: express.Response) => {
    await User.deleteMany({})
    const importUser = await User.insertMany(users)
    res.send({ importUser })
  }),
)

ImportData.post(
  '/products',
  asyncHandler(async (_, res: express.Response) => {
    await User.deleteMany({})
    const importProducts = await ProductModel.insertMany(products)
    res.send({ importProducts })
  }),
)

export default ImportData;