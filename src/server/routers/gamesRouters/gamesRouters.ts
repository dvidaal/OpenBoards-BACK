import { Router } from "express";
import {
  deleteGamesById,
  getGames,
  getGamesById,
} from "../../controllers/gamesControllers.ts/gamesControllers.js";

export const gamesRouteres = Router();

gamesRouteres.get("/", getGames);
gamesRouteres.get("/:id", getGamesById);
gamesRouteres.delete("/delete/:id", deleteGamesById);

export default gamesRouteres;
