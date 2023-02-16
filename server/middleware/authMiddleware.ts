import express, {Request, Response, NextFunction} from 'express'
import jwt, { Secret } from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import {User} from "../models/UserModel";

interface JwtPayload {
  id: string
}

const verify = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET as Secret) as JwtPayload;
        //@ts-ignore
      req.user = await User.findById(decoded.id).select("-password") ;
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

const admin = (req: Request, res: Response, next: NextFunction) => {

  //@ts-ignore
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as an Admin");
  }
};
export { verify, admin };
