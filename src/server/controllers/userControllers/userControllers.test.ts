import { type Request, type Response } from "express";
import request from "supertest";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../../database/models/Users/User";
import { loginUserErrors } from "../../../utils/error";
import statusCodes from "../../../utils/statusCodes";
import { loginUser, registerUser } from "./userControllers";
import { type UserRegisterCredentials, type UserCredentials } from "./types";
import { app } from "../../app";
import CustomError from "../../../CustomError/CustomError";

beforeEach(() => {
  jest.clearAllMocks();
});

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const req: Partial<Request> = {};

const next = jest.fn();

const mockUser: UserCredentials = {
  username: "didi",
  password: "12345678",
};

describe("Given a loginUser controller", () => {
  describe("When it receives a request of a login with a username 'didi' with password '12345678' and the user doesn't exist", () => {
    test("Then it should show a response message `Wrong credentials' with status code 401", async () => {
      const expectedLoginError = loginUserErrors.userNotFound;

      req.body = mockUser;

      User.findOne = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue(undefined),
      }));

      await loginUser(
        req as Request<
          Record<string, unknown>,
          Record<string, unknown>,
          UserCredentials
        >,
        res as Response,
        next
      );

      expect(next).toHaveBeenCalledWith(expectedLoginError);
    });
  });

  describe("When it receives a request of a login with a username 'didi' with password '12345678' and the user does exit in the database", () => {
    test("Then it should get a response with status code 200", async () => {
      const expectedStatusCode = statusCodes.success.okCode;
      const mockToken = "qwertyuiop1234";

      const expectedResponse = { token: mockToken };
      req.body = mockUser;

      User.findOne = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue({
          ...mockUser,
          _id: new mongoose.Types.ObjectId(),
        }),
      }));

      bcrypt.compare = jest.fn().mockResolvedValue(true);
      jwt.sign = jest.fn().mockReturnValue(mockToken);

      await loginUser(
        req as Request<
          Record<string, unknown>,
          Record<string, unknown>,
          UserCredentials
        >,
        res as Response,
        next
      );

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
      expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });
  });

  describe("When it receives a request of a login with username 'didi' with password '12345678' but the password it is different from the one of the database", () => {
    test("Then it should invoke the next method with status code 401 and the message 'Wrong credentials'", async () => {
      const expectedResult = loginUserErrors.wrongPassword;

      req.body = mockUser;

      User.findOne = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue({
          ...mockUser,
          _id: new mongoose.Types.ObjectId(),
        }),
      }));

      bcrypt.compare = jest.fn().mockResolvedValue(false);

      await loginUser(
        req as Request<
          Record<string, unknown>,
          Record<string, unknown>,
          UserCredentials
        >,
        res as Response,
        next
      );

      expect(next).toHaveBeenCalledWith(expectedResult);
    });
  });

  describe("When database response with an error", () => {
    test("Then it should invoked next method", async () => {
      const expectedErrorDatabase = new Error("fatal error");

      User.findOne = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockRejectedValue(expectedErrorDatabase),
      }));

      await loginUser(
        req as Request<
          Record<string, unknown>,
          Record<string, unknown>,
          UserCredentials
        >,
        res as Response,
        next
      );

      expect(next).toHaveBeenCalledWith(expectedErrorDatabase);
    });
  });
});

describe("Given a registerUser controller", () => {
  const newMockUser: UserRegisterCredentials = {
    email: "test@test.com",
    username: "test",
    password: "12345678",
  };
  describe("When it receives a request to register a new user", () => {
    test("Then it should response with a status code 201", async () => {
      const expectedStatusCode = 201;
      const mockHashedPassword = "asdf1234asdf1234";

      req.body = newMockUser;

      bcrypt.hash = jest.fn().mockResolvedValue(mockHashedPassword);
      User.create = jest.fn().mockResolvedValue(mockUser);

      await registerUser(
        req as Request<
          Record<string, unknown>,
          Record<string, unknown>,
          UserRegisterCredentials
        >,
        res as Response,
        next
      );

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
    });
  });

  describe("When databse throws an error", () => {
    test("Then it should response with a message 'The user couldn't be created'", async () => {
      const wrongMockUser: UserRegisterCredentials = {
        ...newMockUser,
        email: "",
      };

      req.body = wrongMockUser;

      const mockCustomError = new CustomError(
        "The user couldn't be created.",
        409,
        "There was a problem creating the user."
      );

      User.create = jest.fn().mockRejectedValue(mockCustomError);
      await registerUser(
        req as Request<
          Record<string, unknown>,
          Record<string, unknown>,
          UserRegisterCredentials
        >,
        res as Response,
        next
      );

      expect(next).toHaveBeenCalledWith(mockCustomError);
    });
  });
});
