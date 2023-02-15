import express, { Response } from 'express'
import asyncHandler from 'express-async-handler'
import bcrypt from 'bcryptjs'
import { generateToken } from '../utils/generateToken'
import { User } from '../models/UserModel'
import { ILogin, IRegister, IUser } from '../types/userTypes'
import { RequestWithBody } from '../types/commonTypes'

const router = express.Router()

// LOGIN
router.post(
  '/login',
  asyncHandler(async (req: RequestWithBody<ILogin>, res: Response<IUser>) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        token: generateToken(user._id as string),
        shippingAddress: user.shippingAddress,
        orders: user.orders,
        createdAt: user.createdAt,
      })
    } else {
      res.status(401)
      throw new Error('Invalid Email or Password')
    }
  }),
)

// REGISTER
router.post(
  '/',
  asyncHandler(async (req: RequestWithBody<IRegister>, res: Response<IUser>) => {
    const { firstName, lastName, phone, email, password } = req.body

    const userExists = await User.findOne({ email })

    if (userExists) {
      res.status(400)
      throw new Error('User already exists')
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await User.create({
      firstName,
      lastName,
      phone,
      email,
      password: hashedPassword,
    })

    if (user) {
      res.status(201).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        token: generateToken(user._id as string),
        shippingAddress: user.shippingAddress,
        orders: user.orders,
        createdAt: user.createdAt,
      })
    } else {
      res.status(400)
      throw new Error('Invalid User Data')
    }
  }),
)

export default router
