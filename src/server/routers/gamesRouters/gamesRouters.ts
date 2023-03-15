import { Router } from "express";
import {
  getGames,
  getGamesById,
} from "../../controllers/gamesControllers.ts/gamesControllers.js";

export const gamesRouteres = Router();

gamesRouteres.get("/games", getGames);
gamesRouteres.get("/:id", getGamesById);

export default gamesRouteres;
