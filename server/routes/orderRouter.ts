import express from 'express'
import asyncHandler from 'express-async-handler'
import { protect, admin } from '../Middleware/AuthMiddleware'
import { Order } from '../Models/Order'
const router = express.Router()

// CREATE ORDER
router.post(
  '/',
  protect,
  asyncHandler(async (req: express.Request, res: express.Response) => {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body
    //@ts-ignore
    const userId = req.user._id

    if (orderItems && orderItems.lenght === 0) {
      res.status(400)
      throw new Error('No order items')
      return
    }

    const order = new Order({
      orderItems,
      shippingAddress,
      user: userId,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    })

    const createOrder = order.save()

    res.status(201).json(createOrder)
  }),
)

// GET ORDER BY ID
router.get(
  '/:id',
  protect,
  asyncHandler(async (req: express.Request, res: express.Response) => {
    const order = Order.findById(req.params.id).populate('user', 'name email')

    if (!order) {
      res.status(404)
      throw new Error('Order Not Found')
    } else {
      res.json(order)
    }
  }),
)

// ADMIN GET ALL ORDERS
router.get(
  "/all",
  protect,
  admin,
  asyncHandler(async (_, res: express.Response) => {
    const orders = await Order.find({})
      .sort({ _id: -1 })
      .populate("user", "id name email");
    res.json(orders);
  })
);

// USER LOGIN ORDERS
router.get(
  "/",
  protect,
  asyncHandler(async (req: express.Request, res: express.Response) => {
    //@ts-ignore
    const order = await Order.find({ user: req.user._id }).sort({ _id: -1 });
    res.json(order);
  })
);

// ORDER IS PAID
router.put(
  "/:id/pay",
  protect,
  asyncHandler(async (req: express.Request, res: express.Response) => {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error("Order Not Found");
    }
  })
);

// ORDER IS PAID
router.put(
  "/:id/delivered",
  protect,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error("Order Not Found");
    }
  })
);

export default router
