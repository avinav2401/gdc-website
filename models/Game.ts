import mongoose, { Schema, model, models } from "mongoose";

const GameSchema = new Schema({
  title: { type: String, required: true },
  developer: { type: String, required: false },
  tagline: { type: String, required: false },
  description: { type: String, required: false },
  engine: { type: String, required: true },
  genre: { type: String, required: true },
  platform: { type: String, required: false },
  itchUrl: { type: String, required: false },
  coverUrl: { type: String, required: false },
  videoUrl: { type: String, required: false },
  tags: { type: String, required: false },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  featured: { type: Boolean, default: false },
  adminComment: { type: String, default: "" },
}, { timestamps: true });

const Game = models.Game || model("Game", GameSchema);
export default Game;
