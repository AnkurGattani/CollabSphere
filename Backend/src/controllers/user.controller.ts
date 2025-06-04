import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import {hashPassword,comparePasswords} from "../utils/PasswordHash";
import {prisma } from "../db/index";
import jwt from "jsonwebtoken";


  
const registerUser = asyncHandler(async (req, res) => {

  const {firstName, lastName, email, password} = req.body;

  // validate the request
  if(!firstName || !lastName || !email || !password){
    throw new ApiError(400, "Please provide all the fields");
  }
  if (email.includes("@") === false) {
    throw new ApiError(400, "Invalid email");
  }
  if (password.length < 8) {
    throw new ApiError(400, "Password must be at least 8 characters long");
  }

  // check if user already exists in the database
  const alreadyExists = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if(alreadyExists){
    throw new ApiError(400, "User with this email already exists");
  }

  // hash password
  const hashedPassword = await hashPassword(password);
  if(!hashedPassword){
    throw new ApiError(500, "Internal server error");
  }

  // create user
  const user = await prisma.user.create({
    data: {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
    },
  });

  if(!user){
    throw new ApiError(500, "Internal server error");
  }
  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret) {
    throw new ApiError(500, "ACCESS_TOKEN_SECRET is not defined");
  }
  const token = jwt.sign({ id: user.id }, secret, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });

  if (!token) {
    throw new ApiError(500, "Internal server error");
  }

  // return response
  const response = new ApiResponse(201, {
    acessToken: token,
    user: user
  }, "User registered successfully");
  res.status(201).json(response);
});

const loginUser= asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //console.log(email);
  //console.log(password);
  // validate the request
  if (!email || !password) {
    throw new ApiError(400, "Please provide email and password");
  }

  // check if user exists in the database
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  // compare passwords
  const match = await comparePasswords(password, user.password);

  if (!match) {
    throw new ApiError(401, "Invalid email or password");
  }

  // generate Access Token
  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret) {
    throw new ApiError(500, "ACCESS_TOKEN_SECRET is not defined");
  }
  const token = jwt.sign({ id: user.id }, secret, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });

  if (!token) {
    throw new ApiError(500, "Internal server error");
  }

  // set cookie
  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  });
  // extract only id email first name and last name to send to the client
  const newuser = {id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName};



  // return response
  const response = new ApiResponse(200, { accessToken: token,user: newuser
   }, "User logged in successfully");
  res.status(200).json(response);
});
  
const logoutUser = asyncHandler(async (req, res) => {
  const user=await prisma.user.findUnique({
    where: {
      id: req.user.id,
    },
  });
  if (!user) {
    throw new ApiError(401, "Invalid Access");
  }
  res.clearCookie("accessToken");
  const response = new ApiResponse(200, {}, "User logged out successfully");
  res.status(200).json(response);

});

const getUserName = asyncHandler(async (req, res) => {
  // console.log('req.params:', req.params.id || req.query.id); // Debug print
   const idParam = req.params.id || req.query.id;
  if (!idParam) {
    throw new ApiError(400, "User ID parameter is missing");
  }
  const userID = Number(idParam);
  if (isNaN(userID) || !Number.isInteger(userID) || userID <= 0) {
    throw new ApiError(400, "Invalid user ID");
  }
  const user = await prisma.user.findUnique({
    where: {
      id: userID,
    },
  });
  if (!user) {
    throw new ApiError(401, "Invalid Access");
  }
  const response = new ApiResponse(200, { name: user.firstName }, "User name fetched successfully");
  res.status(200).json(response);
});

export { registerUser,loginUser,logoutUser,getUserName };