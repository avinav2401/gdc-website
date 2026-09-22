import mongoose, { Schema, model, models } from "mongoose";

const EventSchema = new Schema({
  slug: { type: String, required: true },
  title: { type: String, required: true },
  date: { type: String, required: true },
  dateSort: { type: String, required: true },
  location: { type: String, required: true },
  status: { type: String, enum: ["planned", "live", "shipped", "upcoming"], default: "planned" },
  description: { type: String, required: true },
  imageUrl: { type: String, required: false },
  shape: { type: String, enum: ["full", "large", "half", "small"], default: "half" },
  tags: { type: [String], default: [] },
  registerUrl: { type: String, required: false },
  floatingAssets: { type: [String], default: [] },
  version: { type: String, required: false },
}, { timestamps: true });

const Event = models.Event || model("Event", EventSchema);
export default Event;
