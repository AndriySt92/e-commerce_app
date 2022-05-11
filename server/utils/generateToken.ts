import jwt, { Secret } from "jsonwebtoken";

export const generateToken = (id: Secret) => {
  return jwt.sign({ id }, process.env.SECRET_KEY as Secret, {
    expiresIn: "30d",
  });
};
