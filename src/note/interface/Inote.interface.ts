import mongoose from "mongoose";
import { IUser } from "../../user/interface/Iuser.interface";

export interface INote extends mongoose.Document {
  title: string;
  content: string;
  creator: IUser;
  createdAt: Date;
  updatedAt: Date;
}
