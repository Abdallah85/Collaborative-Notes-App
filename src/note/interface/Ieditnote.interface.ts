import mongoose from "mongoose";

export interface IEditNote extends mongoose.Document {
  oldContent: string;
  newContent: string;
  creator: mongoose.Types.ObjectId;
  noteId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
