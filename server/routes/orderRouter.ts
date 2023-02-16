import express, { Response } from 'express'
import asyncHandler from 'express-async-handler'
import { verify, admin } from '../Middleware/AuthMiddleware'
import { Order } from '../Models/OrderModel'
import { User } from '../models/UserModel'
import { RequestWithBody, RequestWithParams } from '../types/commonTypes'
import { IOrder, ICreateOrder } from '../types/orderTypes'

const router = express.Router()

// CREATE ORDER
router.post(
  '/',
  verify,
  asyncHandler(
    async (req: RequestWithBody<ICreateOrder>, res: Response<IOrder | { message: string }>) => {
      try {
        const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body
        //@ts-ignore
        const userId = req.user._id

        if (orderItems && orderItems.length === 0) {
          res.status(400)
          throw new Error('No order items')
        }

        const order = new Order({
          orderItems,
          shippingAddress,
          user: userId,
          paymentMethod,
          totalPrice,
        })

        const createOrder = await order.save()
        await User.findByIdAndUpdate(userId, {
          $push: { orders: createOrder._id },
        })

        res.status(201).json(createOrder)
      } catch (error) {
        res.status(500).json({ message: 'Something went wrong' })
      }
    },
  ),
)

// GET ORDER BY ID
router.get(
  '/:id',
  verify,
  asyncHandler(
    async (req: RequestWithParams<{ id: string }>, res: Response<IOrder | { message: string }>) => {
      try {
        const order = await Order.findById(req.params.id)

        if (!order) {
          res.status(404)
          throw new Error('Order Not Found')
        } else {
          res.json(order)
        }
      } catch (error) {
        res.status(500).json({ message: 'Something went wrong' })
      }
    },
  ),
)

// ADMIN GET ALL ORDERS
router.get(
  '/',
  verify,
  admin,
  asyncHandler(async (_, res: Response<IOrder[] | { message: string }>) => {
    try {
      const orders = await Order.find({}).sort({ _id: -1 })
      res.json(orders)
    } catch (error) {
      res.status(500).json({ message: 'Something went wrong' })
    }
  }),
)

// USER LOGIN ORDERS
router.get(
  '/myOrders/:userId',
  verify,
  asyncHandler(
    async (
      req: RequestWithParams<{ userId: string }>,
      res: Response<IOrder[] | { message: string }>,
    ) => {
   
      try {
        const orders = await Order.find({ user: req.params.userId }).sort({ _id: -1 })

        res.json(orders)
      } catch (error) {
        res.status(500).json({ message: 'Something went wrong' })
      }
    },
  ),
)

// ORDER IS PAID
router.put(
  '/:id/pay',
  verify,
  admin,
  asyncHandler(
    async (req: RequestWithParams<{ id: string }>, res: Response<IOrder | { message: string }>) => {
      try {
        const order = await Order.findById(req.params.id)

        if (order) {
          order.isPaid = true

          const updatedOrder = await order.save()
          res.json(updatedOrder)
        } else {
          res.status(404)
          throw new Error('Order Not Found')
        }
      } catch (error) {
        res.status(500).json({ message: 'Something went wrong' })
      }
    },
  ),
)

// ORDER IS DELIVERED
router.put(
  '/:id/delivered',
  verify,
  admin,
  asyncHandler(
    async (req: RequestWithParams<{ id: string }>, res: Response<IOrder | { message: string }>) => {
      try {
        const order = await Order.findById(req.params.id)

        if (order) {
          order.isDelivered = true

          const updatedOrder = await order.save()
          res.json(updatedOrder)
        } else {
          res.status(404)
          throw new Error('Order Not Found')
        }
      } catch (error) {
        res.status(500).json({ message: 'Something went wrong' })
      }
    },
  ),
)

export default router
