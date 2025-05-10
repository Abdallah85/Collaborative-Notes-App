import { ICreateNote } from "../interface/createnote.interface";
import { INote } from "../interface/Inote.interface";
import Note from "../schemas/note.schema";

class NoteService {
  async createNote(note: ICreateNote): Promise<INote> {
    const newNote = new Note({
      title: note.title,
      content: note.content,
      creator: note.userId,
    });
    return newNote;
  }

  async getNotes(): Promise<INote[]> {
    const notes = await Note.find();
    return notes;
  }
}

export default NoteService;
