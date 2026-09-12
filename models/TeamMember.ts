import mongoose, { Schema, model, models } from "mongoose";

const TeamMemberSchema = new Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  bio: { type: String, required: false },
  github: { type: String, required: false },
  portfolio: { type: String, required: false },
  isAlumni: { type: Boolean, default: false },
}, { timestamps: true });

const TeamMember = models.TeamMember || model("TeamMember", TeamMemberSchema);
export default TeamMember;
