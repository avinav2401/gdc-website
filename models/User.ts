import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, default: "gdc2026" },
  role: { type: String, enum: ["admin", "member"], default: "member" },
}, { timestamps: true });

const User = models.User || model("User", UserSchema);
export default User;
