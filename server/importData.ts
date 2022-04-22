import express from 'express'
import { UserModel } from './models/User'
import { users } from './data/users'
import { ProductModel } from './models/Product'
import { products } from './data/product'
import asyncHandler from 'express-async-handler'

const ImportData = express.Router()

ImportData.post(
  '/user',
  asyncHandler(async (_, res: express.Response) => {
    await UserModel.deleteMany({})
    const importUser = await UserModel.insertMany(users)
    res.send({ importUser })
  }),
)

ImportData.post(
  '/products',
  asyncHandler(async (_, res: express.Response) => {
    await UserModel.deleteMany({})
    const importProducts = await ProductModel.insertMany(products)
    res.send({ importProducts })
  }),
)

export default ImportData;