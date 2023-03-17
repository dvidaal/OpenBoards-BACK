import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import connectDataBase from "../../../database/connectDataBase";
import { Game } from "../../../database/models/Games/Games";
import { app } from "../../app";

let mongodbServer: MongoMemoryServer;

beforeAll(async () => {
  mongodbServer = await MongoMemoryServer.create();
  const mongoServerUrl = mongodbServer.getUri();

  await connectDataBase(mongoServerUrl);
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongodbServer.stop();
});

afterEach(async () => {
  await Game.deleteMany();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("Given a GET '/games' endpoint", () => {
  describe("When it receives a request", () => {
    test("Then it should respond with status 200", async () => {
      const expectedStatus = 200;
      const eventsUrl = "/openboards/";

      await request(app).get(eventsUrl).expect(expectedStatus);
    });
  });
});
