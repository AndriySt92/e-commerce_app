import express from 'express'
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import {IUserSchema, UserModel} from "../models/User";

export interface IGetUserAuthInfoRequest extends express.Request {
    user: IUserSchema
  }

const protect = asyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.SECRET_KEY as string);
    //@ts-ignore
      req.user = await UserModel.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

const admin = (req: IGetUserAuthInfoRequest, res: express.Response, next: express.NextFunction) => {
  //@ts-ignore
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as an Admin");
  }
};
export { protect, admin };


