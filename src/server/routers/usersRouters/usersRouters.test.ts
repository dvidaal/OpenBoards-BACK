import mongoose from "mongoose";
import request from "supertest";
import jsw from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { MongoMemoryServer } from "mongodb-memory-server";
import connectDataBase from "../../../database/connectDataBase";
import User from "../../../database/models/Users/User";
import { app } from "../../app";
import { type UserData } from "../../controllers/userControllers/types";

let server: MongoMemoryServer;

beforeAll(async () => {
  server = await MongoMemoryServer.create();

  await connectDataBase(server.getUri());
});

afterEach(async () => {
  await User.deleteMany();
});

afterAll(async () => {
  await server.stop();
  await mongoose.connection.close();
});

const mockUser: UserData = {
  username: "didi",
  password: "12345678",
  email: "didi@gmail.com",
};

const loginUrl = "/users/login";

describe("Given a POST '/users/login' endpoint", () => {
  describe("When it receives a request to login with the usename 'didi' and password '12345678'", () => {
    test("Then it should return a status code 200", async () => {
      const expectedStatus = 200;
      const mockToken = "sometoken";

      const hashedpassword = await bcrypt.hash(mockUser.password, 10);

      await User.create({
        ...mockUser,
        password: hashedpassword,
        email: "didi@gmail.com",
      });

      jsw.sign = jest.fn().mockReturnValue(mockToken);

      const response = await request(app)
        .post(loginUrl)
        .send(mockUser)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("token", mockToken);
    });
  });
});
