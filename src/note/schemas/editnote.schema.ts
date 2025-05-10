import { Schema, model } from "mongoose";
import { IEditNote } from "../interface/Ieditnote.interface";

const editNoteSchema = new Schema<IEditNote>(
  {
    oldContent: { type: String, required: true },
    newContent: { type: String, required: true },
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    noteId: { type: Schema.Types.ObjectId, ref: "Note", required: true },
  },
  { timestamps: true }
);

const EditNote = model<IEditNote>("EditNote", editNoteSchema);

export default EditNote;
