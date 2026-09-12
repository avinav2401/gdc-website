import mongoose, { Schema, model, models } from "mongoose";

const EventSchema = new Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  location: { type: String, required: true },
  status: { type: String, enum: ["planned", "live", "shipped"], default: "planned" },
  description: { type: String, required: true },
}, { timestamps: true });

const Event = models.Event || model("Event", EventSchema);
export default Event;
