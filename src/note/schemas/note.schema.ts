import { Schema, model } from "mongoose";
import { INote } from "../interface/Inote.interface";

const noteSchema = new Schema<INote>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Note = model<INote>("Note", noteSchema);

export default Note;
