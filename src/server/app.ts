import express from "express";
import cors from "cors";
import { usersRouters } from "./routers/usersRouters/usersRouters.js";
import gamesRouteres from "./routers/gamesRouters/gamesRouters.js";

export const app = express();
app.disable("x-powered-by");

const allowedOrigins = [
  process.env.CORS_ALLOWED_ORIGIN_LOCAL!,
  process.env.CORS_ALLOWED_ORIGIN_PRODUCTION!,
  process.env.CORS_ALLOWED_ORIGIN_PRODUCTION_1!,
  process.env.CORS_ALLOWED_ORIGIN_PRODUCTION_2!,
  process.env.CORS_ALLOWED_ORIGIN_PRODUCTION_3!,
];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
};

app.use(cors(options));

app.use(express.json());
app.use("/users", usersRouters);
app.use("/openboards", gamesRouteres);
