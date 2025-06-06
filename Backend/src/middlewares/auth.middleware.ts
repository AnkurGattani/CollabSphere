import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import jwt from "jsonwebtoken";
import {prisma } from "../db/index";
import { Request } from "express";

declare module "express-serve-static-core" {
  interface Request {
    user?: any;
  }
}

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }
    if (!process.env.ACCESS_TOKEN_SECRET) {
      throw new ApiError(500, "Internal server error");
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) as jwt.JwtPayload;
    //The verify method is used to validate a JWT. It takes two arguments: the token to be verified and the secret key that was used to sign the token.

    //The verify method will decode the token, check if it's valid (i.e., it was signed with the provided secret key and it hasn't expired), and return the payload of the token if it's valid. The payload is the data that was stored in the token when it was created.


    const user =await prisma.user.findUnique({
        where: {
            id: decodedToken.id,
        },
        });
    

    if (!user) {
      throw new ApiError(401, "Invalid Access  ");
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    throw new ApiError(401, "outside try Invalid Access Token");
  }
});
