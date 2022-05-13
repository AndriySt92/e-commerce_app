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

    const createOrder =await order.save()

    res.status(201).json(createOrder)
  }),
)

// GET ORDER BY ID
router.get(
  '/:id',
  protect,
  asyncHandler(async (req: express.Request, res: express.Response) => {
    const order = await Order.findById(req.params.id) 
    
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
  "/",
  protect,
  admin,
  asyncHandler(async (_, res: express.Response) => {
    const orders = await Order.find({}).sort({ _id: -1 });
    res.json(orders);
  })
);

// USER LOGIN ORDERS
router.get(
  "/myOrders/:userId",
  protect,
  asyncHandler(async (req: express.Request, res: express.Response) => {
    const orders = await Order.find({"user": req.params.userId}).sort({ _id: -1 })
    .populate("user", "id name email");
    res.json(orders)
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
