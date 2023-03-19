import { Router } from "express";
import {
  createGame,
  deleteGamesById,
  getGames,
  getGamesById,
} from "../../controllers/gamesControllers.ts/gamesControllers.js";

export const gamesRouteres = Router();

gamesRouteres.get("/", getGames);
gamesRouteres.get("/:id", getGamesById);
gamesRouteres.delete("/delete/:id", deleteGamesById);
gamesRouteres.post("/create", createGame);

export default gamesRouteres;
