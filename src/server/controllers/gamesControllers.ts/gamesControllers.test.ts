import { type NextFunction, type Request, type Response } from "express";
import CustomError from "../../../CustomError/CustomError";
import {
  Game,
  type GameSchemaStructure,
} from "../../../database/models/Games/Games";
import { type GameStructure } from "../../../types/games/types";
import { type CustomRequest } from "../../../types/users/types";
import statusCodes from "../../../utils/statusCodes";
import {
  createGame,
  deleteGamesById,
  getGames,
  getGamesById,
} from "./gamesControllers";

beforeEach(() => jest.resetAllMocks());

const mockGame: GameStructure = {
  game: "Némesis",
  avatar: "fake",
  date: new Date(),
  hour: "fake",
  bio: "fake",
  plazasLibres: 3,
  id: "1",
  createdBy: "fake",
};

describe("Given a getGames controller", () => {
  describe("When it receives a response", () => {
    test("Then it should call the status 200", async () => {
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
      };

      const req: Partial<Request> = {};
      const next = jest.fn();
      const expectedStatusCode = statusCodes.success.okCode;

      Game.find = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockReturnValue(mockGame),
      }));

      await getGames(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
    });
  });

  describe("When it receives a bad request", () => {
    test("Then it should call its next function", async () => {
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
      };
      const req: Partial<Request> = {};
      const next = jest.fn();

      const expectedError = new CustomError(
        "Bad Request",
        400,
        "Impossible to find game"
      );

      req.body = {};

      Game.find = jest.fn().mockReturnValue(undefined);

      await getGames(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given a getGamesById function", () => {
  describe("When it's invoked with right id", () => {
    test("Then it should call res status method with a 200 and json with a mocked game", async () => {
      const gameId = "test-game-id";

      Game.findById = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue(mockGame),
      }));

      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const req: Partial<CustomRequest> = {
        params: {
          id: gameId,
        },
      };

      const next = jest.fn();
      const expectedStatusCode = statusCodes.success.okCode;
      await getGamesById(req as CustomRequest, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
      expect(res.json).toHaveBeenCalledWith({ singleGame: mockGame });
    });
  });

  describe("When it's invoked with wrong id", () => {
    test("Then it should invoke the next method with status code 400 and the message 'Bad request'", async () => {
      Game.findById = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockRejectedValue(""),
      }));

      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const req: Partial<CustomRequest> = {
        params: {
          id: "wrong id",
        },
      };

      const next = jest.fn();
      const expectedCustomError = new CustomError(
        "Bad request",
        400,
        "Impossible to find the detail of the game"
      );
      await getGamesById(req as CustomRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(expectedCustomError);
    });
  });
});

describe("Given a deleteGamesById function", () => {
  describe("When it receives a request to delete a game", () => {
    test("Then it should delete a game and response with a 200 status code", async () => {
      const req: Partial<CustomRequest> = { params: { id: `${mockGame.id}` } };

      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const next: NextFunction = jest.fn();

      Game.findByIdAndDelete = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue(mockGame),
      }));

      const expectedStatusCode = statusCodes.success.okCode;
      await deleteGamesById(req as CustomRequest, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
      expect(res.json).toHaveBeenCalledWith({ message: "Partida eliminada" });
    });
  });

  describe("When it receives a bad request", () => {
    test("Then it should return a status code 400", async () => {
      const req: Partial<CustomRequest> = {
        params: { id: `${mockGame.id}` },
      };

      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const next: NextFunction = jest.fn();

      Game.findByIdAndDelete = jest.fn().mockReturnValue(new Error());

      const expectedBadRequestStatus = statusCodes.clientError.badRequest;
      await deleteGamesById(req as CustomRequest, res as Response, next);

      const customError = new CustomError(
        "Bad request",
        expectedBadRequestStatus,
        "Impossible to delete the game"
      );

      expect(next).toHaveBeenCalledWith(customError);
    });
  });
});

describe("Given a createGame controller", () => {
  describe("When it receives a response", () => {
    test("Then it should respond with status 201", async () => {
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockResolvedValue(mockGame),
      };
      const req: Partial<CustomRequest> = {};
      const next = jest.fn();
      req.body = mockGame;
      const expectedStatusCode = 201;

      Game.create = jest.fn().mockReturnValue(mockGame);

      await createGame(req as CustomRequest, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
    });
  });

  describe("When it receives a internal server error", () => {
    test("Then it should throw an error", async () => {
      const req: Partial<CustomRequest> = {};
      const res: Partial<Response> = {};
      const next = jest.fn();

      req.body = {};

      const expectedError = new CustomError(
        "No se puede crear la partida",
        500,
        "Imposible crear la partida"
      );

      await createGame(req as CustomRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
