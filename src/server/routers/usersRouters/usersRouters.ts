import { Router } from "express";
import "../../../loadEnvironment.js";
import {
  loginUser,
  registerUser,
} from "../../controllers/userControllers/userControllers.js";

export const usersRouters = Router();

usersRouters.post("/login", loginUser);
usersRouters.post("/register", registerUser);
