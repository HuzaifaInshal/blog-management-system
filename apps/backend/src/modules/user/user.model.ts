import mongoose from "mongoose";
import { UserRole } from "./user.type.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.AUTHOR,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("User", userSchema);
