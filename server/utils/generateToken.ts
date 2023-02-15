import jwt, { Secret } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


export const generateToken = (id: Secret) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as Secret, {
    expiresIn: "30d",
  });
};
