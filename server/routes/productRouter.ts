import express from "express";
import asyncHandler from "express-async-handler";
import {IReviewSchema, Product} from "../models/Product";
import { admin, protect } from "./../Middleware/AuthMiddleware";

const router = express.Router();

// GET ALL PRODUCT
router.get(
  "/",
  asyncHandler(async (req: express.Request, res: express.Response) => {
    const pageSize = 12;
    const page = Number(req.query.pageNumber) || 1;
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : {};
    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ _id: -1 });
    res.json({ products, page, pages: Math.ceil(count / pageSize) });
  })
);

// ADMIN GET ALL PRODUCT WITHOUT SEARCH AND PAGINATION
router.get(
  "/all",
  protect,
  admin,
  asyncHandler(async (_, res: express.Response) => {
    const products = await Product.find({}).sort({ _id: -1 });
    res.json(products);
  })
);

// GET BY ID
router.get(
  "/:id",
  asyncHandler(async (req: express.Request, res: express.Response) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error("Product not Found");
    }
  })
);

// PRODUCT REVIEW
router.post(
  "/:id/review",
  protect,
  asyncHandler(async (req: express.Request, res: express.Response) => {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      //@ts-ignore
      const alreadyReviewed = product?.reviews?.find(
        //@ts-ignore
        (r: Array<IReviewSchema>) => r.user.toString() === req.user._id.toString()
      );
      if (alreadyReviewed) {
        res.status(400);
        throw new Error("Product already Reviewed");
      }
      const review = {
        //@ts-ignore
        name: req.user.name,
        rating: Number(rating),
        comment,
          //@ts-ignore
        user: req.user._id,
      };
      //@ts-ignore
      product.reviews.push(review);
      //@ts-ignore
      product.numReviews = product.reviews.length;
      product.rating =
      //@ts-ignore
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        //@ts-ignore
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: "Reviewed Added" });
    } else {
      res.status(404);
      throw new Error("Product not Found");
    }
  })
);

// DELETE PRODUCT
router.delete(
  "/:id",
  protect,
  admin,
  asyncHandler(async (req: express.Request, res: express.Response) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.remove();
      res.json({ message: "Product deleted" });
    } else {
      res.status(404);
      throw new Error("Product not Found");
    }
  })
);

// CREATE PRODUCT
router.post(
  "/",
  protect,
  admin,
  asyncHandler(async (req: express.Request, res: express.Response) => {
    const { name, price, description, image, countInStock } = req.body;
    const productExist = await Product.findOne({ name });
    if (productExist) {
      res.status(400);
      throw new Error("Product name already exist");
    } else {
      const product = new Product({
        name,
        price,
        description,
        image,
        countInStock,
          //@ts-ignore
        user: req.user._id,
      });
      if (product) {
        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
      } else {
        res.status(400);
        throw new Error("Invalid product data");
      }
    }
  })
);

// UPDATE PRODUCT
router.put(
  "/:id",
  protect,
  admin,
  asyncHandler(async (req: express.Request, res: express.Response) => {
    const { name, price, description, image, countInStock } = req.body;
    const product = await Product.findById(req.params.id);
    if (product) {
      product.name = name || product.name;
      product.price = price || product.price;
      product.description = description || product.description;
      product.image = image || product.image;
      product.countInStock = countInStock || product.countInStock;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  })
);
export default router;