import { type Response, type NextFunction, type Request } from "express";
import CustomError from "../../../CustomError/CustomError.js";
import {
  Game,
  type GameSchemaStructure,
} from "../../../database/models/Games/Games.js";
import statusCodes from "../../../utils/statusCodes.js";
import { type CustomRequest } from "../../../types/users/types";
import mongoose from "mongoose";
import {
  type GamesStructure,
  type GameStructure,
} from "../../../types/games/types.js";

const {
  success: { okCode },
  clientError: { badRequest },
  serverError: { internalServer },
} = statusCodes;

export const getGames = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const games = await Game.find().exec();

    res.status(okCode).json({ games });
  } catch (error) {
    const customError = new CustomError(
      "Bad Request",
      badRequest,
      "Impossible to find game"
    );

    next(customError);
  }
};

export const getGamesById = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { id: gameId } = req.params;
  try {
    const singleGame = await Game.findById(gameId).exec();

    if (singleGame) {
      res.status(200).json({ singleGame });
    }
  } catch (error) {
    const customError = new CustomError(
      "Bad request",
      badRequest,
      "Impossible to find the detail of the game"
    );
    next(customError);
  }
};

export const deleteGamesById = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    await Game.findByIdAndDelete({ _id: id, createdBy: req.createdBy }).exec();
    res.status(okCode).json({ message: "Partida eliminada" });
  } catch (error) {
    const customError = new CustomError(
      "Bad request",
      badRequest,
      "Impossible to delete the game"
    );
    next(customError);
  }
};

export const createGame = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { avatar, bio, createdBy, data, game, hour, plazasLibres } =
    req.body as GameSchemaStructure;
  const { userId } = req;

  try {
    const newGame: GameSchemaStructure = {
      avatar,
      bio,
      createdBy: new mongoose.Types.ObjectId(userId),
      data,
      game,
      hour,
      plazasLibres,
    };

    res.status(201).json({ game: newGame });
  } catch (error) {
    const customError = new CustomError(
      "No se puede crear la partida",
      internalServer,
      "Imposible crear la partida"
    );
    next(customError);
  }
};
