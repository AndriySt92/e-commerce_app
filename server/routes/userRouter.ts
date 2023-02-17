import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import bcrypt from 'bcryptjs'
import { generateToken } from '../utils/generateToken'
import { User } from '../models/UserModel'
import { ILogin, IRegister, IUser } from '../types/userTypes'
import { RequestWithBody, RequestWithParams } from '../types/commonTypes'
import { admin, verify } from '../middleware/authMiddleware'

const router = express.Router()

// LOGIN
router.post(
  '/login',
  asyncHandler(async (req: RequestWithBody<ILogin>, res: Response<IUser | { message: string }>) => {
    try {
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
        res.status(401).json({message: 'Invalid Email or Password'})
      }
    } catch (error) {
      res.status(500).json({ message: 'Something went wrong' })
    }
  }),
)

// REGISTER
router.post(
  '/',
  asyncHandler(
    async (req: RequestWithBody<IRegister>, res: Response<IUser | { message: string }>) => {
      try {
        const { firstName, lastName, phone, email, password } = req.body

        const userExists = await User.findOne({ email })

        if (userExists) {
          res.status(400).json({message: 'User already exists'})
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
          res.status(400).json({message:'Invalid User Data'})
        }
      } catch (error) {
        res.status(500).json({ message: 'Something went wrong' })
      }
    },
  ),
)

// UPDATE PROFILE
router.put(
  '/profile',
  verify,
  asyncHandler(async (req: Request, res: Response<IUser | { message: string }>) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        //@ts-ignore
        req.user._id,
        {
          $set: req.body,
        },
        { new: true },
      ).select('-password -isAdmin -updatedAt')
      res.status(200).json(updatedUser)
    } catch (err) {
      res.status(500).json({ message: 'Something went wrong' })
    }
  }),
)

// PROFILE
router.get(
  '/profile/:id',
  verify,
  admin,
  async (req: RequestWithParams<{ id: string }>, res: Response<IUser | { message: string }>) => {
    try {
      const user = await User.findById(req.params.id).select('-password -isAdmin -updatedAt')

      if (user) {
        res.json(user)
      } else {
        res.status(404).json({ message: 'User not found' })
      }
    } catch (error) {
      res.status(500).json({ message: 'Something went wrong' })
    }
  },
)

// GET ALL USER ADMIN
router.get('/', verify, admin, async (_: any, res: Response<IUser[] | { message: string }>) => {
  try {
    const users = await User.find({}).select('-password -isAdmin -updatedAt')
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
})

export default router
