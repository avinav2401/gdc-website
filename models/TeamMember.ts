import mongoose, { Schema, model, models } from "mongoose";

const TeamMemberSchema = new Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  bio: { type: String, required: false },
  github: { type: String, required: false },
  portfolio: { type: String, required: false },
  isAlumni: { type: Boolean, default: false },
  team: { type: String, enum: ["core", "faculty"], default: "core" },
  level: { type: Number, enum: [0, 1, 2, 3, 4], default: 4 },
  imageUrl: { type: String, required: false },
  instagram: { type: String, required: false },
  linkedin: { type: String, required: false },
}, { timestamps: true });

const TeamMember = models.TeamMember || model("TeamMember", TeamMemberSchema);
export default TeamMember;
