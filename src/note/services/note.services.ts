import mongoose from "mongoose";
import { ICreateNote } from "../interface/createnote.interface";
import { INote } from "../interface/Inote.interface";
import Note from "../schemas/note.schema";
import ApiError from "../../utils/apiError";
import EditNote from "../schemas/editnote.schema";
import { IEditNote } from "../interface/Ieditnote.interface";
import { IUser } from "../../user/interface/Iuser.interface";

class NoteService {
  async createNote(note: ICreateNote, user: IUser): Promise<INote> {
    const newNote = new Note({
      title: note.title,
      content: note.content,
      creator: user.id,
    });
    await newNote.save();
    return newNote;
  }

  async updateNote(
    content: string,
    noteId: mongoose.Types.ObjectId
  ): Promise<INote> {
    const note = await Note.findById(noteId);
    if (!note) {
      throw new ApiError(404, "Note not found");
    }
    const oldContent = note.content;
    note.content = content;
    await note.save();

    const trackEdit = new EditNote({
      oldContent,
      newContent: content,
      creator: note.creator,
      noteId,
    });
    await trackEdit.save();
    return note;
  }

  async getNoteHistory(
    noteId: mongoose.Types.ObjectId
  ): Promise<IEditNote[] | null> {
    const trackNote: IEditNote[] | null = await EditNote.findOne({ noteId });
    if (!trackNote) throw new ApiError(404, "Note not found");
    return trackNote;
  }

  async getNotes(): Promise<INote[]> {
    const notes = await Note.find();
    return notes;
  }

  async deleteNote(noteId: mongoose.Types.ObjectId): Promise<INote> {
    const note = await Note.findById(noteId);
    if (!note) throw new ApiError(404, "Note not found");
    await note.deleteOne();
    return note;
  }

  async searchNotes(query: string): Promise<INote[]> {
    const notes = await Note.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
      ],
    });
    if (!notes || notes.length === 0) throw new ApiError(404, "No notes found");
    return notes;
  }
}

export default NoteService;
