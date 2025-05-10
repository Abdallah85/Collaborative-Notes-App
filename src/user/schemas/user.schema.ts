import { Schema, model } from "mongoose";
import { IUser } from "../interface/Iuser.interface";
import { Role } from "../enums/role.enum";

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },
  },
  {
    timestamps: true,
  }
);

// Create and export the User model
export const User = model<IUser>("User", userSchema);
