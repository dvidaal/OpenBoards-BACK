import { type NextFunction, type Request, type Response } from "express";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import "../../../loadEnvironment.js";
import User from "../../../database/models/Users/User.js";
import { loginUserErrors } from "../../../utils/error.js";
import statusCodes from "../../../utils/statusCodes.js";
import { type UserRegisterCredentials, type UserCredentials } from "./types.js";
import { type CustomJwtPayload } from "../../../types/users/types.js";
import CustomError from "../../../CustomError/CustomError.js";

const {
  success: { okCode },
} = statusCodes;

const hashingPasswordLength = 8;

export const loginUser = async (
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    UserCredentials
  >,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username }).exec();
    if (!user) {
      throw loginUserErrors.userNotFound;
    }

    if (!(await bcryptjs.compare(password, user.password))) {
      throw loginUserErrors.wrongPassword;
    }

    const jwtPayload: CustomJwtPayload = {
      id: user._id.toString(),
      username,
    };

    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET!, {
      expiresIn: "3d",
    });

    res.status(okCode).json({ token });
  } catch (error: unknown) {
    next(error);
  }
};

export const registerUser = async (
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    UserRegisterCredentials
  >,
  res: Response,
  next: NextFunction
) => {
  const { email, username, password } = req.body;

  try {
    const hashedPassword = await bcryptjs.hash(password, hashingPasswordLength);

    await User.create({ email, username, password: hashedPassword });

    res.status(201).json({ message: "The user has been created" });
  } catch (error) {
    const customError = new CustomError(
      "The user couldn't be created.",
      409,
      "There was a problem creating the user."
    );

    next(customError);
  }
};
