import { model, Schema, type InferSchemaType } from "mongoose";

const gamesSchema = new Schema({
  game: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  data: {
    type: Date,
    required: true,
  },
  hour: {
    type: Date,
    required: true,
  },
  bio: {
    type: String,
    required: true,
  },
  plazasLibres: {
    type: Number,
    required: true,
  },

  createdBy: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

export const Game = model("Game", gamesSchema, "games");

export type GameSchemaStructure = InferSchemaType<typeof gamesSchema>;
